<template>
  <div class="comm-body" @touchmove.prevent>
    <!--<img src="../assets/images/bj.jpg" alt="">-->
    <div>
      <div class="content" :style="contentstyle" ref="getfocus" @focusin="show()" @focusout="hide()">
        <!-- 手机登陆 -->
        <x-input title="手机号码" name="mobile" type="tel" placeholder="请输入手机号码" keyboard="number" v-model="cellPhone" mask="99999999999"></x-input>
        <x-input title="图片验证码" placeholder="请输入图片验证码" class="weui-vcode" :max='4' v-model="picverification" :show-clear="false">
          <img slot="right"
               :src="imagesUrl"
               alt="" width="100"
               @click="changeImages()"
               style="border-radius:10px;display: block;"/>
        </x-input>
        <x-input title="手机验证码" placeholder="请输入手机验证码" class="weui-vcode" :max='max' v-model="Verification" style="top: -2px;">
          <x-button slot="right" type="primary" mini :disabled="disabledBool" @click.native="getVerification()">{{btnText}}</x-button>
        </x-input>
        <!-- 登录按钮 -->
        <div class="login">
          <x-button type="primary" @click.native="getLoginMsg()">确认登陆</x-button>
        </div>
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
      picverification: '', //图片验证码
      imagesUrl: '', //验证码图片
      toastVal: '', //toast提示信息
      showToast: false, // toast提示框显示隐藏
      contentstyle: {
        bottom: '200px',
      },
      oHeight: document.documentElement.clientHeight,
    }
  },
  created() {
    // console.log(window)
    this.judgeToken();
    this.changeImages();
  },
  mounted () {
    // 监听屏幕变化
    window.onresize = ()=>{
      if (this.oHeight - document.documentElement.clientHeight > 100) {
        this.contentstyle.bottom = 0;
      } else {
        this.contentstyle.bottom = '200px';
      }
    }
  },
  methods: {
    // ios 焦点事件
    show () {
      const u = navigator.userAgent, app = navigator.appVersion;
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
      if (isiOS) {
        this.contentstyle.bottom = '200px';
      }
    },
    hide() {
      const u = navigator.userAgent, app = navigator.appVersion;
      const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
      if (isiOS) {
        this.contentstyle.bottom = '200px';
      }
    },
    // 判断token
    judgeToken() {
      this.token = window.sessionStorage.getItem('token');
    },
    // 获取图片
    changeImages () {
      const f_random = Math.floor(Math.random()*99999999999)
      this.imagesUrl = `${this.apiHost}member/weixin/wxGetValidateCode.do?token=${this.token}&f_random=${f_random}`
    },
    // 获取验证码
    getVerification() {
      if (!(/^1[0-9]{10}$/.test(this.cellPhone)) || this.picverification.trim().length !== 4) {
        this.toastVal = '请填写正确的手机号和验证码'
        this.showToast = true
      } else {
        this.$http
          .get(`${this.apiHost}member/weixin/generateMobileIdentifiedCode.do?token=${this.token}&f_phone_num=${this.cellPhone}&f_img_code=${this.picverification}`)
          .then(res => {
            // console.log(res)
            const {state} = res.data
            if (state != true) {
              const {error} = res.data
              this.toastVal = '图片验证码错误'
              this.showToast = true
              return false;
            }
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
          })
      }
    },
    // 确认登陆
    getLoginMsg() {
      if (!(/^1[0-9]{10}$/.test(this.cellPhone))) {
        this.toastVal = '手机号错误'
        this.showToast = true
      } else if (this.picverification.trim() == '' || this.picverification.trim().length !== 4) {
        this.toastVal = '图片验证码错误'
        this.showToast = true
      } else if (this.Verification.trim() == '' || this.Verification.trim().length !== 6) {
        this.toastVal = '手机号验证码错误'
        this.showToast = true
      } else {
        this.$http
          .get(`${this.apiHost}member/weixin/authenticMember.do?token=${this.token}&f_phone_num=${this.cellPhone}&code=${this.Verification}&f_img_code=${this.picverification}`)
          .then(res => {
            const {state} = res.data
            const toAddress = this.$route.query.to
            if (state == true) {
              this.$router.push(`/${toAddress}`)
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
  background-color: black;
  background:black url("../assets/images/bj.jpg") no-repeat top;
}
/*.comm-body > img {*/
  /*height: 700px;*/
/*}*/
.comm-body > div {
  height: 100%;
  width: 100%;
  background: rgba(0,0,0,0.5);
  box-sizing: border-box;
}
.content {
  position: absolute;
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
