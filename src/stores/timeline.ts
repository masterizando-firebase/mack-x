import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export interface Tweet {
  id: string
  userId: string
  imageUrl: string | null
  likes: number
  createdAt: number
  content: string
}

export const useTimelineStore = defineStore(
  'timeline',
  () => {
    const timeline = ref<Array<Tweet>>([
      {
        id: '1',
        userId: '1',
        imageUrl: 'https://pbs.twimg.com/media/F7I-XF2W0AAeiMc?format=jpg&name=medium',
        likes: 0,
        createdAt: new Date().getTime(),
        content:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec auctor, nisl euismod'
      }
    ])

    const tweets = computed(() =>
      [...timeline.value].sort(
        // @ts-ignore
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    )

    async function createTweet({ content, image }: { content: string; image?: File | null }) {
      const userId = '1'

      timeline.value.push({
        id: Math.floor(Math.random() * 10000).toString(),
        userId: userId,
        imageUrl: image
          ? 'https://pbs.twimg.com/media/F7I-XF2W0AAeiMc?format=jpg&name=medium'
          : null,
        likes: 0,
        createdAt: new Date().getTime(),
        content
      })
    }

    async function likeTweet(tweet: Tweet): Promise<void> {
      const storedTweetIndex = timeline.value.findIndex((t) => t.id === tweet.id)
      const storedTweet = timeline.value[storedTweetIndex]
      storedTweet.likes = storedTweet.likes + 1
      timeline.value.splice(storedTweetIndex, 1, storedTweet)
    }

    async function unlikeTweet(tweet: Tweet): Promise<void> {
      const storedTweetIndex = timeline.value.findIndex((t) => t.id === tweet.id)
      const storedTweet = timeline.value[storedTweetIndex]
      storedTweet.likes = storedTweet.likes - 1
      timeline.value.splice(storedTweetIndex, 1, storedTweet)
    }

    return { createTweet, likeTweet, unlikeTweet, tweets }
  },
  { persist: true }
)
