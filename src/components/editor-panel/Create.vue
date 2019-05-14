<template>
  <div>
    <h2>Test</h2>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti ratione est velit?
      Similique et iste accusantium vitae aspernatur nihil incidunt eveniet ratione quidem.
      Earum hic provident a, praesentium error facilis!</p>
    <v-select
      :value="'Test 1'"
      :options="[{ value: 'Gaga', options: ['Test 1', 'Test 2', 'huhu'] }]"
    />

    <div class="property">
      <div>
        <input class="new-button" type="button" value="Test" />
      </div>
      <div>
        <input class="new-text" type="button" value="Test" />
      </div>
    </div>
    <div class="property">
      <div>
        <input class="new-joystick" type="button" value="Test" />
      </div>
      <div>
        <input class="new-dpad" type="button" value="Test" />
      </div>
    </div>
    <div class="property">
      <div>
        <input class="new-swipe" type="button" value="Test" />
      </div>
      <div>
        <input class="new-touch" type="button" value="Test" />
      </div>
    </div>
    <div class="property">
      <div>
        <label for="xyz">testlabel</label>
      </div>
      <div>
        <v-select
          :value="'Test 1'"
          :options="[{ value: 'Gaga', options: ['Test 1', 'Test 2'] }]"
        />
      </div>
    </div>
    <div class="property">
      <div>
        <label for="xyz">testlabel</label>
      </div>
      <div>
        <v-select
          :value="'Test 1'"
          :options="[{ value: 'Gaga', options: ['Test 1', 'Test 2'] }]"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'editor-panel-create',
};
</script>

<style scoped>
input[type="button"][class^="new-"] {
  width: calc(100% - 20px);
  height: 32px;
  max-height: 32px;
  font-size: 16px;
  background-size: auto 80%;
  background-position: left 4px center;
  background-repeat: no-repeat;
}
input[type="button"].new-button {
  background-image: url("../../assets/img/new-button.png");
}
input[type="button"].new-dpad {
  background-image: url("../../assets/img/new-dpad.png");
}
input[type="button"].new-joystick {
  background-image: url("../../assets/img/new-joystick.png");
}
input[type="button"].new-swipe {
  background-image: url("../../assets/img/new-swipe.png");
}
input[type="button"].new-text {
  background-image: url("../../assets/img/new-text.png");
}
input[type="button"].new-touch {
  background-image: url("../../assets/img/new-touch.png");
}
</style>
