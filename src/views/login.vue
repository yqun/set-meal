<template>
  <div class="comm-body" @touchmove.prevent>
    <div class="content" :style="contentstyle" ref="getfocus" @focusin="show()" @focusout="hide()">
      <!-- 手机登陆 -->
      <x-input type="tel" placeholder="请输入手机号码" keyboard="number" v-model="cellPhone" mask="99999999999">
        <i slot="label" class="iconfont icon-shouji"></i>
      </x-input>
      <x-input title="图片验证码" placeholder="请输入图片验证码" class="weui-vcode" :max='4' v-model="picverification" :show-clear="false">
        <i slot="label" class="iconfont icon-renzhengdunpaianquanbaozhangzhibao-xianxing"></i>
        <img slot="right"
             :src="imagesUrl"
             alt="" width="100"
             @click="changeImages()"
             style="border-radius:0px;display: block;"/>
      </x-input>
      <x-input title="手机验证码" placeholder="请输入手机验证码" class="weui-vcode" :max='max' v-model="Verification">
        <i slot="label" class="iconfont icon-icon--"></i>
        <x-button slot="right" type="primary" mini
                  style="background-color: #39bafc; border-radius: 20px;"
                  :disabled="disabledBool"
                  @click.native="getVerification()">
          {{btnText}}
        </x-button>
      </x-input>
      <!-- 登录按钮 -->
      <div class="login">
        <x-button type="primary" @click.native="getLoginMsg()"
                  style="background-color: #39bafc; border-radius: 20px;">
          登 录
        </x-button>
      </div>
    </div>
    <!-- toast信息提示 -->
    <toast v-model="showToast" type="text" :time="800" is-show-mask :text="toastVal" position="middle"></toast>
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
            console.log(res)
            const {state} = res.data
            const toAddress = this.$route.query.to? this.$route.query.to:'personal'

            if (state == true) {
              if (res.data.reload) {
                window.sessionStorage.setItem('token', res.data.token)
              }
              this.$router.push(`/${toAddress}`)
            } else {
              this.$vux.toast.text(res.data.error)
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
  background: #fff url("../assets/images/bj.jpg") no-repeat top/100%;
}
.content {
  position: absolute;
  left: 0;
  right: 0;
  box-sizing: border-box;
  padding: 0 20px;
}
.login {
  width: 100%;
  box-sizing: border-box;
  padding: 20px 10px;
}
div.vux-x-input.weui-cell /deep/ .weui-cell__hd {
  margin-right: 20px;
}
div.vux-x-input.weui-cell i {
  color: #39bafc;
  font-size: 20px;
}
div.vux-x-input.weui-cell.weui-vcode::before {
  border: none;
}
div.vux-x-input.weui-cell::after {
  content: "";
  position: absolute;
  bottom: 0;
  right: 15px;
  height: 1px;
  border-bottom: 1px solid #e1e1e1;
  left: 15px;
}
.vux-x-input.weui-cell /deep/ .weui-cell__bd {
  font-size: 14px;
}
</style>
