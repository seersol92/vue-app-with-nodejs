import Vue from 'vue'
import Vuetify from 'vuetify';
import VueRouter from 'vue-router';
import { routes } from './routes'
import App from './App.vue'
import store from './store/store'
import { sync } from 'vuex-router-sync'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(VueRouter);
Vue.use(Vuetify);

const router = new VueRouter({
  routes,
  mode: 'history'
});

Vue.config.productionTip = false
sync(store, router)

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.getters.loggedIn) {
      next({
        name: 'login',
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.requiresVisitor)) {
    if (store.getters.loggedIn) {
      next({
        name: 'home',
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
}).$mount('#app')
