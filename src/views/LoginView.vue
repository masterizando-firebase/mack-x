<script lang="ts" setup>
import LoginEmailField from '@/components/auth/AuthEmailField.vue'
import LoginPasswordField from '@/components/auth/AuthPasswordField.vue'

import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'
import { useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const { handleSubmit, resetForm } = useForm()
const router = useRouter()
const toast = useToast()

function handleSignInSuccess() {
  resetForm()

  toast.add({
    severity: 'success',
    summary: 'Login Successful',
    detail: 'Welcome back!',
    life: 3000
  })
  router.replace('/')
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.authenticate({
      email: values.email,
      password: values.password
    })
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Login Error',
      detail: 'Please check your credentials and try again.',
      life: 3000
    })
    return
  }
  handleSignInSuccess()
})

async function handleSignInWithGoogle() {
  try {
    await authStore.signInWithGoogle()
  } catch (e) {
    toast.add({
      severity: 'error',
      summary: 'Login Error',
      detail: 'Please check your credentials and try again.',
      life: 3000
    })
    return
  }
  handleSignInSuccess()
}

function navigateCreateAccount() {
  router.push('/register')
}
</script>

<template>
  <div class="h-screen text-center m-8">
    <!--  Header  -->
    <header>
      <h1>Login</h1>
      <p class="mb-5">Fill out the form below to sign in in your account.</p>
    </header>

    <div class="flex justify-content-center p-fluid">
      <div class="card">
        <!--     Form       -->
        <form class="flex flex-column gap-2" @submit="onSubmit">
          <LoginEmailField />
          <LoginPasswordField />
          <Button class="mt-1 mb-3" label="Submit" type="submit" />
        </form>

        <div class="flex flex-column">
          <Button
            aria-label="signInWithGoogle"
            class="align-self-center w-full bg-white"
            icon="pi pi-google"
            @click="handleSignInWithGoogle"
          />
        </div>
        <divider />

        <Button
          label="Create an account"
          severity="secondary"
          text
          @click="navigateCreateAccount"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
