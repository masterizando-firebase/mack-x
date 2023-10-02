<script lang="ts" setup>
import LoginEmailField from '@/components/auth/AuthEmailField.vue'
import AuthNameField from '@/components/auth/AuthNameField.vue'
import LoginPasswordField from '@/components/auth/AuthPasswordField.vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'primevue/usetoast'
import { useField, useForm } from 'vee-validate'
import { useRouter } from 'vue-router'

const agreeCheckboxField = useField<boolean>(
  'agree',
  (value) => value || 'You must agree to continue'
)
const router = useRouter()
const toast = useToast()

const authStore = useAuthStore()
const { handleSubmit, resetForm } = useForm()

const onSubmit = handleSubmit(async (values) => {
  try {
    await authStore.signUp({
      name: values.name,
      email: values.email,
      password: values.password
    })
  } catch (e: any) {
    toast.add({
      severity: 'error',
      summary: 'Registration Error',
      detail: e.message,
      life: 3000
    })
    return
  }

  resetForm()
  toast.add({
    severity: 'success',
    summary: 'Login Successful',
    detail: 'Welcome back!',
    life: 3000
  })

  await router.replace('/')
})

function navigateSignIn() {
  router.push('/login')
}
</script>

<template>
  <div class="h-screen text-center m-8">
    <!--  Header  -->
    <header>
      <h1>Register</h1>
      <p class="mb-5">Fill out the form below to create an account.</p>
    </header>

    <div class="flex justify-content-center p-fluid">
      <div class="card">
        <!--     Form       -->
        <form class="flex flex-column" @submit="onSubmit">
          <!--    Name      -->
          <AuthNameField class="mt-2 mb-2" />

          <!--      Email field        -->
          <LoginEmailField class="mb-3" />

          <!--      Password field        -->
          <LoginPasswordField feedback />

          <!--    Checkbox      -->
          <div class="field-checkbox mb-5">
            <Checkbox
              id="accept"
              v-model="agreeCheckboxField.value.value"
              name="accept"
              required
              value="Accept"
            />
            <label for="accept">I agree to the terms and conditions*</label>
          </div>

          <!--      Submit        -->
          <Button class="mb-4" label="Register" type="submit" />

          <Button
            label="I already own an account"
            severity="secondary"
            text
            @click="navigateSignIn"
          />
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
