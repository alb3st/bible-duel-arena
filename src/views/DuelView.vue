<!-- src/views/DuelView.vue -->
<template>
  <div class="min-h-screen bg-slate-900 text-white">

    <!-- ── Game Selesai ──────────────────────────────── -->
    <div v-if="store.gameStatus === 'finished'"
      class="min-h-screen flex items-center justify-center p-4">
      <div class="w-full max-w-md text-center">
        <div class="text-6xl mb-4">🏆</div>
        <h2 class="text-3xl font-bold mb-2">Game Selesai!</h2>

        <!-- Pengumuman pemenang -->
        <div class="bg-slate-800 rounded-2xl p-6 mb-6">
          <template v-if="store.teamScores.A > store.teamScores.B">
            <p class="text-purple-400 text-xl font-bold">🟣 Tim A Menang!</p>
          </template>
          <template v-else-if="store.teamScores.B > store.teamScores.A">
            <p class="text-amber-400 text-xl font-bold">🟡 Tim B Menang!</p>
          </template>
          <template v-else>
            <p class="text-slate-300 text-xl font-bold">🤝 Seri!</p>
          </template>

          <div class="flex justify-center gap-8 mt-4">
            <div>
              <p class="text-purple-400 text-sm">Tim A</p>
              <p class="text-4xl font-bold text-white">{{ store.teamScores.A }}</p>
            </div>
            <div class="text-slate-600 text-3xl font-bold self-center">vs</div>
            <div>
              <p class="text-amber-400 text-sm">Tim B</p>
              <p class="text-4xl font-bold text-white">{{ store.teamScores.B }}</p>
            </div>
          </div>
        </div>

        <!-- Papan skor pemain -->
        <div class="bg-slate-800 rounded-2xl p-4 mb-6 text-left">
          <h3 class="text-slate-400 text-sm mb-3">Skor Pemain</h3>
          <ul class="space-y-2">
            <li v-for="p in sortedPlayers" :key="p.id"
              class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span :class="p.team === 'A' ? 'bg-purple-500' : 'bg-amber-500'"
                  class="w-2 h-2 rounded-full shrink-0"></span>
                <span :class="p.id === store.playerId ? 'text-white font-semibold' : 'text-slate-300'">
                  {{ p.name }}
                  <span v-if="p.id === store.playerId" class="text-xs text-slate-500"> (kamu)</span>
                </span>
              </div>
              <span class="font-bold text-white">{{ p.score }} poin</span>
            </li>
          </ul>
        </div>

        <button @click="handleLeave"
          class="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition font-semibold">
          Kembali ke Menu
        </button>
      </div>
    </div>

    <!-- ── Layar Game ─────────────────────────────────── -->
    <div v-else class="max-w-lg mx-auto p-4 pb-8">

      <!-- Header: skor + ronde -->
      <div class="flex items-center justify-between pt-4 mb-6">
        <div class="text-center bg-purple-900/50 border border-purple-700/50
                    rounded-2xl px-6 py-3 flex-1 mr-2">
          <p class="text-purple-300 text-xs mb-1">Tim A</p>
          <p class="text-3xl font-bold text-white">{{ store.teamScores.A }}</p>
        </div>
        <div class="text-center px-3">
          <p class="text-slate-500 text-xs">Ronde</p>
          <p class="text-xl font-bold text-slate-300">{{ store.roomData?.round ?? 1 }}</p>
        </div>
        <div class="text-center bg-amber-900/50 border border-amber-700/50
                    rounded-2xl px-6 py-3 flex-1 ml-2">
          <p class="text-amber-300 text-xs mb-1">Tim B</p>
          <p class="text-3xl font-bold text-white">{{ store.teamScores.B }}</p>
        </div>
      </div>

      <!-- Area soal -->
      <div class="bg-slate-800 rounded-2xl p-5 mb-4 min-h-[120px] flex items-center justify-center">
        <template v-if="store.currentQuestion">
          <p class="text-lg font-semibold text-white text-center leading-snug">
            {{ store.currentQuestion.text }}
          </p>
        </template>
        <template v-else>
          <div class="text-center">
            <div class="text-3xl mb-2 animate-pulse">⏳</div>
            <p class="text-slate-500 text-sm">Menunggu soal berikutnya...</p>
          </div>
        </template>
      </div>

      <!-- Feedback jawaban -->
      <transition name="pop">
        <div v-if="answerFeedback"
          :class="answerFeedback === 'correct'
            ? 'bg-green-500/20 border-green-500/50 text-green-300'
            : answerFeedback === 'wrong'
            ? 'bg-red-500/20 border-red-500/50 text-red-300'
            : 'bg-slate-700/50 border-slate-600 text-slate-400'"
          class="border rounded-xl px-4 py-2 text-center text-sm font-semibold mb-4">
          <span v-if="answerFeedback === 'correct'">✅ Benar! +10 poin</span>
          <span v-else-if="answerFeedback === 'wrong'">❌ Salah!</span>
          <span v-else>⌛ Terlambat!</span>
        </div>
      </transition>

      <!-- Pilihan jawaban -->
      <div v-if="store.currentQuestion && !store.currentQuestion.answered"
        class="grid grid-cols-2 gap-3 mb-6">
        <button
          v-for="opt in store.currentQuestion.options" :key="opt"
          @click="handleAnswer(opt)"
          :disabled="hasAnswered || answering"
          :class="[
            hasAnswered && opt === store.currentQuestion.answer
              ? 'bg-green-600 border-green-400 text-white'
              : hasAnswered && myWrongAnswers.includes(opt)
              ? 'bg-red-900/50 border-red-700 text-red-300'
              : 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600 hover:border-slate-400',
            'border-2 rounded-xl px-4 py-4 text-sm font-semibold text-center transition-all',
            'disabled:cursor-not-allowed'
          ]"
        >
          {{ opt }}
        </button>
      </div>

      <!-- Soal sudah dijawab -->
      <div v-else-if="store.currentQuestion?.answered"
        class="bg-slate-800 rounded-2xl p-4 mb-6 text-center">
        <p class="text-slate-400 text-sm mb-1">Jawaban benar:</p>
        <p class="text-green-400 font-bold text-lg">{{ store.currentQuestion.answer }}</p>
        <p v-if="store.currentQuestion.firstAnswerer" class="text-slate-500 text-xs mt-2">
          Dijawab oleh: {{ getPlayerName(store.currentQuestion.firstAnswerer) }}
        </p>
      </div>

      <!-- ── Panel Admin ─────────────────────────────── -->
      <div v-if="store.isAdmin" class="border-t border-slate-700 pt-4 mt-2">
        <p class="text-slate-400 text-xs mb-3 text-center">Panel Admin</p>

        <!-- Pilih soal dari bank -->
        <div class="bg-slate-800 rounded-2xl p-4 mb-3">
          <h4 class="text-slate-300 text-sm font-semibold mb-3">Pilih Soal:</h4>
          <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
            <button
              v-for="(q, i) in questions" :key="i"
              @click="selectedQuestion = q"
              :class="selectedQuestion === q
                ? 'bg-indigo-600 border-indigo-400 text-white'
                : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-400'"
              class="w-full text-left border-2 rounded-xl px-3 py-2 text-xs transition-all"
            >
              {{ i + 1 }}. {{ q.text }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <button
            @click="handleBroadcast"
            :disabled="!selectedQuestion || store.loading"
            class="py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40
                   disabled:cursor-not-allowed rounded-xl font-bold text-sm transition"
          >
            📢 Kirim Soal
          </button>
          <button
            @click="handleFinish"
            :disabled="store.loading"
            class="py-3 bg-red-700 hover:bg-red-600 disabled:opacity-40
                   disabled:cursor-not-allowed rounded-xl font-bold text-sm transition"
          >
            🏁 Akhiri Game
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore.js'
import { questions } from '@/data/questions.js'

const router = useRouter()
const store  = useGameStore()

const selectedQuestion = ref(null)
const answerFeedback   = ref(null)  // 'correct' | 'wrong' | 'too_late' | null
const answering        = ref(false)
const hasAnswered      = ref(false)
const myWrongAnswers   = ref([])

// Daftar pemain diurutkan berdasarkan skor (tertinggi dulu)
const sortedPlayers = computed(() =>
  Object.entries(store.players)
    .map(([id, p]) => ({ id, ...p }))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
)

function getPlayerName(id) {
  return store.players[id]?.name ?? 'Pemain lain'
}

async function handleAnswer(option) {
  if (hasAnswered.value || answering.value) return
  answering.value = true

  const result = await store.submitAnswer(option)

  if (result?.result === 'correct') {
    answerFeedback.value = 'correct'
    hasAnswered.value = true
  } else if (result?.result === 'wrong') {
    answerFeedback.value = 'wrong'
    myWrongAnswers.value.push(option)
  } else {
    answerFeedback.value = 'too_late'
    hasAnswered.value = true
  }

  answering.value = false
  setTimeout(() => { answerFeedback.value = null }, 2500)
}

async function handleBroadcast() {
  if (!selectedQuestion.value) return
  await store.broadcastQuestion(selectedQuestion.value)
  selectedQuestion.value = null
}

async function handleFinish() {
  await store.finishGame()
}

async function handleLeave() {
  await store.leaveRoom()
  router.push('/')
}

// Reset state jawaban saat soal baru masuk
watch(() => store.currentQuestion?.startedAt, () => {
  hasAnswered.value  = false
  myWrongAnswers.value = []
  answerFeedback.value = null
})

// Redirect jika tidak ada sesi (buka URL langsung)
onMounted(() => {
  if (!store.roomCode) {
    router.replace('/')
  }
})
</script>

<style scoped>
.pop-enter-active {
  animation: pop 0.25s ease-out;
}
@keyframes pop {
  from { opacity: 0; transform: scale(0.92); }
  to   { opacity: 1; transform: scale(1); }
}
</style>
