<template>
	<div>
	
	</div>

	
</template>

<script>
function setCookie(name, value, Days){  
    if(Days == null || Days == ''){  
        Days = 300;  
    }  
    var exp  = new Date();  
    exp.setTime(exp.getTime() + Days*24*60*60*1000);  
    document.cookie = name + "="+ escape (value) + "; path=/;expires=" + exp.toGMTString();  
    //document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();  
}  
  
/*get cookie*/  
function getCookie(name) {  
    var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");  
    if(arr=document.cookie.match(reg))  
        return unescape(arr[2]);   
    else   
        return null;   
}  
  
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'
export default {
  components: {},
  data() {
    return {
      checked: false,
      activeName: "first",
      activeChannelCategory: "1",
      activeHomeClassicList: "1",
      channelCategorys: [],
      channelCategoryList: {},
      sliderList: {},
      homeClassicList: {},
      homeClassicItems: {},
      homeClassicOtherItems: {},
      homePartnerList: {},
      bgImage:"",
      form:{
        email: "",
        pwd: "",
        code: "",
      },
      isCanClick:false,
      isLogin:false,
      userInfo:"",
    };
  },
  beforeCreate() {
    //创建虚拟dom前
  },
  created() {
    //创建虚拟dom后
  },
  beforeMount() {
    //页面加载前
  },
  mounted() {
    //页面加载完成回调
    var self=this;
    this.bgImage = this.API.captchaApi
    // if(this.getLoginFlag){
    //   this.isLogin = true;
    //   this.userInfo = this.getUserInfo
    // }
//  this.getPasswordBycookie();
//  this.getUserInfoFn();
    this.increment(0);
    this.getSliderList(); //轮播图
//  this.getHomeCategoryList(); //分类
//  this.getHomeClassicList(); //案例
//  this.getHomePartnerList(); //合作商
    document.onkeydown = (e)=>{
      if(e.keyCode == 13 && self.submitForm){
        document.body.focus();
         self.submitForm();
      }
    }
  },
  computed: {
    // 使用对象展开运算符将 getters 混入 computed 对象中
    ...mapGetters([
      'getNavList',
      "getLoginFlag",
      'getUserInfo',
      // ...
    ])
  },
  methods: {
    ...mapActions([
				'increment', // 映射 this.increment() 为 this.$store.dispatch('increment')
        'decrement',
				"setloginflag",
				'setuserinfo'
      ]),
      goToUrl(url) {
      let self = this;
      self.$router.push({
        path: url
      });
    },
    getSliderList() {
      //获取轮播数据
      let self = this;
      self.$http.get(self.API.sliderList).then(
        response => {
          // 响应成功回调
          if (response.data.status == 0) {
            self.sliderList = response.data.data;
            console.log('sliderList',self.sliderList);
            console.log('sliderList',typeof(self.sliderList[0].url)=='undefined');
          }
        },
        response => {}
      );
    },
    sendImageCode() {
      // 更换验证码图片
	  let self = this;
	  self.bgImage = self.API.captchaApi+"?index="+Math.random();
    },
    isCanClickFn(){
      var self = this;
      for(let key in this.form){
        if(this.form[key]==""){
          self.isCanClick = false;
          return
        }
      }
      self.isCanClick = true;
    },
    submitForm(formName) {
      //提交按钮
      let self = this;
      let reg = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
      );
      document.body.blur();
      for(let key in this.form){
        if(this.form[key]==""){
          self.$message({
            type: "error",
            message: `请将登陆信息填写完整`
          });
          return false;
        }
      }
      if (!reg.test(self.form.email)) {
        this.$alert("请填写正确邮箱", "邮箱格式错误", {
          confirmButtonText: "确定",
          closeOnClickModal:true
        });
          return false;
      }
      this.postFromFn();
    },
    postFromFn(){
        //登录
      let self = this;
      self.$http
        .post(self.API.loginApi, {
          ...self.form
        })
        .then(
          response => {
            // 响应成功回调
            if (response.data.status == 0) {
              self.$message({
                type: "success",
                message: `登录成功`
              });
              self.getUserInfoFn();
              self.setloginflag(true);
              self.getPasswordBycookie();
            }else{
              self.$message({
                type: "error",
                message: response.data.msg
              });
            }
          },
          response => {}
        );
    },
    getPasswordBycookie(){
        // 从cookie 中读取 账号密码
      var self = this;
      if(self.checked){
        console.log(1)
        setCookie('user',self.form.email,14);
        setCookie('pass',self.form.pwd,14);
      }
      self.form.email = getCookie('user');
      self.form.pwd = getCookie('pass');
    },
    getUserInfoFn(){
      let self = this;
      self.$http
        .get(self.API.userInfoApi, {
        })
        .then(
          response => {
            // 响应成功回调
            if (response.data.status == 0 && response.data.data.username != null ) {
              self.isLogin = true;
              self.userInfo = response.data.data;
              console.log("userInfo",self.userInfo)
              self.setuserinfo(response.data.data);
              self.setloginflag(true);
            }else{
              if(response.data.data.username != null){
                self.isLogin = false;
                self.$message({
                  type: "error",
                  message: response.data.msg
                });
              }
              
            }
          },
          response => {}
        );
    },
    getHomeCategoryList() {
      //获取优质分类
      let self = this;
      self.$http.get(self.API.homeCategoryList).then(
        response => {
          // 响应成功回调
          if (response.data.status == 0) {
            self.channelCategorys = response.data.data;
            self.activeChannelCategory = response.data.data[0].id + "";
            self.getHomeCategoryItems(response.data.data[0].id);
          }
        },
        response => {}
      );
    },
    getHomeCategoryItems(id) {
      //获取分类详情
      let self = this;
      self.$http
        .get(self.API.homeCategoryItems, {
          params: {
            pid: id
          }
        })
        .then(
          response => {
            // 响应成功回调
            if (response.data.status == 0) {
              self.channelCategoryList = response.data.data;
            }
          },
          response => {}
        );
    },
    getHomeClassicList(id) {
      //首页经典案例列表
      let self = this;
      self.$http
        .get(self.API.homeClassicList, {
          params: {}
        })
        .then(
          response => {
            // 响应成功回调
            if (response.data.status == 0) {
              self.homeClassicList = response.data.data;
              self.activeHomeClassicList = response.data.data[0].id + "";
              self.getHomeClassicOtherItems(response.data.data[0].id);
              console.log("getHomeClassicOtherItems", response.data.data[0].id);
            }
          },
          response => {}
        );
    },
    getHomeClassicOtherItems(id) {
      //首页经典案例详情2
      let self = this;
      self.$http
        .get(self.API.homeClassicOtherItems, {
          params: {
            categoryId: id
          }
        })
        .then(
          response => {
            // 响应成功回调
            if (response.data.status == 0) {
              self.homeClassicOtherItems = response.data.data;
              console.log(response.data.data);
            }
          },
          response => {}
        );
    },
    getHomeClassicItems(id) {
      //经典案例页面详情
      let self = this;
      self.$http
        .get(self.API.homeClassicItems, {
          params: {
            categoryId: id
          }
        })
        .then(
          response => {
            // 响应成功回调
            if (response.data.status == 0) {
              self.homeClassicItems = response.data.data;
              console.log(response.data.data);
            }
          },
          response => {}
        );
    },

    getHomePartnerList(id) {
      //首页经典案例列表
      let self = this;
      self.$http
        .get(self.API.homePartnerList, {
          params: {}
        })
        .then(
          response => {
            // 响应成功回调
            if (response.data.status == 0) {
              self.homePartnerList = response.data.data;
              console.log(response.data.data);
            }
          },
          response => {}
        );
    },
    handleClick(t, e) {
      this.getHomeCategoryItems(t.name);
    },
    handleClickHomeClassicList(t, e) {
      console.log(e.name);
      this.getHomeClassicOtherItems(t.name);
    }
  }
};
</script>

<style lang="scss">

</style>