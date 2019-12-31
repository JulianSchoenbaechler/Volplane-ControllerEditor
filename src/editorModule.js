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
    setActiveView(state, name = '') {
      state.activeView = name;
    },

    // Set the zoom level
    setZoomLevel(state, level = 1) {
      state.zoomLevel = level;

      if (state.zoomLevel < state.minZoomLevel) {
        state.zoomLevel = state.minZoomLevel;
      } else if (state.zoomLevel > state.maxZoomLevel) {
        state.zoomLevel = state.maxZoomLevel;
      }

      state.zoomLevel = Math.round(state.zoomLevel * 100) / 100;
    },

    // Raise the zoom level by 0.1
    raiseZoomLevel(state) {
      state.zoomLevel += 0.1;

      if (state.zoomLevel > state.maxZoomLevel) {
        state.zoomLevel = state.maxZoomLevel;
      }

      state.zoomLevel = Math.round(state.zoomLevel * 100) / 100;
    },

    // Lower the zoom level by 0.1
    lowerZoomLevel(state) {
      state.zoomLevel -= 0.1;

      if (state.zoomLevel < state.minZoomLevel) {
        state.zoomLevel = state.minZoomLevel;
      }

      state.zoomLevel = Math.round(state.zoomLevel * 100) / 100;
    },

    // Zoom by a specified multiplicator of 0.05
    zoom(state, multiplicator = 1) {
      state.zoomLevel -= multiplicator * 0.05;

      if (state.zoomLevel < state.minZoomLevel) {
        state.zoomLevel = state.minZoomLevel;
      } else if (state.zoomLevel > state.maxZoomLevel) {
        state.zoomLevel = state.maxZoomLevel;
      }

      state.zoomLevel = Math.round(state.zoomLevel * 100) / 100;
    },
  },
};
