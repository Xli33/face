import { createApp } from "vue";
import router from "./router";
// import store from "./store";

import { Toast, Loading, Button, Row, Col } from "vant";
import "vant/es/toast/style";
import "vant/es/loading/style";
import "vant/es/button/style";
import "vant/es/row/style";
import "vant/es/col/style";

import "./utils/http";
import App from "./App.vue";
import "@/styles/reset.less";

// 设置默认loading行为
Toast.setDefaultOptions("loading", { forbidClick: true, duration: 0 });
// 允许同时存在多个Toast
Toast.allowMultiple();

createApp(App)
  // .use(store)
  .use(router)
  .use(Toast)
  .use(Loading)
  .use(Button)
  .use(Row)
  .use(Col)
  .mount("#app");
