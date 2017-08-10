import Vue from 'vue';
import VueRouter from 'vue-router'; // 引用路由
import VueResource from 'vue-resource'; // 请求方法
import App from './App';
import goods from 'components/goods/goods'; // 注册组件goods
import ratings from 'components/ratings/ratings'; // 注册组件ratings
import seller from 'components/seller/seller'; // 注册组件seller

// 引用样式
import 'common/stylus/index.styl';

// 全局调用
Vue.use(VueRouter);
Vue.use(VueResource);

// 实例routes
const routes = [{
  path: '/',
  redirect: '/goods'
}, {
  path: '/goods',
  component: goods
}, {
  path: '/ratings',
  component: ratings
}, {
  path: '/seller',
  component: seller
}];

// 注册router
const router = new VueRouter({
  // 默认的类名
  linkActiveClass: 'active',
  routes
});

// 注册vue
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
});
