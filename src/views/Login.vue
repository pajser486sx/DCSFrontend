<script setup>
import { ref } from 'vue'
import { auth } from '@/firebase.js'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { RouterLink, useRouter } from 'vue-router'
  
const username = ref('')
const password = ref('')
const router = useRouter()


const login = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, username.value, password.value)
    console.log('Logged in as:', userCredential.user.email)
    alert('Welcome, ' + userCredential.user.email)

     const isAdmin = userCredential.user.email === 'paja@gmail.com'
    if (isAdmin) {
      router.push('/admin')
    } else {
      router.push('/Daily')
    }
  } catch (error) {
    console.error('Auth error:', error.message)
    alert(error.message)
  }
   router.push('/Daily')
}


</script>

<template>
  <div class="flex justify-between items-center min-h-screen bg-yellow-300 text-black px-8">
    
    <div class="max-w-md ml-30">
      <img src="/WelcomeLogin.png" alt="Welcome back!" class="w-full h-auto" />
    </div>

    <div class="flex flex-col items-center">
      <div
        class="bg-white p-8 mr-30 rounded shadow-lg w-full max-w-sm" style="font-family: 'Lapsus Pro'"
      >
        <h2 class="text-2xl mb-6 text-center">ACCOUNT</h2>
        <form @submit.prevent="login">
          <input
            type="text"
            placeholder="Email"
            class="block mb-4 p-2 rounded w-full bg-gray-300 text-black placeholder-black"
            v-model="username"
          />
          <input
            type="password"
            placeholder="Password"
            class="block mb-6 p-2 rounded w-full bg-gray-300 text-black placeholder-black"
            v-model="password"
          />
          <button type="submit" class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 w-full">
            LOG IN
          </button>
        </form>
      </div>

      <p class="mt-4 text-yellow-300 bg-black px-4 py-2 rounded uppercase" style="font-family: 'Lapsus Pro'">
        Don’t have an account?
        <RouterLink to="/Register" class="underline text-white hover:text-gray-400">
          Register
        </RouterLink>
      </p>
    </div>

  </div>
</template>
