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
        company: "",
        contactName: "",
        contactPhone: "",
        pwd: "",
        confirmPwd: "",
        code: "",
        type: []
      },
      rules: {
        email: [
         { required: true, message: '请输入邮箱地址', trigger: 'blur' },
         { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        company: [
          { required: true, message: "请填写公司名称", trigger: "change" }
        ],
        contactName: [
          { required: true, message: "请填写联系人名称", trigger: "change" }
        ],
        contactPhone: [
          { required: true, message: "填写正确电话", trigger: "change" }
        ],
        code: [
          { required: true, validator: this.emailIsTrue, trigger: "blur" }
        ],
        pwd: [
          { required: true, validator: this.validatePass, trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        confirmPwd: [
          { required: true, validator: this.validatePass2, trigger: "blur" }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请阅读并同意协议",
            trigger: "change"
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
      "getNavList",
      "getUserInfo"
      // ...
    ])
  },
  methods: {
    ...mapActions([
      "increment", // 映射 this.increment() 为 this.$store.dispatch('increment')
      "decrement",
      "setuserinfo"
    ]),
    sendEmailCode() {
      let self = this;
      var reg = new RegExp(
        "^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"
      );
      if (!reg.test(self.form.email)) {
        this.$alert("请填写正确邮箱", "未发送成功", {
          confirmButtonText: "确定",
          closeOnClickModal:true
        });
      } else {
        self.$http
          .get(self.API.emailApi, {
            params: {
              email: self.form.email
            }
          })
          .then(
            response => {
              // 响应成功回调
              if (response.data.code == 0) {
                self.$message({
                  type: "success",
                  message: `验证码成功发送至>>>${self.form.email}`
                });
                console.log(response.data);
              }else{
                this.$alert(response.data.msg, "未发送成功", {
                  confirmButtonText: "确定",
                  closeOnClickModal:true
                });
              }
            },
            response => {}
          );
      }
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
      var self =this;
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
        if (this.rules.confirmPwd !== "") {
          this.$refs.form.validateField("confirmPwd");
        }
        callback();
      }
    },
    validatePass2(rule, value, callback) {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.pwd) {
        callback(new Error("两次输入密码不一致!"));
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
        .post(self.API.signUpApi, {
          ...self.form
        })
        .then(
          response => {
            // 响应成功回调
            if (response.data.code == 0) {
              self.$message({
                  type: "success",
                  message: `注册成功`
                });
                setTimeout(() => {
                  self.goToUrl('/home')
                }, 2000);
              console.log(response.data);
            }
          },
          response => {}
        );
    }
  }
};
</script>

<style lang="scss">

</style>