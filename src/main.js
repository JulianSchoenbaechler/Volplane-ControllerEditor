import Vue from 'vue';
import App from './App.vue';
import Store from './store';

// Global components
import Popup from './components/global/Popup.vue';
import CheckBox from './components/global/CheckBox.vue';
import RadioButton from './components/global/RadioButton.vue';
import Select from './components/global/Select.vue';
import ColorSelect from './components/global/ColorSelect.vue';

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
  faPlus,
  faSearchMinus,
  faSearchPlus,
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
  faPlus,
  faSearchMinus,
  faSearchPlus,
);

// Global components
Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.component('popup', Popup);
Vue.component('v-checkbox', CheckBox);
Vue.component('v-radio', RadioButton);
Vue.component('v-select', Select);
Vue.component('v-color', ColorSelect);

// Global directives
Vue.directive('autofocus', {
  // Autofocus for input elements
  inserted: (el) => {
    el.focus();
  },
});

Vue.config.productionTip = false;

new Vue({
  store: Store,
  render: h => h(App),
  mounted() {
    this.$nextTick(() => {
      const url = new URL(window.location.href);

      document.onkeydown = (e) => {
        if (e == null) { return; }

        if ((e.ctrlKey || e.metaKey) && (e.keyCode === 90)) {
          this.$store.dispatch('history/undo');
        } else if ((e.ctrlKey || e.metaKey) && (e.keyCode === 89)) {
          this.$store.dispatch('history/redo');
        }
      };

      // Load controller from URL parameter
      this.$store.dispatch('loadController', url.searchParams.get('controller'));
    });
  },
}).$mount('#app');
