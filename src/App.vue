<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-yellow-300 to-orange-500 bg-fixed">
    <Navbar />
    <RouterView />
  </div>
</template>

