<script lang="ts" setup>
import AppBar from '@/components/app/AppBar.vue'
import TweetBox from '@/components/home/TweetBox.vue'
import TweetPost from '@/components/home/TweetPost.vue'
import { useTimelineStore } from '@/stores/timeline'
import { RecycleScroller } from 'vue-virtual-scroller'

const timelineStore = useTimelineStore()
</script>

<template>
  <AppBar>
    <h1 class="title">Home</h1>

    <TweetBox />

    <RecycleScroller v-slot="{ item }" :item-size="32" :items="timelineStore.tweets" key-field="id">
      <TweetPost :tweet="item" />
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