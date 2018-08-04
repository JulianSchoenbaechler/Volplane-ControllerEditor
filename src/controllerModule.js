export default {
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
};
