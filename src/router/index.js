import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	routes: [{
		path: '/',
		name: 'Home',
		component: resolve => require(['../view/Home.vue'], resolve),
		children: [{
			path: '/',
			component: resolve => require(['../view/Home/Index.vue'], resolve),
			name: '首页'
		}]
	}, {
		path: '/signup',
		name: 'signUp',
		component: resolve => require(['../view/Home/signUp.vue'], resolve)
	}, {
		path: '/login',
		name: 'Login',
		component: resolve => require(['../view/Home/Login.vue'], resolve)
	},{
		path: '/resetpwd',
		name: 'reSetPwd',
		component: resolve => require(['../view/Home/reSetPwd.vue'], resolve)
	}, {
		path: '*',
		name: 'Home',
		component: resolve => require(['../view/Home.vue'], resolve),
		children: [{
			path: '/',
			component: resolve => require(['../view/Home/Index.vue'], resolve),
			name: '首页'
		}]
	}]
})