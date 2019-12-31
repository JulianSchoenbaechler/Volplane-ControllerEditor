export default {
  namespaced: true,

  // Popup state
  state: {
    isOpen: false,
    title: 'Popup',
    cancelButton: true,
    displayInput: false,
    displayError: false,
    displayAdditional: false,
    popupText: 'Sure?',
    errorText: 'Error!',
    additionalText: '',
    submitText: 'OK',
    cancelText: 'Cancel',
    inputBounds: { min: 3, max: 25 },
    inputRestrictions: {
      values: [],
      error: 'Input error!',
    },
  },

  // Popup getters
  getters: {

    // Indicates if a popup is currently open
    isOpen(state) {
      return state.isOpen;
    },

    // Gets the title of the popup
    title(state) {
      return state.title;
    },

    // Gets the type of the popup
    type({ cancelButton, displayInput }) {
      if (cancelButton) {
        return displayInput ? 'prompt' : 'confirm';
      }

      return 'alert';
    },

  },

  // Popup state mutations
  mutations: {

    // Show alert popup
    showAlert(state, options) {
      if (!state.isOpen) {
        state.title = options.title || 'Popup';
        state.popupText = options.text || 'Sure?';
        state.additionalText = options.additionalText || '';
        state.submitText = options.submit || 'OK';

        state.cancelButton = false;
        state.displayInput = false;
        state.displayAdditional = typeof options.additionalText !== 'undefined';
        state.isOpen = true;
      }
    },

    // Show confirm popup
    showConfirm(state, options) {
      if (!state.isOpen) {
        state.title = options.title || 'Popup';
        state.popupText = options.text || 'Sure?';
        state.additionalText = options.additionalText || '';
        state.submitText = options.submit || 'Yes';
        state.cancelText = options.cancel || 'No';

        state.cancelButton = true;
        state.displayInput = false;
        state.displayAdditional = typeof options.additionalText !== 'undefined';
        state.isOpen = true;
      }
    },

    // Show prompt popup
    showPrompt(state, options) {
      if (!state.isOpen) {
        state.title = options.title || 'Popup';
        state.popupText = options.text || 'Sure?';
        state.additionalText = options.additionalText || '';
        state.submitText = options.submit || 'OK';
        state.cancelText = options.cancel || 'Cancel';
        state.inputBounds.min = options.min || 3;
        state.inputBounds.max = options.max || 25;
        state.inputRestrictions.values = options.restrictions.values || [];
        state.inputRestrictions.error = options.restrictions.error || 'Input error!';

        state.cancelButton = true;
        state.displayInput = true;
        state.displayAdditional = typeof options.additionalText !== 'undefined';
        state.isOpen = true;
      }
    },

    // Show an error on the current popup
    showError(state, options) {
      if (state.isOpen) {
        state.errorText = options.error || 'Error!';

        // Override additional text
        if (options.additionalText) {
          state.additionalText = options.additionalText;
        }

        state.displayAdditional = typeof state.additionalText !== 'undefined';
        state.displayError = true;
      }
    },

    // Submit popup
    submitPopup(state) {
      state.isOpen = false;
    },

    // Close popup
    closePopup(state) {
      state.isOpen = false;
    },

  },

  // Popup actions
  actions: {

    // Resolve popup
    // Wait for submitting (fulfill) or closing (reject) popup
    resolvePopup() {
      return new Promise((resolve, reject) => {
        // TODO: check this for memory leak
        // In theory this should be fine:
        // After 'unsubscribe()' is called, the inlined function can be freed which makes the
        // function useless. After the promise is handled by the caller, it can be discarded.
        // Garbage collection should remove the scoped variable.
        const unsubscribe = this.subscribe((mutation) => {
          // On submit
          if (mutation.type === 'popup/submitPopup') {
            unsubscribe();
            resolve(mutation.payload);

          // On close (closing with payload is an error)
          } else if (mutation.type === 'popup/closePopup') {
            unsubscribe();

            if (mutation.payload) {
              reject(mutation.payload);
            } else {
              resolve();
            }
          }
        });
      });
    },

    // Alert popup
    alert({ commit, dispatch }, options = {}) {
      commit('showAlert', options);
      return dispatch('resolvePopup');
    },

    // Confirm popup
    confirm({ commit, dispatch }, options = {}) {
      commit('showConfirm', options);
      return dispatch('resolvePopup');
    },

    // Prompt popup
    prompt({ commit, dispatch }, options = {}) {
      commit('showPrompt', options);
      return dispatch('resolvePopup');
    },
  },
};
