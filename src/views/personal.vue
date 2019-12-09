<template>
  <div>
    <!-- banner -->
    <div class="banner">
      <span class="back" @click="$router.replace('/home')">
        <x-icon type="ios-arrow-left" size="29" fill="#fff" style="vertical-align: bottom"></x-icon>返回
      </span>
      <div class="user_header">
        <img :src="url" v-if="this.url != '0'">
        <i class="iconfont icon-morentouxiang" v-else-if="this.url == '0'"></i>
      </div>
      <div>
        {{userInfo.f_phone_num}}
      </div>
    </div>
    <!-- 钱包余额 -->
    <div class="wallet">
      <div>
        <div class="balance">
          <p>钱包余额</p>
          <p style="color: orange">{{userInfo.f_remain_sum}}</p>
        </div>
        <div class="recharge_btn">
          <x-button mini style="background-color: #39bafc;color: #fff;"
                    @click.native="$router.push('/recharge')">充值</x-button>
        </div>
      </div>
    </div>
    <group :gutter="10">
      <cell v-if="false" title="我的卡包" link="/bankcard">
        <i slot="icon" class="cell_icon iconfont icon-qiabao"></i>
      </cell>
      <cell v-if="false" title="退款" is-link @click.native="conshow = true">
        <i slot="icon" class="cell_icon iconfont icon-tuikuanguanli"></i>
      </cell>
      <cell v-if="false" title="附近设备" link="/nearby">
        <i slot="icon" class="cell_icon iconfont icon-shebei"></i>
      </cell>
      <cell title="消费记录" is-link @click.native="expense()">
        <i slot="icon" class="cell_icon iconfont icon-jilu"></i>
      </cell>
      <cell v-if="charger" title="商户入口" is-link @click.native="commercial()">
        <i slot="icon" class="cell_icon iconfont icon-qiabao"></i>
      </cell>
      <cell v-if="false" title="我的收藏" link="">
        <i slot="icon" class="cell_icon iconfont icon-tuikuanguanli"></i>
      </cell> <!-- /enshrine -->
      <cell title="更换绑定手机号" link="/login">
        <i slot="icon" class="cell_icon iconfont icon-shebei"></i>
      </cell> <!-- /enshrine -->
      <cell v-if="false" title="投资加盟">
        <i slot="icon" class="cell_icon iconfont icon-tuikuanguanli"></i>
      </cell>
    </group>
    <!-- 退款弹窗 -->
    <confirm v-model="conshow" content="是否确认退款" @on-confirm="cononConfirm()"></confirm>
    <!-- 弹框信息 -->
    <toast v-model="showPositionValue" type="text" :time="1000" :text="massage" position="middle" width="14em"></toast>
  </div>
</template>

<script>
import { Blur } from 'vux'
export default {
  name: "personal",
  components: {
    Blur
  },
  data () {
    return {
      token: '',
      openId: '',
      f_random_num: '',
      f_sn_num: '',
      images: [
        {url:'1',content:'充值中心'},
        {url:'1',content:'我的卡包'},
        {url:'1',content:'正在使用'},
      ],
      url: '',
      userInfo: {},
      toastShowMonery: false,
      massage: '',
      showPositionValue: false,
      conshow: false,
      charger: false,
    }
  },
  created() {
    this.handleToken();
  },
  methods: {
    // 点击消费记录
    expense() {
      this.$http.get(`${this.apiHost}member/weixin/findMemberByToken.do?token=${this.token}`)
        .then(res => {
          const {state} = res.data
          if (state == true) {
            this.$router.push('/expense')
          } else {
            this.$router.push('/login');
          }
        })
    },
    // 点击商户中心
    commercial() {
      this.$http
        .get(`${this.apiHost}member/weixin/checkAuthen.do?token=${this.token}`)
        .then(res => {
          const {state} = res.data
          if (state == true) {
            this.$router.push('/commercial')
          } else {
            const {error} = res.data
            this.massage = error
            this.showPositionValue = true
          }
        })
    },
    // 获取token
    handleToken() {
      const token = window.sessionStorage.getItem('token')
      if (token == 'undefinde' || token == null) {
        this.openId = this.$route.query.openId
        this.$http
          .get(this.apiHost + `member/getToken.do?openId=${this.openId}`)
          .then(res => {
            const {data} = res;
            this.token = data.token;
            // 把token设置在sessionStorage中
            window.sessionStorage.setItem('token', data.token);
            // 获取token
            this.getuserInfo()
          })
      } else {
        this.token = token
        // 获取token
        this.getuserInfo()
      }
    },
    // 获取用户信息
    getuserInfo () {
      this.$http.get(this.apiHost + `member/weixin/getPersonalInfo.do?token=${this.token}`)
        .then(res => {
          console.log(res)
          const {member, charger} = res.data
          this.charger = charger
          member.f_remain_sum = member.f_remain_sum.toFixed(2)
          this.userInfo = member
          if (member.f_head_portrait == '') {
            this.url = '0'
          } else {
            this.url = member.f_head_portrait
          }
        })
    },
    // 提现
    cononConfirm () {
      // payMoney,payKind 参数 payKind=3 || 4  退款是 3  提现是 4
      this.$http.get(`${this.apiHost}weChatPay/businessPay.do?token=${this.token}&payKind=3`)
        .then(res => {
          // console.log(this.userInfo.f_remain_sum)
          const {resultCode, resultMessage} = res.data
          this.showPositionValue = true
          this.massage = resultMessage
          this.getuserInfo();
        })
    },
  }
}
</script>

<style scoped>
/* banner */
.banner {
  width: 100%;
  height: 180px;
  text-align: center;
  color: #fff;
  box-sizing: border-box;
  padding-top: 30px;
  background: -webkit-linear-gradient(#38d6fd, #39adf6); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(#38d6fd, #39adf6); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(#38d6fd, #39adf6); /* Firefox 3.6 - 15 */
  background: linear-gradient(#38d6fd, #39adf6); /* 标准的语法 */
  position: relative;
}
.banner .back {
  font-size: 20px;
  position: absolute;
  left: 8px;
  top: 12px;
  line-height: 27px;
}
.user_header i {
  font-size: 50px;
}
.user_header img {
  width: 60px;
  height: 60px;
  border-radius: 100px;
  overflow: hidden;
}
/* 钱包 */
.wallet {
  padding: 0 30px;
  margin-top: -40px;
  position: relative;
  z-index: 10;
}
.wallet > div {
  height: 80px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 1px 2px 4px 0px rgba(207,227,228,1);
  box-sizing: border-box;
  padding: 0 40px;
}
.wallet > div .balance {
  float: left;
  /*width: 50%;*/
  padding-top: 15px;
}
.wallet > div .recharge_btn {
  float: right;
  text-align: center;
  /*width: 50%;*/
  line-height: 80px;
}
.wallet > div .recharge_btn button {
  font-size: 16px;
}
.weui-btn {
  border-radius: 20px;
}
/* cell */
/deep/ .weui-cells {
  font-size: 16px;
}
/* iconfont */
/deep/ .weui-cell__hd {
  padding-right: 10px;
}
.cell_icon {
  font-size: 20px;
  color: #39bafc;
  position: relative;
  top: 1px;
}

</style>
