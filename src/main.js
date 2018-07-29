import Vue from 'vue';
import App from './App.vue';
import Store from './store';

Vue.config.productionTip = false;

new Vue({
  store: Store,
  render: h => h(App),
  mounted() {
    this.$nextTick(() => {
      const url = new URL(window.location.href);

      // Load controller from URL parameter
      this.$store.dispatch('loadController', url.searchParams.get('controller'));
    });
  },
}).$mount('#app');
