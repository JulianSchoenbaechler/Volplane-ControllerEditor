<template>
  <label>
    <input
      type="radio"
      v-bind="$attrs"
      :name="name"
      :value="value"
      :checked="checked"
      v-on="listeners"
      @change="$emit('change', $event.target.checked)"
    />
    <font-awesome-icon v-if="checked" icon="dot-circle" />
    <font-awesome-icon v-else :icon="['far', 'circle']" />
    <slot>{{ this.value }}</slot>
  </label>
</template>

<script>
export default {
  name: 'radio',
  inheritAttrs: false,
  model: {
    prop: 'checked',
    event: 'change',
  },
  props: {
    name: String,
    value: String,
    checked: Boolean,
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
  width: auto;
  height: 20px;
  max-width: auto;
  max-height: 20px;
  margin: 4px 10px;
  padding: 0;
  font-family: "Montserrat";
  font-weight: 200;
  font-style: normal;
  font-size: 14px;
  color: #f8f8ec;
  cursor: pointer;
}
input[type="radio"] {
  display: none;
}
svg {
  margin-right: 4px;
  color: #7a2f34;
}
</style>
