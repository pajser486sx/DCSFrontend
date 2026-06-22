<script setup>
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'

import ArtButton from './ArtButton.vue'
import DailyButton from './DailyButton.vue'
import SearchBar from './SearchBar.vue'

const router = useRouter()
const route = useRoute()

const { isLoggedIn, isAdmin, logout } = useAuth()

const showLogo = computed(() =>
  ['coloured', 'grayscale', 'traditional', 'digital', 'login', 'register', 'admin', 'daily', 'upload', 'search'].includes(route.name)
)

const goHome = () => router.push('/')
const goToLogin = () => router.push('/login')
const goToAdmin = () => router.push('/admin')

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>

<template>
  <nav class="bg-black text-white flex justify-between items-center px-4 py-2 relative">
    <div class="flex gap-4">
      <ArtButton name="Coloured" />
      <ArtButton name="Grayscale" />
      <ArtButton name="Traditional" />
      <ArtButton name="Digital" />
      <DailyButton name="Daily" />
    </div>
    <button
      v-if="showLogo"
      @click="goHome"
      class="absolute left-1/2 transform -translate-x-1/2 text-2xl tracking-wide"
      style="font-family: 'Lapsus Pro';">
      DCS
    </button>

    <div class="flex items-center gap-2">
      <SearchBar />

      <button
        v-if="isAdmin"
        @click="goToAdmin"
        class="bg-white text-black px-3 py-1 rounded hover:bg-gray-300">
        Admin
      </button>

      <RouterLink
        v-if="isLoggedIn"
        to="/Upload"
        class="bg-white text-black px-3 py-1 rounded hover:bg-gray-300">
        Upload
      </RouterLink>

      <button
        v-if="!isLoggedIn"
        @click="goToLogin"
        class="bg-white text-black px-3 py-1 rounded hover:bg-gray-300">
        Log In
      </button>

      <button
        v-if="isLoggedIn"
        @click="handleLogout"
        class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800">
        Log Out
      </button>
    </div>
  </nav>
</template>
