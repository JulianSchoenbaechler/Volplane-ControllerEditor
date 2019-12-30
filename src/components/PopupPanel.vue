<template>
  <transition name="fade">
    <!-- <popup v-if="removePopup" title="Delete View" @submit="remove">
      <p>
        Are you sure you want to remove the view <em>{{ tempView }}</em> with all its contents
        from the controller?
      </p>
      <div class="split right">
        <input type="button" value="No" @click="removePopup = false" />
      </div>
      <div class="split left">
        <input type="submit" value="Yes" v-autofocus />
      </div>
    </popup> -->
  </transition>
</template>

<script>
export default {
  name: 'popup-panel',
  props: {
    loadingText: {
      default: 'Loading...',
      type: String,
    },
  },
};
</script>
