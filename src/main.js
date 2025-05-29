import { createApp } from "vue";
import "./styles/main.css";
import App from "./App.vue";
import { createPinia } from "pinia";

createApp(App).mount("#app");

const pinia = createPinia();
createApp(App).use(pinia).mount("#app");
