<template>
  <div>
    <h2>Create New Element</h2>
    <v-select
      name="demo"
      value="Gaga"
      :options="[
        'Gaga',
        'Dodo'
      ]"
    />
    <form>
      <v-radio
        v-model="option"
        name="hololulu"
        value="o1"
      />
      <v-radio
        v-model="option"
        name="hololulu"
        value="o2"
      />
      <v-radio
        v-model="option"
        name="hololulu"
        value="o3"
      />
      <v-checkbox
        v-model="check"
        name="gaga"
        value="Check This"
      />
    </form>

    <div class="property">
      <div>
        <input
          class="new-text"
          type="button"
          value="Text / Image"
          @click="add('text', $event)"
        >
      </div>
      <div>
        <input
          class="new-button"
          type="button"
          value="Button"
        >
      </div>
    </div>
    <div class="property">
      <div>
        <input
          class="new-swipe"
          type="button"
          value="Swipe Area"
        >
      </div>
      <div>
        <input
          class="new-touch"
          type="button"
          value="Touch Area"
        >
      </div>
    </div>
    <div class="property">
      <div>
        <input
          class="new-dpad"
          type="button"
          value="D-Pad"
        >
      </div>
      <div>
        <input
          class="new-rdpad"
          type="button"
          value="Relative D-Pad"
        >
      </div>
    </div>
    <div class="property">
      <div>
        <input
          class="new-joystick"
          type="button"
          value="Joystick"
        >
      </div>
      <div>
        <input
          class="new-rjoystick"
          type="button"
          value="Relative Joystick"
        >
      </div>
    </div>
  </div>
</template>

<script>
const typeToString = (type) => {
  switch (type) {
    case 'text':
      return 'Text / Image';
    case 'button':
      return 'Button';
    case 'swipe':
      return 'Swipe Field';
    case 'touch':
      return 'Touch Area';
    case 'dpad':
      return 'D-Pad';
    case 'dpadRelative':
      return 'Relative D-Pad';
    case 'joystick':
      return 'Joystick';
    case 'joystickRelative':
      return 'Relative Joystick';
    default:
      return null;
  }
};

export default {
  name: 'EditorPanelCreate',

  data() {
    return {
      option: 'o2',
      check: false,
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

    // Add view button
    // Event handler
    add(type = null, event = null) {
      const i = this.views.findIndex((v) => v.name === this.activeView);

      if (event) event.stopPropagation();

      this.$store.dispatch('popup/prompt', {
        title: `Add ${typeToString(type)}`,
        text: 'Enter a <strong>name identifier</strong> for the new element. The name identifier '
          + 'is the direct connection between Unity and this controller element and will be used '
          + 'to access it from code.',
        restrictions: {
          values: this.views[i].content.map((e) => e.name),
          error: 'An element with this name identifier already exists!',
        },
      }).then((name) => {
        if (name) {
          // Save this action
          this.$store.dispatch('history/register', {
            type: 'addElement',
            activeView: this.activeView,
          });

          // Adding new element
          this.$store.commit('controller/addElement', {
            view: this.activeView,
            name,
            type,
          });
        }
      }, (error) => {
        throw new Error(error);
      });

      if (this.addPopup) return;

      this.tempElement = null;
      this.addError = null;
      this.tempType = type;
      this.addPopup = true;
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
