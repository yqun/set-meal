<template>
  <div class="addsite">
    <div class="addinfo">
      <!-- 返回导航 -->
      <comm-admin go="/siteAdmin"></comm-admin>
      <!-- 站点信息 -->
      <group gutter="0">
        <x-input title="名称" v-model="name"></x-input>
        <x-input title="地址" v-model="address"></x-input>
      </group>
      <!-- 提交按钮 -->
      <div class="submitbtn">
        <x-button type="primary" text="保存" @click.native="submitSiteInfo()"></x-button>
      </div>
    </div>
    <!-- 地图容器 -->
    <div id="allmap"></div>
    <!-- 提示框 -->
    <toast type="text" v-model="show" :time="1000" :text=toastMsg></toast>
  </div>
</template>

<script>
import jsonp from 'jsonp';
export default {
  name: "addSite",
  data() {
    return {
      token: '',
      positionSize: {}, // 当前位置
      clickPointer: '', // 点击创建的 点标记
      name: '',
      address: '',
      position: {},
      show: false, // 提示框  显示隐藏
      toastMsg: '',
    }
  },
  created () {
    // console.log(this.$route.params.id) // 获取 拼接传过来的id值
    this.judgeToken(); // 获取 token值
    this.getADMap(); // 调用百度地图接口
  },
  methods: {
    // 判断token
    judgeToken() {
      this.token = window.sessionStorage.getItem('token');
    },
    //调用百度地图接口
    getADMap () {
      jsonp(
        'http://webapi.amap.com/maps?v=1.4.11&key=1900d888e0c9f8bb6cb20aaab138529f&plugin=AMap.MouseTool'
        , {}
        , () => {
          this.getSiteInfoById()
        })
    },
    // 初始化地图
    initMap () {
      let map = new window.AMap.Map('allmap', {
        zoom:12,//级别
        // center: [this.position.lng, this.position.lat],
        resizeEnable: true,
        viewMode:'2D',//使用2D视图
        lang:'zh_cn'  //设置地图语言类型
      });
      window.map = map
      // this.nowPosition();
      this.priceControl();
      this.getClickPointer();
    },
    // 定位到当前位置
    nowPosition () {
      const that = this;
      map.plugin('AMap.Geolocation', function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,     // 是否使用高精度定位，默认：true
          timeout: 1000,         // 设置定位超时时间，默认：无穷大
          buttonOffset: new AMap.Pixel(10, 20),   // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: false,     //定位成功后将定位到的位置作为地图中心点，默认：true
          zoomToAccuracy: false,   //定位成功后是否自动调整地图视野到定位点
          showButton: true,        //显示定位按钮，默认：true
          buttonPosition: 'LT'    //  定位按钮的排放位置,  RB表示右下
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition()
        AMap.event.addListener(geolocation, 'complete', onComplete)
        AMap.event.addListener(geolocation, 'error', onError)
        // var that = this;
        function onComplete (data) {
          // data是具体的定位信息
          // console.log(data);
          that.positionSize.lng = data.position.lng
          that.positionSize.lat = data.position.lat
        }
        function onError (data) {
          // 定位出错
          alert('定位失败')
        }
      })
    },
    // 工具控件
    priceControl () {
      map.plugin([
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.OverView',
        'AMap.MapType',
        'AMap.Geolocation',
      ], function () {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        map.addControl(new AMap.ToolBar());
      })
    },
    // 点击 位置 添加点标记
    getClickPointer () {
      map.on('click', e => {
        // 获取 点击的位置
        this.position = e.lnglat
        this.addRemoveMark()
      })
    },
    // 添加 移除 点标记
    addRemoveMark() {
      // 点击出现新位置 之前  移除上一个点位置
      map.remove(this.clickPointer)
      // 创建点标记
      this.clickPointer = new AMap.Marker({
        position:[this.position.lng, this.position.lat],//位置
        title: '',
        icon: this.icon,
        offset: new AMap.Pixel(-15,-27),
        clickable: true,
        // 设置是否可以拖拽
        draggable: true,
        cursor: 'move',
        // 设置拖拽效果
        raiseOnDrag: true
      })
      // 添加点标记
      map.add(this.clickPointer)
      // 移动事件
      this.clickPointer.on('dragend', e => {
        this.position = e.lnglat
      })
    },
    // 判断 是新增 还是编辑
    getSiteInfoById() {
      const id = this.$route.params.id
      if (id != 0) {
        // 获取 电站信息
        this.$http
          .get(`${this.apiHost}chargeStation/weixin/wxFindChargerStation.do?token=${this.token}&id=${id}`)
          .then(res => {
            const {chargeStation:{f_address, f_name, f_lng, f_lat}} = res.data
            this.name = f_name
            this.address = f_address
            this.position.lng = f_lng
            this.position.lat = f_lat
            this.initMap();
            this.addRemoveMark();
            map.setCenter([this.position.lng, this.position.lat])
          })
      } else {
        this.initMap();
        map.setCenter([116.397428, 39.90923])
      }
    },
    // 点击按钮提交数据
    submitSiteInfo() {
      const id = this.$route.params.id
      if (this.name.trim() && this.address.trim() && this.position.lng && this.position.lat) {
        if (id == 0) {
          // addSite
          this.addSite()
        } else {
          // 修改
          this.updateSite(id)
        }
      } else {
        this.show = true
        this.toastMsg = '信息不能为空'
      }
    },
    // addSite
    addSite() {
      this.$http
        .get(`${this.apiHost}chargeStation/weixin/wxSaveChargeStation.do?token=${this.token}&f_name=${this.name}&f_address=${this.address}&f_lng=${this.position.lng}&f_lat=${this.position.lat}`)
        .then(res => {
          const {state} = res.data
          if (state == true) {
            this.show = true
            this.toastMsg = '添加站点成功'
            setTimeout(() => {
              this.$router.push('/siteAdmin')
            }, 800)
          } else {
            const {error} = res.data
            this.show = true
            this.toastMsg = error
          }
        })
    },
    // 修改电站
    updateSite(id) {
      this.$http
        .get(`${this.apiHost}chargeStation//weixin/wxUpdateChargeStation.do?token=${this.token}&id=${id}&f_name=${this.name}&f_address=${this.address}&f_lng=${this.position.lng}&f_lat=${this.position.lat}`)
        .then(res => {
          const {state} = res.data
          if (state == true) {
            this.show = true
            this.toastMsg = '修改站点成功'
            setTimeout(() => {
              this.$router.push('/siteAdmin')
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
.addsite {
  width: 100%;
  height: 100%;
}
.addinfo {
  width: 100%;
  /*height: 30%;*/
  box-sizing: border-box;
}
.submitbtn {
  box-sizing: border-box;
  padding: 0 10px;
  margin: 10px 0;
}
#allmap {
  width: 100%;
  height:70%;
  background-color: #ccc;
}
</style>
