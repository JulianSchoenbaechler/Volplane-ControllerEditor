<template>
  <div
    :class="{ select: true, open }"
    @click="toggle(undefined, $event)"
    @keypress.esc="toggle(false)"
    @keypress.enter="valueChange(localValue)"
  >
    <input
      ref="input"
      type="text"
      v-bind="$attrs"
      :name="name"
      :value="localValue"
      v-on="listeners"
      @input="valueInput($event)"
    >
    <font-awesome-icon icon="sort-down" />
    <ul>
      <li
        v-for="(item, i) in computedOptions"
        v-show="item.class === 'category' ||
          freshOpened ||
          item.value.toLowerCase().startsWith(localValue.toLowerCase())"
        :key="'select-' + i"
        :class="item.class"
        @click="item.class !== 'category' ?
          valueChange(item.value, $event) :
          $event.stopPropagation()"
      >
        {{ item.value }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'VSelect',
  inheritAttrs: false,

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    name: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      open: false,
      localValue: '',
      freshOpened: true,
      selfClick: false,
    };
  },

  computed: {
    // The component event listeners
    // Without the ones that are handled in code
    listeners() {
      const { input, change, ...listeners } = this.$listeners;
      return listeners;
    },

    // Determines if the provided options are single data or categorized data
    isSingle() {
      if (this.options && this.options.length > 0) {
        if (
          typeof (this.options[0] === 'string') || (this.options[0] instanceof String)
        ) {
          return true;
        }
      }
      return false;
    },

    // An array representing the list items from the options
    computedOptions() {
      let list = [];

      if (this.isSingle) {
        this.options.forEach((n) => {
          list = [...list, { class: 'item', value: n }];
        });
      } else {
        this.options.forEach((n) => {
          list = [...list, { class: 'category', value: n.value }];
          list = [
            ...list,
            ...n.options.map((val) => ({ class: 'item', value: val })),
          ];
        });
      }

      return list;
    },
  },

  watch: {
    // Watch the provided value property for changes
    // Update localValue if needed
    value: {
      handler(val) {
        this.localValue = val;
      },
      immediate: true,
    },
  },

  mounted() {
    this.$nextTick(() => {
      // Listen for window resizing event
      window.addEventListener('click', this.windowClick);
    });
  },

  beforeDestroy() {
    // Unsubscribe event listener(s)
    window.removeEventListener('click', this.windowClick);
  },

  methods: {
    // Input event handler
    valueInput(e) {
      this.freshOpened = false;
      this.localValue = e.target.value;
      this.$emit('input', e.target.value);
      console.log(this.name);
    },

    // Value change
    // Auto-select the corresponding option or none
    // This will emit the onChange event of the component
    valueChange(val, e = null) {
      let value = '';

      if (this.options) {
        const opts = this.isSingle
          ? [...this.options]
          : [].concat(...this.options.map((n) => n.options));

        value = opts.find((v) => v.startsWith(val)) || opts[0];
      } else {
        value = '';
      }

      this.$refs.input.value = value;
      this.localValue = value;
      this.$emit('change', value);
      this.toggle(false);

      if (e !== null) e.stopPropagation();
    },

    // Toggle (open/close) the select component
    toggle(override = undefined, e = null) {
      if (this.open || override === false) {
        this.$refs.input.blur();
        this.open = false;
      } else if (!this.open || override === true) {
        this.$refs.input.select();
        this.freshOpened = true;
        this.open = true;
      }

      if (e !== null) {
        e.stopPropagation();

        if (this.open) {
          this.selfClick = true;
          window.dispatchEvent(new Event('click'));
          this.selfClick = false;
        }
      }
    },

    // Window click event handler
    windowClick() {
      if (!this.selfClick) { this.toggle(false); }
    },
  },
};
</script>

<style scoped>
.select {
  display: inline-block;
  position: relative;
  width: 200px;
  height: 20px;
  max-width: calc(100% - 20px);
  max-height: 20px;
  margin: 0 10px;
}
.select input {
  position: relative;
  max-width: 100%;
  margin: 0;
  padding: 0 14px 0 4px;
  cursor: pointer;
}
.select.open input {
  border-radius: var(--border-radius) var(--border-radius) 0 0;
}
.select ul {
  display: block;
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: auto;
  max-width: none;
  max-height: 600px;
  margin: 0;
  padding: 0;
  overflow: hidden auto;
  list-style: none;
  cursor: pointer;
  background-color: var(--color-dark2);
  border-radius: 0 0 var(--border-radius) var(--border-radius);
  border-top: none;
  border-right: 1px solid var(--color-accent);
  border-left: 1px solid var(--color-accent);
  border-bottom: 1px solid var(--color-accent);
  box-sizing: border-box;
  transform: scaleY(0);
  transform-origin: top;
  z-index: 1;
  transition: var(--transition-standard);
}
.select.open ul {
  transform: scaleY(1);
}
.select li {
  display: block;
  width: auto;
  height: 20px;
  max-width: none;
  max-height: 20px;
  margin: 0;
  padding: 0 10px;
  transition: var(--transition-fast);
}
.select li.category {
  padding: 0 4px;
  color: var(--color-selection);
  font-style: italic;
  background-color: var(--color-dark1);
}
.select li.item:hover {
  background-color: var(--color-accent);
}
svg {
  position: absolute;
  top: 0;
  right: 4px;
  width: auto;
  height: auto;
  color: var(--color-accent);
}
</style>
