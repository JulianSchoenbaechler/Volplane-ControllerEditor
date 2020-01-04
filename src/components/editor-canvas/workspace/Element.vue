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
  name: 'EditorCanvasWorkspaceElement',

  components: { dragResize: VolplaneDragResize },

  props: {
    ...VolplaneDragResize.props,
    name: {
      type: String,
      default: 'noname',
    },
    view: {
      type: String,
      default: '',
    },
    zoomLevel: {
      type: Number,
      default: 1,
    },
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
