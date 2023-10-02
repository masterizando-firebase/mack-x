import router from '@/router'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const authenticatedUser = ref<AuthenticatedUser | undefined>(undefined)
    const users = ref<Array<AuthenticatedUser>>([
      {
        uid: '1',
        name: 'John Doe',
        username: 'johndoe',
        email: 'johndoe@email.com',
        password: '123',
        imageUrl: 'https://logodownload.org/wp-content/uploads/2017/09/mackenzie-logo-3.png',
        followingCount: 0,
        followersCount: 0,
        createdAt: new Date()
      }
    ])

    async function signUp({
      name,
      email,
      password
    }: {
      name: string
      email: string
      password: string
    }) {
      if (users.value.find((user) => user.email === email)) {
        throw new Error('User already exists')
      }

      const user = {
        name,
        email,
        password,
        uid: (users.value.length + 1).toString(),
        username: name.replace(' ', '').toLowerCase(),
        imageUrl: undefined,
        followingCount: 0,
        followersCount: 0,
        createdAt: new Date()
      }

      users.value.push(user)
      authenticatedUser.value = user
    }

    async function authenticate({ email, password }: { email: string; password: string }) {
      authenticatedUser.value = users.value.find(
        (user) => user.email === email && user.password === password
      )
    }

    async function signOut() {
      authenticatedUser.value = undefined
      await router.replace('/login')
    }

    async function update(user: AuthenticatedUser) {
      const index = users.value.findIndex((u) => u.email === user.email)

      if (index === -1) {
        throw new Error('User not found')
      }

      if (user.username in users.value && users.value[index].username !== user.username) {
        throw new Error('Username already exists')
      }

      users.value[index] = user
      authenticatedUser.value = user
    }

    function getByUsername(username: string | string[]) {
      return users.value.find((user) => user.username === username)
    }

    async function getById(id: string) {
      return users.value.find((user) => user.uid === id)
    }

    return {
      authenticatedUser,
      users,
      signUp,
      authenticate,
      signOut,
      update,
      getById,
      getByUsername
    }
  },
  { persist: true }
)
