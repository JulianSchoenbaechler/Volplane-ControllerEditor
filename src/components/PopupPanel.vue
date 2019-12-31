<template>
  <transition name="fade">
    <popup v-if="isOpen" :title="title" @submit="submit">

      <!-- Popup text -->
      <p v-html="popupText"></p>

      <!-- Input field -->
      <input
        v-if="displayInput"
        type="text"
        v-model="inputValue"
        @input="sanitize"
        v-autofocus
      />

      <!-- Error and additional text -->
      <p v-if="displayError" class="color-red" v-html="errorText"></p>
      <p v-if="displayAdditional" v-html="additionalText"></p>

      <!-- Also use cancel button? -->
      <template v-if="cancelButton">
        <div class="split right">
          <input type="button" :value="cancelText" @click="close" />
        </div>
        <div class="split left">

          <!-- Auto-focus only if not a prompt -->
          <template v-if="displayInput">
            <input type="submit" :value="submitText" />
          </template>
          <template v-else>
            <input type="submit" :value="submitText" v-autofocus />
          </template>
        </div>
      </template>
      <template v-else>
        <input type="submit" :value="submitText" v-autofocus />
      </template>
    </popup>
  </transition>
</template>

<script>
import { mapState } from 'vuex';
import sanitizeName from '../utils/stringSanitizer';

export default {
  name: 'popup-panel',

  data() {
    return {
      inputValue: '',
    };
  },

  computed: mapState('popup', [
    'isOpen',
    'title',
    'cancelButton',
    'displayInput',
    'displayError',
    'displayAdditional',
    'popupText',
    'errorText',
    'additionalText',
    'submitText',
    'cancelText',
    'inputBounds',
    'inputRestrictions',
  ]),

  methods: {

    // Submit popup
    submit(element) {
      if (this.displayInput) {
        const input = this.inputValue;
        const { min, max } = this.inputBounds;
        const { values, error } = this.inputRestrictions;

        // Incorrect character count
        if ((input.length < min) || (input.length > max)) {
          this.$store.commit('popup/showError', {
            error: `The view name identifier must have a length ranging from ${min} to ${max} `
              + 'characters.',
          });
          element[0].select();

        // Invalid value
        } else if (values.includes(input)) {
          this.$store.commit('popup/showError', { error });
          element[0].select();

        // Everything fine -> submit
        } else {
          this.$store.commit('popup/submitPopup', input);
          this.inputValue = '';
        }
      } else {
        this.$store.commit('popup/submitPopup', true);
      }
    },

    // Close popup
    close() {
      this.$store.commit('popup/closePopup', false);
      this.inputValue = '';
    },

    // Sanitize input value from special characters
    sanitize() {
      const sanitized = sanitizeName(this.inputValue);

      if (sanitized !== false) this.inputValue = sanitized;
    },
  },
};
</script>
