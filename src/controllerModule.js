import deepCopy from './utils/deepCopy';

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
      return deepCopy(state);
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

    // Completely reassign controller data
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
        if (i < 0) return;

        state.views.splice(i, 1);
      }
    },

    // Add a new element to a specified view
    // Provide a name identifier and a type
    addElement(state, data = {}) {
      if (!data.view || !data.name || !data.type) return;

      const i = state.views.findIndex(v => v.name === data.view);

      if (i < 0) return;

      // Create element data
      let element = {
        type: data.type,
        name: data.name,
        width: 40,
        height: 40,
        x: 0,
        y: 0,
        hidden: false,
        layer: 0,
      };

      const basicElement = {
        ...element,
        image: '',
        imagePosition: 'contain',
        font: '',
        fontSize: '',
        fontStyle: 'regular',
        fontColor: 'rgb(248, 248, 236)',
        paddingH: 2,
        paddingV: 2,
      };

      // Differentiate between element types
      switch (data.type) {
        case 'text':
          element = {
            ...basicElement,
            text: 'Text',
            textAlignH: 'left',
            textAlignV: 'top',
          };
          break;

        case 'button':
          element = {
            ...basicElement,
            highlightImage: '',
            text: 'Button',
            textAlignH: 'center',
            textAlignV: 'middle',
          };
          break;

        case 'swipe':
          element = {
            ...basicElement,
            highlightImage: '',
            text: 'Swipe Field',
            textAlignH: 'center',
            textAlignV: 'middle',
          };
          break;

        case 'touch':
          element = {
            ...basicElement,
            highlightImage: '',
            text: 'Touch Field',
            textAlignH: 'center',
            textAlignV: 'middle',
          };
          break;

        case 'dpad':
          element = {
            ...element,
            image: '',
            highlightImageU: '',
            highlightImageD: '',
            highlightImageL: '',
            highlightImageR: '',
            is8Way: false,
            imagePosition: 'contain',
          };
          break;

        case 'rdpad':
          element = {
            ...element,
            image: '',
            handlerImage: '',
            highlightImageU: '',
            highlightImageD: '',
            highlightImageL: '',
            highlightImageR: '',
            imagePosition: 'contain',
            is8Way: false,
            distance: 10,
          };
          break;

        case 'joystick':
          element = {
            ...element,
            image: '',
            stickImage: '',
            imagePosition: 'contain',
            distance: 10,
          };
          break;

        case 'rjoystick':
          element = {
            ...element,
            image: '',
            stickImage: '',
            thumbImage: '',
            imagePosition: 'contain',
            stickSize: 0.8,
            thumbSize: 0.4,
          };
          break;

        default:
          break;
      }

      state.views[i].content.push(element);
    },

    // Remove an element from a specified view
    // Provide a name identifier
    removeElement(state, view = null, name = null) {
      if (!view || !name) return;

      const i = state.views.findIndex(v => v.name === view);

      if (i < 0) return;

      const j = state.views[i].content.findIndex(e => e.name === name);

      if (j < 0) return;

      state.views[i].content.splice(j, 1);
    },
  },
};
