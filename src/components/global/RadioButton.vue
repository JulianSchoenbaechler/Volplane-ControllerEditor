<template>
  <label class="wrapper">
    <input
      type="radio"
      v-bind="$attrs"
      :value="value"
      v-on="listeners"
      @change="$emit('change', $event.target.value)"
    >
    <font-awesome-icon
      v-if="checked"
      icon="dot-circle"
    />
    <font-awesome-icon
      v-else
      :icon="['far', 'circle']"
    />
    <slot>{{ value }}</slot>
  </label>
</template>

<script>
export default {
  name: 'VRadio',
  inheritAttrs: false,
  model: {
    prop: 'modelValue',
    event: 'change',
  },
  props: {
    value: {
      type: String,
      default: 'Radio Button',
    },
    modelValue: {
      type: String,
      default: 'Radio Button',
    },
  },
  computed: {
    listeners() {
      const { change, ...listeners } = this.$listeners;
      return listeners;
    },
    checked() {
      return this.modelValue === this.value;
    },
  },
};
</script>

<style scoped>
label {
  display: block;
  max-width: none;
  max-height: 20px;
}
input[type="radio"] {
  display: none;
}
svg {
  margin-right: 4px;
  color: var(--color-accent);
}
</style>
