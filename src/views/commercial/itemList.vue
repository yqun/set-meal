<template>
  <div @touchmove.prevent>
    <!-- 返回导航 -->
    <comm-admin go="commercial"></comm-admin>
    <div class="item">
      <ul>
        <li>
          <i class="iconfont icon-28"></i>
          <!--<p>{{balance}}</p>-->
        </li>
        <li @click="$router.push('/dailyReport')">
          <i class="iconfont icon-ribao"></i>
          <p>日报</p>
        </li>
        <li @click="$router.push('/monthlyReport')">
          <i class="iconfont icon-yuebao"></i>
          <p>月报</p>
        </li>
        
        <li style="background-color: #efefef;"><!-- @click="getMoney()" -->
          <i class="iconfont icon-tixian"></i>
          <p>提现</p>
        </li>
        <li @click="$router.push('/orderForm')">
          <i class="iconfont icon-daohang"></i>
          <p>订单</p>
        </li>
        <li>
          <i class="iconfont icon-chatou"></i>
          <p>设备</p>
        </li>
      </ul>
    </div>
    <!-- 信息提示框 -->
    <toast :text="toastMsg" v-model="toastShow" type="text"></toast>
  </div>
</template>

<script>
export default {
  name: "itemList",
  data() {
    return {
      token: '',
      balance: '',
      toastShow: false,
      toastMsg: '',
    }
  },
  created () {
    this.judgeToken()
    this.getBalance()
  },
  methods: {
    // 判断token
    judgeToken() {
      this.token = window.sessionStorage.getItem('token');
    },
    // 获取余额
    getBalance () {
      this.$http
        .get(`${this.apiHost}member/weixin/wxFindCashSum.do?token=${this.token}`)
        .then(res => {
          const {sum} = res.data
          this.balance = (sum * 1).toFixed(2)
        })
    },
    // 提现
    getMoney () {
      // payMoney,payKind 参数 payKind=3 || 4  退款是 3  提现是 4
      this.$http.get(`${this.apiHost}weChatPay/businessPay.do?token=${this.token}&payKind=4`)
        .then(res => {
          // console.log(this.userInfo.f_remain_sum)
          const {resultCode, resultMessage} = res.data
          this.toastShow = true
          this.toastMsg = resultMessage
          this.getBalance();
        })
    }
  }
}
</script>

<style scoped>
.item {
  width: 100%;
}
.item ul {
  width: 100%;
}
.item ul li {
  list-style: none;
  float: left;
  width: 33.33%;
  height: 6em;
  box-sizing: border-box;
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  text-align: center;
  padding-top: 10px;
  background: #fff;
}
.item ul li:nth-child(3n) {
  border-right: none;
}
.item ul li i {
  font-size: 26px;
  color: #01AAED;
}
</style>
