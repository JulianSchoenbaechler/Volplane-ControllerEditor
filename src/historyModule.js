export default {
  namespaced: true,

  // History state
  state: {
    maxSteps: 20,
    currentPosition: -1,
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

    // The element the pointer is currently on
    currentElement(state) {
      return state.history[state.currentPosition] || null;
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
      if ((position >= 0) && (position < state.maxSteps) && (position < state.history.length)) {
        state.currentPosition = position;
      } else {
        state.currentPosition = -1;
      }
    },

    // Remove all subsequent history items from the current position
    removeSubsequent(state) {
      const next = state.currentPosition + 1;
      const { length } = state.history;

      if (next < length) {
        state.history.splice(next, length - next);
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
      state.currentPosition = -1;
      state.history = [];
    },

  },

  // History actions
  actions: {

    // Register new history dataat the current position
    register({ commit, state }, { type, activeView, data }) {
      if (!type || !activeView || !data) { return; }

      commit('removeSubsequent');
      commit('addToHistory', { type, activeView, data });
      commit('setCurrentPosition', state.history.length - 1);
    },

    // Undo from history
    undo({ commit, state }) {
      if (state.currentPosition < 0) { return; }

      const element = state.history[state.currentPosition];

      // Resolve element data
      switch (element.type) {
        case 'test':
          console.log('undo...');
          break;

        default:
          return;
      }

      // Change to the active view and set history position
      commit('editor/setActiveView', element.activeView, { root: true });
      commit('setCurrentPosition', state.currentPosition - 1);
    },

    // Redo from history
    redo({ commit, state }) {
      const next = state.currentPosition + 1;

      if ((next < 0) || (next >= state.history.length)) {
        return;
      }

      const element = state.history[next];

      // Resolve element data
      switch (element.type) {
        case 'test':
          console.log('redo...');
          break;

        default:
          return;
      }

      // Change to the active view and set history position
      commit('editor/setActiveView', element.activeView, { root: true });
      commit('setCurrentPosition', next);
    },

  },
};
