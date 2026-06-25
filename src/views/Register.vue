<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const username = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()
const { registerUser } = useAuth()

const register = async () => {
  try {
    if (!username.value || !email.value || !password.value) {
    alert('Please fill out all of the fields!')
      return
    }
    const user = await registerUser(username.value, email.value, password.value)

    alert(`Welcome, ${user.email}!`)
    router.push('/daily')
  } catch (error) {
    console.error('Registration error:', error.message)
    alert(error.message)
  }
}
</script>

<template>
  <div class="flex justify-between items-center min-h-screen bg-yellow-300 text-black px-8">
    <div class="max-w-md ml-30">
      <img src="/DCS3loginCreator.png" alt="Ready to join us?" class="w-full h-auto" />
    </div>

    <div class="bg-white p-8 mr-30 rounded shadow-lg w-full max-w-sm" style="font-family: 'Lapsus Pro'">
      <h2 class="text-2xl mb-6 text-center">REGISTER</h2>

      <form @submit.prevent="register">
      <input
          v-model="username"
          type="text"
          placeholder="Username"
          class="block mb-4 p-2 rounded w-full bg-gray-300 text-black placeholder-black"
        />
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="block mb-4 p-2 rounded w-full bg-gray-300 text-black placeholder-black"
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="block mb-6 p-2 rounded w-full bg-gray-300 text-black placeholder-black"
        />
        <button type="submit" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full">
          REGISTER
        </button>
      </form>
    </div>
  </div>
</template>
