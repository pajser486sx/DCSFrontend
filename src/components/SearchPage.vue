<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const artworks = ref([])
const users = ref([])
const loading = ref(false)
const error = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const hasPreviousPage = ref(false)
const hasNextPage = ref(false)

const totals = ref({
  artworks: 0,
  users: 0
})

const q = computed(() => {
  return (route.query.q ?? '').toString()
})

const pageFromRoute = computed(() => {
  const page = Number(route.query.page) || 1
  return page < 1 ? 1 : page
})

const formatDate = (dateValue) => {
  if (!dateValue) return 'Unknown date'

  try {
    return new Date(dateValue).toLocaleString()
  } catch {
    return String(dateValue)
  }
}

const tagsOf = (art) => {
  const raw = Array.isArray(art.tags)
    ? art.tags
    : String(art.tags || '').split(',')

  return raw.map(tag => String(tag).trim()).filter(Boolean)
}

const runSearch = async () => {
  const term = q.value.trim()
  const page = pageFromRoute.value

  if (!term) {
    artworks.value = []
    users.value = []
    currentPage.value = 1
    totalPages.value = 1
    hasPreviousPage.value = false
    hasNextPage.value = false
    totals.value = {
      artworks: 0,
      users: 0
    }
    return
  }

  loading.value = true
  error.value = ''

  try {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/api/search?q=${encodeURIComponent(term)}&page=${page}`
    )

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Search failed')
    }

    artworks.value = data.artworks || []
    users.value = data.users || []

    currentPage.value = data.page || page
    totalPages.value = data.totalPages || 1
    hasPreviousPage.value = data.hasPreviousPage || false
    hasNextPage.value = data.hasNextPage || false

    totals.value = data.totals || {
      artworks: 0,
      users: 0
    }
  } catch (err) {
    error.value = err.message
    artworks.value = []
    users.value = []
  } finally {
    loading.value = false
  }
}

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return

  router.push({
    path: '/search',
    query: {
      q: q.value,
      page
    }
  })
}

const nextPage = () => {
  if (!hasNextPage.value) return
  goToPage(currentPage.value + 1)
}

const previousPage = () => {
  if (!hasPreviousPage.value) return
  goToPage(currentPage.value - 1)
}

onMounted(runSearch)

watch(
  () => [route.query.q, route.query.page],
  runSearch
)
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center gap-3">
      <h1 class="text-2xl font-bold">Search query:</h1>
      <span class="px-2 py-1 rounded bg-yellow-200 text-black font-bold">
        {{ q }}
      </span>
    </div>
    <div v-if="loading" class="italic">
      Searching…
    </div>
    <div v-else class="space-y-10">
      <p v-if="error" class="text-red-500 font-bold">
        {{ error }}
      </p>
      <div
        v-if="!error"
        class="flex items-center gap-4 bg-gray-800 text-white p-3 rounded uppercase" style="font-family: 'Lapsus Pro'">{{ dailyDate }}
        <span>Artworks found: {{ totals.artworks }}</span>
        <span>Users found: {{ totals.users }}</span>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
      </div>

      <section>
        <h2 class="text-xl font-bold ">Found users: (max. 12 per page)</h2>
        <span v-if="users.length === 0" style="font-family: 'Lapsus Pro'">No matching users on this page.</span>
        <ul v-else class="list-disc pl-6">
          <li v-for="user in users" :key="user._id || user.email">
            {{ user.username || user.email }}
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-xl font-bold mb-3 text-black">Artworks:</h2>
        <div v-if="artworks.length === 0" class="text-white" style="font-family: 'Lapsus Pro'">{{ dailyDate }}
          No artworks found on this page.
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div
            v-for="art in artworks"
            :key="art.id"
            class="relative bg-gray-800 p-4 rounded text-white">
            <img
              v-if="art.url"
              :src="art.url"
              :alt="art.title || 'Artwork'"
              class="w-full h-auto object-cover rounded mb-2"/>

            <h2 class="text-lg font-semibold">
              {{ art.title || 'Untitled' }}
            </h2>

            <p class="text-sm opacity-70">
              Uploaded by: {{ art.uploaded_by || 'Unknown user' }}
            </p>

            <p class="text-sm opacity-60">
              {{ formatDate(art.created_at) }}
            </p>

            <p class="text-sm opacity-50 italic" v-if="art.daily_word">
              Daily word on that day: "{{ art.daily_word }}"
            </p>

            <div class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="tag in tagsOf(art)"
                :key="tag"
                class="bg-yellow-300 px-2 py-1 rounded text-xs font-bold text-black mr-1">
                #{{ String(tag).trim().replace(/[^a-zA-Z]+/g, '') }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div
        v-if="!error && totalPages > 1"
        class="flex items-center justify-center gap-4 pt-6">
        <button
          @click="previousPage"
          :disabled="!hasPreviousPage"
          class="px-4 py-2 rounded bg-gray-800 text-white disabled:opacity-40">
          Previous
        </button>
        <span class="uppercase" style="font-family: 'Lapsus Pro'">{{ dailyDate }}
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="nextPage"
          :disabled="!hasNextPage"
          class="px-4 py-2 rounded bg-gray-800 text-white disabled:opacity-40">
          Next
        </button>
      </div>
    </div>
  </div>
</template>