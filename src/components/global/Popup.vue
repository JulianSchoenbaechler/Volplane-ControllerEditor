<template>
  <div class="popup-container full-screen">
    <div class="popup-wrapper">
      <h1>{{ title }}</h1>
      <form
        autocomplete="off"
        @submit.prevent="submitPopup($event)"
        v-on="listeners"
      >
        <slot>
          <div class="split right">
            <input
              type="button"
              value="Cancel"
            >
          </div>
          <div class="split left">
            <input
              type="submit"
              value="OK"
            >
          </div>
        </slot>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    title: {
      type: String,
      default: 'Popup',
    },
    handler: {
      type: Function,
      default: () => { },
    },
  },
  computed: {
    // The component event listeners
    // Without the ones that are handled in code
    listeners() {
      const { submit, ...listeners } = this.$listeners;
      return listeners;
    },
  },
  methods: {
    submitPopup(e = null) {
      if (this.handler) this.handler();
      this.$emit('submit', e.target.elements);
    },
  },
};
</script>

<style>
.popup-container {
  background-color: var(--color-dark1);
}
.popup-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  align-content: stretch;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  max-width: 600px;
  max-height: 100%;
  text-align: left;
}
.popup-wrapper h1,
.popup-wrapper h2,
.popup-wrapper h3,
.popup-wrapper h4,
.popup-wrapper h5,
.popup-wrapper h6 {
  flex: 0 0 auto;
  margin: 0 0 24px;
  padding: 0;
  font-size: 16px;
  font-weight: 300;
  line-height: 32px;
  text-align: center;
  color: var(--color-accent);
  border-bottom: 1px solid var(--color-accent);
}
.popup-wrapper form {
  flex: 0 1 auto;
  overflow: auto;
}
.popup-wrapper input {
  position: relative;
  display: block;
  margin: 0 10px 20px;
}
.popup-wrapper input[type="text"],
.popup-wrapper input[type="number"] {
  position: relative;
  display: block;
  width: 220px;
  margin: 0 auto 20px;
}
.popup-wrapper p {
  position: relative;
  display: block;
  width: auto;
  height: auto;
  top: 0;
  left: 0;
  margin: 0 10px 20px;
  text-align: justify;
  font-size: var(--font-size-normal);
  line-height: normal;
}
.popup-wrapper p em,
.popup-wrapper p i,
.popup-wrapper p b,
.popup-wrapper p u {
  color: var(--color-selection);
}
.popup-wrapper .split {
  display: inline-block;
  width: 50%;
  margin: 0;
  padding: 0;
}
.popup-wrapper .split input {
  display: inline-block;
}
.popup-wrapper .left {
  text-align: left;
}
.popup-wrapper .left input {
  margin-left: 20px;
}
.popup-wrapper .right {
  text-align: right;
}
.popup-wrapper .right input {
  margin-right: 20px;
}
.popup-wrapper .center {
  text-align: center;
}
</style>
