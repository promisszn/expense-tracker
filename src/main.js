import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueCookies from "vue3-cookies";
import VueToast from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-sugar.css';
import "@/assets/styles/global.scss";

const app = createApp(App);

app.use(router);
router.app = app;

app.use(VueCookies);
app.use(VueToast);
app.mount("#app");
