export default {
  namespaced: true,

  // Editor state
  state: {
    activeView: '',
  },

  // Editor getters
  getters: {

    // The name identifier of the currently loaded view
    activeView(state) {
      return state.activeView || '';
    },
  },

  // Editor state mutations
  mutations: {

    // Set the active view
    setActiveView(state, name = 'noname') {
      state.activeView = name;
    },
  },
};
