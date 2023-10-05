import { getDatabase, push, ref as dbRef, update, onValue, get, child } from 'firebase/database'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { getCurrentUser, useDatabaseList, useFirestore } from 'vuefire'
import type { Tweet } from '@/stores/timeline'
import { collection, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'

export const useBookmarksStore = defineStore(
  'bookmarks',
  () => {
    const firestore = useFirestore()
    const realtime = getDatabase()
    const timelineRef = dbRef(realtime, 'timeline')
    const bookmarksTimeline = useDatabaseList<Tweet>(timelineRef)

    const bookmarks = computed(() =>
      [...bookmarksTimeline.value].sort(
        // @ts-ignore
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    )

    async function getBookmarks(): Promise<Array<Tweet>> {
      const tweets: Array<Tweet> = []
      const user = await getCurrentUser()

      const userRef = await doc(firestore, 'bookmarks', user!.uid)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        const tweetsIds = userDoc.data().tweets

        for (const tweetId of tweetsIds) {
          const databaseRef = dbRef(getDatabase());
          const data = await get(child(databaseRef, 'timeline/' + tweetId))

          tweets.push(data.val() as Tweet)
        }
      }

      return tweets
    }

    async function addBookmark(tweet: Tweet) {
      const user = await getCurrentUser()

      const userRef = await doc(firestore, 'bookmarks', user!.uid)
      const userDoc = await getDoc(userRef)

      if (userDoc.exists()) {
        const data = userDoc.data()

        await updateDoc(userRef, {
          tweets: [
            ...data.tweets,
            tweet.id
          ]
        })
      } else {
        await setDoc(userRef, {
          tweets: [
            tweet.id,
          ]
        })
      }
    }

    async function removeBookmark(tweet: Tweet) {

    }

    return { addBookmark, removeBookmark, getBookmarks, bookmarks }
  },
  { persist: true }
)
