<script lang="ts" setup>
import { formatDate } from '@vueuse/shared/index.cjs'
import type { PropType } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  user: {
    type: Object as PropType<User>,
    required: true
  },
  isCurrentUser: {
    type: Boolean,
    default: false
  }
})

function navigateEditProfile() {
  router.push(`/profile/${props.user.username}/edit`)
}

function getFormattedDate(storedDate: Date | any) {
  return formatDate(new Date(storedDate), 'MMMM YYYY')
}
</script>

<template>
  <div class="content">
    <div class="md:px-8 md:pt-8 pt-3 px-3 pb-4">
      <div class="flex mb-4">
        <Avatar
          v-if="!user?.imageUrl"
          class="mr-2 w-8rem h-8rem"
          icon="pi pi-user"
          shape="circle"
        />
        <Avatar v-else :image="user.imageUrl" class="mr-2 w-8rem h-8rem" shape="circle" />

        <div v-if="isCurrentUser" class="flex ml-auto align-self-center">
          <Button
            class="p-button-rounded p-button-outlined"
            icon="pi pi-pencil"
            label="Edit profile"
            @click="navigateEditProfile"
          />
        </div>
      </div>

      <div class="align-self-center">
        <p class="text-4xl m-0 mb-2 font-semibold">{{ user.name }}</p>
        <p class="text-xl m-0 font-light">@{{ user.username }}</p>

        <div class="flex align-items-center mt-5">
          <i class="pi pi-calendar mr-2"></i>
          <p class="m-0">Joined {{ getFormattedDate(user.createdAt) }}</p>
        </div>

        <div class="flex align-items-center">
          <p class="mr-3">
            <span class="text-white font-bold">{{ user.followingCount }}</span> Following
          </p>

          <p>
            <span class="text-white font-bold">{{ user.followersCount }}</span> Followers
          </p>
        </div>
      </div>
    </div>

    <p class="md:ml-8 ml-3 posts font-bold text-lg">Tweets</p>
  </div>
</template>

<style scoped>
.content {
  width: 100%;
  border-bottom: 1px solid var(--border-color);
}

.posts {
  width: fit-content;
  border-bottom: 2px solid var(--primary-color);

  margin-top: 0;
  margin-bottom: -2px;

  cursor: pointer;
}
</style>
