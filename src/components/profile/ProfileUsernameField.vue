<script lang="ts" setup>
import { useField } from 'vee-validate'

const props = defineProps({
  initialUsername: {
    type: String,
    required: false,
    default: ''
  }
})

const usernameField = useField<string>('username', validateUsername)
usernameField.value.value = props.initialUsername

function validateUsername(value: string) {
  if (!value) {
    return 'This field is required'
  }

  const regex = /^[a-zA-Z0-9]+$/i

  if (!regex.test(value)) {
    return 'This field must be a valid username'
  }

  return true
}
</script>

<template>
  <div :class="{ 'text-left': true, 'mb-2': usernameField.errorMessage.value }">
    <span class="p-float-label p-input-icon-right">
      <InputText
        id="username"
        v-model="usernameField.value.value"
        :class="{ 'p-invalid': usernameField.errorMessage.value }"
        aria-describedby="text-error"
        required
        size="large"
        type="text"
      />
      <label for="username">Username</label>
    </span>
    <small id="text-error" class="p-error text-left">{{
      usernameField.errorMessage.value || '&nbsp;'
    }}</small>
  </div>
</template>

<style scoped></style>
