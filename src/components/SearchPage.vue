<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '@/supabase.js'

const route = useRoute()

const allowedTags = ['grayscale', 'digital', 'traditional', 'coloured']

const q = ref('')
const loading = ref(false)
const artworks = ref([])
const users = ref([])

const formatDate = (d) => {
  try { return new Date(d).toLocaleString() } catch { return String(d) }
}
const tagsOf = (art) => {
  const raw = Array.isArray(art.tags) ? art.tags : String(art.tags || '').split(',')
  return raw.map(t => String(t).trim()).filter(Boolean)
}

const fetchResults = async () => {
  const term = q.value.trim()
  artworks.value = []
  users.value = []
  if (!term) return

  loading.value = true
  try {
    const termLower = term.toLowerCase()
    const like = `%${termLower}%`
    const isAllowedTag = allowedTags.includes(termLower)

    const orParts = [
      `title.ilike.${like}`,
      `uploaded_by.ilike.${like}`,
      `daily_word.ilike.${like}`,
    ]
    if (isAllowedTag) {
      orParts.push(`tags.ilike.${like}`)
    }

    const { data, error } = await supabase
      .from('artworks')
      .select('*')
      .or(orParts.join(','))
      .order('created_at', { ascending: false })

    if (error) throw error
    artworks.value = data ?? []

    users.value = Array.from(new Set(
      artworks.value
        .map(a => a?.uploaded_by)
        .filter(u => u && u.toLowerCase().includes(termLower))
    ))
  } catch (e) {
    console.error('Search error:', e)
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  q.value = (route.query.q ?? '').toString()
  fetchResults()
})
watch(
  () => route.query.q,
  (newQ) => {
    q.value = (newQ ?? '').toString()
    fetchResults()
  }
)
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center gap-3">
      <h1 class="text-2xl font-bold">Search query: </h1>
      <span class="px-2 py-1 rounded bg-yellow-200 text-black font-bold">{{ q }}</span>
    </div>

    <div v-if="loading" class="italic">Searching…</div>
    <div v-else class="space-y-10">

      <section>
        <h2 class="text-xl font-bold">Found users: </h2>
        <span v-if="users.length === 0">No matching users.</span>
        <ul v-else class="list-disc pl-6">
          <li v-for="u in users" :key="u">
            {{ u }}
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-bold mb-3 text-black">Artworks: </h2>
        <div v-if="artworks.length === 0" class="text-white">No artworks found.</div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div
            v-for="art in artworks"
            :key="art.id"
            class="relative bg-gray-800 p-4 rounded text-white"
          >
            <img
              v-if="art.url"
              :src="art.url"
              :alt="art.title || 'Artwork'"
              class="w-full h-auto object-cover rounded mb-2"
            />

            <h2 class="text-lg font-semibold">{{ art.title || 'Untitled' }}</h2>
            <p class="text-sm opacity-70">Uploaded by: {{ art.uploaded_by }}</p>
            <p class="text-sm opacity-60">{{ formatDate(art.created_at) }}</p>
            <p class="text-sm opacity-50 italic" v-if="art.daily_word">
              Daily word on that day: "{{ art.daily_word }}"
            </p>

            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="tag in tagsOf(art)"
                :key="tag"
                class="bg-yellow-300 px-2 py-1 rounded text-xs font-bold text-black mr-1"
              >
                #{{ String(tag).trim().replace(/[^a-zA-Z]+/g, '') }}
              </span>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>
