<template>
  <label class="wrapper">
    <input
      type="checkbox"
      v-bind="$attrs"
      :name="name"
      :value="value"
      :checked="checked"
      v-on="listeners"
      @change="$emit('change', $event.target.checked)"
    >
    <font-awesome-icon
      v-if="checked"
      icon="check-square"
    />
    <font-awesome-icon
      v-else
      :icon="['far', 'square']"
    />
    <slot>{{ value }}</slot>
  </label>
</template>

<script>
export default {
  name: 'VCheckbox',
  inheritAttrs: false,
  model: {
    prop: 'checked',
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
    checked: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    listeners() {
      const { change, ...listeners } = this.$listeners;
      return listeners;
    },
  },
};
</script>

<style scoped>
label {
  display: block;
  max-width: none;
  max-height: 20px;
  margin: 0 10px;
}
input[type="checkbox"] {
  display: none;
}
svg {
  margin-right: 4px;
  color: var(--color-accent);
}
</style>
