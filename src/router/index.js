import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '@/firebase.js'

import HomeView from '@/views/HomeView.vue'
import Coloured from '@/components/Coloured.vue'
import Grayscale from '@/components/Grayscale.vue'
import Traditional from '@/components/Traditional.vue'
import Digital from '@/components/Digital.vue'
import Daily from '@/components/Daily.vue'
import SearchPage from '@/components/SearchPage.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Admin from '@/views/Admin.vue'
import Upload from '@/views/Upload.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/coloured', name: 'coloured', component: Coloured },
  { path: '/grayscale', name: 'grayscale', component: Grayscale },
  { path: '/traditional', name: 'traditional', component: Traditional },
  { path: '/digital', name: 'digital', component: Digital },
  { path: '/daily', name: 'daily', component: Daily },
  { path: '/login', name: 'login', component: Login },
  { path: '/register', name: 'register', component: Register },
  { path: '/admin', name: 'admin', component: Admin },
  { path: '/upload', name: 'upload', component: Upload },
  { path: '/search', name: 'search', component: SearchPage },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const protectedAdminRoute = to.path === '/admin'
  const protectedUploadRoute = to.path === '/upload'

  const user = auth.currentUser

  if (!user) {
    return new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
        unsubscribe()

        if (protectedAdminRoute && firebaseUser?.email !== 'paja@gmail.com') {
          alert('You are not authorized to access this page.')
          resolve({ path: '/' })
          return
        }

        if (protectedUploadRoute && !firebaseUser) {
          alert('Please log in to upload.')
          resolve({ path: '/login' })
          return
        }

        resolve(true)
      })
    })
  } else {
    if (protectedAdminRoute && user.email !== 'paja@gmail.com') {
      alert('You are not authorized to access this page.')
      return { path: '/' }
    }

    if (protectedUploadRoute && !user) {
      alert('Please log in to upload.')
      return { path: '/login' }
    }

    return true
  }
})

export default router
