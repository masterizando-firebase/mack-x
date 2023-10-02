<script lang="ts" setup>
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import type { Tweet } from '@/stores/timeline'
import { useTimelineStore } from '@/stores/timeline'
import { onBeforeMount, ref } from 'vue'

const { likeTweet, unlikeTweet } = useTimelineStore()

const props = defineProps<{ tweet: Tweet }>()

const likes = ref<number>(props.tweet.likes)
const isLiked = ref<boolean>(false)
const user = ref<User | undefined>(undefined)

async function onLike(): Promise<void> {
  if (isLiked.value) {
    await unlikeTweet(props.tweet)
  } else {
    await likeTweet(props.tweet)
  }

  isLiked.value = !isLiked.value
  likes.value += isLiked.value ? 1 : -1
}

onBeforeMount(async () => {
  user.value = await useAuthStore().getById(props.tweet.userId)
})
</script>

<template>
  <div v-if="user" class="container">
    <img
      :src="user.imageUrl ?? 'https://jlmoisan.com/wp-content/uploads/2021/04/user-placeholder.png'"
      alt="User profile image"
      class="avatar"
      @click="router.push(`/profile/${user.username}`)"
    />

    <div class="content">
      <div class="flex mb-2">
        <p class="user">{{ user.name }}</p>

        <p class="username">{{ `@${user.username}` }}</p>
      </div>

      <p class="tweet">
        {{ tweet.content }}
      </p>

      <div v-if="tweet.imageUrl" class="image">
        <img :src="tweet.imageUrl" alt="Tweet image" class="tweet-image" />
      </div>

      <div class="reactions">
        <Button
          :icon="`pi pi-heart${isLiked ? '-fill' : ''}`"
          :label="`${likes}`"
          class="like"
          rounded
          severity="danger"
          size="small"
          text
          @click="onLike()"
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

.content {
  width: 100%;
}

.avatar {
  min-width: 40px !important;
  min-height: 40px !important;
  width: 40px !important;
  height: 40px !important;

  border-radius: 100px;

  margin: 4px 8px 0 0;

  cursor: pointer;
}

.user {
  font-size: 1.1rem;
  font-weight: bold;
  margin: 8px 0 0 0;
}

.username {
  opacity: 0.7;
  font-size: 1rem;

  margin: 8px 0 0 8px;
}

.tweet {
  margin: 4px 0 0 0;
}

.image {
  padding: 8px 0 8px 0;
}

.tweet-image {
  width: 100%;
  height: 400px;

  object-fit: cover;
  border-radius: 20px;

  border: 1px solid var(--border-color);
}

.reactions {
  margin-top: 8px;
}

.like {
  padding: 0 4px 0 4px;
}
</style>
