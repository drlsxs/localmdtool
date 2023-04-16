import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/main.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    redirect:'/dbconfig',
    children: [
      {
        path: 'dbconfig',
        name: 'dbconfig',
        component: () => import("@/views/homeview/dbconfig/"),
      },
      {
        path: 'dsconfig',
        name: 'dsconfig',
        component: () => import("@/views/homeview/dsconfig/"),
      },
      {
        path: 'storage',
        name: 'storage',
        component: () => import("@/views/homeview/storage/"),
      },
      {
        path: 'publish',
        name: 'publish',
        component: () => import("@/views/homeview/publish/"),
      },
      {
        path: 'setting',
        name: 'setting',
        component: () => import("@/views/setting/"),
      }
    ],
  },
]

const router = new VueRouter({
  routes,
  mode: "hash",
})

export default router
