<script lang="ts" setup>
import AppModal from '@/components/app/AppModal.vue'
import AuthNameField from '@/components/auth/AuthNameField.vue'
import ProfileUsernameField from '@/components/profile/ProfileUsernameField.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import AuthFileField from "@/components/auth/AuthFileField.vue";

const emits = defineEmits(['change'])

const router = useRouter()
const toast = useToast()

const authStore = useAuthStore()
const { handleSubmit, resetForm } = useForm()

const user = ref<AuthenticatedUser>(authStore.authenticatedUser!)
const profileImage = ref<File | null>(null)

const onSubmit = handleSubmit(async (values) => {
  user.value = authStore.authenticatedUser!

  if (values.name) {
    user.value.name = values.name
  }

  if (values.username) {
    user.value.username = values.username
  }

  try {
    await authStore.update(user.value, profileImage.value)
  } catch (e: any) {
    toast.add({
      severity: 'error',
      summary: 'Profile update error',
      detail: e.message,
      life: 3000
    })
    return
  }

  toast.add({
    severity: 'success',
    summary: 'Profile updated successfully!',
    detail: 'Enjoy the new era!',
    life: 3000
  })

  resetForm()
  emits('change')
  router.back()
})
</script>

<template>
  <AppModal route-name="profile-edit">
    <div class="h-screen text-center m-8">
      <!--  Header  -->
      <header>
        <h1>Profile Edit</h1>
        <p class="mb-5">
          Update your profile with your new information and don't forget to save :)
        </p>
      </header>

      <div class="flex justify-content-center p-fluid">
        <div class="card">
          <!--     Form       -->
          <form class="flex flex-column" @submit="onSubmit">
            <!--    Name      -->
            <AuthNameField :initial-name="user.name" class="mt-2 mb-2" />

            <!--    Username      -->
            <ProfileUsernameField :initial-username="user.username" class="mt-2 mb-2" />

            <!--     File     -->
            <AuthFileField v-model="profileImage" />

            <!--      Submit        -->
            <div class="flex gap-8 mt-5">
              <Button label="Cancel" outlined severity="secondary" @click="router.back()" />
              <Button label="Save" outlined type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppModal>
</template>

<style scoped></style>
