<template>
  <!-- 附近设备 -->
  <div class="nearbybody">
    <flexbox class="zoom">
      <flexbox-item><div class="flex-demo"><span @click="zoomPosition(1)">周围1千米</span></div></flexbox-item>
      <flexbox-item><div class="flex-demo"><span @click="zoomPosition(3)">周围3千米</span></div></flexbox-item>
      <flexbox-item><div class="flex-demo"><span @click="zoomPosition(5)">周围5千米</span></div></flexbox-item>
    </flexbox>
    <div id="allmap"></div>
  </div>
</template>

<script>
import jsonp from 'jsonp'
export default {
  name: "nearby",
  data () {
    return {
      token: '',
      equipmentPosition: [],
      markerList: [],
      icon: '',   //地图图标
      // 当前位置
      positionSize: {},

    }
  },
  created () {
    this.judgeToken(); // 获取token
    this.getADMap();
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
            this.initMap(116.397428, 39.90923);
            this.mark();
          })
    },
    // 初始化地图
    initMap (positionX, positionY) {
      let map = new window.AMap.Map('allmap', {
        zoom:12,//级别
        resizeEnable: true,
        viewMode:'2D',//使用3D视图
        lang:'zh_cn'  //设置地图语言类型
      });
      window.map = map
      this.nowPosition();
      this.priceControl();
    },
    // 定位到当前位置
    nowPosition () {
      const that = this;
      map.plugin('AMap.Geolocation', function() {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,     // 是否使用高精度定位，默认：true
          timeout: 1000,         // 设置定位超时时间，默认：无穷大
          buttonOffset: new AMap.Pixel(10, 40),   // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
          showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
          showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
          panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
          // zoomToAccuracy: true,   //定位成功后是否自动调整地图视野到定位点
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
          that.zoomPosition(1)
        }
        function onError (data) {
          // 定位出错
          alert('定位失败')
        }
      })
    },
    // 点标记
    mark () {
      map.remove(this.markerList)
      this.markerList = [];
      this.equipmentPosition.forEach(item => {
        // 设置 定位点图标的颜色
        if (item.f_state == true) {
          this.icon = this.apiHost + '/images/system/location_red.png'
        } else {
          this.icon = this.apiHost + '/images/system/location_gray.png'
        }
        // 定位图标
        var marker = new AMap.Marker({
          position:[item.f_lng, item.f_lat],//位置
          title: 'item.f_name',
          icon: this.icon,
          offset: new AMap.Pixel(-15,-27),
          clickable: true
        })
        var  label={content:"名称："+item.f_name+"<br>地址："+item.f_address,offset:new AMap.Pixel(24,-24)};
        marker.on("click",function(){
          var markers=map.getAllOverlays("marker");
          if(markers.length==1){
            marker.setLabel(label);
          }else{
            //先把其他的标记点的label删除
            for(var i=0;i<markers.length;i++){
              markers[i].setLabel("");
            }
            //再设置当前点的label
            marker.setLabel(label);
            marker.setzIndex(10);
          }
        });
        // 添加多个点 在地图上
        this.markerList.push(marker)
        // 把点全部显示在页面上
        map.setFitView();
      })
      map.add(this.markerList)


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
    // 点击定位
    zoomPosition (size) {
      // var bounds = map.getCenter();  // 当前地图中心位置
      // size = 20;
      var lnglat = new AMap.LngLat(this.positionSize.lng, this.positionSize.lat) // lng, lat 替换成传入的坐标
      var southWest = lnglat.offset(-(size*1000), -(size*1000))   // 西南三公里
      var northEast = lnglat.offset((size*1000), (size*1000))     // 东北三公里
      this.getSitePositionInfo(southWest, northEast) // 获取 公里范围内的  所有站点位置信息
    },
    // 获取 一块区域内的 站点位置信息
    getSitePositionInfo (southWest, northEast) {
      this.$http
        .get(`${this.apiHost}chargeStation/weixin/wxFindChargersByScope.do?token=${this.token}&f_hori_min=${southWest.lng}&f_vert_min=${southWest.lat}&f_hori_max=${northEast.lng}&f_vert_max=${northEast.lat}`)
        .then(res => {
          const {rows} = res.data
          if (rows == undefined || rows.length == 0) {
            // alert('附近没有设备')
          } else {
            this.equipmentPosition = rows
            this.mark()
          }
        })
    }
  }
}
</script>

<style scoped>
.nearbybody {
  height: 100%;
  width: 100%;
}
#allmap {
  width: 100%;
  height: 100%;
  background-colors: lightgreen;
}
.zoom {
  position: fixed;
  top: 6px;
  z-index: 1000;
  box-sizing: border-box;
  padding: 0 40px;
}
.zoom span {
  display: block;
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-sizing: border-box;
  background-color: #10AEFF;
  color: #fff;
}
</style>
