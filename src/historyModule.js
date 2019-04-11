export default {
  namespaced: true,

  // History state
  state: {
    maxSteps: 20,
    currentPosition: 0,
    history: [],
  },

  // History getters
  getters: {

    // The maximum amount of steps that get saved in the history
    maxSteps(state) {
      return state.maxSteps;
    },

    // The current position of the history pointer
    currentPosition(state) {
      return state.currentPosition;
    },

  },

  // History state mutations
  mutations: {

    // Set maximum amount of steps that get saved in the history
    setMaxSteps(state, steps) {
      state.maxSteps = Number(steps);
    },

    // Sets the current position of the history pointer
    setCurrentPosition(state, position) {
      if ((position >= 0) && (position < state.maxSteps) && (position <= state.history.length)) {
        state.currentPosition = position;
      }
    },

    // Remove all subsequent history items from the current position
    removeSubsequent(state) {
      const current = state.currentPosition;
      const { length } = state.history;

      if (current < length) {
        state.history.splice(current, length - current);
      }
    },

    // Add new element to the end of the history array
    // Shift if necessary
    addToHistory(state, { type, activeView, data }) {
      if (!type || !activeView || !data) { return; }

      while (state.history.length >= state.maxSteps) {
        state.history.shift();
      }

      state.history.push({ type, activeView, data });
    },

    // Clear the currently stored history
    clearHistory(state) {
      state.currentPosition = 0;
      state.history = [];
    },

  },

  // History actions
  actions: {

    // Register new history dataat the current position
    register({ commit, state, rootGetters }, { type, activeView }) {
      if (!type || !activeView) { return; }

      commit('removeSubsequent');
      commit('addToHistory', { type, activeView, data: rootGetters['controller/controllerData'] });
      commit('setCurrentPosition', Math.min(state.currentPosition + 1, state.maxSteps - 1));
    },

    // Undo from history
    undo({
      commit,
      dispatch,
      rootGetters,
      state,
    }) {
      const isFirst = state.history.length === state.currentPosition;
      const previous = state.currentPosition - 1;

      if ((previous < 0) || (previous >= state.history.length)) { return; }

      const element = state.history[previous];

      // Set current working state
      if (isFirst) {
        dispatch('register', { type: 'temp', activeView: rootGetters['editor/activeView'] });
      }

      // Set controller data
      commit('controller/setControllerData', element.data, { root: true });
      // console.log(element.type);

      // Change to the active view and set history position
      commit('editor/setActiveView', element.activeView, { root: true });
      commit('setCurrentPosition', previous);
    },

    // Redo from history
    redo({ commit, state }) {
      const next = state.currentPosition + 1;

      if ((next < 0) || (next >= state.history.length)) { return; }

      const element = state.history[next];

      // Set controller data
      commit('controller/setControllerData', element.data, { root: true });
      // console.log(element.type);

      // Change to the active view and set history position
      commit('editor/setActiveView', element.activeView, { root: true });
      commit('setCurrentPosition', next);
    },

  },
};
