// src/services/gameService.js
import { db } from './firebase.js'
import {
  ref, set, get, update, push, onValue, remove
} from 'firebase/database'

// ─── Helpers ──────────────────────────────────────────────

export function generateRoomCode() {
  // Buat kode 6 karakter: misal "AB12CD"
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// ─── Room ─────────────────────────────────────────────────

export async function createRoom(adminName) {
  let roomCode
  let exists = true

  // Pastikan kode unik — coba sampai dapat yang belum ada
  while (exists) {
    roomCode = generateRoomCode()
    const snap = await get(ref(db, `rooms/${roomCode}`))
    exists = snap.exists()
  }

  await set(ref(db, `rooms/${roomCode}`), {
    status: 'waiting',        // waiting | playing | finished
    round: 0,
    createdAt: Date.now(),
    adminName,
    players: {},
    matches: [],
    currentQuestion: null,
    teamScores: { A: 0, B: 0 }
  })

  return roomCode
}

export async function checkRoomExists(roomCode) {
  const snap = await get(ref(db, `rooms/${roomCode}`))
  return snap.exists()
}

export async function getRoomStatus(roomCode) {
  const snap = await get(ref(db, `rooms/${roomCode}/status`))
  return snap.val()
}

// ─── Player ───────────────────────────────────────────────

export async function joinRoom(roomCode, playerName, team) {
  // Cek dulu: apakah room ada & masih waiting?
  const status = await getRoomStatus(roomCode)
  if (!status) throw new Error('Room tidak ditemukan.')
  if (status !== 'waiting') throw new Error('Game sudah dimulai, tidak bisa bergabung.')

  // push() auto-generate ID unik untuk setiap pemain
  const playerRef = push(ref(db, `rooms/${roomCode}/players`))
  const playerId = playerRef.key

  await set(playerRef, {
    name: playerName,
    team,           // 'A' atau 'B'
    score: 0,
    joinedAt: Date.now(),
    status: 'ready'
  })

  return playerId
}

export async function leaveRoom(roomCode, playerId) {
  await remove(ref(db, `rooms/${roomCode}/players/${playerId}`))
}

// ─── Matchmaking ──────────────────────────────────────────

export async function generateMatches(roomCode) {
  const snap = await get(ref(db, `rooms/${roomCode}/players`))
  const playersObj = snap.val()

  if (!playersObj) throw new Error('Tidak ada pemain.')

  const teamA = []
  const teamB = []

  // Pisahkan berdasarkan tim
  Object.entries(playersObj).forEach(([id, p]) => {
    if (p.team === 'A') teamA.push({ id, ...p })
    else teamB.push({ id, ...p })
  })

  if (teamA.length === 0 || teamB.length === 0) {
    throw new Error('Kedua tim harus memiliki pemain.')
  }

  // Buat pasangan: A[0] vs B[0], A[1] vs B[1], dst
  const maxPairs = Math.max(teamA.length, teamB.length)
  const matches = []

  for (let i = 0; i < maxPairs; i++) {
    matches.push({
      playerA: teamA[i]?.id ?? null,
      playerB: teamB[i]?.id ?? null,
      winner: null,
      status: 'pending'   // pending | active | done
    })
  }

  await update(ref(db, `rooms/${roomCode}`), {
    matches,
    status: 'playing',
    round: 1
  })

  return matches
}

// ─── Realtime Listener ────────────────────────────────────

// Mendengarkan perubahan seluruh room secara realtime
// Mengembalikan fungsi unsubscribe — panggil saat komponen di-unmount
export function listenToRoom(roomCode, callback) {
  const roomRef = ref(db, `rooms/${roomCode}`)
  const unsubscribe = onValue(roomRef, (snap) => {
    callback(snap.val())
  })
  return unsubscribe
}

// Mendengarkan daftar pemain saja (lebih efisien jika hanya butuh ini)
export function listenToPlayers(roomCode, callback) {
  return onValue(ref(db, `rooms/${roomCode}/players`), (snap) => {
    callback(snap.val() ?? {})
  })
}

// ─── Question ─────────────────────────────────────────────

export async function broadcastQuestion(roomCode, question) {
  // Acak urutan pilihan jawaban (Fisher-Yates shuffle)
  const shuffledOptions = [...question.options]
  for (let i = shuffledOptions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]]
  }

  await update(ref(db, `rooms/${roomCode}`), {
    currentQuestion: {
      ...question,
      options: shuffledOptions,
      startedAt: Date.now(),
      answered: false,
      firstAnswerer: null,
      wrong: {}
    }
  })
}

// ─── Answer ───────────────────────────────────────────────

export async function submitAnswer(roomCode, playerId, answer) {
  const qSnap = await get(ref(db, `rooms/${roomCode}/currentQuestion`))
  const q = qSnap.val()

  if (!q || q.answered) return { result: 'too_late' }

  if (answer === q.answer) {
    await update(ref(db, `rooms/${roomCode}/currentQuestion`), {
      answered: true,
      firstAnswerer: playerId
    })

    // Tambah poin ke pemain
    const playerRef = ref(db, `rooms/${roomCode}/players/${playerId}`)
    const playerSnap = await get(playerRef)
    const currentScore = playerSnap.val()?.score ?? 0
    await update(playerRef, { score: currentScore + 10 })

    // Update skor tim
    const team = playerSnap.val()?.team
    const teamRef = ref(db, `rooms/${roomCode}/teamScores/${team}`)
    const teamSnap = await get(teamRef)
    await set(teamRef, (teamSnap.val() ?? 0) + 10)

    return { result: 'correct', points: 10 }
  } else {
    await set(ref(db, `rooms/${roomCode}/currentQuestion/wrong/${playerId}`), true)
    return { result: 'wrong' }
  }
}

// ─── Finish ───────────────────────────────────────────────

export async function finishGame(roomCode) {
  await update(ref(db, `rooms/${roomCode}`), {
    status: 'finished',
    currentQuestion: null
  })
}
