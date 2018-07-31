import Vue from 'vue';
import Vuex from 'vuex';
import loadData from './dataLoader';
import sanitizeName from './stringSanitizer';

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

        context.commit('controller/setControllerData', data);
        context.commit('setLoadingPanel', false);
      } catch (e) {
        console.error(e);
      }
    },
  },

  // Store modules
  modules: {

    // Controller data module
    controller: {
      namespaced: true,

      // Controller state
      state: {
        name: 'noname',
        views: [],
        fontList: [],
        synchronizeTime: true,
        deviceMotion: false,
        sensitivity: 5,
        lastEdit: 0,
      },

      // Controller getters
      getters: {

        // The name of the loaded controller
        name(state) {
          return state.name || 'noname';
        },

        // All views of the loaded controller
        views(state) {
          return state.views || [];
        },
      },

      // Controller state mutations
      mutations: {

        // Complete reassign controller data
        setControllerData(state, data) {
          Object.assign(state, data);
        },

        // Basic controller settings
        setControllerSettings(state, data) {
          const { synchronizeTime = true, deviceMotion = false, sensitivity = 5 } = data;

          state.synchronizeTime = synchronizeTime;
          state.deviceMotion = deviceMotion;
          state.sensitivity = sensitivity;
        },
      },
    },
  },
});
