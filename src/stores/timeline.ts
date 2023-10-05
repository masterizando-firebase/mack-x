import { getAnalytics, logEvent } from 'firebase/analytics'
import { getDatabase, push, ref as dbRef, update } from 'firebase/database'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { getCurrentUser, useDatabaseList } from 'vuefire'

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
    const db = getDatabase()
    const timelineRef = dbRef(db, 'timeline')
    const timeline = useDatabaseList<Tweet>(timelineRef)
    const analytics = getAnalytics()

    const tweets = computed(() =>
      [...timeline.value].sort(
        // @ts-ignore
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    )

    async function createTweet({ content, image }: { content: string; image?: File | null }) {
      const user = await getCurrentUser()
      const tweet = {
        id: Math.floor(Math.random() * 10000).toString(),
        userId: user!.uid,
        imageUrl: image
          ? 'https://pbs.twimg.com/media/F7I-XF2W0AAeiMc?format=jpg&name=medium'
          : null,
        likes: 0,
        createdAt: new Date().getTime(),
        content
      }

      await push(timelineRef, tweet)

      logEvent(analytics, 'tweet_create', { tweet: tweet, user: user })
    }

    async function likeTweet(tweet: Tweet): Promise<void> {
      await update(timelineRef, {
        [tweet.id]: {
          ...tweet,
          likes: tweet.likes + 1
        }
      })
      logEvent(analytics, 'tweet_like', { tweet })
    }

    async function unlikeTweet(tweet: Tweet): Promise<void> {
      await update(timelineRef, {
        [tweet.id]: {
          ...tweet,
          likes: tweet.likes - 1
        }
      })
      logEvent(analytics, 'tweet_unlike', { tweet })
    }

    return { createTweet, likeTweet, unlikeTweet, tweets }
  },
  { persist: true }
)
