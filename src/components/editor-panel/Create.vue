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
        <input type="button" value="Test" />
      </div>
      <div>

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
