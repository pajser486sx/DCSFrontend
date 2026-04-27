<script setup>
import { ref } from 'vue'
import { supabase } from '@/supabase.js'
import { auth } from '@/firebase.js'
import { useDailyWord } from '@/composables/UseDailyWord'

const title = ref('')
const file = ref(null)
const previewUrl = ref(null)
const grayscaleOrColoured = ref('grayscale')
const digitalOrTraditional = ref('digital')
const { dailyWord } = useDailyWord()

const handleFileChange = (event) => {
  const selected = event.target.files[0]
  if (selected) {
    file.value = selected
    previewUrl.value = URL.createObjectURL(selected)
  }
}
const handleUpload = async () => {
  if (!file.value || !title.value.trim()) {
    alert('Please provide a title or select a file.')
    return
  }

  const user = auth.currentUser
  if (!user) {
    alert('You must be logged in to upload.')
    return
  }

  const filePath = `${user.uid}_${Date.now()}_${file.value.name}`

  const { error: uploadError } = await supabase.storage
    .from('artworks')
    .upload(filePath, file.value)

  if (uploadError) {
    alert('Upload failed: ' + uploadError.message)
    return
  }

  const { data: urlData } = supabase.storage
    .from('artworks')
    .getPublicUrl(filePath)

const tags = [grayscaleOrColoured.value, digitalOrTraditional.value]

const { error: dbError } = await supabase
  .from('artworks')
  .insert([{
    title: title.value,
    url: urlData.publicUrl,
    tags,
    uploaded_by: user.email,
    created_at: new Date(),
    daily_word: dailyWord.value
  }])

if (dbError) {
  alert('Error saving metadata: ' + dbError.message)
  return
}

  alert('Upload successful!')
  title.value = ''
  file.value = null
  previewUrl.value = null
}

</script>

<template>
  <div class="px-4 py-8">
    <div class="flex justify-center mb-6">
      <img
        src="/UploadArt.png"
        alt="Upload Art"
        class="w-88 h-auto"
      />
    </div>

    <div class="mx-auto w-full max-w-xl rounded-xl shadow bg-gray-800 p-6">
      <form @submit.prevent="handleUpload" class="space-y-5">

        <div class="max-w-sm">
          <input
            type="text"
            v-model="title"
            placeholder="Title..."
            class="w-full p-2 border rounded text-white"
          />
        </div>

        <div class="text-white">
          <input
            type="file"
            @change="handleFileChange"
            accept="image/*"
            class="w-full"
          />
        </div>

        <div v-if="previewUrl" class="pt-2 text-white">
          <img
            :src="previewUrl"
            alt="Preview"
            class="w-full h-auto rounded border"
          />
        </div>

        <div class="flex flex-col sm:flex-row gap-4 text-white">
          <select v-model="grayscaleOrColoured" class="p-2 border rounded bg-black">
            <option value="grayscale">Grayscale</option>
            <option value="coloured">Coloured</option>
          </select>

          <select v-model="digitalOrTraditional" class="p-2 border rounded bg-black">
            <option value="digital">Digital</option>
            <option value="traditional">Traditional</option>
          </select>
        </div>

        <button
          type="submit"
          class="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-300 hover:text-black w-full sm:w-auto"
        >
          Upload
        </button>
      </form>
    </div>

    <div class="pt-4 text-center">
      <span class="text-yellow-300 font-bold bg-black px-4 py-2 rounded uppercase" style="font-family: 'Lapsus Pro'">
        Warning! Once uploaded, you cannot delete your artwork!
      </span>
    </div>
  </div>
</template>
