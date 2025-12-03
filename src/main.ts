import { createApp } from 'vue'
import { createPinia } from "pinia"
import App from './App.vue'
import router from './router'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import apiPlugin from './api/index'
import VueGtag from 'vue-gtag-next'

// Vuetify imports
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)


// Global styles & icons
import './assets/styles/global.css'
import './assets/styles/custom.css'
import '@mdi/font/css/materialdesignicons.css'


// Create Vuetify instance
const vuetify = createVuetify({
  components: {
    ...components,
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})

const google_tag = import.meta.env.VITE_GOOGLE_ANALYTICS_ID as string

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(VueGtag, {
  property: {
    id: google_tag,
  },
  router, 
})
app.use(vuetify)
app.use(apiPlugin)
// app.use(VCalendar, {})
// app.mount('#app')


// Wait until window finishes loading
window.addEventListener("load", () => {
  // remove static loader
  const loader = document.getElementById("app-loader");
  if (loader) loader.style.display = "hidden";

  app.mount("#app");
});
