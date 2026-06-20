<script setup>
import { ref, watchEffect } from 'vue'
import { useDailyWord } from '@/composables/UseDailyWord'
import { supabase } from '@/supabase.js'

const { dailyWord, dailyDate } = useDailyWord()
const images = ref([])

const fetchImagesForToday = async () => {
  const { data, error } = await supabase
    .from('artworks')
    .select('*')
    .eq('daily_word', dailyWord.value)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching images:', error)
    return
  }

  images.value = data
}

watchEffect(() => {
  if (dailyWord.value && dailyWord.value !== 'Error fetching word') {
    fetchImagesForToday()
  }
})
</script>

<template>
  <div class="p-6 text-center">
    <h2 class="text-3xl font-bold mb-2" style="font-family: 'Lapsus Pro'">Today's daily word is:</h2>
    <p class="text-8xl text-white drop-shadow-[0_0_3px_black] uppercase" style="font-family: 'Lapsus Pro'">{{ dailyWord }}</p>
    <p class="text-white text-xl mt-2">Date: {{ dailyDate }}</p>
  </div>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
  <div
    v-for="image in images"
    :key="image.id"
    class="bg-gray-800 p-4 rounded shadow"
  >
    <img :src="image.url" :alt="image.title" class="rounded mb-2 w-full h-auto" />

    <h2 class="text-lg font-semibold text-white">{{ image.title }}</h2>
    <p class="text-sm opacity-70 text-white">Uploaded by: {{ image.uploaded_by }}</p>
    <p class="text-sm opacity-60 text-white">{{ new Date(image.created_at).toLocaleString() }}</p>
    <div class="mt-2 flex flex-wrap gap-2">
     <span
            v-for="tag in image.tags.split(',')"
            :key="tag"
            class="bg-yellow-300 px-2 py-1 rounded text-xs font-bold text-black mr-1"
            >
            #{{ tag.trim().replace(/[^a-zA-Z]+/g, '') }}
      </span>
    </div>
  </div>
</div>
</template>

