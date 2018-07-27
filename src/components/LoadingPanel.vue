<template>
  <transition name="fade">
    <div id="ce-loading" class="full-screen">
      <p>{{ loadingText }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'loading-panel',
  props: {
    loadingText: {
      default: 'Loading...',
      type: String,
    },
  },
  mounted() {
    console.log(this.$store);
  },
};
</script>

<style scoped>
#ce-loading {
  color: #7a2f34;
}
</style>
