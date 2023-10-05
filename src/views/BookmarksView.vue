<script lang='ts' setup>
import AppBar from '@/components/app/AppBar.vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import { useBookmarksStore } from '@/stores/bookmarks'
import TweetPost from '@/components/home/TweetPost.vue'
import { onBeforeMount, ref } from 'vue'
import type { Tweet } from '@/stores/timeline'

const bookmarksStore = useBookmarksStore()

const bookmarks = ref<Array<Tweet>>([])

onBeforeMount(async () => {
  bookmarks.value = await bookmarksStore.getBookmarks()
})
</script>

<template>
  <AppBar>
    <h1 class='title'>Bookmarks</h1>

    <RecycleScroller v-slot='{ item }' :item-size='32' :items='bookmarks' key-field='id'>
      <TweetPost :tweet='item' />
    </RecycleScroller>
  </AppBar>
</template>

<style scoped>
.title {
  padding: 0 0 0 16px;
}

:deep(.resize-observer) {
  display: none;
}
</style>