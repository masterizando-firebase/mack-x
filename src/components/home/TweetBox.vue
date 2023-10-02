<script lang="ts" setup>
import { useTimelineStore } from '@/stores/timeline'
import { useFileDialog } from '@vueuse/core/index.cjs'
import { useToast } from 'primevue/usetoast'
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const toast = useToast()
const authStore = useAuthStore()
const { createTweet } = useTimelineStore()

const { open, reset, onChange } = useFileDialog({
  accept: 'image/*',
  multiple: false
})

const tweet = ref<string | null>(null)
const tweetImage = ref<File | null>(null)
const tweetImageUrl = ref<string | null>(null)
const loading = ref<boolean>(false)

onChange((files) => {
  if (files?.length === 1) {
    const file = files[0]
    tweetImage.value = file
    tweetImageUrl.value = URL.createObjectURL(file)
  }
})

function onClearFile(): void {
  tweetImage.value = null
  tweetImageUrl.value = null
  reset()
}

async function onTweet(): Promise<void> {
  loading.value = true

  try {
    await createTweet({
      content: tweet.value!,
      image: tweetImage.value
    })
  } catch (e: any) {
    toast.add({
      severity: 'error',
      summary: 'Tweet was not created',
      detail: e.message,
      life: 3000
    })
    return
  }

  tweet.value = null
  onClearFile()

  toast.add({
    severity: 'success',
    summary: 'You just tweeted!',
    detail: 'Go share with your friends!',
    life: 3000
  })

  loading.value = false
}
</script>

<template>
  <div class="container">
    <img
      class="avatar"
      alt="User profile image"
      :src="
        authStore.authenticatedUser?.imageUrl ??
        'https://jlmoisan.com/wp-content/uploads/2021/04/user-placeholder.png'
      "
    />

    <div class="content">
      <InputText
        v-model="tweet"
        aria-describedby="tweet-input"
        class="tweet"
        placeholder="Whats happening?!"
        size="large"
      />

      <div v-if="tweetImageUrl" class="image relative">
        <Button
          class="absolute right-0 mt-2 mr-3"
          icon="pi pi-times"
          rounded
          style="background: black; border: none; color: white"
          @click="onClearFile()"
        />

        <img :src="tweetImageUrl" alt="Tweet image" class="tweet-image" />
      </div>

      <div class="flex justify-content-between">
        <Button icon="pi pi-image" rounded text @click="open()" />

        <Button
          :disabled="!tweet"
          :loading="loading"
          class="mr-2"
          label="Post"
          rounded
          @click="onTweet"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;

  display: flex;
  align-items: start;

  border-top: 1px solid var(--border-color);

  padding: 8px 16px;
}

.avatar {
  min-width: 40px !important;
  min-height: 40px !important;
  width: 40px !important;
  height: 40px !important;

  border-radius: 100px;

  margin: 4px 8px 0 0;
}

.content {
  width: 100%;
}

.avatar {
  min-width: 40px;
  min-height: 40px;

  margin: 4px 8px 0 0;
}

.tweet {
  width: 100%;

  border: none;
}

.tweet:focus {
  border: none;
  box-shadow: none;
}

.image {
  padding-right: 8px;
}

.tweet-image {
  width: 100%;
  height: 400px;

  object-fit: cover;
  border-radius: 20px;

  margin-bottom: 8px;
}
</style>
