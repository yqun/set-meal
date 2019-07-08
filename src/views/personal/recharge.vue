<template>
  <!-- 充值中心 -->
  <div>
    <!-- banner -->
    <div class="banner">
      <span class="back" @click="$router.go(-1)">
        <x-icon type="ios-arrow-left" size="29" fill="#fff" style="vertical-align: bottom"></x-icon>返回
      </span>
      <p>当前余额</p>
      <p><strong><span>￥</span>{{userInfo.f_remain_sum}}</strong></p>
      <p>当前账号: {{userInfo.f_nick_name_real}}</p>
    </div>
    <!-- 内容 -->
    <div class="content">
      <!-- 套餐 -->
      <h3>套餐选择</h3>
      <button-tab v-model="index">
        <button-tab-item class="mealchoose-item"
                         v-for="item in rechargelist"
                         :key="item.id">
          <span v-if="item.f_added_sum">赠送{{item.f_added_sum}}元</span>
          <p>充{{item.f_sum}}元 <i v-if="item.f_added_sum">赠{{item.f_added_sum}}元</i></p>
          <strong>￥{{item.f_sum}}</strong>
        </button-tab-item>
      </button-tab>
      <!-- 充值说明 -->
      <p class="state">充值说明：充值金额可以直接在平台消费抵用</p>
      <!-- 立即充值 -->
      <div>
        <x-button type="primary" class="btn" @click.native="nowrecharge()" style="background-color: #39bafc;">立即充值</x-button>
        <x-button link="/rechargeorder" style="background-color: #f8f8fa;">
          <!--<i class="iconfont icon-chongzhijilu" ></i>-->
          充值记录
        </x-button>
      </div>
    </div>
    <!-- 弹出信息 -->
    <toast v-model="toastShow" type="text" :text="toastMsg" width="15em" :time="1400"></toast>
  </div>
</template>

<script>
export default {
  name: "recharge",
  data () {
    return {
      token: '',
      swiperHeight: 0.5,
      userInfo: '',
      // tabButton
      index: 0, // 选择不同套餐 返回不同的值
      rechargelist: [], // 套餐情况
      toastShow: false,
      toastMsg: '',
      f_product_id: '',
    }
  },
  created() {
    this.judgeToken()
    this.getrecharge()
    this.getUserInfo()
  },
  methods: {
    // 判断token
    judgeToken() {
      this.token = window.sessionStorage.getItem('token');
    },
    // 获取用户信息
    getUserInfo() {
      this.$http
        .get(`${this.apiHost}member/weixin/getPersonalInfo.do?token=${this.token}`)
        .then(res => {
          const {state, member} = res.data
          if (state == true) {
            member.f_remain_sum = member.f_remain_sum.toFixed(2)
            this.userInfo = member
          }
        })
    },
    // 获取充值套餐
    getrecharge() {
      this.$http
        .get(`${this.apiHost}product/findProductByCondition.do?token=${this.token}&f_product_type=2`)
        .then(res => {
          const {state, rows} = res.data
          if (state == true) {
            this.rechargelist = rows
          }
        })
    },
    // 立即充值
    nowrecharge() {
      this.f_product_id = this.rechargelist[this.index].id
      // console.log(this.f_product_id)
      // 跳转地址
      this.$http.get(`${this.apiHost}weChatPay/generateOrder.do?token=${this.token}&f_product_id=${this.f_product_id}`)
        .then(res => {
          this.orderId = res.data.orderId
          const that = this;
          // 充值说明：充值费用只限于充电，不能退回!

          wx.config({
            debug: false,
            appId: res.data.appId,
            timestamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.signature,
            jsApiList: ["chooseWXPay"]
          });
          this.$vux.confirm.show({
            title: '充值说明',
            content: '充值费用只限于充电，不能退回!',
            showCancelButton: false,
            // 组件除show外的属性
            onConfirm : () => {
              wx.chooseWXPay({
                timestamp: res.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                nonceStr: res.data.nonceStr, // 支付签名随机串，不长于 32 位
                package: res.data.package1, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                paySign: res.data.paySign, // 支付签名
                success: function (res) {
                  // 支付成功后的回调函数
                  this.getUserInfo()
                  // if (res.errMsg == "chooseWXPay:ok") {
                  //   alert("支付成功！");
                  // } else {
                  //   alert("支付失败" + res.errMsg);
                  // }
                },
                fail: function (res) {
                  that.$http.get(`${that.apiHost}weChatPay/delOrderById.do?token=${that.token}&orderId=${that.orderId}`)
                },
                cancel: function (res) {
                  //支付取消
                  alert('支付取消');
                  that.$http.get(`${that.apiHost}weChatPay/delOrderById.do?token=${that.token}&orderId=${that.orderId}`)
                }
              });
            }
          })

        })
        .catch(err => {
          alert(err)
        })
    }
  }
}
</script>

<style scoped>
.banner {
  width: 100%;
  height: 200px;
  text-align: center;
  color: #fff;
  box-sizing: border-box;
  padding-top: 40px;
  background: -webkit-linear-gradient(#38d6fd, #39adf6); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(#38d6fd, #39adf6); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(#38d6fd, #39adf6); /* Firefox 3.6 - 15 */
  background: linear-gradient(#38d6fd, #39adf6); /* 标准的语法 */
  position: relative;
}
.banner strong {
  font-size: 48px;
}
.banner strong span {
  font-size: 30px;
}
.banner .back {
  font-size: 20px;
  position: absolute;
  left: 8px;
  top: 12px;
  line-height: 27px;
}
h3 {
  padding: 10px 10px;
  margin: 0 10px;
  font-weight: 400;
  position: relative;
}
h3:before {
  content: '';
  width: 3px;
  height: 18px;
  background-color: #01AAED;
  position: absolute;
  left: 0;
  top: 16px;
}
.content {
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
}
/* 按钮 */
.state {
  padding: 5px 10px;
  font-size: 14px;
  background-color: #f3f8fe;
  margin: 20px 0;
  color: #ccc;
}
.weui-btn + .weui-btn {
  margin: 15px 0;
}
/* tab */
.vux-button-group {
  flex-wrap: wrap;
}
.vux-button-group a {
  line-height: normal;
  padding: 18px 0;
  border-radius: 5px !important;
  height: 100%;
  box-sizing: border-box;
  background-color: transparent;
  border: 1px solid #39bafc;
  margin: 5px 5px;
  color: #666;
}
.vux-button-group > a.vux-button-tab-item:after {
  position: relative !important;
  border: none;
}
.vux-button-group > a.vux-button-group-current {
  background: -webkit-linear-gradient(#38d6fd, #39adf6); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(#38d6fd, #39adf6); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(#38d6fd, #39adf6); /* Firefox 3.6 - 15 */
  background: linear-gradient(#38d6fd, #39adf6); /* 标准的语法 */
}
.vux-button-group > a.vux-button-group-current p,
.vux-button-group > a.vux-button-group-current strong {
  color: #fff;
}
.mealchoose-item span {
  display: block;
  position: absolute;
  left: -1px;
  top: -1px;
  font-size: 10px;
  padding: 0 4px;
  background-color: #39bafc;
  color: #fff;
  border-top-left-radius: 5px;
}
.mealchoose-item p {
  font-size: 14px;
}
.mealchoose-item p i {
  font-style: normal;
}
.mealchoose-item strong {
  font-size: 18px;
  font-weight: 400;
}
</style>
