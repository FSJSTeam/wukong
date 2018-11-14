import Vue from 'vue';
import index from './index';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import qs from 'qs'
Vue.use(ElementUI);

Vue.config.productionTip = false;

const service = axios.create({
  baseURL: '',           // api的base_url
  timeout: 60000, // 请求超时时间
  headers: {
    // 'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
  },
  transformRequest: data => qs.stringify(data)
 })
 Vue.prototype.$ajax = service
/* eslint-disable no-new */
new Vue({
  el: '#index',
  router,
  components: { index },
  template: '<index/>'
});
