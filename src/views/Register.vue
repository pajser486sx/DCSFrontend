<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '@/firebase.js'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { setDoc, doc, collection, getDocs, query, where } from 'firebase/firestore'

const email = ref('')
const password = ref('')
const router = useRouter()

const register = async () => {
  try {
    const q = query(collection(db, 'users'), where('email', '==', email.value))
    const snapshot = await getDocs(q)
    if (snapshot.size > 0) {
      alert('This email is already taken!')
      return
    }

    if (!email.value || !password.value) {
      alert('Please fill out all of the fields!')
      return
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const uid = userCredential.user.uid
    
    await setDoc(doc(db, 'users', uid), {
      email: email.value
    })

    alert(`Welcome, ${email.value}!`)
    router.push('/Daily')
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
