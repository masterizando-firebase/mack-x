declare module 'vue-virtual-scroller'

interface User {
  uid: string
  name: string
  username: string
  imageUrl: string | undefined | null
  followingCount: number
  followersCount: number
  createdAt: Date
}

interface AuthenticatedUser extends User {
  email: string
  password: string
}
