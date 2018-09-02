export default {
  namespaced: true,

  // Editor state
  state: {
    activeView: '',
    zoomLevel: 1,
    minZoomLevel: 0.2,
    maxZoomLevel: 3,
  },

  // Editor getters
  getters: {

    // The name identifier of the currently loaded view
    activeView(state) {
      return state.activeView || '';
    },

    // The zoom level of the canvas workspace
    zoomLevel(state) {
      return state.zoomLevel || 1;
    },
  },

  // Editor state mutations
  mutations: {

    // Set the active view
    setActiveView(state, name = 'noname') {
      state.activeView = name;
    },

    // Set the zoom level
    setZoomLevel(state, level = 1) {
      state.zoomLevel = level;
    },

    // Raise the zoom level by 0.2
    raiseZoomLevel(state) {
      state.zoomLevel += 0.2;

      if (state.zoomLevel > state.maxZoomLevel) {
        state.zoomLevel = state.maxZoomLevel;
      }

      state.zoomLevel = Math.round(state.zoomLevel * 10) / 10;
    },

    // Lower the zoom level by 0.2
    lowerZoomLevel(state) {
      state.zoomLevel -= 0.2;

      if (state.zoomLevel < state.minZoomLevel) {
        state.zoomLevel = state.minZoomLevel;
      }

      state.zoomLevel = Math.round(state.zoomLevel * 10) / 10;
    },
  },
};
