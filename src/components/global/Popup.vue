<template>
  <transition name="fade">
    <div class="popup-container full-screen">
      <div class="popup-wrapper">
        <h1>{{ title }}</h1>
        <form autocomplete="off" @submit.prevent="$emit('submit', $event.target.elements)">
          <slot>
            <label><input type="checkbox" name="checkbox" value="value">Text</label>
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
</style>
