<script lang="ts" setup>
import AppBar from '@/components/app/AppBar.vue'
import ProfileHeader from '@/components/profile/ProfileHeader.vue'
import { useAuthStore } from '@/stores/auth'
import ProfileEditView from '@/views/ProfileEditView.vue'
import ProfileTimelineView from '@/views/ProfileTimelineView.vue'
import { onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()

const route = router.currentRoute.value
const username = route.params.username
const isOwnProfile = username === authStore.authenticatedUser?.username

const user = ref({
  uid: '',
  name: '',
  username: '',
  imageUrl: '',
  followingCount: 0,
  followersCount: 0,
  createdAt: new Date()
} satisfies User)

onBeforeMount(async () => {
  if (isOwnProfile) {
    setupAuthenticatedUser()
    return
  }

  try {
    const foundUser = await authStore.getByUsername(username)

    if (foundUser) {
      user.value = {
        uid: foundUser.uid,
        name: foundUser.name,
        username: foundUser.username,
        imageUrl: foundUser.imageUrl ?? '',
        followingCount: foundUser.followingCount,
        followersCount: foundUser.followersCount,
        createdAt: foundUser.createdAt
      }
    }
  } catch (e) {
    await router.push('/404')
    return
  }
})

function setupAuthenticatedUser() {
  user.value = {
    uid: authStore.authenticatedUser!.uid,
    name: authStore.authenticatedUser!.name,
    username: authStore.authenticatedUser!.username,
    imageUrl: authStore.authenticatedUser!.imageUrl ?? '',
    followingCount: authStore.authenticatedUser!.followingCount,
    followersCount: authStore.authenticatedUser!.followersCount,
    createdAt: authStore.authenticatedUser!.createdAt
  }
}
</script>

<template>
  <ProfileEditView @change="setupAuthenticatedUser" />

  <AppBar>
    <ProfileHeader :is-current-user="isOwnProfile" :user="user" />

    <ProfileTimelineView :user="user" />
  </AppBar>
</template>

<style scoped>
:deep(.p-avatar) {
  height: 15rem;
  width: 15rem;
}

:deep(.p-avatar-icon) {
  font-size: 5rem;
}
</style>
