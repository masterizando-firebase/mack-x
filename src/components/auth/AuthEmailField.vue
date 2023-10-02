<script lang="ts" setup>
import { useField } from 'vee-validate'

const props = defineProps({
  initialEmail: {
    type: String,
    required: false,
    default: ''
  }
})

const emailField = useField<string>('email', validateEmail)
emailField.value.value = props.initialEmail

function validateEmail(value: string) {
  if (!value) {
    return 'This field is required'
  }

  const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i
  if (!regex.test(value)) {
    return 'This field must be a valid email'
  }

  return true
}
</script>

<template>
  <div :class="{ 'text-left': true, 'mb-2': emailField.errorMessage.value }">
    <span class="p-float-label p-input-icon-right mt-2">
      <i class="pi pi-envelope" />
      <InputText
        id="email"
        v-model="emailField.value.value"
        :class="{
          'p-invalid': emailField.errorMessage.value
        }"
        aria-describedby="text-error"
        size="large"
        type="email"
      />
      <label for="email">Email</label>
    </span>
    <small id="text-error" class="p-error text-left mb-2">{{
      emailField.errorMessage.value || '&nbsp;'
    }}</small>
  </div>
</template>

<style scoped></style>
