import Vue from 'vue';
import App from './App.vue';
import Store from './store';

// Global components
import Popup from './components/global/Popup.vue';
import CheckBox from './components/global/CheckBox.vue';
import RadioButton from './components/global/RadioButton.vue';
import Select from './components/global/Select.vue';

/* eslint-disable */
import { library } from '@fortawesome/fontawesome-svg-core';

import {
  faSquare,
  faCircle,
} from '@fortawesome/free-regular-svg-icons';

import {
  faTimes,
  faBullseye,
  faAngleRight,
  faAngleLeft,
  faCheckSquare,
  faDotCircle,
  faSortDown,
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
/* eslint-enable */

// Adding font awesome icons to library
library.add(
  faTimes,
  faBullseye,
  faAngleRight,
  faAngleLeft,
  faSquare,
  faCheckSquare,
  faCircle,
  faDotCircle,
  faSortDown,
);

// Global components
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('popup', Popup);
Vue.component('v-checkbox', CheckBox);
Vue.component('v-radio', RadioButton);
Vue.component('v-select', Select);

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
