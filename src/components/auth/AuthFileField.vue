<script lang="ts" setup>
import { useFileDialog } from '@vueuse/core/index.cjs'
import { ref } from 'vue'
import type { PropType } from 'vue'

defineProps({
  modelValue: {
    type: Object as PropType<File | null>,
    required: false,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

defineExpose({
  onClearFile: onClearFile
})

const { open, reset, onChange } = useFileDialog({
  accept: 'image/*',
  multiple: false
})

const image = ref<File | null>(null)
const imageUrl = ref<string | null>(null)

onChange((files) => {
  if (files?.length === 1) {
    const file = files[0]
    image.value = file
    imageUrl.value = URL.createObjectURL(file)

    emit('update:modelValue', image.value)
  }
})

function onClearFile(): void {
  image.value = null
  imageUrl.value = null
  reset()
}
</script>

<template>
  <Button icon="pi pi-image" :label="image ? image.name : 'Select file'" rounded @click="open()" />
</template>

<style scoped></style>
