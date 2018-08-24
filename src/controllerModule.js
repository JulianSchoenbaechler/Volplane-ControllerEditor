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

    // Set the default view by name
    makeDefaultView(state, name = null) {
      if (name) {
        state.views.forEach((v) => {
          if (v.name === name) {
            v.default = true;
          } else {
            v.default = false;
          }
        });
      }
    },

    // Remove a view by name
    removeView(state, name = null) {
      if (name) {
        const i = state.views.findIndex(v => v.name === name);

        // If view found, remove it
        if (i > -1) {
          state.views.splice(i, 1);
        }
      }
    },
  },
};
