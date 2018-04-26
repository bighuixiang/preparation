import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Router from './router'
import Store from './vuex/store'
import Vuex from 'vuex'
import Axios from 'axios'
import Verification from './verification'
//import NProgress from 'nprogress' //页面顶部进度条
//import './nprogress/nprogress.css'
import qs from 'qs'; //使用qs模块转换payload参数为formdata请求参数
import APIS from './api'

Vue.use(ElementUI)
Vue.use(Vuex)

//Vue.filter('timeToNow', filters.timeToNow);

Router.beforeEach((to, from, next) => {
	let vm = Router.app.$root
	let token = window.localStorage.getItem("token");
	//	if((token == '' || token == null) && to.path !== '/login')
	//		next('/login')
	//验证当前用户是否具备  访问当前路由的权限
	vm.verification(vm, (success) => {
		console.log("验证当前用户是否具备访问当前路由的权限")
		if(success) {
			next()
		} else {
			next("/login")
		}
	});
})

Router.afterEach(transition => {
	//	NProgress.done();
});
// 添加请求拦截器
Axios.interceptors.request.use(config => {
	// 在发送请求之前做些什么
	config.data = qs.stringify(config.data);
	return config;
}, error => {
	// 对请求错误做些什么
	if(error.response) {
		switch(error.response.status) {
			case 401:
				// 返回 401 清除token信息并跳转到登录页面
				Router.replace({
					path: '/login',
					query: {
						redirect: Router.currentRoute.fullPath
					}
				})
		}
	}
	return Promise.reject(error.response.data) // 返回接口返回的错误信息
});

// 添加响应拦截器
Axios.interceptors.response.use(function(response) {
	// 对响应数据做点什么
	return response;
}, function(error) {
	// 对响应错误做点什么
	return Promise.reject(error);
});

Vue.prototype.API = APIS;
Vue.prototype.$http = Axios;
Vue.prototype.verification = Verification;

new Vue({
	store: Store,
	router: Router,
	render: h => h(App)
}).$mount('#app');