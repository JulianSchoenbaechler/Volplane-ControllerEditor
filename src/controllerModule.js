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

    // Expose the whole controller data
    controllerData(state) {
      // Deep copy....
      // Keep attention to the memory consumption -> then again it's web-design (T.T)
      return JSON.parse(JSON.stringify(state));
    },

    // The name of the loaded controller
    name(state) {
      return state.name || 'noname';
    },

    // All views of the loaded controller
    views(state) {
      return state.views || [];
    },

    // Default view
    defaultView(state) {
      let def = 'noname';

      state.views.forEach((v) => {
        if (v.default) {
          def = v.name;
        }
      });

      return def;
    },
  },

  // Controller state mutations
  mutations: {

    // Generate an easy-to-read string of the controller data
    exportControllerData(state) {
      return JSON.stringify(state, null, 2);
    },

    // Complete reassign controller data
    setControllerData(state, data) {
      Object.assign(state, data);
      // Object.assign(state, JSON.parse(JSON.stringify(data)));
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

    // Add a new view by name
    addView(state, name = null) {
      if (name) {
        const { layout: lastLayout } = state.views[state.views.length - 1];

        state.views.push({
          name,
          default: false,
          color: 'rgb(31, 29, 42)',
          layout: lastLayout,
          content: [],
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
