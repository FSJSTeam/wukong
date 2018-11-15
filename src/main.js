import Vue from 'vue';
import index from './index';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueCookies from 'vue-cookie'
Vue.use(ElementUI);
Vue.use(VueCookies)
Vue.config.productionTip = false;

var ENV = 'dev'
var baseUrl = ENV == 'dev' ? '/api' : 'http://39.98.66.212/index.php/'
const service = axios.create({
  baseURL: baseUrl,           // api的base_url
  timeout: 60000, // 请求超时时间
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  },
  // transformRequest: data => qs.stringify(data)
 })
 Vue.prototype.$ajax = service
/* eslint-disable no-new */
new Vue({
  el: '#index',
  router,
  components: { index },
  template: '<index/>'
});
