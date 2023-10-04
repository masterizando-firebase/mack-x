<script lang='ts' setup>
import AppBar from '@/components/app/AppBar.vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import { useBookmarksStore } from '@/stores/bookmarks'
import TweetPost from '@/components/home/TweetPost.vue'

const bookmarksStore = useBookmarksStore()
</script>

<template>
  <AppBar>
    <h1 class='title'>Bookmarks</h1>

    <RecycleScroller v-slot='{ item }' :item-size='32' :items='bookmarksStore.bookmarks' key-field='id'>
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