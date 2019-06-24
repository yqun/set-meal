<template>
  <div>
    <div class="banner">
      <span class="back" @click="$router.go(-1)">
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
    <div class="wallet">
      <div>

      </div>
    </div>
    <!-- 头像 -->
    <!--<div class="user" >-->
      <!--<div class="center clearfix">-->
        <!--<div class="userheader">-->
          <!--<img :src="url" v-if="this.url != '0'">-->
          <!--<i class="iconfont icon-morentouxiang" v-else-if="this.url == '0'"></i>-->
        <!--</div>-->
        <!--<div class="userinfo">-->
          <!--<span>{{userInfo.f_nick_name_real || '用户名为空'}}</span>-->
          <!--<span>{{userInfo.f_phone_num}}</span>-->
          <!--<span>账户余额 <strong>{{userInfo.f_remain_sum}}</strong> 元</span>-->
        <!--</div>-->
      <!--</div>-->
    <!--</div>-->
    <!-- 选项 -->
    <flexbox>
      <flexbox-item class="optionitem">
        <div @click="$router.push('/recharge')">
          <i class="iconfont icon-chongzhi"></i>
          <p>充值中心</p>
        </div>
      </flexbox-item>
      <flexbox-item class="optionitem">
        <div @click="$router.push('/bankcard')">
          <i class="iconfont icon-yinhangqia2"></i>
          <p>我的卡包</p>
        </div>
      </flexbox-item>
      <flexbox-item class="optionitem">
        <div @click="conshow = true">
          <i class="iconfont icon-icon-test"></i>
          <p>退款</p>
        </div>
      </flexbox-item>
    </flexbox>
    <group gutter="8px">
      <cell title="附近设备" link="/nearby"></cell>
      <cell title="消费记录" is-link @click.native="expense()"></cell>
      <cell title="商户入口" is-link @click.native="commercial()"></cell>
      <cell title="我的收藏" link=""></cell> <!-- /enshrine -->
      <cell title="更换绑定手机号" link="/login"></cell> <!-- /enshrine -->
      <cell title="投资加盟"></cell>
    </group>
    <group title="">
      <cell title="返回首页" @click.native="$router.push('/home')"></cell>
    </group>
    <!-- 退款弹窗 -->
    <confirm v-model="conshow"
             content="是否确认退款"
             @on-confirm="cononConfirm()">
    </confirm>
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
          const {member} = res.data
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
  left: 12px;
  top: 12px;
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
  position: relative;
  top: -40px;
  z-index: 10;
}
.wallet > div {
  height: 80px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 2px 2px 3px 0 rgba(207,227,228,1);
}

.optionitem {
  text-align: center;
  padding-top: 18px;
}
.optionitem i {
  padding: 10px;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  background-color: #10AEFF;
  color: #fff;
  font-size: 20px;
}
.optionitem p {
  margin-top: 10px;
}
</style>
