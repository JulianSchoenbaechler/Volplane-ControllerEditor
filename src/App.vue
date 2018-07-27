<template>
  <div id="app">
    <loading-panel v-show="loadingPanel" />
  </div>
</template>

<script>
import LoadingPanel from './components/LoadingPanel.vue';

export default {
  name: 'app',
  components: {
    'loading-panel': LoadingPanel,
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

a {
  color: #42b983;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.full-screen {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 100%;
  min-height: 100%;
  text-align: center;
  background-color: #222125;
  z-index: 1000;
}
.full-screen p {
  position: absolute;
  display: inline-block;
  top: 50%;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  font-size: 24px;
  font-weight: 200;
  font-style: normal;
  line-height: 0;
  overflow: visible;
  white-space: normal;
}

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
