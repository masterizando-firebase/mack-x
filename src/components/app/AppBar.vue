<script lang="ts" setup>
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { signOut } = useAuthStore()
const { authenticatedUser } = useAuthStore()
</script>

<template>
  <div class="content">
    <nav>
      <div class="menus">
        <img
          alt="Twitter logo"
          class="logo mt-3"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Logo_of_Twitter.svg/1245px-Logo_of_Twitter.svg.png"
        />

        <Button
          class="action"
          icon="pi pi-home"
          label="Home"
          rounded
          size="large"
          text
          @click="router.push('/')"
        />

        <Button
          class="action"
          icon="pi pi-bookmark"
          label="Bookmarks"
          rounded
          size="large"
          text
          @click="router.push('/bookmarks')"
        />

        <Button
          class="action"
          icon="pi pi-user"
          label="Profile"
          rounded
          size="large"
          text
          @click="router.push(`/profile/${authenticatedUser!.username}`)"
        />

        <Button
          class="action"
          icon="pi pi-sign-out"
          label="Sign out"
          rounded
          severity="danger"
          size="large"
          text
          @click="signOut"
        />
      </div>
    </nav>

    <main>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.content {
  max-width: 1300px;
  height: 100vh;
  display: flex;

  margin-left: auto;
  margin-right: auto;
  padding: 0 10px;
}

nav {
  flex: 0.2;
  min-width: 250px;

  border-right: 1px solid var(--border-color);

  padding: 16px 16px 0 16px;
}

main {
  flex: 0.5;
  min-width: 60%;

  border-right: 1px solid var(--border-color);

  overflow-y: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.menus {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.625rem;
}

.logo {
  height: 32px;
  margin: 0 0 16px 20px;
}

.action {
  margin-bottom: 4px;
}
</style>
