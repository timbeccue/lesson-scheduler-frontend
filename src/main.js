import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js"

// Import bootstrap instead of using cdn in index.html
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';

import "./assets/main.css";

const app = createApp(App)

app.use(router)
app.mount("#app");


