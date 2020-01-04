<template>
  <section id="ce-canvas">
    <tabs />
    <workspace />
  </section>
</template>

<script>
import Tabs from './editor-canvas/Tabs.vue';
import Workspace from './editor-canvas/Workspace.vue';

export default {
  name: 'EditorCanvas',
  components: {
    Tabs,
    Workspace,
  },
};
</script>

<style>
</style>
