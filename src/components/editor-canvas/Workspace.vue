<template>
  <div
    id="ce-canvas-workspace"
    ref="workspace"
    @wheel.prevent="handleMouseWheel($event)"
    @mousewheel.prevent="handleMouseWheel($event, true)"
  >
    <div
      class="virtual-console"
      :style="{
        width: size.x + 'px',
        height: size.y + 'px',
      }"
    >

    </div>
  </div>
</template>

<script>
export default {
  name: 'editor-canvas-workspace',

  data() {
    return {
      size: {
        x: 360,
        y: 640,
      },
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
    zoomLevel(level) {
      const initialX = 360;
      const initialY = 640;

      this.size.x = initialX * level;
      this.size.y = initialY * level;
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

    // Handle mouse wheel event
    handleMouseWheel(e = null, legacy = false) {
      if (e === null) return false;

      let deltaY = 0;

      if (!legacy) {
        deltaY = e.deltaY || e.detail;
      } else {
        deltaY = -(1 / 40) * e.wheelDelta;
      }

      if (deltaY < 0) this.zoomIn();
      else this.zoomOut();

      return false;
    },

    test() {
      console.log('test');
    },
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
  overflow: auto;
}
.virtual-console {
  display: block;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  width: 360px;
  height: 640px;
  margin: auto;
  padding: 0;
  text-align: center;
  background-image: url('../../assets/img/pirate.jpg');
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
