import { ref, onMounted } from 'vue'

const dailyWord = ref('')

export function useDailyWord() {
  const fetchDailyWord = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/daily-words`)

      if (!res.ok) {
        throw new Error('Failed to fetch daily word')
      }
      const words = await res.json()

      dailyWord.value = words[0]?.word || 'No daily word found'
    } catch (error) {
      console.error('Error fetching daily word:', error)
      dailyWord.value = 'Error fetching word'
    }
  }

  onMounted(() => {
    fetchDailyWord()
  })

  return {
    dailyWord
  }
}


/* import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/firebase.js'

export function useDailyWord() {
  const dailyWord = ref('')
  const dailyDate = ref('')
  const allWords = ref([])

  const fetchDailyWord = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'dailyWords'))
      allWords.value = snapshot.docs.map(doc => doc.data().word)

      if (allWords.value.length > 0) {
        const now = new Date()
        const dayIndex = Math.floor(now.getTime() / (1000 * 60 * 60 * 24))
        const wordIndex = dayIndex % allWords.value.length

        dailyWord.value = allWords.value[wordIndex]
        dailyDate.value = now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      } else {
        dailyWord.value = 'No words found'
        dailyDate.value = ''
      }
    } catch (error) {
      console.error('Firestore fetch error:', error)
      dailyWord.value = 'Error fetching word'
      dailyDate.value = ''
    }
  }

  onMounted(fetchDailyWord)

  return { dailyWord, dailyDate }
}

*/
