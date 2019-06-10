<template>
  <div
    class="wrapper"
    v-on="listeners"
  >
    <div ref="picker"></div>
  </div>
</template>

<script>
import Pickr from '@simonwep/pickr/dist/pickr.min';

let pickr = null;

export default {
  name: 'v-color',

  model: {
    prop: 'value',
    event: 'change',
  },

  props: { value: String },

  computed: {
    // The component event listeners
    // Without the ones that are handled in code
    listeners() {
      const { change, ...listeners } = this.$listeners;
      return listeners;
    },
  },

  mounted() {
    const vm = this;

    this.$nextTick(() => {
      pickr = new Pickr({
        el: this.$refs.picker,
        default: this.value || 'rgba(31, 29, 42, 1)',
        defaultRepresentation: 'HEX',
        position: 'left',
        components: {
          preview: true,
          opacity: true,
          hue: true,
          interaction: {
            hex: true,
            rgba: true,
            hsva: true,
            input: true,
            clear: false,
            save: true,
          },
        },
        onSave(hsva) {
          vm.$emit('change', hsva.toRGBA().toString());
        },
      });
    });
  },

  beforeDestroy() {
    pickr.destroy();
  },
};
</script>

<style scoped>
@import "../../css/pickr.css";

.wrapper {
  display: block;
  position: relative;
  width: auto;
  height: 20px;
  max-width: none;
  max-height: 20px;
  margin: 4px 10px;
  padding: 0;
}
input[type="button"] {
  min-width: none !important;
}
</style>
