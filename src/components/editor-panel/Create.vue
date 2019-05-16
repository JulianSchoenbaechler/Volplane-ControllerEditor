<template>
  <div>
    <transition name="fade">

      <!-- add view confirmation popup -->
      <popup v-if="addPopup" title="Add View" @submit="add">
        <p>
          Enter a <strong>name identifier</strong> for the new element. The name identifier is the
          direct connection between Unity and this controller element and will be used to access it
          from code.
        </p>
        <input
          type="text"
          v-model="tempElement"
          @input="sanitize"
          v-autofocus
        />
        <p v-if="addError" class="color-red">
          {{ addError }}
        </p>
        <p>
          An element name should not contain any special characters with the exception of <b>-</b>
          (dash) and <b>_</b> (underline).
        </p>
        <div class="split right">
          <input type="button" value="Cancel" @click="addPopup = false" />
        </div>
        <div class="split left">
          <input type="submit" value="OK" />
        </div>
      </popup>

    </transition>

    <!-- main panel -->
    <h2>Create New Element</h2>

    <div class="property">
      <div>
        <input
          class="new-text"
          type="button"
          value="Text / Image"
          @click="addRequest($event, 'text')"
        />
      </div>
      <div>
        <input class="new-button" type="button" value="Button" />
      </div>
    </div>
    <div class="property">
      <div>
        <input class="new-swipe" type="button" value="Swipe Area" />
      </div>
      <div>
        <input class="new-touch" type="button" value="Touch Area" />
      </div>
    </div>
    <div class="property">
      <div>
        <input class="new-dpad" type="button" value="D-Pad" />
      </div>
      <div>
        <input class="new-rdpad" type="button" value="Relative D-Pad" />
      </div>
    </div>
    <div class="property">
      <div>
        <input class="new-joystick" type="button" value="Joystick" />
      </div>
      <div>
        <input class="new-rjoystick" type="button" value="Relative Joystick" />
      </div>
    </div>
  </div>
</template>

<script>
import sanitizeName from '../../utils/stringSanitizer';

export default {
  name: 'editor-panel-create',

  data() {
    return {
      tempElement: null,
      tempType: null,
      addPopup: false,
      addError: null,
    };
  },

  computed: {
    // The controller views
    views() {
      return this.$store.getters['controller/views'];
    },

    // The editors active view name identifier
    activeView() {
      return this.$store.getters['editor/activeView'];
    },
  },

  methods: {

    // Sanitize 'tempElement' value from special characters
    sanitize() {
      const sanitized = sanitizeName(this.tempElement);

      if (sanitized !== false) this.tempElement = sanitized;
    },

    // Add view button
    // Event handler
    addRequest(event = null, type = null) {
      if (event) event.stopPropagation();

      if (this.addPopup) return;

      this.tempElement = null;
      this.addError = null;
      this.tempType = type;
      this.addPopup = true;
    },

    // Add view with name
    add(elements) {
      if (!this.tempElement || this.tempElement.length < 3) {
        this.addError = 'The view name identifier must be at least 3 characters long!';
        elements[0].select();
        return;
      }

      const i = this.views.findIndex(v => v.name === this.activeView);

      if (this.views[i].content.some(e => e.name === this.tempElement)) {
        this.addError = 'An element with this name identifier already exists in the current view!';
        elements[0].select();
        return;
      }

      // Save this action
      this.$store.dispatch('history/register', {
        type: 'addElement',
        activeView: this.activeView,
      });

      // Adding new element
      this.$store.commit('controller/addElement', {
        view: this.activeView,
        name: this.tempElement,
        type: this.tempType,
      });
      // Set active element

      this.tempElement = null;
      this.tempType = null;
      this.addPopup = false;
    },

  },
};
</script>

<style scoped>
input[type="button"][class^="new-"] {
  width: calc(100% - 20px);
  height: 32px;
  max-height: 32px;
  background-size: auto 80%;
  background-position: left 4px center;
  background-repeat: no-repeat;
}
input[type="button"].new-button {
  background-image: url("../../assets/img/button-icon.png");
}
input[type="button"].new-text {
  background-image: url("../../assets/img/text-icon.png");
}
input[type="button"].new-dpad {
  background-image: url("../../assets/img/dpad-icon.png");
}
input[type="button"].new-rdpad {
  background-image: url("../../assets/img/rdpad-icon.png");
}
input[type="button"].new-joystick {
  background-image: url("../../assets/img/joystick-icon.png");
}
input[type="button"].new-rjoystick {
  background-image: url("../../assets/img/rjoystick-icon.png");
}
input[type="button"].new-swipe {
  background-image: url("../../assets/img/swipe-icon.png");
}
input[type="button"].new-touch {
  background-image: url("../../assets/img/touch-icon.png");
}
</style>
