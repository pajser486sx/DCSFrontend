import { computed, ref } from 'vue'

const storedUser = localStorage.getItem('dcsUser')
const storedToken = localStorage.getItem('dcsToken')

const user = ref(storedUser ? JSON.parse(storedUser) : null)
const token = ref(storedToken || null)

const isLoggedIn = computed(() => !!token.value && !!user.value)
const isAdmin = computed(() => user.value?.isAdmin === true)

export function useAuth() {
  const saveAuth = (authData) => {
    token.value = authData.token
    user.value = authData.user

    localStorage.setItem('dcsToken', authData.token)
    localStorage.setItem('dcsUser', JSON.stringify(authData.user))
  }

  const getAuthHeaders = () => {
    if (!token.value) return {}

    return {
      Authorization: `Bearer ${token.value}`
    }
  }

  const loginUser = async (email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Login failed')
    }

    saveAuth(data)

    return data.user
  }

  const registerUser = async (username, email, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Registration failed')
    }

    saveAuth(data)

    return data.user
  }

  const logout = () => {
    token.value = null
    user.value = null

    localStorage.removeItem('dcsToken')
    localStorage.removeItem('dcsUser')
  }

  const fetchCurrentUser = async () => {
    if (!token.value) return null

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
      headers: getAuthHeaders()
    })

    const data = await res.json()

    if (!res.ok) {
      logout()
      throw new Error(data.message || 'Session expired')
    }

    user.value = data.user
    localStorage.setItem('dcsUser', JSON.stringify(data.user))

    return data.user
  }

  return {
    user,
    token,
    isLoggedIn,
    isAdmin,
    loginUser,
    registerUser,
    logout,
    getAuthHeaders,
    fetchCurrentUser
  }
}