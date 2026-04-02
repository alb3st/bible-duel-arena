<!-- src/views/LobbyView.vue -->
<template>
  <div class="min-h-screen bg-slate-900 text-white p-4">
    <div class="max-w-lg mx-auto">

      <!-- Header: kode room -->
      <div class="text-center mb-8 pt-6">
        <p class="text-slate-400 text-sm mb-1">Kode Room</p>
        <div class="flex items-center justify-center gap-3">
          <h2 class="text-5xl font-mono font-bold tracking-widest text-white">
            {{ store.roomCode }}
          </h2>
          <button @click="copyCode"
            class="text-slate-400 hover:text-white transition text-sm bg-slate-800
                   px-3 py-1 rounded-lg border border-slate-600">
            {{ copied ? '✅ Disalin!' : '📋 Salin' }}
          </button>
        </div>
        <p class="text-slate-500 text-sm mt-2">Bagikan kode ini ke teman-temanmu</p>
      </div>

      <!-- Badge admin (Game Master) -->
      <div v-if="store.isAdmin" class="bg-indigo-900/40 border border-indigo-700/50
           rounded-2xl p-3 mb-4 flex items-center gap-3">
        <span class="text-2xl">👑</span>
        <div>
          <p class="text-indigo-300 text-sm font-semibold">{{ store.playerName }} (Game Master)</p>
          <p class="text-slate-500 text-xs">Kamu mengelola game, bukan peserta</p>
        </div>
      </div>

      <!-- Status: jumlah pemain -->
      <div class="bg-slate-800 rounded-2xl p-4 mb-4 text-center">
        <p class="text-slate-400 text-sm">Pemain bergabung</p>
        <p class="text-3xl font-bold text-white">{{ store.playerCount }}</p>
        <p class="text-slate-500 text-xs mt-1">
          Butuh minimal 1 pemain per tim untuk mulai
        </p>
      </div>

      <!-- Daftar Tim A & Tim B berdampingan -->
      <div class="grid grid-cols-2 gap-4 mb-6">

        <!-- Tim A -->
        <div class="bg-purple-900/40 border border-purple-700/50 rounded-2xl p-4">
          <h3 class="font-bold text-purple-300 mb-3 flex items-center gap-2">
            🟣 Tim A
            <span class="text-xs bg-purple-700/50 px-2 py-0.5 rounded-full">
              {{ store.teamA.length }} pemain
            </span>
          </h3>
          <ul class="space-y-2">
            <li
              v-for="p in store.teamA" :key="p.id"
              class="flex items-center gap-2 text-sm"
            >
              <span class="w-2 h-2 rounded-full bg-purple-400 shrink-0"></span>
              <span :class="p.id === store.playerId ? 'text-white font-semibold' : 'text-slate-300'">
                {{ p.name }}
                <span v-if="p.id === store.playerId" class="text-purple-400 text-xs">(kamu)</span>
              </span>
            </li>
            <li v-if="store.teamA.length === 0" class="text-slate-500 text-xs italic">
              Belum ada pemain...
            </li>
          </ul>
        </div>

        <!-- Tim B -->
        <div class="bg-amber-900/40 border border-amber-700/50 rounded-2xl p-4">
          <h3 class="font-bold text-amber-300 mb-3 flex items-center gap-2">
            🟡 Tim B
            <span class="text-xs bg-amber-700/50 px-2 py-0.5 rounded-full">
              {{ store.teamB.length }} pemain
            </span>
          </h3>
          <ul class="space-y-2">
            <li
              v-for="p in store.teamB" :key="p.id"
              class="flex items-center gap-2 text-sm"
            >
              <span class="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
              <span :class="p.id === store.playerId ? 'text-white font-semibold' : 'text-slate-300'">
                {{ p.name }}
                <span v-if="p.id === store.playerId" class="text-amber-400 text-xs">(kamu)</span>
              </span>
            </li>
            <li v-if="store.teamB.length === 0" class="text-slate-500 text-xs italic">
              Belum ada pemain...
            </li>
          </ul>
        </div>

      </div>

      <!-- Error message -->
      <div v-if="store.error" class="mb-4 bg-red-500/20 border border-red-500/50
           text-red-300 rounded-xl px-4 py-3 text-sm">
        ⚠️ {{ store.error }}
      </div>

      <!-- Tombol Start (hanya admin) -->
      <div v-if="store.isAdmin">
        <button
          @click="handleStart"
          :disabled="!store.canStartGame || store.loading"
          class="w-full py-4 rounded-2xl font-bold text-lg transition-all
                 bg-green-600 hover:bg-green-500 text-white
                 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <span v-if="store.loading">⏳ Memulai...</span>
          <span v-else-if="!store.canStartGame">
            ⏳ Menunggu pemain di kedua tim...
          </span>
          <span v-else>⚔️ Mulai Game!</span>
        </button>
        <p class="text-center text-slate-500 text-xs mt-2">
          Hanya kamu (admin) yang bisa memulai game
        </p>
      </div>

      <!-- Pesan untuk non-admin -->
      <div v-else class="text-center">
        <div class="bg-slate-800 rounded-2xl p-4">
          <div class="text-2xl mb-2 animate-pulse">⏳</div>
          <p class="text-slate-400 text-sm">Menunggu admin memulai game...</p>
        </div>
      </div>

      <!-- Tombol keluar -->
      <button @click="handleLeave"
        class="w-full mt-4 py-3 rounded-xl text-slate-500 hover:text-red-400
               hover:bg-slate-800 transition text-sm border border-transparent
               hover:border-slate-700">
        ← Keluar dari Room
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useGameStore } from '@/stores/gameStore.js'

const router = useRouter()
const route  = useRoute()
const store  = useGameStore()

const copied   = ref(false)

// Salin kode room ke clipboard
async function copyCode() {
  await navigator.clipboard.writeText(store.roomCode)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

async function handleStart() {
  await store.startGame()
}

async function handleLeave() {
  await store.leaveRoom()
  router.push('/')
}

// Redirect otomatis saat game dimulai
watch(() => store.gameStatus, (status) => {
  if (status === 'playing') {
    router.push(`/duel/${store.roomCode}`)
  }
})

// Jika user langsung buka URL lobby tanpa lewat HomeView
onMounted(() => {
  const code = route.params.roomCode
  if (code && !store.roomCode) {
    // Tidak ada data session — arahkan kembali ke home
    router.replace('/')
  }
})

onUnmounted(() => {
  // Listener Firebase otomatis dibersihkan oleh store
})
</script>
