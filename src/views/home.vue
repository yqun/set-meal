<template>
  <div style="padding-bottom: 54px;">
    <!-- banner -->
    <swiper :loop="true"
            :aspect-ratio="swiperHeight"
            show-desc-mask
            auto>
      <swiper-item v-for="(item, index) in list"
                   :aspect-ratio="swiperHeight"
                   :key="index">
        <a :href="item.url"><img :src="item.img" alt=""></a>
      </swiper-item>
    </swiper>
    <!-- flexbox -->
    <flexbox :gutter="0">
      <flexbox-item>
        <div class="option" @click="personal()">
          <!--<i class="iconfont icon-icon7"></i>-->
          <img src="../assets/images/充电桩_03.png" alt="">
          <p>个人中心</p>
        </div>
      </flexbox-item>
      <flexbox-item>
        <div class="option" @click="$router.push('/recharge')">
          <!--<i class="iconfont icon-chongzhi"></i>-->
          <img src="../assets/images/充电桩_05.png" alt="">
          <p>充值中心</p>
        </div>
      </flexbox-item>
      <flexbox-item>
        <div class="option" @click="expense()">
          <!--<i class="iconfont icon-dingdan"></i>-->
          <img src="../assets/images/充电桩_07.png" alt="">
          <p>我的订单</p>
        </div>
      </flexbox-item>
      <flexbox-item>
        <div class="option">
          <!--<i class="iconfont icon-xin"></i>-->
          <img src="../assets/images/充电桩_09.png" alt="">
          <p>公众号</p>
        </div>
      </flexbox-item>
      <flexbox-item>
        <div class="option">
          <!--<i class="iconfont icon-handshakedealp"></i>-->
          <img src="../assets/images/充电桩_11.png" alt="">
          <p>投资加盟</p>
        </div>
      </flexbox-item>    </flexbox>
    <!-- 新起点嘉园 -->
    <div class="content">
      <flexbox>
        <flexbox-item :span="4">
          <div class="content-pic">
            <img :src="imageUrl" alt="">
          </div>
        </flexbox-item>
        <flexbox-item>
          <div class="content-txt">
            <span>
              编号:{{ sn_num }}
            </span>
            <span>
              当前信号:
              <strong v-if="this.signal == 5 || this.signal == 4" style="color:green">
                <i class="iconfont icon-WIFIxinhao-ji"></i>
              </strong>
              <strong v-if="this.signal == 3" style="color:green">
                <i class="iconfont icon-WIFIxinhao-ji1"></i>
              </strong>
              <strong v-if="this.signal == 2" style="color:brown">
                <i class="iconfont icon-WIFIxinhao-ji2"></i>
              </strong>
              <strong v-if="this.signal == 1" style="color:#ccc">
                <i class="iconfont icon-WIFIxinhao-ji3"></i>
              </strong>
              <strong v-if="this.signal == 0" style="color:#ccc">
                <i class="iconfont icon-WIFIxinhao-wu"></i>
              </strong>
            </span>
            <p>可用插座数:<strong> {{ this.pointer_free_count }} </strong></p>
            <p>已选择插座号:
              <strong v-if="chooseconfirmList.f_order == null">未选择</strong>
              <strong v-else-if="chooseconfirmList.f_order !== null">{{chooseconfirmList.f_order}}</strong>
            </p>
            <p class="scan" @click="againscan()">
              <i class="iconfont icon-saoyisao"></i>
              扫一扫
            </p>
          </div>
        </flexbox-item>
      </flexbox>
    </div>
    <!-- 套餐选择 -->
    <flexbox class="choose" orient="vertical" :gutter="0" v-if="f_charger_type == 1">
      <flexbox-item><h4>套餐选择</h4></flexbox-item>
      <flexbox-item>
        <button-tab v-model="index">
          <button-tab-item class="mealchoose-item"
                           @on-item-click="getActivebtn(index)"
                           v-if="item.f_product_type != 3"
                           v-for="(item,index) in chooseCost"
                           :key="item.id">
            <p>{{item.f_sum}}元</p>
            <strong>使用{{item.f_minute}}分钟</strong>
          </button-tab-item>
          <button-tab-item class="mealchoose-item"
                           @on-item-click="getActivebtn(index)"
                           style="height: 38px;line-height: 38px;background-color: green;"
                           v-if="item.f_product_type == 3"
                           v-for="(item,index) in chooseCost"
                           :key="item.id">
            <p style="color:#fff;font-size: 18px;">充满自停</p>
            <strong></strong>
          </button-tab-item>
        </button-tab>
      </flexbox-item>
    </flexbox>
    <!-- 信息说明 -->
    <div class="state" v-if="f_manufacturer == 1">
      <div v-if="!fullStop.length">
        温馨提示:
        <span @click="confirmState = true">
          本设备使用过程中若功率超过设定标准,实际充电时间将缩短，点击本条提示查看标准
        </span>
      </div>
      <div v-if="fullStop.length">
        充电服务费(按分钟计费)
        <flexbox style="margin-top: 10px;">
          <flexbox-item>
            <div class="full-stop">
              <p>0 < 功率(瓦) ≤ {{fullStop[0].f_level_one}}</p>
              <p>{{fullStop[0].f_price_one}}元/小时</p>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="full-stop">
              <p>{{fullStop[0].f_level_one}} < 功率(瓦) ≤ {{fullStop[0].f_level_second}}</p>
              <p>{{fullStop[0].f_price_second}}元/小时</p>
            </div>
          </flexbox-item>
        </flexbox>
        <flexbox style="margin-top: 10px;">
          <flexbox-item>
            <div class="full-stop">
              <p>{{fullStop[0].f_level_second}} < 功率(瓦) ≤ {{fullStop[0].f_level_third}}</p>
              <p>{{fullStop[0].f_price_third}}元/小时</p>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="full-stop">
              <p>{{fullStop[0].f_level_third}} < 功率(瓦) ≤ {{fullStop[0].f_level_fourth}}</p>
              <p>{{fullStop[0].f_price_fourth}}元/小时</p>
            </div>
          </flexbox-item>
        </flexbox>
      </div>
    </div>
    <confirm v-model="confirmState" title="详细说明" :show-cancel-button="false">
      <p class="confirmconent">充电功率<250W，100%套餐时长充电</p>
      <p class="confirmconent">250W≤充电功率<500W，50%套餐时长充电</p>
      <p class="confirmconent">500W≤充电功率<800W，25%套餐时长充电</p>
    </confirm>
    <!-- 按钮 -->
    <div class="submit">
      <x-button type="primary" class="btn" @click.native="showConfirm()" :disabled="disabled">确认使用</x-button>
      <confirm v-model="toastShow" class="confirm" @on-confirm="affirm()">
        <h2>请把插头插在插座上</h2>
      </confirm>
      <!-- toast -->
      <toast v-model="showPositionValue" type="text" :time="1000" :text="massage" position="middle" width="10em"></toast>
    </div>
    <!-- 验证钱包 -->
    <confirm v-model="toastShowMonery" class="confirm" confirm-text="去充钱" @on-confirm="addmonery()">
      <h2>{{content}}</h2>
    </confirm>
    <!-- 插座弹框 -->
    <confirm :title="title" v-model="show" class="confirm" :show-confirm-button="false">
      <ul class="clearfix">
        <li v-if="state === false" style="width: 100%; color: #333;"><h2>该充电桩已下线</h2></li>
        <confirm-item v-for="(item,index) in confirmList"
                      v-if="state == true"
                      :key="item.id"
                      :item="item"
                      :index="index"
                      @choose-list-ltem="confirmListitem">
                      <!--:list="confirmList"-->
        </confirm-item>
      </ul>
    </confirm>
  </div>
</template>

<script>
export default {
  components: {
    'confirmItem': {
      props: ["item","index"],
      template: `<li @click="chooseListitem(index)"
                     style="color: green"
                     v-if="item.f_work_state == 1 || item.f_work_state == null">
                    <i class="iconfont icon-chazuo" style="display: block; font-size: 30px; margin: 0 auto; width:30px;height: 30px;"></i>
                    {{item.f_order}}
                  </li>
                  <li @click="chooseListitem(index)"
                     style="color: yellow"
                     v-else-if="item.f_work_state == 2">
                    <i class="iconfont icon-chazuo" style="display: block; font-size: 30px; margin: 0 auto; width:30px;height: 30px;"></i>
                    {{item.f_order}}
                  </li>
                  <li @click="chooseListitem(index)"
                     style="color: red"
                     v-else-if="item.f_work_state == 3">
                    <i class="iconfont icon-chazuo" style="display: block; font-size: 30px; margin: 0 auto; width:30px;height: 30px;"></i>
                    {{item.f_order}}
                  </li>
                  <li @click="chooseListitem(index)"
                     style="color: gray"
                     v-else-if="item.f_work_state == 4">
                    <i class="iconfont icon-chazuo" style="display: block; font-size: 30px; margin: 0 auto; width:30px;height: 30px;"></i>
                    {{item.f_order}}
                  </li>`,
      methods: {
        chooseListitem(index) {
          this.$emit('choose-list-ltem', index)
        }
      }
    }
  },
  data () {
    return {
      openId: 0,
      token: '',
      // swiper pic
      list: [],
      swiperHeight: 0.5,
      // 静态图片充电桩
      imageUrl: '',
      // tabButton
      index: -1,
      signal: 0,
      pointer_free_count: 0,
      state: false,
      show: false,
      title: '请选择插座',
      // 循环插座
      confirmList: [],
      // 选择的插座
      chooseconfirmList: {},
      // 套餐选择
      chooseCost: [],
      // 点击确认  需要提交的数据
      random: '',
      sn_num: '',
      f_charger_type: 0, // 判断汽车桩还是电车桩
      formData: {},
      toastShow: false,
      content: '点击确认充钱',
      toastShowMonery: false,
      // 充电
      showPositionValue: false,
      // error
      massage: '充电已开始',
      orderId: '',
      disabled: false, // 确认充电按钮禁用
      // 判断说明信息存在不存在
      f_manufacturer: 0,
      confirmState: false,
      fullStop: [], // 充满自停
    }
  },
  created () {
    this.judgeToken();
    this.handleToken();
  },
  methods: {
    // 判断token
    judgeToken() {
      this.token = window.sessionStorage.getItem('token');
    },
    // 获取token
    async handleToken() {
      // 判断 是扫码进来的主页  还是通过跳转进来的
      this.openId = this.$route.query.openId
      this.random = this.$route.query.f_random_num
      const res = await this.$http.get(`${this.apiHost}member/getToken.do?openId=${this.openId}`);
      const {data} = res;
      // 判断 token 是否存在
      if (this.token == 'undefined' || this.token == null) {
        this.token = data.token;
        // 把token设置在sessionStorage中
        window.sessionStorage.setItem('token', data.token);
      }
      this.getf_sn_num()
      this.handleAdver() // 获取banner图片
      this.getImages() // 主页充电桩图片
    },
    // 获取   f_sn_num设备码
    getf_sn_num() {
      if (this.random) {
        this.$http.get(`${this.apiHost}charger/weixin/findEntityByRandom.do?token=${this.token}&f_random_num=${this.random}`)
          .then(res => {
            // console.log(res)
            const { state } = res.data
            if (state == true) {
              const {f_sn_num, f_manufacturer} = res.data.charge
              this.sn_num = f_sn_num
              this.f_manufacturer = f_manufacturer
              window.sessionStorage.setItem('sn_num', this.sn_num);
              this.formData.f_sn_num = this.sn_num
              //根据设备号获取设备信息
              this.handleState();
            } else {
              console.log(1)
              const {error} = res.data
              alert(error)
            }
          })
      } else {
        this.sn_num = window.sessionStorage.getItem('sn_num')
        this.formData.f_sn_num = this.sn_num
        //根据设备号获取设备信息
        this.handleState();
      }
    },
    // 获取图片
    getImages () {
      this.imageUrl = `${this.apiHost}images/weixin/charger.png`
    },
    // 个人中心
    personal () {
      this.$http.get(`${this.apiHost}member/weixin/findMemberByToken.do?token=${this.token}`)
        .then(res => {
          const {state} = res.data
          if (state == true) {
            this.$router.push('/personal')
          } else {
            this.$router.push('/login?to=personal');
          }
        })
    },
    // 我的订单
    expense () {
      this.$http.get(`${this.apiHost}member/weixin/findMemberByToken.do?token=${this.token}`)
        .then(res => {
          const {state} = res.data
          if (state == true) {
            this.$router.push('/expense')
          } else {
            this.$router.push('/login?to=expense');
          }
        })
    },
    // 调用微信扫一扫
    againscan() {
      this.$http.get(`${this.apiHost}/weChatPay/weixin/getJsApiConfig.do?token=${this.token}`)
        .then(res => {
          const {appId, timeStamp, nonceStr, signature} = res.data
          const that = this
          wx.config({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            // 必填，公众号的唯一标识
            appId: appId,
            // 必填，生成签名的时间戳
            timestamp: ""+timeStamp,
            // 必填，生成签名的随机串
            nonceStr: nonceStr,
            // 必填，签名
            signature: signature,
            // 必填，需要使用的JS接口列表
            jsApiList : [ 'scanQRCode' ]
          })
          // 配置失败  返回失败信息
          wx.error(function(res){
            // alert('配置失败')
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            // for (let key in res) {
            //   alert(res[key])
            // }
          });
          // 调用 微信扫一扫接口
          wx.scanQRCode({
            needResult : 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType : [ "qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success : function(res) {
              const str = 'f_random_num'
              if(res.resultStr.indexOf(str) == -1) {
                alert('请扫描插座上的二维码')
              } else {
                // alert('获取随机数成功' + res.resultStr.split('=')[1])
                that.random = res.resultStr.split('=')[1]
                that.$router.push({
                  path: '/home',
                  query: {
                    f_random: res.resultStr.split('=')[1],
                    openId: that.openId
                  }
                })
                that.getf_sn_num()
              }
            }
          });
        })
    },
    // banner 轮播
    handleAdver() {
      this.$http.get(`${this.apiHost}adver/weixin/findPushedAdv.do?token=${this.token}`)
        .then(res => {
          res.data.rows.forEach(async (item,index) => {
            const {f_title, f_url, image:{id}} = item;
            this.list.push({
              url: f_url,
              img: `${this.apiHost}system/getImage.do?token=${this.token}&id=${id}`,
              title: f_title
            })
          })
        })
    },
    // 获取设备插座  信号
    handleState () {
      this.$http
        .get(`${this.apiHost}charger/weixin/findChargerState.do?token=${this.token}&f_sn_num=${this.sn_num}`)
        .then(res => {
          const {f_pointer_free_count, f_signal, pointers, f_state, f_charger_type} = res.data.charger
          this.f_charger_type = f_charger_type
          this.state = f_state;
          if (this.state == true) {
            this.pointer_free_count = f_pointer_free_count; // 可用插座数
            this.signal = f_signal; // 信号
            this.confirmList = pointers; // 插头
          }
          this.handleCost() // 获取充电套餐
        })
    },
    // 获取充电套餐
    handleCost () {
      // 判断 f_charger_type 值 汽车桩没有套餐
      if (this.f_charger_type == 1) {
        this.$http.get(this.apiHost + `product/findProductByCondition.do?token=${this.token}&f_product_type=1&f_charger_type=${this.f_charger_type}&f_sn_num=${this.sn_num}`)
          .then(res => {
            console.log(res)
            const {rows} = res.data
            this.chooseCost = rows // 套餐
          })
      }
    },
    // 点击按钮选择套餐
    getActivebtn (index) {
      this.handleState();
      if (this.sn_num) {
        if (this.confirmList.length == 1) {
          this.confirmListitem(0);
        } else {
          this.show = true;
        }
        this.formData.f_product_id = this.chooseCost[index].id
      } else {
        this.show = true;
        this.title = '请重新扫描二维码'
      }
      // 判断充满自停
      this.fullStop = this.chooseCost.filter((item) => {
        return item.id == this.chooseCost[index].id && item.f_product_type == 3
      })
    },
    // 点击选择插座
    confirmListitem(index) {
      this.chooseconfirmList = this.confirmList[index]
      this.show = false
      this.formData.f_pointer_order = this.confirmList[index].f_order
      if (this.confirmList[index].f_work_state == 2) {
        this.showPositionValue = true
        this.massage = '该充电口正在使用'
      } else if (this.confirmList[index].f_work_state == 3) {
        this.showPositionValue = true
        this.massage = '该充电口禁用'
      } else if (this.confirmList[index].f_work_state == 4) {
        this.showPositionValue = true
        this.massage = '该充电口故障'
      }
    },
    // 点击确认使用
    showConfirm () {
      // 汽车桩跳到电车桩
      if(this.f_charger_type != 2 && this.formData.f_product_id == -1) {
        this.formData.f_pointer_order = undefined
      }
      if (this.f_charger_type != 2 && this.formData.f_pointer_order && this.formData.f_product_id && this.formData.f_sn_num) return this.affirmcharge();
      // this.handleState();
      // 电车桩
      if (this.f_charger_type == 1) {
          if (this.index == -1) {
            this.showPositionValue = true
            return this.massage = '请选择套餐'
          }
          if (this.formData.f_pointer_order == undefined) {
            this.show = true
            this.showPositionValue = true
            return this.massage = '请选择插座'
            // this.formData.f_product_id = this.chooseCost[this.index].id;
            // if (this.confirmList.length == 1) {
            //   this.confirmListitem(0);
            //   this.affirmcharge();
            // } else {
            //   this.show = true;
            // }
          }
      }
      // 汽车桩
      if (this.f_charger_type == 2){
        this.formData.f_product_id = -1
        if (this.confirmList.length == 1) {
          this.confirmListitem(0);
          this.affirmcharge();
        } else {
          this.show = true;
        }
      }
    },
    // 确认充电 判断金额是否小于套餐金额
    affirmcharge() {
      // alert('判断')
      this.$http.get(`${this.apiHost}member/checkEnough.do?token=${this.token}&id=${this.formData.f_product_id}`)
        .then((res) => {
          const {state} = res.data
          if (state == true) {
            if (this.state === false) {
              this.show = true;
            } else {
              this.toastShow = true
            }
          } else {
            const {error} = res.data
            this.content = error
            this.toastShowMonery = true
          }
        })
    },
    affirm () {
      this.$http.get(this.apiHost + `charger/weixin/startCharge.do?token=${this.token}&f_sn_num=${this.formData.f_sn_num}&f_product_id=${this.formData.f_product_id}&f_pointer_order=${this.formData.f_pointer_order}`)
        .then(res => {
          const {state} = res.data
          if (state == true) {
            this.showPositionValue = true;
            this.massage = '充电已开始'
          } else {
            const {error} = res.data
            this.showPositionValue = true
            this.massage = error
          }
        })
    },
    addmonery () {
      if (this.formData.f_product_id == -1) return this.$router.push('recharge');
      // 跳转地址
      this.$http.get(this.apiHost + `weChatPay/generateOrder.do?token=${this.token}&f_product_id=${this.formData.f_product_id}`)
        .then(res => {
          this.orderId = res.data.orderId
          const that = this;
          wx.config({
            debug: false,
            appId: res.data.appId,
            timestamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            signature: res.data.signature,
            jsApiList: ["chooseWXPay"]
          });

          wx.chooseWXPay({
            timestamp: res.data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: res.data.nonceStr, // 支付签名随机串，不长于 32 位
            package: res.data.package1, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: res.data.paySign, // 支付签名
            success: function (res) {
              // 支付成功后的回调函数
              // if (res.errMsg == "chooseWXPay:ok") {
              //   alert("支付成功！");
              // } else {
              //   alert("支付失败" + res.errMsg);
              // }
            },
            fail: function (res) {
              that.$http.get(that.apiHost + `weChatPay/delOrderById.do?token=${that.token}&orderId=${that.orderId}`)
            }
          });
        })
        .catch(err => {
          alert(err)
        })
    },

  }
}
</script>

<style scoped>
/*初始化*/
ul>li {
  list-style: none;
}
/*轮播图*/
.vux-slider > .vux-swiper > .vux-swiper-item img {
  width: 100%;
  height: 100%;
}
.option {
  text-align: center;
  padding-top: 20px;
}
.option img {
  width: 60%;
  vertical-align: middle;
}
.option i {
  font-size: 26px;
  padding: 10px;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  background-color: #10AEFF;
  color: #fff;
}
.option p {
  font-size: 14px;
  margin-top: 8px;
}
/* 新起点嘉园 */
.content {
  margin-top: 10px;
  padding: 0 0 0 10px;
}
.content p {
  color: #757575;
  font-size: 16px;
}
.content p strong {
  color: green;
}
.content span {
  display: block;
  color: #757575;
  font-size: 16px;
}
.content-pic {
  width: 90%;
  height: 120px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin: 0 auto;
  overflow: hidden;
}
.content-pic img {
  display: block;
  height: 100px;
  margin: 10px auto;
}
.content-txt {
  position: relative;
}
p.scan {
  position: absolute;
  right: 20px;
  top: 28px;
  width: 40px;
  height: 40px;
  background-color: #10AEFF;
  border-radius: 50%;
  color: #fff;
  text-align: center;
  font-size: 8px;
}
p.scan i{
  display: block;
}
  /*套餐选择*/
.choose {
  box-sizing:border-box;
  padding: 0 8px;
  border-bottom: 1px solid #ededed;
}
.choose h4 {
  margin: 10px 10px 0;
  padding: 10px 0;
  border-top: 1px solid #dcdcdc;
}
/* 说明  按钮 */
div.state {
  background-color: #f3f8fe;
  margin: 10px 10px;
  padding: 0 10px;
  box-sizing: border-box;
}
div.state  span {
  font-size: 14px;
  color: #ff7272;
}
div.state .full-stop {
  text-align: center;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-clip: padding-box;
}
/* 弹窗说明内容 */
.confirmconent {
  font-size: 14px;
  text-align: left;
  margin-top: 10px;
  color: #333;
}
.submit {
  box-sizing: border-box;
  padding: 5px 10px;
  background-color: transparent;
  position: fixed;
  z-index:10000;
  bottom: 0;
  left: 0;
  width: 100%;
}
.submit button.btn.weui-btn_primary {
  margin-top: 14px;
  background-color: rgba(25,173,26,0.5);
  font-weight: 700;
}
/* tab */
.vux-button-group {
  flex-wrap: wrap;
}
.vux-button-group a {
  min-width: 70px;
  line-height: normal;
  padding: 18px 0;
  border-radius: 5px !important;
  height: 100%;
  background-color: transparent;
  border: 1px solid #ccc;
  margin: 5px 5px;
  color: #333;
}
.vux-button-group > a.vux-button-tab-item:after {
  position: relative !important;
  border: none;
}
.vux-button-group > a.vux-button-group-current {
  color: #333;
  border: 1px solid #01AAED;
  background-color: rgba(200,225,252,0.1);
}
.vux-button-group > a.vux-button-group-current p:after {
  content:'';
  width: 0px;
  height: 0px;
  border-radius: 0;
  border-bottom: 5px solid transparent;
  border-top: 15px solid #01AAED;;
  border-right: 15px solid transparent;
  border-left: 15px solid transparent;
  transform:rotate(-45deg);
  position: absolute;
  right: -12px;
  bottom: -7px;
}
.vux-button-group > a.vux-button-group-current strong:after,
.vux-button-group > a.vux-button-group-current strong:before{
  display: block;
  position: absolute;
  right: 4px;
  bottom: 0;
  content: '';
  width: 1px;
  height: 12px;
  background-color: #fff;
  transform: rotate(40deg);
}
.vux-button-group > a.vux-button-group-current strong:before {
  transform: rotate(-45deg);
  height: 6px;
  right: 10px;
  bottom: 1px;
}
.mealchoose-item p {
  font-size: 14px;
}
.mealchoose-item strong {
  font-size: 12px;
  font-weight: 500;
  color: #FFB800;
}
/*弹框*/
.clearfix::before, .clearfix::after {
  content:"";
  display: table;
  overflow: hidden;
  height: 0;
}
.clearfix::after {
  clear: both;
}
.confirm ul li {
  width: 25%;
  height: 45px;
  float: left;
  text-align: center;
  margin-bottom: 5px;
}
.confirm ul li i {
  display: block;
  font-size: 30px;
  width: 30px;
  height: 30px;
  margin: 0 auto;
}
</style>
