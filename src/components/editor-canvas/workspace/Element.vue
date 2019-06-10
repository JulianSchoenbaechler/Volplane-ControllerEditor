<template>
  <drag-resize
    v-bind="dragResizeProps"
    @stopDrag="updateElement"
    @stopResize="updateElement"
  >
    <div :style="`font-size: ${12 * zoomLevel}pt`">
      <slot />
    </div>
  </drag-resize>
</template>

<script>
import 'volplane-drag-resize/lib/volplane-drag-resize.css';
import VolplaneDragResize from 'volplane-drag-resize';

export default {
  name: 'editor-canvas-workspace-element',

  components: { dragResize: VolplaneDragResize },

  props: {
    ...VolplaneDragResize.props,
    name: String,
    view: String,
    zoomLevel: Number,
  },

  computed: {
    dragResizeProps() {
      const {
        name, // Explicit ingore
        view, // Explicit ingore
        zoomLevel, // Explicit ingore
        ...p
      } = this.$props;

      return p;
    },
  },

  methods: {
    updateElement(data) {
      const props = {
        name: this.name,
        view: this.view,
        ...data,
      };
      this.$store.commit('controller/changeElementProperties', props);
    },
  },
};
</script>
