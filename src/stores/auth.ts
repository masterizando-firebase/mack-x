import router from '@/router'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useFirebaseAuth, useFirestore } from 'vuefire'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const authenticatedUser = ref<AuthenticatedUser | undefined>(undefined)
    const users = ref<AuthenticatedUser[]>([])

    const auth = useFirebaseAuth()
    const db = useFirestore()

    async function storeUserFromCredential(
      id: string,
      email: string,
      name: string | null,
      imageUrl: string | null = null
    ) {
      const user = {
        uid: id,
        name: name,
        email: email,
        username: name,
        imageUrl: imageUrl,
        followersCount: 0,
        followingCount: 0,
        createAt: new Date()
      }
      await setDoc(doc(db, 'users', id), user)
      return user
    }

    async function signUp({
      name,
      email,
      password
    }: {
      name: string
      email: string
      password: string
    }) {
      const userCredentials = await createUserWithEmailAndPassword(auth!, email, password)
      authenticatedUser.value = await storeUserFromCredential(
        userCredentials.user.uid,
        userCredentials.user.email!,
        name
      )
    }

    async function authenticate({ email, password }: { email: string; password: string }) {
      const userCredentials = await signInWithEmailAndPassword(auth!, email, password)
      const docSnap = await getDoc(doc(db, 'users', userCredentials.user.uid))

      if (!docSnap.exists()) {
        throw new Error('Authentication Failed')
      }

      authenticatedUser.value = docSnap.data()
    }

    async function signOut() {
      authenticatedUser.value = undefined
      await fbSignOut(auth!)
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
