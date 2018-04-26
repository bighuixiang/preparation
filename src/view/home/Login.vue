<template>
	<div class="content">
		
	</div>
</template>

<script>
import { mapGetters } from "vuex";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      isShowI18n: false,
      keywords: "", //搜索关键字
      form: {
        email: "",
        pwd: "",
        code: ""
      },
      bgImage: "",
      language:{},
      rules: {
        email: [
          {
            required: true,
            message: "请输入邮箱地址",
            trigger: "blur"
          },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        code: [
          {
            required: true,
            validator: this.emailIsTrue,
            trigger: ["blur"]
          }
        ],
        pwd: [
          {
            required: true,
            validator: this.validatePass,
            trigger: ["blur"]
          },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: ["blur", "change"]
          }
        ]
      }
    };
  },
  mounted() {
    let self = this;
    document.onkeydown = (e)=>{
      if(e.keyCode == 13 && self.submitForm){
        document.body.focus();
         self.submitForm('form');
      }
    }
  },
  computed: {
    // 使用对象展开运算符将 getters 混入 computed 对象中
    ...mapGetters([
      "getLoginFlag",
      "getNavList",
      "getUserInfo"
      // ...
    ])
  },
  methods: {
    ...mapActions([
      "increment", // 映射 this.increment() 为 this.$store.dispatch('increment')
      "decrement",
      "setloginflag",
      "setuserinfo"
    ]),
    sendImageCode() {
      let self = this;
      self.bgImage = self.API.captchaApi + "?index=" + Math.random();
    },
    submitForm(formName) {
      //提交按钮
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.postFromFn();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    emailIsTrue(rule, value, callback) {
      var self = this;
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else {
        if (self.form.email !== "") {
          callback();
        } else {
          callback(new Error("请先填写邮箱"));
        }
      }
    },
    validatePass(rule, value, callback) {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        callback();
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    goToUrl(url) {
      let self = this;
      self.$router.push({
        path: url
      });
    },
    postFromFn() {
      let self = this;
      self.$http
        .post(self.API.loginApi, {
          ...self.form
        })
        .then(
          response => {
            // 响应成功回调
            if (response.data.code == 0) {
              self.$message({
                type: "success",
                message: `登录成功`
              });
              self.setloginflag(true);
              setTimeout(() => {
                self.goToUrl("/home");
              }, 1000);
            } else {
              self.$message({
                type: "error",
                message: response.data.msg
              });
            }
          },
          response => {}
        );
    }
  }
};
</script>

<style lang="scss" scoped>
.content{
	
}
</style>