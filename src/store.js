import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    // Loading panel active
    loadingPanel: true,
  },
  mutations: {
    setLoadingPanel(state, value = true) {
      state.loadingPanel = value;
    },
  },
  actions: {

  },
});
