<script lang="ts" setup>
import TweetPost from '@/components/home/TweetPost.vue'
import { RecycleScroller } from 'vue-virtual-scroller'
import { useTimelineStore } from '@/stores/timeline'
import { computed } from 'vue'
import type { PropType } from 'vue'

const timelineStore = useTimelineStore()

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true
  }
})

const profileTweets = computed(() =>
  timelineStore.tweets.filter((tweet) => tweet.userId === props.user!.uid)
)
</script>

<template>
  <RecycleScroller v-slot="{ item }" :item-size="32" :items="profileTweets" key-field="id">
    <TweetPost :tweet="item" />
  </RecycleScroller>
</template>

<style scoped>
:deep(.resize-observer) {
  display: none;
}
</style>
