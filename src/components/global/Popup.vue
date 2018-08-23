<template>
  <transition name="fade">
    <div class="popup-container full-screen">
      <div class="popup-wrapper">
        <h1>{{ title }}</h1>
        <form autocomplete="off" @submit.prevent="$emit('submit', $event.target.elements)">
          <slot>
            <!-- <label><input type="checkbox" name="checkbox" value="value">Text</label> -->
            <v-checkbox v-model="cb">Check</v-checkbox>
            <v-radio v-model="rb1" name="select" @change="changeSelect(1)">Select 1</v-radio>
            <v-radio v-model="rb2" name="select" @change="changeSelect(2)">Select 2</v-radio>
            <v-radio v-model="rb3" name="select" @change="changeSelect(3)">Select 3</v-radio>
            <input type="color" />
            <label>This is a label.</label>
            <input type="text" value="Hello" />
            <input type="number" value="5" />
            <textarea>Hello there</textarea>
            <v-select
              v-model="selection"
              :options="[
                {
                  value: 'Tests',
                  options: ['First Test','Second Test','Third Test']
                }
              ]"
            />
            <input type="button" value="Cancel" />
            <input type="submit" value="OK" />
          </slot>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ['title'],
  data() {
    return {
      cb: false,
      rb1: true,
      rb2: false,
      rb3: false,
      selection: 'gaga',
    };
  },
  methods: {
    changeSelect(n) {
      this.rb1 = n === 1;
      this.rb2 = n === 2;
      this.rb3 = n === 3;
    },
  },
};
</script>

<style>
.popup-container {
  color: #f8f8ec;
  background-color: #222125;
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
  color: #7a2f34;
  border-bottom: 1px solid #7a2f34;
}
.popup-wrapper form {
  flex: 0 1 auto;
  overflow: auto;
}
</style>
