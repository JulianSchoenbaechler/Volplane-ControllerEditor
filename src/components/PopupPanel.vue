<template>
  <transition name="fade">
    <popup v-if="isOpen" :title="title" @submit="submit">
      <p v-html="popupText"></p>
      <input
        v-if="displayInput"
        type="text"
        v-model="inputValue"
        @input="sanitize"
        v-autofocus
      />
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
  ]),

  methods: {

    // Submit popup
    submit() {
      if (this.displayInput) {
        const { min, max } = this.inputBounds;

        if ((this.inputValue.length < min) || (this.inputValue.length > max)) {
          this.$store.commit('popup/showError', {
            error: 'A view name should not contain any special characters with the exception of '
              + '<b>-</b> (dash) and <b>_</b> (underline) and must have a length ranging from '
              + `${min} to ${max} characters.`,
          });

          return;
        }
      }

      this.$store.commit('popup/submitPopup');
    },

    // Close popup
    close() {
      this.$store.commit('popup/closePopup');
    },

    // Sanitize input value from special characters
    sanitize() {
      const sanitized = sanitizeName(this.inputValue);

      if (sanitized !== false) this.inputValue = sanitized;
    },
  },
};
</script>
