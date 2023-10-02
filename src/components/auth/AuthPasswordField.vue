<script lang="ts" setup>
import { useField } from 'vee-validate'

defineProps({
  feedback: {
    type: Boolean,
    default: false
  }
})
const passwordField = useField<string>('password', validatePassword)

function validatePassword(value: string) {
  if (!value) {
    return 'This field is required'
  }

  return true
}
</script>

<template>
  <div :class="{ 'text-left': true, 'mt-1': true, 'mb-3': passwordField.errorMessage.value }">
    <span class="p-float-label p-input-icon-right">
      <Password
        id="password"
        v-model="passwordField.value.value"
        :class="{ 'p-invalid': passwordField.errorMessage.value }"
        :feedback="feedback"
        :inputStyle="{ height: '49.25px' }"
        aria-describedby="text-error"
        toggleMask
        type="password"
      />
      <label for="password">Password</label>
    </span>
    <small id="text-error" class="p-error">{{
      passwordField.errorMessage.value || '&nbsp;'
    }}</small>
  </div>
</template>

<style scoped></style>
