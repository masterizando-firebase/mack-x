<script lang="ts" setup>
import { useField } from 'vee-validate'

const props = defineProps({
  initialName: {
    type: String,
    required: false,
    default: ''
  }
})

const nameField = useField<string>('name', validateName)
nameField.value.value = props.initialName

function validateName(value: string) {
  if (!value) {
    return 'This field is required'
  }

  return true
}
</script>

<template>
  <div :class="{ 'text-left': true, 'mb-2': nameField.errorMessage.value }">
    <span class="p-float-label p-input-icon-right">
      <i class="pi pi-user" />
      <InputText
        id="name"
        v-model="nameField.value.value"
        :class="{ 'p-invalid': nameField.errorMessage.value }"
        aria-describedby="text-error"
        required
        size="large"
        type="text"
      />
      <label for="name">Name</label>
    </span>
    <small id="text-error" class="p-error text-left">{{
      nameField.errorMessage.value || '&nbsp;'
    }}</small>
  </div>
</template>

<style scoped></style>
