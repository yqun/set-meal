<template>
  <div>
    <!-- 返回导航 -->
    <comm-admin go="/commercial"></comm-admin>
    <!-- 扫一扫 -->
    <group title="注册充电桩" title-color="blue">
      <x-input class="weui-vcode" v-model="saoma1">
        <x-button slot="right" type="primary" mini @click.native="facility()">扫一扫</x-button>
      </x-input>
      <span>请扫描设备通讯卡上的二维码</span>
      <x-input class="weui-vcode" v-model="saoma2">
        <x-button slot="right" type="primary" mini @click.native="machine()">扫一扫</x-button>
      </x-input>
    </group>
    <span>请扫描随机纸质二维码</span>
    <!-- 下拉列表 -->
    <group gutter="0">
      <selector direction="to"
                :options="list"
                v-model="defaultValue"
                value=""
                placeholder="请选择站点">
      </selector>
    </group>
    <span>请选择站点(*必选)</span>
    <div class="btn">
      <x-button type="primary" @click.native="submitSiteInfo()">提交</x-button>
    </div>
    <!-- 信息提示框 -->
    <toast v-model="show" type="text" :text="toastMsg"></toast>
  </div>
</template>

<script>
export default {
  name: "saoma",
  data() {
    return {
      token: '',
      saoma1: ' ',
      saoma2: ' ',
      defaultValue: '',
      list: [],
      show: false, // 信息提示框显示隐藏
      toastMsg: '',
    }
  },
  created () {
    this.judgeToken() // 获取token
    this.getSiteInfoById() // 根据id获取电桩信息
    this.getWeiXinUser() // 获取微信配置
    this.getAllSite() // 获取所有站点名称
  },
  methods: {
    // 判断token
    judgeToken() {
      this.token = window.sessionStorage.getItem('token');
    },
    // 获取所有站点名称
    getAllSite() {
      this.$http
        .get(`${this.apiHost}chargeStation/weixin/wxFindCurrentStationList.do?token=${this.token}`)
        .then(res => {
          const {rows, state} = res.data
          if (state === true) {
            rows.forEach(item => {
              this.list.push(
                {key: item.id, value: item.f_name}
              )
            })
          }
        })
    },
    // 点击重绑  根据传过来的id获取电桩信息
    getSiteInfoById() {
      const siteId = this.$route.params.id
      if (siteId != 0) {
        this.$http
          .get(`${this.apiHost}charger/weixin/wxFindChargerById.do?token=${this.token}&id=${siteId}`)
          .then(res => {
            const {state, charger:{chargeStation ,f_sn_num, f_random_num}} = res.data
            this.defaultValue = chargeStation.id
            this.saoma1 = f_sn_num
            this.saoma2 = f_random_num
          })
      }
    },
    // 获取微信配置
    getWeiXinUser() {
      this.$http.get(`${this.apiHost}/weChatPay/weixin/getJsApiConfig.do?token=${this.token}`)
        .then(res => {
          // console.log(res.data.signature)
          const {appId, timeStamp, nonceStr, signature} = res.data
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
            // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
            // for (let key in res) {
            //   alert(res[key])
            // }
          });
        })
    },
    // 请扫描设备通讯卡上的二维码
    facility () {
      const that = this
      // 调用 微信扫一扫接口
      wx.scanQRCode({
        needResult : 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType : [ "qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success : function(res) {
          const str = res.resultStr
          that.saoma1 = str
        }
      });
    },
    // 请扫描随机纸质二维码
    machine () {
      const that = this
      wx.scanQRCode({
        needResult : 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType : [ "qrCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success : function(res) {
          const str = res.resultStr.split('=')[1]
          that.saoma2 = str
        }
      });
    },
    // 点击提交
    submitSiteInfo() {
      const id = this.$route.params.id
      if (this.saoma1 && this.saoma2 && this.defaultValue) {
        if (id == 0) {
          // 新增
          this.addSite()
        } else {
          // 修改
          this.udateSite(id)
        }
      } else {
        this.show = true
        this.toastMsg = '数据不能为空'
      }

    },
    // 添加电桩
    addSite() {
      this.$http
        .get(`${this.apiHost}charger/weixin/registerCharger.do?token=${this.token}&f_sn_num=${this.saoma1}&f_random_num=${this.saoma2}&f_chargerStation_id=${this.defaultValue}`)
        .then(res => {
          const {state} = res.data
          if (state == true) {
            this.show = true
            this.toastMsg = '添加电桩成功'
            setTimeout(() => {
              this.$router.push('/chargAdmin')
            }, 800)
          } else {
            const {error} = res.data
            this.show = true
            this.toastMsg = error
          }
        })
    },
    // 修改电桩
    udateSite(id) {
      this.$http //id f_sn_num f_random_num f_station_id
        .get(`${this.apiHost}charger/weixin/wxUpdateCharger.do?token=${this.token}&id=${id}&f_sn_num=${this.saoma1}&f_random_num=${this.saoma2}&f_station_id=${this.defaultValue}`)
        .then(res => {
          const {state} = res.data
          if (state == true) {
            this.show = true
            this.toastMsg = '修改电桩成功'
            setTimeout(() => {
              this.$router.push('/chargAdmin')
            }, 800)
          } else {
            const {error} = res.data
            this.show = true
            this.toastMsg = error
          }
        })
    }
  }
}
</script>

<style scoped>
#vux-selector-9em65 {
  color: red !important;
}
.weui-vcode {
  border-bottom: 1px solid #ccc;
  border-top: 1px solid #ccc;
}
.vux-x-input.weui-cell.weui-vcode::before {
  position: static;
}
.weui-cells::after {
  position: static;
}
.btn {
  margin-top: 20px;
  padding: 0 10px;
}
span {
  color: red;
  font-size: 14px;
  margin: 0 16px;
}
</style>
