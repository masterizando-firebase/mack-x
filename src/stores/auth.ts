import router from '@/router'
import { getAnalytics, logEvent } from 'firebase/analytics'
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as fbSignOut
} from 'firebase/auth'

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getCurrentUser, useFirebaseAuth, useFirestore } from 'vuefire'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const authenticatedUser = ref<AuthenticatedUser | undefined>(undefined)
    const users = ref<Array<User>>([])

    const auth = useFirebaseAuth()
    const db = useFirestore()
    const analytics = getAnalytics()

    function generateUsername(name: string) {
      return `${name.replace(/ /g, '').toLowerCase()}`
    }

    async function storeUserFromCredential(
      id: string,
      email: string,
      name: string | null,
      imageUrl: string | null = null
    ) {
      const storeName = name || 'user'

      const user = {
        uid: id,
        name: storeName,
        email: email,
        username: generateUsername(storeName),
        imageUrl: imageUrl,
        followersCount: 0,
        followingCount: 0,
        createdAt: new Date()
      }

      await setDoc(getByIdQuery(user.uid), user)
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
      logEvent(analytics, 'sign_up', { user: authenticatedUser.value })
    }

    async function authenticate({ email, password }: { email: string; password: string }) {
      const userCredentials = await signInWithEmailAndPassword(auth!, email, password)
      const docSnap = await getDoc(getByIdQuery(userCredentials.user.uid))

      if (!docSnap.exists()) {
        throw new Error('Authentication Failed')
      }

      authenticatedUser.value = docSnap.data() as AuthenticatedUser
      logEvent(analytics, 'login', { user: authenticatedUser.value })
    }

    async function signInWithGoogle() {
      const provider = new GoogleAuthProvider()
      const userCredentials = await signInWithPopup(auth!, provider)
      const docSnap = await getDoc(getByIdQuery(userCredentials.user.uid))

      let user: AuthenticatedUser | null = null

      if (!docSnap.exists()) {
        user = await storeUserFromCredential(
          userCredentials.user.uid,
          userCredentials.user.email!,
          userCredentials.user.displayName,
          userCredentials.user.photoURL
        )
      }

      authenticatedUser.value = user || (docSnap.data() as AuthenticatedUser)
      logEvent(analytics, 'login', { user: authenticatedUser.value })
    }

    async function signOut() {
      logEvent(analytics, 'sign_out', { user: authenticatedUser.value })
      authenticatedUser.value = undefined
      await fbSignOut(auth!)
      await router.replace('/login')
    }

    async function userWithUsernameExists(username: string) {
      const userCollection = collection(db, 'users')
      const whereCond = where('username', '==', username)

      const docSnap = await getDocs(query(userCollection, whereCond))

      return !docSnap.empty && docSnap.docs[0].exists()
    }

    async function update(user: AuthenticatedUser, image: File | null) {
      const currentUser = await getCurrentUser()

      if (!currentUser) {
        throw new Error('User not found')
      }

      if (await userWithUsernameExists(user.username)) {
        throw new Error('Username already exists')
      }

      if (image) {
        // Upload image
      }

      logEvent(analytics, 'updated_user', { user: authenticatedUser.value })

      await updateDoc(doc(db, 'users', user.uid), { ...user })
    }

    async function getByUsername(username: string | string[]) {
      const userCollection = collection(db, 'users')
      const whereCond = where('username', '==', username)

      const docSnap = await getDocs(query(userCollection, whereCond))

      return docSnap.docs[0].data() as User
    }

    function getByIdQuery(id: string) {
      return doc(db, 'users', id)
    }

    async function getById(id: string) {
      const docSnap = await getDoc(getByIdQuery(id))
      if (!docSnap.exists()) {
        throw new Error('Not found')
      }

      return docSnap.data() as User
    }

    return {
      authenticatedUser,
      users,
      signUp,
      authenticate,
      signInWithGoogle,
      signOut,
      update,
      getById,
      getByUsername
    }
  },
  { persist: true }
)
