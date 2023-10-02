<script lang="ts" setup>
defineProps({
  routeName: {
    type: String,
    required: true
  }
})
</script>

<template>
  <Transition name="nested">
    <div v-if="routeName === $router.currentRoute.value.name" class="modal-mask outer">
      <div class="inner" @click.stop>
        <slot />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-mask {
  width: 100%;
  height: 100%;
  position: fixed;

  z-index: 2;
  backdrop-filter: blur(20px);
  transition: opacity 0.2s ease-in-out;
}

.nested-enter-active .inner,
.nested-leave-active .inner {
  transition: all 0.15s cubic-bezier(1, 0.5, 0.2, 1);
}

.nested-enter-from .inner,
.nested-leave-to .inner {
  transform: translateY(200px);
  opacity: 0;
}
</style>
