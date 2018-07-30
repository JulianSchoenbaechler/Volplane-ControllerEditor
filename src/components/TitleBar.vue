<template>
  <section id="ce-title">
      <h1>{{ title }}</h1>
      <samp>{{ info }}</samp>
  </section>
</template>

<script>
export default {
  computed: {
    title() {
      return this.$store.getters['controller/name'];
    },
    info() {
      return 'info';
    },
  },
};
</script>
