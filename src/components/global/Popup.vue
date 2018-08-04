<template>
  <transition name="fade">
    <div class="popup-container full-screen">
      <p>{{ title }}</p>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    type: String,
    title: String,
  },

  watch: {
    type: {
      immediate: true,
      handler: (value) => {
        switch (value) {
          case 'alert':
            // eslint-disable-next-line
            alert("It works!");
            break;

          default:
            console.error(new Error(`Unknown popup type '${value}'!`));
            break;
        }
      },
    },
  },
};
</script>

<style>
.popup-container {
  color: #f8f8ec;
  background-color: #222125;
}
</style>
