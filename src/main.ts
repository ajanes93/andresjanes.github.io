import { createPinia } from "pinia";
import { ViteSSG } from "vite-ssg";

import App from "./App.vue";
import { useConsoleGreeting } from "./composables/useConsoleGreeting";
import "./index.css";

export const createApp = ViteSSG(
  App,
  {
    routes: [{ component: App, path: "/" }],
  },
  ({ app }) => {
    app.use(createPinia());
    useConsoleGreeting().print();
  }
);
