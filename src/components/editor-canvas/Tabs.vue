<template>
  <div id="ce-canvas-tabs">
    <ul ref="container">
      <li class="small">
        <span class="inline-control move-left" />
      </li>
      <li v-for="(view, i) in views" :key="`view-${i}`" :class="{ default: view.default }">
        {{ view.name }}
        <span v-if="!view.default" class="inline-control make-default" />
        <span class="inline-control delete" />
      </li>
      <li class="small">
        <span class="inline-control move-right" />
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'editor-canvas-tabs',

  data() {
    return {
      overflow: false,
    };
  },

  computed: {
    views() {
      return this.$store.getters['controller/views'];
    },
  },

  methods: {
    handleOverflow() {
      const list = this.$refs.container;

      if (
        this.$data.overflow === false &&
        list.scrollWidth > list.clientWidth
      ) {
        console.log('overflow');
        this.$data.overflow = true;
      } else if (
        this.$data.overflow === true &&
        list.scrollWidth <= list.clientWidth
      ) {
        console.log('none overflow');
        this.$data.overflow = false;
      }
    },
  },

  mounted() {
    this.$nextTick(() => {
      // Listen for window resizing event
      window.addEventListener('resize', this.handleOverflow);

      // Init
      this.handleOverflow();
    });
  },

  beforeDestroy() {
    // Unsubscribe event listener(s)
    window.removeEventListener('resize', this.handleOverflow);
  },
};
</script>
