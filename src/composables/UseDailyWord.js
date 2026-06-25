import { ref, onMounted } from 'vue'

const dailyWord = ref('')
const dailyDate = ref('')
const dailyWordObject = ref(null)

export function useDailyWord() {
  const fetchDailyWord = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/daily-words/today`)

      if (!res.ok) {
        throw new Error('Failed to fetch daily word')
      }

      const wordData = await res.json()

      dailyWordObject.value = wordData
      dailyWord.value = wordData.word

      if (wordData.date) {
        dailyDate.value = new Date(`${wordData.date}T00:00:00Z`).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
      } else {
        dailyDate.value = ''
      }
    } catch (error) {
      console.error('Error fetching daily word:', error)
      dailyWord.value = 'Error fetching word'
      dailyDate.value = ''
      dailyWordObject.value = null
    }
  }

  onMounted(fetchDailyWord)

  return {
    dailyWord,
    dailyDate,
    dailyWordObject,
    fetchDailyWord
  }
}