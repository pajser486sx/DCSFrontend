<script setup>
import { ref, onMounted } from 'vue'
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/firebase.js'

const newWord = ref('')
const dailyWords = ref([])
const fetchWords = async () => {
  const snapshot = await getDocs(collection(db, 'dailyWords'))
  dailyWords.value = snapshot.docs
    .map(doc => ({
      id: doc.id,
      word: doc.data().word,
      createdAt: doc.data().createdAt?.toDate?.() || new Date(0)
    }))
    .sort((a, b) => b.createdAt - a.createdAt)
}

const submitWord = async () => {
  const trimmed = newWord.value.trim()
  if (!trimmed) return

  await addDoc(collection(db, 'dailyWords'), {
    word: trimmed,
    createdAt: new Date()
  })
  newWord.value = ''
  await fetchWords()
}

const popLastWord = async () => {
  if (dailyWords.value.length === 0) return
  const lastWord = dailyWords.value[0]
  await deleteDoc(doc(db, 'dailyWords', lastWord.id))
  fetchWords()
}

onMounted(fetchWords)
</script>

<template>
  <div class="min-h-screen w-full bg-orange-400 flex flex-col items-center py-10 px-4">
    <img
      src="/Administration.png"
      alt="Administration"
      class="w-full max-w-4xl mx-auto mb-10"
    />

    <div class="w-full max-w-xl bg-gray-800 backdrop-blur-sm rounded-2xl p-6">
      <h1 class="text-3xl font-bold mb-6 text-center text-white uppercase" style="font-family: 'Lapsus Pro';">Admin Dashboard</h1>

      <form @submit.prevent="submitWord" class="mb-6 flex flex-col sm:flex-row items-center gap-3">
        <input
          v-model="newWord"
          placeholder="Enter a new word"
          class="p-2 rounded w-full bg-white text-black placeholder-gray-600"
        />
        <button class="bg-yellow-300 hover:bg-yellow-500 text-black px-4 py-2 rounded w-full sm:w-auto">
          Add a word...
        </button>
      </form>

      <button
        @click="popLastWord"
        class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mb-6 w-full"
      >
        Delete the last word...
      </button>

      <div class="border border-white/30 rounded bg-white/20 p-4 max-h-[70vh] overflow-y-auto">
        <p v-for="entry in dailyWords" :key="entry.id" class="mb-1 text-white">
          {{ entry.word }}
        </p>
      </div>
    </div>
  </div>
</template>
