<template>
  <div id="app">
    <loading-panel v-show="loadingPanel" />
    <popup-panel />
    <title-bar />

    <main>
      <editor-toolbox />
      <editor-panel />
      <editor-canvas />
      <editor-footer />
    </main>
  </div>
</template>

<script>
import LoadingPanel from './components/LoadingPanel.vue';
import PopupPanel from './components/PopupPanel.vue';
import TitleBar from './components/TitleBar.vue';
import EditorToolbox from './components/EditorToolbox.vue';
import EditorPanel from './components/EditorPanel.vue';
import EditorCanvas from './components/EditorCanvas.vue';
import EditorFooter from './components/Footer.vue';

export default {
  name: 'app',
  components: {
    'loading-panel': LoadingPanel,
    'popup-panel': PopupPanel,
    'title-bar': TitleBar,
    'editor-toolbox': EditorToolbox,
    'editor-panel': EditorPanel,
    'editor-canvas': EditorCanvas,
    'editor-footer': EditorFooter,
  },
  computed: {
    loadingPanel() {
      return this.$store.state.loadingPanel;
    },
  },
};
</script>

<style>
@import "css/normalize.css";
@import "css/main.css";

/* TRANSITIONS */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
