import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "faceCheck"
  },
  // get
  {
    path: "/faceCheck",
    name: "faceCheck",
    component: () =>
      import(
        /* webpackChunkName: "faceCheck" */ "@/views/faceCheck/faceCheck.vue"
      )
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach(to => {
  // window._query = { ...to.query };
});

export default router;
