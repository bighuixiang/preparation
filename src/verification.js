//用户token
const token = window.localStorage.getItem('token')

//验证当前用户是否具备  访问当前操作的权限
async function checked(vm, callback, next) {
	//1.获取  token   2.获取签名  3.根据签名获取授权(第一次失败  重试第二次  不会有第三次)    4.跳转页面 

	try {
		await vm.$http.get(vm.API.sliderList).then(
			response => {
				// 响应成功回调
				console.log(response.data)
			},
			response => {}
		);
		 new Error("123");
//		await new Promise.reject("Testing static reject");
		await callback && callback(true);
	} catch(e) {
		callback && callback(false);
	}
}

export default(vm, callback) => {
	checked(vm, callback);
}