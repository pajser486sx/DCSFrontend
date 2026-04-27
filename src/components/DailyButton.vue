<template>
  <button class="font-bold px-3 py-1 rounded border border-yellow-400 text-yellow-400 hover:bg-yellow-900 transition" @click="navigate">
    {{ name }}
  </button>
</template>

<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({ name: String })
const router = useRouter()

const navigate = () => {
  router.push('/' + props.name.toLowerCase())
}
</script>