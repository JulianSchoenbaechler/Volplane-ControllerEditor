<template>
  <div id="ce-canvas-tabs">
    <ul ref="container">
      <li v-show="arrow.left" class="small" @click="shiftTabs(true, $event)">
        <span class="inline-control">
          <font-awesome-icon icon="angle-left" />
        </span>
      </li>
      <li v-for="(visible, i) in visibility"
          :key="`view-${i}`"
          v-show="visible.value"
          :class="{
            default: views[i].default,
            active: visible.active,
            stretch: overflow,
          }"
          @click="setActive(views[i].name, $event)">
        {{ views[i].name }}
        <span class="inline-control delete" @click="remove(views[i].name, $event)">
          <font-awesome-icon icon="times" />
        </span>
        <span
            v-if="!views[i].default"
            class="inline-control make-default"
            @click="makeDefault(views[i].name, $event)">
          <font-awesome-icon icon="bullseye" title="Make default" />
        </span>
      </li>
      <!-- TODO: add (+) control -> adding new view -->
      <li v-show="arrow.right" class="small" @click="shiftTabs(false, $event)">
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
      const currentNumberOfViews = this.visibility.length;
      let activeIndex = 0;

      // View added?
      if (currentNumberOfViews !== 0 && currentNumberOfViews < value.length) {
        activeIndex = value.length - 1;
      } else {
        // Find index of current view
        this.visibility.forEach((v, i) => {
          if (v.active === true) activeIndex = i;
        });
      }

      // Reassign visibility array
      this.visibility = [];

      for (let i = 0; i < value.length; i += 1) {
        this.visibility.push({
          value: true,
          active: i === activeIndex,
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
    // Event handler
    shiftTabs(inverse = false, event = null) {
      let shifted = false;

      if (event) event.stopPropagation();

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

    // Select a tab (view) and set it active
    // Event handler
    setActive(name = 'noname', event = null) {
      if (event) event.stopPropagation();

      this.visibility.forEach((v, i) => {
        v.active = this.views[i].name === name;
      });

      this.$store.commit('editor/setActiveView', name);
    },

    // Remove view button
    // Event handler
    remove(name = 'noname', event = null) {
      if (event) event.stopPropagation();
      console.log(`Delete view: ${name}`);
    },

    // Make default view button
    // Event handler
    makeDefault(name = 'noname', event = null) {
      if (event) event.stopPropagation();
      console.log(`Make default view: ${name}`);
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

<style>
/*
 * Editor canvas tabs
 */

#ce-canvas-tabs {
  display: block;
  position: relative;
  width: 100%;
  height: auto;
  margin: 0;
  padding: 0;
}
#ce-canvas-tabs ul {
  display: flex;
  width: 100%;
  height: 32px;
  max-width: 100%;
  max-height: 32px;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: hidden;
  flex-flow: row nowrap;
  background-color: #414044;
  box-shadow: 0 0 4px 4px #222125;
}
#ce-canvas-tabs li {
  display: inline-block;
  flex: 0 0 auto;
  max-width: 80%;
  max-height: 32px;
  padding: 0 10px;
  font-size: 14px;
  line-height: 32px;
  overflow: hidden;
  user-select: none;
  border-right: 1px solid #414044;
  background-color: #525156;
  cursor: pointer;
}
#ce-canvas-tabs li:last-child {
  border: none;
}
#ce-canvas-tabs li.default {
  color: #cdaf7b;
}
#ce-canvas-tabs li.active {
  background-color: #222125;
}
#ce-canvas-tabs li.active.default {
  color: #7a2f34;
}
#ce-canvas-tabs li.small {
  padding: 0 4px;
}
#ce-canvas-tabs li.stretch:not(.small) {
  /* small list items never grow */
  flex-grow: 1;
}
#ce-canvas-tabs li .inline-control {
  display: block;
  float: right;
  visibility: hidden;
  width: 12px;
  height: 12px;
  margin: 10px 0 10px 6px;
  padding: 0;
  color: #f8f8ec;
  font-size: 12px;
  line-height: 12px;
  text-align: center;
}
#ce-canvas-tabs li.small .inline-control {
  visibility: visible;
  margin: 10px 0;
}
#ce-canvas-tabs li:hover .inline-control,
#ce-canvas-tabs li.active .inline-control {
  visibility: visible;
}
#ce-canvas-tabs .inline-control.make-default {
  /* background-color: olivedrab; */
}
#ce-canvas-tabs .inline-control.delete {
  /* background-color: red; */
}
</style>
