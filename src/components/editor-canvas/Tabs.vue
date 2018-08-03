<template>
  <div id="ce-canvas-tabs">
    <ul ref="container">
      <li v-show="arrow.left" class="small" @click="shiftTabs(true)">
        <span class="inline-control">
          <font-awesome-icon icon="angle-left" />
        </span>
      </li>
      <li v-for="(visible, i) in visibility"
          :key="`view-${i}`"
          v-show="visible.value"
          :class="{
            default: views[i].default,
            /* active: true, */
            stretch: overflow,
          }">
        {{ views[i].name }}
        <span class="inline-control delete">
          <font-awesome-icon icon="times" />
        </span>
        <span v-if="!views[i].default" class="inline-control make-default">
          <font-awesome-icon icon="bullseye" />
        </span>
      </li>
      <!-- TODO: add (+) control -> adding new view -->
      <li v-show="arrow.right" class="small" @click="shiftTabs()">
        <span class="inline-control">
          <font-awesome-icon icon="angle-right" />
        </span>
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
    // The controller views
    views() {
      return this.$store.getters['controller/views'];
    },
  },

  watch: {
    // Watch for view changes (adding / removing)
    views(value) {
      this.visibility = [];

      for (let i = 0; i < value.length; i += 1) {
        this.visibility.push({
          value: true,
          width: 0,
        });
      }

      // Init list item width the next tick
      this.$nextTick(() => {
        const listItems = this.$refs.container.children;

        for (let i = 0; i < value.length; i += 1) {
          this.visibility[i].width = listItems[i + 1].offsetWidth;
        }

        this.handleOverflow();
      });
    },
  },

  methods: {
    // Checks the tabs for overflow and handles the rearrangement
    handleOverflow() {
      const list = this.$refs.container;
      const tabWidth = this.visibility.reduce((a, v) => v.width + a, 0);

      // Inline function for calculating minimum space required for a specified amount of tabs.
      const minWidth = (numberOfTabs = 1) => {
        const itemWidths = this.visibility.map(v => v.width);
        let w = 0;

        // Adding together the width of the greatest tabs
        for (let i = 0; i < numberOfTabs; i += 1) {
          const max = Math.max(...itemWidths);
          w += max;
          itemWidths.splice(itemWidths.indexOf(max), 1);
        }

        return w + 41;
      };

      // Check if tabs would fit
      if (tabWidth <= list.clientWidth) {
        if (this.overflow === true) {
          // Remove arrows and enable everything
          this.arrow.right = false;
          this.arrow.left = false;
          this.visibility.forEach((v) => {
            v.value = true;
          });
          this.overflow = false;
        }
      } else {
        let tabCount = this.visibility.filter(v => v.value === true).length;
        const maxTabs = this.visibility.length;
        const bottomLimit = minWidth(tabCount);
        const upperLimit =
          tabCount < maxTabs ? minWidth(tabCount + 1) : list.clientWidth;

        // Add or remove as necessary
        if (tabCount === maxTabs) {
          // First time detected overflow -> still same amount of tabs, remove one
          tabCount -= 1;
        } else if (list.clientWidth >= upperLimit) {
          // Add one if space available
          tabCount += 1;
        } else if (list.clientWidth < bottomLimit) {
          // Remove one when space exceeded
          tabCount -= 1;
        }

        this.visibility.forEach((v, i) => {
          v.value = i < tabCount;
        });

        this.arrow.right = true;
        this.arrow.left = false;
        this.overflow = true;
      }
    },

    // Shifting overflowing tabs right or left
    shiftTabs(inverse = false) {
      let shifted = false;

      // Inline function for handling enabling/disabling of elements on shift
      // independent of the shifting direction.
      // Provide the iteration (tab) index
      const shift = (i) => {
        if (!shifted && this.visibility[i].value) {
          shifted = true;
          this.visibility[i].value = false;
        } else if (shifted && !this.visibility[i].value) {
          shifted = false;
          this.visibility[i].value = true;

          if (!inverse && i === this.visibility.length - 1) {
            this.arrow.right = false;
          } else if (inverse && i === 0) {
            this.arrow.left = false;
          }
        }
      };

      // According to shift direction, iterate through array forwards or backwards
      if (!inverse) {
        for (let i = 0; i < this.visibility.length; i += 1) {
          shift(i);
        }
        this.arrow.left = true;
      } else {
        for (let i = this.visibility.length - 1; i >= 0; i -= 1) {
          shift(i);
        }
        this.arrow.right = true;
      }
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
