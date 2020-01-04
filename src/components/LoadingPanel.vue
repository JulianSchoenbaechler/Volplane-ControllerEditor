<template>
  <transition name="fade">
    <div
      id="ce-loading"
      class="full-screen"
    >
      <p>{{ loadingText }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'LoadingPanel',
  props: {
    loadingText: {
      default: 'Loading...',
      type: String,
    },
  },
};
</script>
