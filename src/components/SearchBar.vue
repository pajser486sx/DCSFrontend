<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const query = ref('')
const router = useRouter()
const goSearch = () => {
  const q = query.value.trim()
  if (!q) return
  router.push({ name: 'search', query: { q } })
}
</script>

<template>
  <input
    v-model="query"
    placeholder="Search..."
    class="px-3 py-1 rounded bg-yellow-300 text-black"
    @keyup.enter="goSearch"
  />
</template>
