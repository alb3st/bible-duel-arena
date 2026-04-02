<!-- src/views/HomeView.vue -->
<template>
  <div class="min-h-screen bg-slate-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md">

      <!-- Logo / Judul -->
      <div class="text-center mb-10">
        <h1 class="text-4xl font-bold text-white mb-2">⚔️ Bible Duel</h1>
        <p class="text-slate-400">Quiz Battle Alkitab — 2 Tim Bertarung!</p>
      </div>

      <!-- Form nama (selalu tampil) -->
      <div class="mb-6">
        <label class="block text-slate-300 text-sm mb-2">Nama kamu</label>
        <input
          v-model="playerName"
          type="text"
          placeholder="Masukkan namamu..."
          maxlength="20"
          class="w-full bg-slate-800 text-white rounded-xl px-4 py-3
                 border border-slate-600 focus:border-purple-500
                 focus:outline-none focus:ring-2 focus:ring-purple-500/30
                 placeholder-slate-500 transition"
        />
      </div>

      <!-- Error message -->
      <div v-if="store.error" class="mb-4 bg-red-500/20 border border-red-500/50
           text-red-300 rounded-xl px-4 py-3 text-sm">
        ⚠️ {{ store.error }}
      </div>

      <!-- Dua pilihan: Host atau Join -->
      <div class="grid grid-cols-2 gap-4 mb-6">
        <!-- Buat Room Baru -->
        <button
          @click="activeMode = 'host'"
          :class="activeMode === 'host'
            ? 'bg-purple-600 border-purple-400 text-white'
            : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-400'"
          class="border-2 rounded-xl p-4 text-left transition-all"
        >
          <div class="text-2xl mb-1">🏠</div>
          <div class="font-semibold text-sm">Buat Room</div>
          <div class="text-xs mt-1 opacity-70">Jadi Game Master</div>
        </button>

        <!-- Join Room -->
        <button
          @click="activeMode = 'join'"
          :class="activeMode === 'join'
            ? 'bg-amber-600 border-amber-400 text-white'
            : 'bg-slate-800 border-slate-600 text-slate-300 hover:border-slate-400'"
          class="border-2 rounded-xl p-4 text-left transition-all"
        >
          <div class="text-2xl mb-1">🚪</div>
          <div class="font-semibold text-sm">Join Room</div>
          <div class="text-xs mt-1 opacity-70">Masuk dengan kode</div>
        </button>
      </div>

      <!-- Form tambahan untuk Join -->
      <transition name="fade">
        <!-- Info untuk Host -->
        <div v-if="activeMode === 'host'" class="mb-6">
          <div class="bg-indigo-900/30 border border-indigo-700/40 rounded-2xl p-4">
            <p class="text-indigo-300 text-sm font-semibold mb-1">👑 Kamu akan jadi Game Master</p>
            <p class="text-slate-400 text-xs leading-relaxed">
              Game Master tidak ikut bermain. Kamu bertugas mengirim soal
              dan memimpin jalannya game.
            </p>
          </div>
        </div>

        <!-- Form untuk Join -->
        <div v-else-if="activeMode === 'join'" class="space-y-4 mb-6">
          <div>
            <label class="block text-slate-300 text-sm mb-2">Kode Room</label>
            <input
              v-model="roomCodeInput"
              type="text"
              placeholder="Contoh: AB12CD"
              maxlength="6"
              class="w-full bg-slate-800 text-white rounded-xl px-4 py-3
                     border border-slate-600 focus:border-amber-500
                     focus:outline-none uppercase tracking-widest
                     placeholder-slate-500 transition text-center text-lg font-mono"
              @input="roomCodeInput = roomCodeInput.toUpperCase()"
            />
          </div>

          <div>
            <label class="block text-slate-300 text-sm mb-2">Pilih Tim</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                @click="selectedTeam = 'A'"
                :class="selectedTeam === 'A'
                  ? 'bg-purple-600 border-purple-400 text-white'
                  : 'bg-slate-800 border-slate-600 text-slate-300'"
                class="border-2 rounded-xl py-3 font-bold transition"
              >
                Tim A 🟣
              </button>
              <button
                @click="selectedTeam = 'B'"
                :class="selectedTeam === 'B'
                  ? 'bg-amber-600 border-amber-400 text-white'
                  : 'bg-slate-800 border-slate-600 text-slate-300'"
                class="border-2 rounded-xl py-3 font-bold transition"
              >
                Tim B 🟡
              </button>
            </div>
          </div>
        </div>
      </transition>

      <!-- Tombol Aksi -->
      <button
        v-if="activeMode"
        @click="handleSubmit"
        :disabled="!canSubmit || store.loading"
        class="w-full py-4 rounded-xl font-bold text-lg transition-all
               disabled:opacity-40 disabled:cursor-not-allowed"
        :class="activeMode === 'host'
          ? 'bg-purple-600 hover:bg-purple-500 text-white'
          : 'bg-amber-600 hover:bg-amber-500 text-white'"
      >
        <span v-if="store.loading">⏳ Memproses...</span>
        <span v-else-if="activeMode === 'host'">🏠 Buat Room Sekarang</span>
        <span v-else>🚪 Masuk ke Room</span>
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore.js'

const router = useRouter()
const store  = useGameStore()

const playerName    = ref('')
const activeMode    = ref(null)   // 'host' | 'join' | null
const roomCodeInput = ref('')
const selectedTeam  = ref(null)   // 'A' | 'B'

const canSubmit = computed(() => {
  if (!playerName.value.trim()) return false
  if (activeMode.value === 'host') return true
  if (activeMode.value === 'join') {
    return roomCodeInput.value.length === 6 && selectedTeam.value !== null
  }
  return false
})

async function handleSubmit() {
  if (!canSubmit.value) return

  if (activeMode.value === 'host') {
    await store.hostRoom(playerName.value.trim())
  } else {
    await store.joinRoom(
      roomCodeInput.value.trim(),
      playerName.value.trim(),
      selectedTeam.value
    )
  }

  // Kalau tidak ada error, pindah ke lobby
  if (!store.error) {
    router.push(`/lobby/${store.roomCode}`)
  }
}

// Reset error saat user mulai mengetik ulang
watch([playerName, roomCodeInput, selectedTeam], () => {
  store.error = null
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
