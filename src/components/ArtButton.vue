<template>
  <button class="px-3 py-1 rounded hover:bg-gray-700 transition" @click="navigate">{{ name }}</button>
</template>

<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({ name: String })
const router = useRouter()

const navigate = () => {
  router.push('/' + props.name.toLowerCase())
}
</script>
