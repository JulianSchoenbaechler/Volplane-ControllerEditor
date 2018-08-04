import Vue from 'vue';
import Vuex from 'vuex';
import loadData from './utils/dataLoader';
import sanitizeName from './utils/stringSanitizer';

// Store modules
import controllerModule from './controllerModule';
import editorModule from './editorModule';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,

  // Global state
  state: {
    // Loading panel active
    loadingPanel: true,
  },

  // Global getters
  getters: {},

  // Global mutations
  mutations: {
    setLoadingPanel(state, value = true) {
      state.loadingPanel = value;
    },
  },

  // Global actions
  actions: {

    // Loading panel enable/disable
    setLoadingPanel(context, value = true) {
      context.commit('setLoadingPanel', value);
    },

    // Loading controller controller data
    async loadController(context, controller = '') {
      const load = sanitizeName(controller);

      // Check for controller name
      if (load === false) {
        console.error('[ControllerEditor] Nothing to load...');
        return;
      }

      try {
        const data = await loadData(`data/controller/${load}.json?t=${Date.now() || 0}`);

        // Set defaults

        // Controller
        context.commit('controller/setControllerData', data);

        // Editor
        context.commit('editor/setActiveView', context.getters['controller/views'][0].name || 'noname');

        context.commit('setLoadingPanel', false);
      } catch (e) {
        console.error(e);
      }
    },
  },

  // Store modules
  modules: {

    // Controller module
    controller: controllerModule,

    // Editor module
    editor: editorModule,
  },
});
