// src/stores/gameStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as gameService from '@/services/gameService.js'

export const useGameStore = defineStore('game', () => {

  // ── State ────────────────────────────────────────────────
  const roomCode   = ref(null)
  const playerId   = ref(null)
  const playerName = ref(null)
  const playerTeam = ref(null)
  const isAdmin    = ref(false)
  const roomData   = ref(null)
  const error      = ref(null)
  const loading    = ref(false)

  // Simpan fungsi unsubscribe listener Firebase
  let _unsubscribe = null

  // ── Computed ─────────────────────────────────────────────
  const players = computed(() => roomData.value?.players ?? {})

  const teamA = computed(() =>
    Object.entries(players.value)
      .filter(([, p]) => p.team === 'A')
      .map(([id, p]) => ({ id, ...p }))
  )

  const teamB = computed(() =>
    Object.entries(players.value)
      .filter(([, p]) => p.team === 'B')
      .map(([id, p]) => ({ id, ...p }))
  )

  const teamScores  = computed(() => roomData.value?.teamScores ?? { A: 0, B: 0 })
  const gameStatus  = computed(() => roomData.value?.status ?? 'waiting')
  const matches     = computed(() => roomData.value?.matches ?? [])
  const playerCount = computed(() => Object.keys(players.value).length)

  const canStartGame = computed(() =>
    isAdmin.value &&
    teamA.value.length > 0 &&
    teamB.value.length > 0 &&
    gameStatus.value === 'waiting'
  )

  const currentQuestion = computed(() => roomData.value?.currentQuestion ?? null)

  // ── Actions ──────────────────────────────────────────────

  async function hostRoom(name) {
    loading.value = true
    error.value = null
    try {
      playerName.value = name
      isAdmin.value = true
      playerId.value = null      // Admin bukan pemain
      playerTeam.value = null
      roomCode.value = await gameService.createRoom(name)
      _startListening()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function joinRoom(code, name, team) {
    loading.value = true
    error.value = null
    try {
      const exists = await gameService.checkRoomExists(code)
      if (!exists) throw new Error('Kode room tidak ditemukan.')

      roomCode.value = code.toUpperCase()
      playerName.value = name
      playerTeam.value = team
      isAdmin.value = false
      playerId.value = await gameService.joinRoom(roomCode.value, name, team)
      _startListening()
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function startGame() {
    if (!canStartGame.value) return
    loading.value = true
    error.value = null
    try {
      await gameService.generateMatches(roomCode.value)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function leaveRoom() {
    // Admin tidak punya playerId, pemain biasa perlu dihapus dari DB
    if (roomCode.value && playerId.value) {
      await gameService.leaveRoom(roomCode.value, playerId.value)
    }
    _cleanup()
  }

  async function broadcastQuestion(question) {
    if (!isAdmin.value) return
    loading.value = true
    error.value = null
    try {
      await gameService.broadcastQuestion(roomCode.value, question)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function submitAnswer(answer) {
    if (!playerId.value || !roomCode.value) return null
    return gameService.submitAnswer(roomCode.value, playerId.value, answer)
  }

  async function finishGame() {
    if (!isAdmin.value) return
    loading.value = true
    error.value = null
    try {
      await gameService.finishGame(roomCode.value)
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  function _startListening() {
    _unsubscribe = gameService.listenToRoom(roomCode.value, (data) => {
      roomData.value = data
    })
  }

  function _cleanup() {
    if (_unsubscribe) {
      _unsubscribe()
      _unsubscribe = null
    }
    roomCode.value   = null
    playerId.value   = null
    playerName.value = null
    playerTeam.value = null
    isAdmin.value    = false
    roomData.value   = null
    error.value      = null
  }

  return {
    // state
    roomCode, playerId, playerName, playerTeam, isAdmin,
    roomData, error, loading,
    // computed
    players, teamA, teamB, teamScores, gameStatus,
    matches, playerCount, canStartGame, currentQuestion,
    // actions
    hostRoom, joinRoom, startGame, leaveRoom,
    broadcastQuestion, submitAnswer, finishGame
  }
})
