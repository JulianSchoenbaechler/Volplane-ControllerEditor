<template>
  <div
    id="ce-canvas-workspace"
    ref="workspace"
    v-dragscroll="mode === 'move'"
    :class="mode === 'edit' ? 'mode-edit' : 'mode-move'"
    @wheel.prevent="handleMouseWheel($event)"
    @mousewheel.prevent="handleMouseWheel($event, true)"

  >
    <div
      class="virtual-console"
      :style="consoleStyle"
    >
      <drag-resize
        :parentLimitation="true"
        :parentPixelW="parseInt(consoleStyle.width.slice(0, -2))"
        :parentPixelH="parseInt(consoleStyle.height.slice(0, -2))"
        :preventActiveBehavior="mode === 'move'"
        :isDraggable="mode === 'edit'"
        :isResizable="mode === 'edit'"
        :snapToGrid="true"
        :gridX="10"
        :gridY="10"
      >
      </drag-resize>
    </div>
  </div>
</template>

<script>
import { dragscroll } from 'vue-dragscroll';
import 'volplane-drag-resize/lib/volplane-drag-resize.css';
import VolplaneDragResize from 'volplane-drag-resize';

export default {
  name: 'editor-canvas-workspace',

  directives: {
    dragscroll,
  },

  components: {
    dragResize: VolplaneDragResize,
  },

  data() {
    return {
      consoleStyle: {
        width: '360px',
        height: '640px',
        top: '50%',
        left: '50%',
        'margin-top': '-320px',
        'margin-right': '0',
        'margin-bottom': '0',
        'margin-left': '-180px',
      },
      scrollable: false,
      mode: 'edit',
    };
  },

  computed: {
    // The editors active view name identifier
    activeView() {
      return this.$store.getters['editor/activeView'];
    },

    // The current canvas editor zoom level
    zoomLevel() {
      return this.$store.getters['editor/zoomLevel'];
    },

    // The active controller view data
    view() {
      const views = this.$store.getters['controller/views'];
      return views.find(v => v.name === this.activeView) || {};
    },
  },

  watch: {
    // Resize virtual controler according to zoom level
    zoomLevel: 'recalculateConsoleSize',

    // Switch view
    activeView() {
      this.$store.commit('editor/setZoomLevel', 1);
      this.recalculateConsoleSize();
    },
  },

  methods: {
    // Zoom in
    zoomIn() {
      this.$store.commit('editor/raiseZoomLevel');
    },

    // Zoom out
    zoomOut() {
      this.$store.commit('editor/lowerZoomLevel');
    },

    // Zoom a specified amount
    zoom(delta = 1) {
      this.$store.commit('editor/zoom', delta);
    },

    // Handle mouse wheel event
    handleMouseWheel(e = null, legacy = false) {
      if (e === null) return false;

      let deltaY = 0;

      if (!legacy) {
        deltaY = e.deltaY || e.detail;
      } else {
        deltaY = -(1 / 40) * e.wheelDelta;
      }

      this.zoom(deltaY);
      return false;
    },

    // Recalculate virtual console size
    recalculateConsoleSize(zoomLevel) {
      const level = parseFloat(zoomLevel) || this.zoomLevel;
      const $ws = this.$refs.workspace;
      const initialX = this.view.layout !== 'landscape' ? 360 : 640;
      const initialY = this.view.layout !== 'landscape' ? 640 : 360;

      const width = initialX * level;
      const height = initialY * level;

      this.consoleStyle.width = `${width}px`;
      this.consoleStyle.height = `${height}px`;

      if ($ws.clientWidth < width) {
        this.consoleStyle.left = 0;
        this.consoleStyle['margin-left'] = 0;
      } else {
        this.consoleStyle.left = '50%';
        this.consoleStyle['margin-left'] = `${-width / 2}px`;
      }

      if ($ws.clientHeight < height) {
        this.consoleStyle.top = 0;
        this.consoleStyle['margin-top'] = 0;
      } else {
        this.consoleStyle.top = '50%';
        this.consoleStyle['margin-top'] = `${-height / 2}px`;
      }

      // Calculate scroll position ratio
      const scrollRatio = {
        x: $ws.scrollLeft / ($ws.scrollWidth - $ws.clientWidth),
        y: $ws.scrollTop / ($ws.scrollHeight - $ws.clientHeight),
      };

      // Scroll to position after applying changes
      this.$nextTick(() => {
        if (
          $ws.scrollWidth - $ws.clientWidth > 0 ||
          $ws.scrollHeight - $ws.clientHeight > 0
        ) {
          $ws.scrollTo(
            ($ws.scrollWidth - $ws.clientWidth) *
              (Number.isNaN(scrollRatio.x) ? 0.5 : scrollRatio.x),
            ($ws.scrollHeight - $ws.clientHeight) *
              (Number.isNaN(scrollRatio.y) ? 0.5 : scrollRatio.y),
          );
          this.scrollable = true;
        } else {
          this.scrollable = false;
        }
      });
    },

    // Handle keydown event
    // Switch mode for shift-key
    keydownHandler(e) {
      if (this.mode === 'move') return;
      if (e.shiftKey) this.mode = 'move';
    },

    // Handle keyup event
    // Switch mode for shift-key
    keyupHandler(e) {
      if (this.mode === 'edit') return;
      if (!e.shiftKey) this.mode = 'edit';
    },

    test() {
      console.log('test');
    },
  },

  mounted() {
    this.$nextTick(() => {
      // Listen for window resizing event
      window.addEventListener('resize', this.recalculateConsoleSize);

      // Listen for window keydown/keyup event
      window.addEventListener('keydown', this.keydownHandler);
      window.addEventListener('keyup', this.keyupHandler);
    });
  },

  beforeDestroy() {
    // Unsubscribe event listener(s)
    window.removeEventListener('resize', this.recalculateConsoleSize);
    window.removeEventListener('keydown', this.keydownHandler);
    window.removeEventListener('keyup', this.keyupHandler);
  },
};
</script>

<style>
#ce-canvas-workspace {
  display: block;
  position: relative;
  width: 100%;
  height: calc(100% - 32px);
  max-width: 100%;
  max-height: calc(100% - 32px);
  overflow: hidden;
}
#ce-canvas-workspace.mode-edit {
  cursor: auto;
}
#ce-canvas-workspace.mode-move {
  cursor: move;
}
.virtual-console {
  display: block;
  position: relative;
  top: 50%;
  left: 50%;
  width: 360px;
  height: 640px;
  margin: -320px 0 0 -180px;
  padding: 0;
  text-align: center;
  background-image: url("../../assets/img/pirate.jpg");
  background-size: cover;
  background-position: center;
}
.virtual-console.landscape {
  min-width: 640px;
  min-height: 360px;
  width: 640px;
  height: 360px;
  max-width: 640px;
  max-height: 360px;
}
.virtual-console.portrait {
  min-width: 360px;
  min-height: 640px;
  width: 360px;
  height: 640px;
  max-width: 360px;
  max-height: 640px;
}
</style>
