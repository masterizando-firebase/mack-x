import { getDatabase, push, ref as dbRef, update } from 'firebase/database'
import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useDatabaseList } from 'vuefire'
import type { Tweet } from '@/stores/timeline'

export const useBookmarksStore = defineStore(
  'bookmarks',
  () => {
    const db = getDatabase()
    const timelineRef = dbRef(db, 'timeline')
    const bookmarksTimeline = useDatabaseList<Tweet>(timelineRef)

    const bookmarks = computed(() =>
      [...bookmarksTimeline.value].sort(
        // @ts-ignore
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      )
    )

    async function addBookmark(tweet: Tweet) {

    }

    async function removeBookmark(tweet: Tweet) {

    }

    return { addBookmark, removeBookmark, bookmarks }
  },
  { persist: true }
)
