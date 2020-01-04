<template>
  <div id="ce-canvas-tabs">
    <ul ref="container">
      <li
        v-show="arrow.left"
        class="small"
        @click="shiftTabs(true, $event)"
      >
        <span class="inline-control">
          <font-awesome-icon icon="angle-left" />
        </span>
      </li>

      <li
        v-for="(visible, i) in visibility"
        v-show="visible.value"
        :key="`view-${i}`"
        :class="{
          default: views[i].default,
          active: visible.active,
          stretch: overflow,
        }"
        @click="setActive(views[i].name, $event)"
      >
        {{ views[i].name }}
        <span
          class="inline-control delete"
          @click="remove(views[i].name, $event)"
        >
          <font-awesome-icon icon="times" />
        </span>
        <span
          v-if="!views[i].default"
          class="inline-control make-default"
          @click="makeDefault(views[i].name, $event)"
        >
          <font-awesome-icon
            icon="bullseye"
            title="Make default"
          />
        </span>
      </li>

      <li
        v-show="arrow.right"
        class="small"
        @click="shiftTabs(false, $event)"
      >
        <span class="inline-control">
          <font-awesome-icon icon="angle-right" />
        </span>
      </li>

      <li
        :class="overflow ? 'small' : 'floating'"
        @click="add($event)"
      >
        <span class="inline-control">
          <font-awesome-icon icon="plus" />
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'EditorCanvasTabs',

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

    // The controllers default view name identifier
    defaultView() {
      return this.$store.getters['controller/defaultView'];
    },

    // The editors active view name identifier
    activeView() {
      return this.$store.getters['editor/activeView'];
    },
  },

  watch: {
    // Switch view
    activeView(value) {
      this.visibility.forEach((v, i) => {
        if (i < this.views.length) {
          v.active = this.views[i].name === value;
        }
      });
    },

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

  methods: {
    // Checks the tabs for overflow and handles the rearrangement
    handleOverflow() {
      const list = this.$refs.container;

      // Calculate the total width of all tabs inclusive 'add' button (28px)
      const tabWidth = this.visibility.reduce((a, v) => v.width + a, 0) + 28;

      // Inline function for calculating minimum space required for a specified amount of tabs.
      const minWidth = (numberOfTabs = 1) => {
        const itemWidths = this.visibility.map((v) => v.width);
        let w = 0;

        // Adding together the width of the greatest tabs
        for (let i = 0; i < numberOfTabs; i += 1) {
          const max = Math.max(...itemWidths);
          w += max;
          itemWidths.splice(itemWidths.indexOf(max), 1);
        }

        // Add width of arrow buttons and 1px border
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
        let tabCount = this.visibility.filter((v) => v.value === true).length;
        const maxTabs = this.visibility.length;
        const bottomLimit = minWidth(tabCount);
        const upperLimit = tabCount < maxTabs ? minWidth(tabCount + 1) : list.clientWidth;

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

      let foundView = false;

      this.visibility.forEach((v, i) => {
        if (i < this.views.length) {
          v.active = this.views[i].name === name;
          foundView = true;
        }
      });

      this.$store.commit('editor/setActiveView', foundView ? name : '');
    },

    // Add view button
    // Event handler
    add(event = null) {
      if (event) event.stopPropagation();

      this.$store.dispatch('popup/prompt', {
        title: 'Add View',
        text: 'Enter a <strong>name identifier</strong> for the new view. The name identifier is '
          + 'the direct connection between Unity and this controller view and will be used to '
          + 'access it from code.',
        additionalText: 'A view name should not contain any special characters with the exception '
          + 'of <b>-</b> (dash) and <b>_</b> (underline).',
        restrictions: {
          values: this.views.map((v) => v.name),
          error: 'A view with this name identifier already exists!',
        },
      }).then((name) => {
        if (name) {
          // Save this action
          this.$store.dispatch('history/register', {
            type: 'addView',
            activeView: this.activeView,
          });

          // Adding new view
          this.$store.commit('controller/addView', name);
          this.$store.commit('editor/setActiveView', name);
        }
      }, (error) => {
        throw new Error(error);
      });
    },

    // Remove view button
    // Event handler
    remove(name = null, event = null) {
      if (event) event.stopPropagation();

      this.$store.dispatch('popup/confirm', {
        title: 'Remove View',
        text: `Are you sure you want to remove the view <em>${name}</em> with all its contents `
          + 'from the controller?',
      }).then((confirmed) => {
        if (confirmed) {
          const { defaultView } = this;

          // Save this action
          this.$store.dispatch('history/register', {
            type: 'removeView',
            activeView: this.activeView,
          });

          this.$store.commit('controller/removeView', name);

          if (this.views.length > 0) {
            // Removed the default view?
            // Set default to the first view
            if (name === defaultView) {
              this.makeDefault(this.views[0].name);
            }

            // Removed the active view?
            // Set to the first view
            if (name === this.activeView) {
              this.setActive(this.views[0].name);
            }
          }
        }
      }, (error) => {
        throw new Error(error);
      });
    },

    // Make default view button
    // Instantly commiting store change
    // Event handler
    makeDefault(name = null, event = null) {
      if (event) event.stopPropagation();

      // Save this action
      this.$store.dispatch('history/register', {
        type: 'makeDefaultView',
        activeView: this.$store.getters['controller/defaultView'],
      });

      this.$store.commit('controller/makeDefaultView', name);
    },
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
  height: 32px;
  margin: 0;
  padding: 0;
  box-shadow: 0 0 4px 4px var(--color-dark1);
  z-index: 1;
}
#ce-canvas-tabs ul {
  display: flex;
  flex-basis: 100%;
  flex-flow: row nowrap;
  width: 100%;
  height: 32px;
  max-width: 100%;
  max-height: 32px;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: hidden;
  background-color: var(--color-dark5);
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
  border-right: 1px solid var(--color-dark5);
  background-color: var(--color-selection-background);
  cursor: pointer;
}
#ce-canvas-tabs li:last-child {
  border: none;
}
#ce-canvas-tabs li.default {
  color: var(--color-selection);
}
#ce-canvas-tabs li.active {
  background-color: var(--color-dark1);
}
#ce-canvas-tabs li.active.default {
  color: var(--color-accent);
}
#ce-canvas-tabs li.small {
  padding: 0 4px;
}
#ce-canvas-tabs li.floating {
  padding: 0 8px;
  background-color: transparent;
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
  color: var(--color-bright1);
  font-size: 12px;
  line-height: 12px;
  text-align: center;
}
#ce-canvas-tabs li.small .inline-control,
#ce-canvas-tabs li.floating .inline-control {
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
