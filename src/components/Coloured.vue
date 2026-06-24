<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/supabase.js'
import { useAuth } from '@/composables/useAuth'

const images = ref([])
const allWords = ref([])
const { isAdmin } = useAuth()

const fetchAllDailyWords = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/daily-words`)
  if (!res.ok) {
    console.error('Failed to fetch daily words')
    return
  }
  const words = await res.json()
  allWords.value = words.map(word => word.word)
}
const getWordForDate = (timestamp) => {
  if (!allWords.value.length) return ''
  const dayIndex = Math.floor(new Date(timestamp).getTime() / (1000 * 60 * 60 * 24))
  const wordIndex = dayIndex % allWords.value.length
  return allWords.value[wordIndex]
}
const formatDate = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}
const fetchColouredImages = async () => {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .ilike('tags', '%coloured%')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch images:', error.message)
    return
  }
  images.value = data ?? []
}

const deletingIds = ref(new Set())

const deleteImage = async (image) => {
  if (!isAdmin.value) return
  const confirmMsg = `Delete "${image.title}"? This removes record from THE DATABASE.`
  if (!confirm(confirmMsg)) return

  try {
    deletingIds.value.add(image.id)

    const { error: dbErr } = await supabase
      .from('artworks')
      .delete()
      .eq('id', image.id)

    if (dbErr) {
      alert('Failed to delete from database: ' + dbErr.message)
      return
    }

    images.value = images.value.filter(i => i.id !== image.id)
  } finally {
    deletingIds.value.delete(image.id)
  }
}

onMounted(fetchColouredImages)
</script>

<template>
  <div class="p-4 text-white">
    <img src="/ColouredFeed.png"
      alt="Coloured feed"
      class="w-[500px] h-auto mb-10"
    />
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div
        v-for="image in images"
        :key="image.id"
        class="relative bg-gray-800 p-4 rounded"
      >
        <img
          :src="image.url"
          :alt="image.title"
          class="w-full h-auto object-cover rounded mb-2"
        />

        <button
          v-if="isAdmin"
          @click="deleteImage(image)"
          :disabled="deletingIds.has(image.id)"
          title="Delete image"
          class="absolute bottom-2 right-2 h-8 w-8 rounded-full flex items-center justify-center
                 bg-white text-black font-bold shadow hover:opacity-90 active:scale-95"
        >
          <span v-if="!deletingIds.has(image.id)">×</span>
        </button>

        <h2 class="text-lg font-semibold">{{ image.title }}</h2>
        <p class="text-sm opacity-70">Uploaded by: {{ image.uploaded_by }}</p>
        <p class="text-sm opacity-60">{{ formatDate(image.created_at) }}</p>
        <p class="text-sm opacity-50 italic">
          Daily word on that day: "{{ image.daily_word || 'No daily word saved' }}"
        </p>

        <div class="mt-2 flex flex-wrap gap-2">
          <span
            v-for="tag in (Array.isArray(image.tags) ? image.tags : String(image.tags || '').split(','))"
            :key="tag"
            class="bg-yellow-300 px-2 py-1 rounded text-xs font-bold text-black mr-1"
          >
            #{{ String(tag).trim().replace(/[^a-zA-Z]+/g, '') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
