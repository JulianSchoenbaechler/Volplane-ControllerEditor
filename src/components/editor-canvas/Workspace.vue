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
    <!-- grid -->
    <table class="grid" v-show="snapToGrid">
      <tr v-for="y in gridSplitY" :key="`grid-y-${y}`">
        <td v-for="x in gridSplitX" :key="`grid-x-${x}`"></td>
      </tr>
    </table>
    <!-- demo rectangle -->
      <drag-resize
        :parentLimitation="true"
        :parentPixelW="parseInt(consoleStyle.width.slice(0, -2))"
        :parentPixelH="parseInt(consoleStyle.height.slice(0, -2))"
        :preventActiveBehavior="mode === 'move'"
        :isDraggable="mode === 'edit'"
        :isResizable="mode === 'edit'"
        :snapToGrid="snapToGrid"
        :gridX="100 / gridSplitX"
        :gridY="100 / gridSplitY"
      >
      </drag-resize>
    </div>
    <div class="ce-canvas-controls left">
      <v-checkbox
        v-model="snapToGrid"
        :value="'Grid'"
        :style="'display: inline-block;'"
      />
      <span class="inline-label">&nbsp;X:</span>
      <input
        type="number"
        style="width: 40px;"
        :value="gridSplitX"
        @focus="$event.currentTarget.select()"
        @change="handleGridControl($event, true)"
      />
      <span class="inline-label">&nbsp;Y:</span>
      <input
        type="number"
        style="width: 40px;"
        :value="gridSplitY"
        @focus="$event.currentTarget.select()"
        @change="handleGridControl($event, false)"
      />
    </div>
    <div class="ce-canvas-controls right">
      <span class="inline-control float-left" @click="zoomOut">
        <font-awesome-icon icon="search-minus" />
      </span>
      <input
        type="text"
        :value="`${(zoomLevel * 100).toFixed(0)}%`"
        @focus="$event.currentTarget.select()"
        @input="handleZoomControl($event)"
        @change="handleZoomControl($event, true)"
      />
      <span class="inline-control float-right" @click="zoomIn">
        <font-awesome-icon icon="search-plus" />
      </span>
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
      snapToGrid: false,
      gridSplitX: 10,
      gridSplitY: 10,
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

    // Handle manual zoom factor input
    handleZoomControl(e = null, blur = false) {
      if (e === null) return;

      const el = e.currentTarget;
      let val = el.value.replace(/[^0-9.]/g, '');
      const level = Number(val) || 1;

      if (blur) {
        el.blur();
        this.$store.commit('editor/setZoomLevel', level / 100);
        val = (this.zoomLevel * 100).toFixed(0);
        el.value = `${val}%`;
      }
    },

    // Handle workspace grid control input
    handleGridControl(e = null, horizontal = true) {
      if (e === null) return;

      const el = e.currentTarget;
      let val = Number(el.value.replace(/[^0-9.]/g, '')) || 10;

      if (val < 1) {
        val = 1;
      } else if (val > 100) {
        val = 100;
      }

      el.blur();
      el.value = val;

      // Change horizontal or vertical cell count?
      if (horizontal) {
        this.gridSplitX = val;
      } else {
        this.gridSplitY = val;
      }
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
#ce-canvas-workspace .ce-canvas-controls {
  display: block;
  position: fixed;
  width: auto;
  height: auto;
  bottom: 20px;
  padding: 6px 10px;
  text-align: center;
  background-color: rgba(34, 33, 37, 0.7);
  z-index: 999;
}
#ce-canvas-workspace .ce-canvas-controls.left {
  left: calc(48px + 40%); /* This simulates 'sticky' and maybe must be changed in the future... */
  border-right: 2px solid #414044;
}
#ce-canvas-workspace .ce-canvas-controls.right {
  right: 0;
  border-left: 2px solid #414044;
}
#ce-canvas-workspace .ce-canvas-controls input[type="text"],
#ce-canvas-workspace .ce-canvas-controls input[type="number"] {
  display: inline-block;
  position: relative;
  width: auto;
  max-width: 60px;
  margin: 0 10px;
  text-align: center;
}
#ce-canvas-workspace .ce-canvas-controls .inline-control {
  display: block;
  position: relative;
  width: auto;
  height: calc(100% - 12px);
  margin: 2px 0 0;
  padding: 0;
  color: #f8f8ec;
  text-align: center;
  cursor: pointer;
}
#ce-canvas-workspace .ce-canvas-controls .inline-label {
  display: inline-block;
  position: relative;
  width: auto;
  height: calc(100% - 12px);
  margin: 2px 0 0;
  padding: 0;
  color: #f8f8ec;
  text-align: center;
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
.virtual-console > table.grid {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  z-index: 0;
}
.virtual-console > table.grid,
.virtual-console > table.grid, tr,
.virtual-console > table.grid, td {
    border: 1px solid #7a2f34;
    border-collapse: collapse;
}
</style>
