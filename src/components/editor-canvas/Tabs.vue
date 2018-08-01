<template>
  <div id="ce-canvas-tabs">
    <ul ref="container">
      <li v-show="arrow.left" class="small">
        <span class="inline-control" />
      </li>
      <li v-for="(view, i) in views"
          :key="`view-${i}`"
          :class="{ default: view.default }">
        {{ view.name }}
        <span v-if="!view.default" class="inline-control make-default" />
        <span class="inline-control delete" />
      </li>
      <!-- TODO: add (+) control -> adding new view -->
      <li v-show="arrow.right" class="small">
        <span class="inline-control" />
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
      visibility: [],
      arrow: {
        right: false,
        left: false,
      },
    };
  },

  computed: {
    views() {
      return this.$store.getters['controller/views'];
    },
  },

  watch: {
    views(value) {
      // Re-init
      this.$nextTick(() => {
        const listItems = this.$refs.container.children;

        this.visibility = [];

        for (let i = 0; i < value.length; i += 1) {
          this.visibility.push({
            value: true,
            width: listItems[i + 1].offsetWidth,
          });
        }

        this.handleOverflow();
      });
    },
  },

  methods: {
    handleOverflow() {
      const list = this.$refs.container;
      const tabWidth = this.visibility.reduce((a, el) => a + el.width, 0);

      // Check if tabs would fit
      if (tabWidth <= list.clientWidth) {
        if (this.overflow === true) {
          // Remove arrows and enable everything
          this.arrow.right = false;
          this.arrow.left = false;
          this.visibility.forEach((el) => {
            el.value = true;
          });
        }
      }

      /* if (this.overflow === false && tabWidth > list.clientWidth) {
        console.log('overflow');
        this.overflow = true;
      } else if (this.overflow === true && tabWidth <= list.clientWidth) {
        console.log('none overflow');
        this.overflow = false;
      } */
    },
  },

  mounted() {
    this.$nextTick(() => {
      // Listen for window resizing event
      window.addEventListener('resize', this.handleOverflow);
    });
  },

  beforeDestroy() {
    // Unsubscribe event listener(s)
    window.removeEventListener('resize', this.handleOverflow);
  },
};
</script>
