<template>
  <div style="padding-bottom: 54px;position: relative;">
    <!-- 小图标 -->
    <div class="nav_showBtn">
      <i class="iconfont icon-wode" @click="navConfirm = true"></i>
    </div>
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
    <!-- 导航 -->
    <confirm v-model="navConfirm" class="nav_confirm" :show-cancel-button="false" :show-confirm-button="false" hide-on-blur>
      <div class="nav">
        <ul class="clearfix">
          <li>
            <div class="images" @click="personal()">
              <img src="../assets/images/充电桩_03.png" alt="">
            </div>
            <div class="text">个人中心</div>
          </li>
          <li>
            <div class="images" @click="$router.push('/recharge')">
              <img src="../assets/images/充电桩_05.png" alt="">
            </div>
            <div class="text">充值中心</div>
          </li>
          <li>
            <div class="images" @click="expense()">
              <img src="../assets/images/充电桩_07.png" alt="">
            </div>
            <div class="text">我的订单</div>
          </li>
          <li>
            <div class="images" @click="publicNumber()">
              <img src="../assets/images/充电桩_09.png" alt="">
            </div>
            <div class="text">公众号</div>
          </li>
          <li>
            <div class="images"><img src="../assets/images/充电桩_11.png" alt=""></div>
            <div class="text">投资加盟</div>
          </li>
        </ul>
      </div>
    </confirm>
    <!-- 新起点嘉园 -->
    <div class="equipment">
      <div class="equipment_state">
        <p class="equipment_num"><strong>编号:{{ sn_num }}</strong></p>
        <p class="equipment_signal equipment_info">
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
        </p>
        <p class="equipment_socket_sum equipment_info">可用插座数:<strong style="color: #39bafc;"> {{ this.pointer_free_count }} </strong></p>
        <p class="equipment_socket_num equipment_info">已选择插座号:
          <strong v-if="chooseconfirmList.f_order == null">未选择</strong>
          <strong v-else-if="chooseconfirmList.f_order !== null">{{chooseconfirmList.f_order}}</strong>
        </p>
      </div>
      <div class="again_scan">
        <img src="../assets/images/chongdainzhuang.png" alt="" @click="againscan()">
        <p style="font-weight: 700; font-size: 14px;">扫码充电</p>
      </div>
      <div class="equipment_socket_bigNum">
        <span>{{chooseconfirmList.f_order || '无'}}</span>
        <p style="font-weight: 700; font-size: 14px;">插座号</p>
      </div>
    </div>
    <!-- 移动的文字 -->
    <div class="move_text" v-if="noFinishedSetMealShow">
      <marquee behavior="scroll"
               direction="left"
               scrollamount="4"
               hspace=20
               vspace=20>

        <span v-if="item.f_product_type != 3 && item.f_charger_type == 1"
              v-for="item in noFinishedSetMeal"
              :key="item.id"
              @click.stop="stopcharge(item.id)">
          {{item.f_sum}}元{{item.f_minute}}分钟正在充电　　点击可结束充电
        </span>

        <span v-if="item.f_product_type == 3 && item.f_charger_type == 1"
              v-for="item in noFinishedSetMeal"
              :key="item.id"
              @click.stop="stopcharge(item.id)">
          充满自停正在充电　　点击可结束充电
        </span>
        <span v-if="item.f_charger_type == 2"
              v-for="item in noFinishedSetMeal"
              :key="item.id"
              @click.stop="stopcharge(item.id)">
          充电正在进行，点击可结束充电。
        </span>
      </marquee>
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
                           style="line-height: 38px;"
                           v-if="item.f_product_type == 3"
                           v-for="(item,index) in chooseCost"
                           :key="item.id">
            <p style="font-size: 18px;">充满自停</p>
            <strong></strong>
          </button-tab-item>
        </button-tab>
      </flexbox-item>
    </flexbox>
    <confirm v-model="chooseShow" title="套餐选择" :show-confirm-button="false">
      <flexbox class="choose" orient="vertical" :gutter="0" v-if="f_charger_type == 1" style="border-bottom: none;">
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
                             style="line-height: 38px;"
                             v-if="item.f_product_type == 3"
                             v-for="(item,index) in chooseCost"
                             :key="item.id">
              <p style="font-size: 18px;">充满自停</p>
            </button-tab-item>
          </button-tab>
        </flexbox-item>
      </flexbox>
    </confirm>
    <!-- 信息说明 -->
    <div class="state" v-if="f_manufacturer == 1">
      <div v-if="!fullStop.length">
        温馨提示:
        <span @click="confirmState = true">
          本设备使用过程中若功率超过设定标准,实际充电时间将缩短，点击本条提示查看标准
        </span>
      </div>
      <div v-if="fullStop.length" style="color: #e7060a;">
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
    <!--this.toastShow = true-->
    <confirm v-model="setMealExplain" title="充电说明" :show-cancel-button="false" @on-confirm="toastShow = true">
      <div v-if="!fullStop.length">
        <p class="confirmconent">充电功率<250W，100%套餐时长充电</p>
        <p class="confirmconent">250W≤充电功率<500W，50%套餐时长充电</p>
        <p class="confirmconent">500W≤充电功率<800W，25%套餐时长充电</p>
      </div>
      <div class="clearfix" v-if="fullStop.length">
        <div style="float: left;text-align: right;width: 64%;">
          <p>0 < 功率(瓦) ≤ {{fullStop[0].f_level_one}}</p>
          <p>{{fullStop[0].f_level_one}} < 功率(瓦) ≤ {{fullStop[0].f_level_second}}</p>
          <p>{{fullStop[0].f_level_second}} < 功率(瓦) ≤ {{fullStop[0].f_level_third}}</p>
          <p>{{fullStop[0].f_level_third}} < 功率(瓦) ≤ {{fullStop[0].f_level_fourth}}</p>
        </div>
        <div style="float: right;text-align: right;width: 36%;box-sizing: border-box;padding-left: 6px;">
          <p>{{fullStop[0].f_price_one}}元/小时</p>
          <p>{{fullStop[0].f_price_second}}元/小时</p>
          <p>{{fullStop[0].f_price_third}}元/小时</p>
          <p>{{fullStop[0].f_price_fourth}}元/小时</p>
        </div>
      </div>
    </confirm>
    <confirm v-model="confirmState" title="详细说明" :show-cancel-button="false">
      <p class="confirmconent">充电功率<{{powerInfo.f_power_first}}W，{{powerInfo.f_rate_first}}%套餐时长充电</p>
      <p class="confirmconent">{{powerInfo.f_power_first}}W≤充电功率<{{powerInfo.f_power_second}}W，{{powerInfo.f_rate_second}}%套餐时长充电</p>
      <p class="confirmconent">{{powerInfo.f_power_second}}W≤充电功率<{{powerInfo.f_power_third}}W，{{powerInfo.f_rate_third}}%套餐时长充电</p>
    </confirm>
    <!-- 按钮 -->
    <div class="submit">
      <x-button type="primary" class="btn" @click.native="showConfirm()" :disabled="disabled">开 始 充 电</x-button>
      <confirm v-model="toastShow" class="confirm" @on-confirm="affirm()">
        <span class="plase_confirm">请确认</span>
        <h2>请把插头插在插座上</h2>
        <p v-if="this.index != -1" style="font-size: 14px;color: #e7060a;margin-top: 10px;">
          你选择的套餐为{{chooseCost[this.index].f_sum}}元{{chooseCost[this.index].f_minute}}分钟，
          插座号为{{chooseconfirmList.f_order}}
        </p>
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
    <!-- 关注公众号 -->
    <confirm v-model="publicNumberShow" confirm-text="关注" @on-confirm="publicNumber">
      <h3>您尚未关注公众号，请关注公众号接收订单信息</h3>
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
                    <i class="iconfont icon-chazuo"></i>
                    {{item.f_order}}
                  </li>
                  <li @click="chooseListitem(index)"
                     style="color: yellow"
                     v-else-if="item.f_work_state == 2">
                    <i class="iconfont icon-chazuo"></i>
                    {{item.f_order}}
                  </li>
                  <li @click="chooseListitem(index)"
                     style="color: red"
                     v-else-if="item.f_work_state == 3">
                    <i class="iconfont icon-chazuo"></i>
                    {{item.f_order}}
                  </li>
                  <li @click="chooseListitem(index)"
                     style="color: gray"
                     v-else-if="item.f_work_state == 4">
                    <i class="iconfont icon-chazuo"></i>
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
      client: '', //判断微信还是支付宝
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
      powerInfo: {}, // 详细说明功率
      // 循环插座
      confirmList: [],
      // 选择的插座
      chooseconfirmList: {},
      // 套餐选择
      chooseCost: [],
      chooseShow: false,
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
      f_manufacturer: window.sessionStorage.getItem('f_manufacturer')?window.sessionStorage.getItem('f_manufacturer'):0,
      confirmState: false,
      fullStop: [], // 充满自停
      // 是否关注公众号
      publicNumberShow: false,
      // 导航浮起来
      navConfirm: false,
      // 未结束的套餐
      noFinishedSetMealShow: false,
      noFinishedSetMeal: '',
      stopChargeSetMeal: false, // 停止充电套餐
      // 弹出的充电说明
      setMealExplain: false,
    }
  },
  created () {
    this.judgeToken();
    this.handleToken();
    this.getWeiXinUser();
  },
  methods: {
    // 判断token
    judgeToken() {
      this.token = window.sessionStorage.getItem('token');
      this.client = window.sessionStorage.getItem('client');
    },
    // 获取token
    async handleToken() {
      // 判断 是扫码进来的主页  还是通过跳转进来的
      this.openId = this.$route.query.openId;
      this.random = this.$route.query.f_random_num;
      window.sessionStorage.setItem('f_random_num', this.random?this.random:'')
      const res = await this.$http.get(`${this.apiHost}member/getToken.do?openId=${this.openId}`);
      console.log(res);
      const {data} = res;
      if (!this.client) {
        window.sessionStorage.setItem('client', data.client);
        this.client = data.client;
      }

      if (data.f_subscribe == 0) {
        this.publicNumberShow = true
      }
      // 判断 token 是否存在
      if (this.token == 'undefined' || this.token == null) {
        this.token = data.token;
        // 把token设置在sessionStorage中
        window.sessionStorage.setItem('token', data.token);
      }

      this.getf_sn_num()
      this.handleAdver() // 获取banner图片
      this.getImages() // 主页充电桩图片
      this.getNoFinishedSetMeal() // 获取未结束的充电套餐
    },
    // 获取   f_sn_num设备码
    getf_sn_num() {
      if (this.random) {
        this.$http.get(`${this.apiHost}charger/weixin/findEntityByRandom.do?token=${this.token}&f_random_num=${this.random}`)
          .then(res => {
            console.log(res)
            const { state } = res.data
            if (state == true) {
              const {f_sn_num, f_manufacturer} = res.data.charge
              this.powerInfo = res.data.charge
              this.sn_num = f_sn_num
              this.f_manufacturer = f_manufacturer
              window.sessionStorage.setItem('sn_num', this.sn_num);
              window.sessionStorage.setItem('f_manufacturer', this.f_manufacturer);
              this.formData.f_sn_num = this.sn_num
              //根据设备号获取设备信息
              this.handleState();
            } else {
              // console.log(1)
              const {error} = res.data
              alert(error)
            }
          })
      } else {
        this.sn_num = window.sessionStorage.getItem('sn_num')
        this.formData.f_sn_num = this.sn_num
        //根据设备号获取设备信息
        this.handleState();
        // 获取未结束的充电套餐
        this.getNoFinishedSetMeal();
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
    // 获取微信配置
    getWeiXinUser() {
      this.$http.get(`${this.apiHost}/weChatPay/weixin/getJsApiConfig.do?token=${this.token}`)
        .then(res => {
          // console.log(res.data.signature)
          const {appId, timeStamp, nonceStr, signature} = res.data;
          wx.config({
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            debug: false,
            appId: appId,// 必填，公众号的唯一标识
            timestamp: ""+timeStamp, // 必填，生成签名的时间戳
            nonceStr: nonceStr, // 必填，生成签名的随机串
            signature: signature, // 必填，签名
            jsApiList : [ 'scanQRCode', "chooseWXPay" ] // 必填，需要使用的JS接口列表
          });
          // 配置失败  返回失败信息
          wx.error(function(res){
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            // for (let key in res) {
            //   alert(res[key])
            // }
          });
        })
    },
    // 调用微信扫一扫
    againscan() {
      const that = this
      if (this.client == 'ali') {
        ap.scan(function(res){
          // ap.alert(res.code);
          if (res.code.indexOf('f_random_num') == -1) return alert('请扫描插座上的二维码');
          that.random = res.code.split('=')[1];
          that.$router.push({path: '/home', query: {f_random: that.random, openId: that.openId}});
        });
      } else {
        // 调用 微信扫一扫接口
        wx.scanQRCode({
          needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
          scanType: ["qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
          success: function (res) {
            if (res.resultStr.indexOf('f_random_num') == -1) return alert('请扫描插座上的二维码');
            that.random = res.resultStr.split('=')[1];
            that.$router.push({path: '/home', query: {f_random: that.random, openId: that.openId}});
          }
        });
      }
      this.getf_sn_num()
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
    // 公众号
    publicNumber () {
      window.location.href='https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU2MjcwMzU3OA==&scene=110==#wechat_redirect'
    },
    // 点击移动的文字 跳转
    toExpense() {
      this.$http.get(`${this.apiHost}member/weixin/findMemberByToken.do?token=${this.token}`)
        .then(res => {
          console.log(res)
          const {state} = res.data
          if (state == true) {
            this.$router.push('/expense')
          } else {
            this.$router.push('/login?to=expense');
          }
        })
    },
    // 停止充电
    stopcharge (id) {
      const arr = this.noFinishedSetMeal.filter(item => {
        return item.id = id
      })[0]
      // console.log(this.noFinishedSetMeal)
      let content = ''
      if (arr.f_product_type != 3 && arr.f_charger_type == 1) {
        content = `<h4 style="line-height: 40px;">${arr.f_sum}元${arr.f_minute}分钟正在充电,是否停止充电。</h4>`
      } else if (arr.f_product_type == 3 && arr.f_charger_type == 1) {
        content = `<h4 style="line-height: 40px;">充满自停正在充电,是否停止充电。</h4>`
      } else if (arr.f_charger_type == 2) {
        content = `<h4 style="line-height: 40px;">充电正在进行,是否停止充电。</h4>`
      }
      this.$vux.confirm.show({
        content: content,
        // 组件除show外的属性
        onCancel : () => {},
        onConfirm : () => {
          this.$vux.loading.show({text: '正在结束'})
          // console.log(id)
          this.$http
            .get(`${this.apiHost}/Order/weixin/wxOverOrder.do?token=${this.token}&f_order_id=${id}`)
            .then(res => {
              // console.log(res)
              const {state} = res.data
              if (state == true) {
                this.$vux.toast.text('订单结束')
                this.getNoFinishedSetMeal(); // 获取未完成的充电套餐
                this.handleState(); // 重新获取插座信息
              } else {
                this.$vux.toast.text(res.data.error)
              }
              this.$vux.loading.hide();
            })
        }
      })

    },
    // 获取未结束套餐情况
    getNoFinishedSetMeal() {
      this.$http
        .get(`${this.apiHost}Order/weixin/wxFindOrderInProcess.do?token=${this.token}`)
        .then(res => {
          console.log(res);
          const {total, rows} = res.data;
          this.noFinishedSetMeal = rows;
          if (total) return this.noFinishedSetMealShow = true;
          if (!total && this.noFinishedSetMealShow) return this.noFinishedSetMealShow = false;
        })
    },
    // 获取设备插座  信号
    handleState () {
      this.$http
        .get(`${this.apiHost}charger/weixin/findChargerState.do?token=${this.token}&f_sn_num=${this.sn_num}`)
        .then(res => {
          // console.log(1,res.data.charger.pointers)
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
        this.$http.get(`${this.apiHost}product/findProductByCondition.do?token=${this.token}&f_product_type=1&f_charger_type=${this.f_charger_type}&f_sn_num=${this.sn_num}`)
          .then(res => {
            // console.log(res)
            const {rows} = res.data
            this.chooseCost = rows // 套餐
          })
      }
    },
    // 点击按钮选择套餐
    getActivebtn (index) {
      if (this.chooseShow) this.chooseShow = !this.chooseShow
      this.handleState();
      if (this.sn_num) {
        if (this.confirmList.length == 1) {
          this.confirmListitem(0);
        } else {
          setTimeout(() => {this.show = true}, 600)
        }
        this.formData.f_product_id = this.chooseCost[index].id
      } else {
        // setTimeout(() => {this.show = true}, 600)
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
      if (this.confirmList[index].f_work_state == 2) return this.$vux.toast.text('该充电口正在使用');
      if (this.confirmList[index].f_work_state == 3) return this.$vux.toast.text('该充电口禁用');
      if (this.confirmList[index].f_work_state == 4) return this.$vux.toast.text('该充电口故障');
      this.affirmcharge()
    },
    // 点击开始充电
    showConfirm () {
      // 汽车桩还是电车桩
      if(this.f_charger_type != 2 && this.formData.f_product_id == -1) {
        this.formData.f_pointer_order = undefined
      }
      if (this.f_charger_type != 2 && this.formData.f_pointer_order && this.formData.f_product_id && this.formData.f_sn_num) return this.affirmcharge();
      // 电车桩
      if (this.f_charger_type == 1) {
        if (this.index == -1) {
          this.chooseShow = true // 电车桩弹出套餐
          return this.$vux.toast.text('请选择套餐')
        }
        if (this.formData.f_pointer_order == undefined) {
          this.show = true
          return this.$vux.toast.text('请选择插座')
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
        } else {
          this.show = true;
        }
      }
    },
    // 判断金额是否小于套餐金额
    affirmcharge() {
      // alert('判断')
      this.$http.get(`${this.apiHost}member/checkEnough.do?token=${this.token}&id=${this.formData.f_product_id}`)
        .then((res) => {
          const {state} = res.data
          if (state == true) {
            if (this.state === false) {
              this.show = true;
            } else {
              setTimeout(() => {
                // this.toastShow = true
                if (this.f_charger_type == 1) {
                  this.setMealExplain = true // 电车桩弹出充电信息
                } else {
                  this.toastShow = true; // 汽车桩不弹
                }
              }, 600)
            }
          } else {
            const {error} = res.data
            this.content = error
            this.toastShowMonery = true
          }
        })
    },
    // 开始充电
    affirm () {
      this.$vux.loading.show({text: '正在通信，请稍后。'})
      this.$http.get(this.apiHost + `charger/weixin/startCharge.do?token=${this.token}&f_sn_num=${this.formData.f_sn_num}&f_product_id=${this.formData.f_product_id}&f_pointer_order=${this.formData.f_pointer_order}`)
        .then(res => {
          console.log(res)
          const {state} = res.data
          if (state == true) {
            this.$vux.loading.hide()
            this.showPositionValue = true;
            this.massage = '充电已开始'
            this.getNoFinishedSetMeal() // 未结束的订单
            this.handleState()          // 获取插座信息
          } else {
            this.$vux.loading.hide()
            const {error} = res.data
            this.showPositionValue = true
            this.massage = error
          }
        })
    },
    // 调用微信支付接口充钱
    addmonery () {
      if (this.formData.f_product_id == -1) return this.$router.push('recharge');
      // 支付宝
      if (this.client == 'ali') {
        const _this = this;
        this.$vux.confirm.show({
          title: '充值说明',
          content: '充值费用只限于充电，不能退回!',
          showCancelButton: false,
          // 组件除show外的属性
          onConfirm : () => {
            _this.$http.get(`${_this.apiHost}weChatPay/aLiPayMent.do?token=${_this.token}&f_product_id=${this.formData.f_product_id}&f_random_num=${this.random}`)
              .then(res => {
                const {state, content} = res.data;
                if (state) {
                  this.$router.push({
                    path: '/aliPay',
                    query: {form: content}
                  });
                }
              })
          }
        });
      } else {
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
              jsApiList: ["chooseWXPay", "scanQRCode"]
            });
            this.$vux.confirm.show({
              title: '充值说明',
              content: '充值费用只限于充电，不能退回!',
              showCancelButton: false,
              // 组件除show外的属性
              onConfirm: () => {
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
              }
            })

          })
          .catch(err => {
            alert(err)
          })
      }
    },
  }
}
</script>

<style>
  p.confirmconent.vux_js {
    font-size: 12px;
    text-align: left;
  }
</style>
<style scoped>
.nav_showBtn {
  position: absolute;
  right: 20px;
  top: 10px;
  z-index:999;
}
.nav_showBtn i {
  font-size: 28px;
  color: #fff;
}
/*初始化*/
ul>li {
  list-style: none;
}
/*轮播图*/
.vux-slider > .vux-swiper > .vux-swiper-item img {
  width: 100%;
  height: 100%;
}
/* 导航 */
.nav_confirm /deep/ .weui-dialog__bd:first-child {
  padding: 0;
}
.nav_confirm /deep/ .weui-dialog {
  height: 110px;
  max-width: 1000px;
  width: 96%;
  top: -150px;
}
.nav_confirm /deep/ .weui-mask {
  background: rgba(0, 0, 0, 0.5);
}
.nav ul li {
  height: 110px;
  float: left;
  width: 20%;
  background-color: #fff;
  box-sizing: border-box;
  padding-top: 20px;
}
.nav ul li div {
  text-align: center;
}
.nav ul li div.images img{
  width: 50px;
}
.nav ul li div.text{
  font-size: 12px;
}
/* 新起点嘉园 */
.equipment{
  margin: 15px 10px;
  padding: 0 10px;
  height: 110px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 1px 2px 4px 0px rgba(207,227,228,1)
}
.equipment .equipment_state {
  height: 100%;
  float: left;
  display: flex;
  flex-direction: column;
  justify-content:center;
}
.equipment .equipment_socket_bigNum {
  height: 100%;
  float: right;
  text-align: center;
  box-sizing: border-box;
  padding: 20px 0 0;
  margin-right: 10px;
}
.equipment .again_scan {
  float: right;
  height: 100%;
  text-align: center;
  box-sizing: border-box;
  padding: 20px 0 0;
}
.equipment .equipment_num {
  font-size: 14px;
  color: #333;
}
.equipment .equipment_info {
  font-size: 12px;
  color: #666;
}
.equipment .equipment_socket_bigNum span {
  display: block;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  text-align: center;
  line-height: 50px;
  background-color: #e7060a;
  color: #fff;
  font-size: 26px;
  margin-bottom: 4px;
}
.equipment .again_scan img {
  display: block;
  margin: 0 auto 4px;
  height: 50px;
  border-radius: 50%;
}
/* 移动的文字 */
.move_text {
  height: 30px;
  line-height: 30px;
  font-size: 14px;
  margin: 0 10px;
  background-color: rgba(57, 168, 252, 0.1);
  color: #e7060a;
}
marquee {
  display: inline-block;
  overflow: hidden;
  text-align: initial;
  white-space: nowrap;
}
/*套餐选择*/
.choose {
  box-sizing:border-box;
  padding: 0 8px;
  border-bottom: 1px solid #ededed;
}
.choose h4 {
  margin: 10px 10px 0;
}
/* 说明  按钮 */
div.state {
  color: #e7060a;
  /*background-color: #f3f8fe;*/
  margin: 10px 10px;
  padding: 0 10px;
  box-sizing: border-box;
}
div.state  span {
  font-size: 14px;
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
  font-size: 13px;
  text-align: left;
  margin-top: 10px;
  color: #333;
}
.submit {
  box-sizing: border-box;
  padding: 5px 10px;
  background-color: transparent;
  position: fixed;
  z-index:999;
  bottom: 0;
  left: 0;
  width: 100%;
}
.submit button.btn.weui-btn_primary {
  margin-top: 14px;
  background-color: rgba(57,186,252,1);
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
  border: 1px solid #39bafc;
  margin: 5px 5px;
  color: #333;
}
.vux-button-group > a.vux-button-tab-item:after {
  position: relative !important;
  border: none;
}
.vux-button-group > a.vux-button-group-current {
  color: #fff;
  background: -webkit-linear-gradient(#38d6fd, #39adf6); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(#38d6fd, #39adf6); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(#38d6fd, #39adf6); /* Firefox 3.6 - 15 */
  background: linear-gradient(#38d6fd, #39adf6); /* 标准的语法 */
}
.vux-button-group > a.vux-button-group-current strong {
  color: #fff;
}
.mealchoose-item p {
  font-size: 14px;
}
.mealchoose-item strong {
  font-size: 12px;
  font-weight: 400;
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
.confirm {
  position: relative;
}
.confirm .plase_confirm {
  font-size: 12px;
  position: absolute;
  left: 10px;
  top: 10px;
}
.confirm ul li {
  width: 25%;
  height: 60px;
  float: left;
  text-align: center;
  margin-bottom: 5px;
}
.confirm ul li >>> i {
  display: block;
  font-size: 40px;
  width: 40px;
  height: 44px;
  margin: 0 auto;
}
/deep/ .weui-dialog__bd {
  padding-left: 10px;
  padding-right: 10px;
}
.testCon /deep/ .weui-dialog__bd{
  height: 400px;
  overflow: auto;
  text-align: left;
}
</style>
