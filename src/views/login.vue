<template>
  <div class="comm-body" @touchmove.prevent>
    <div>
      <!-- 手机登陆 -->
      <x-input title="手机号码"
               name="mobile"
               placeholder="请输入手机号码"
               keyboard="number"
               v-model="cellPhone"
               mask="99999999999">
      </x-input>
      <x-input title="发送验证码" class="weui-vcode" :max='max' v-model="Verification">
        <x-button slot="right"
                  type="primary"
                  mini
                  :disabled="disabledBool"
                  @click.native="getVerification()">{{btnText}}</x-button>
      </x-input>
      <!-- 登录按钮 -->
      <div class="login">
        <x-button type="primary" @click.native="getLoginMsg()">确认登陆</x-button>
      </div>
      <!-- toast信息提示 -->
      <toast v-model="showToast" type="text" :time="800" is-show-mask :text="toastVal" position="middle"></toast>
    </div>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      token: '',
      max: 6,
      cellPhone: '', // 输入的电话号码
      Verification: '', // 输入的验证码
      btnText: '发送验证码', // 发送验证码按钮文本
      disabledBool: false, // 验证码禁用
      toastVal: '', //toast提示信息
      showToast: false, // toast提示框显示隐藏
    }
  },
  created() {
    this.judgeToken();
  },
  methods: {
    // 判断token
    judgeToken() {
      this.token = window.sessionStorage.getItem('token');
    },
    // 获取验证码
    getVerification() {
      if (!(/^1[0-9]{10}$/.test(this.cellPhone))) {
        this.toastVal = '请填写正确的手机号'
        this.showToast = true
      } else {
        this.$http
          .get(`${this.apiHost}member/weixin/generateMobileIdentifiedCode.do?token=${this.token}`)
          .then(res => {
            // 60秒时间倒计时
            this.btnText = 60;
            this.disabledBool = true;
            const timer = setInterval(res => {
              this.btnText--;
              if (this.btnText == 0) {
                clearInterval(timer)
                this.btnText = '发送验证码';
                this.disabledBool = false
              }
            }, 1000)
            const {code} = res.data
            this.Verification = code
          })
      }
    },
    getLoginMsg() {
      if (!(/^1[0-9]{10}$/.test(this.cellPhone))) {
        this.toastVal = '手机号错误'
        this.showToast = true
      } else if (this.Verification == '' || this.Verification.length !== 6) {
        this.toastVal = '验证码错误'
        this.showToast = true
      } else {
        this.$http
          .get(`${this.apiHost}member/weixin/authenticMember.do?token=${this.token}&f_phone_num=${this.cellPhone}&code=${this.Verification}`)
          .then(res => {
            const {state} = res.data
            if (state == true) {
              this.$router.push('/personal')
            } else {
              this.toastVal = res.data.error
              this.showToast = true
            }
          })
      }//end if
    }
  }
}
</script>

<style scoped>
.comm-body {
  width: 100%;
  height: 100%;
  background: url("../assets/images/bj.jpg") center;
}
.comm-body > div {
  height: 100%;
  background: rgba(0,0,0,0.5);
  box-sizing: border-box;
  padding: 240px 0 0;
}
.login {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 10px;
}
div.vux-x-input.weui-cell {
  color: #fff !important;
}
div.vux-x-input.weui-cell.weui-vcode::after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-top: 1px solid #D9D9D9;
  color: #D9D9D9;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  left: 15px;
}
</style>
