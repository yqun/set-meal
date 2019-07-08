<template>
  <div class="comm-body">
    <!-- 返回导航 -->
    <comm-admin go="commercial"></comm-admin>
    <div class="content">
      <p>
        <x-button type="primary" link="/register/0" style="background-color: #39bafc; font-size: 16px;">
          <x-icon type="ios-plus-outline" size="20" style="position: relative;top: 4px; fill: #fff;"></x-icon>
          添加电桩
        </x-button>
      </p>
      <ul class="container">
        <li v-for="item in list" :key="item.id" class="clearfix">
          <div>
            <h3>{{item.f_sn_num}}</h3>
            <div class="siteinfo">
            <p>
              最大功率：<strong style="color: orange">{{item.f_power || 0}}W</strong>
              设备状态：<strong v-if="item.f_state == true" style="color: orange">上线</strong>
              <strong v-else style="color: orange">下线</strong>
            </p>
              <!-- 其他三类桩 -->
            <p v-if="item.f_manufacturer != 1">
              信号：<strong v-if="item.f_overtime == false" style="color:green">
                    <i class="iconfont icon-WIFIxinhao-ji"></i>
                  </strong>
                  <strong v-else-if="item.f_overtime == true" style="color:#ccc">
                    <i class="iconfont icon-WIFIxinhao-ji1"></i>
                  </strong>
              所属电站：<strong style="color: green;">{{item.chargeStation.f_name}}</strong>
            </p>
              <!-- 普通充电桩 -->
            <p v-if="item.f_manufacturer == 1">
              信号：<strong v-if="item.f_signal == 5 || item.f_signal == 4" style="color:green">
                    <i class="iconfont icon-WIFIxinhao-ji"></i>
                   </strong>
                   <strong v-else-if="item.f_signal == 3" style="color:green">
                     <i class="iconfont icon-WIFIxinhao-ji1"></i>
                   </strong>
                   <strong v-else-if="item.f_signal == 2" style="color:brown">
                     <i class="iconfont icon-WIFIxinhao-ji2"></i>
                   </strong>
                   <strong v-else-if="item.f_signal == 1" style="color:#ccc">
                     <i class="iconfont icon-WIFIxinhao-ji3"></i>
                   </strong>
                   <strong v-else-if="item.f_signal == 0" style="color:#ccc">
                     <i class="iconfont icon-WIFIxinhao-wu"></i>
                   </strong>
              所属电站：<strong style="color: green;">{{item.chargeStation.f_name}}</strong>
            </p>
          </div>
          </div>
          <div class="btn">
            <div class="clearfix">
              <x-button type="primary" mini @click.native="downLine(item.id)" style="background-color: #39bafc;">下线</x-button>
              <x-button type="primary" mini @click.native="upLine(item.id)" style="background-color: #39bafc;">上线</x-button>
            </div>
            <div class="clearfix" style="margin-top: 4px;">
              <x-button type="warn" mini @click.native="updateSiteItem(item.id)">重绑</x-button>
              <x-button type="warn" mini @click.native="deleteSiteItem(item.id)">删除</x-button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "chargAdmin",
  data() {
    return {
      searchValue: '',
      list: [],
      f_signal: 0, // 信号
    }
  },
  created () {
    this.judgeToken()
    this.getSitelist()
  },
  methods: {
    // 判断token
    judgeToken() {
      this.token = window.sessionStorage.getItem('token');
    },
    // 获取  电桩信息
    getSitelist () {
      this.$http
        .get(`${this.apiHost}charger/weixin/wxFindCurrentChargeList.do?token=${this.token}`)
        .then(res => {
          // console.log(res)
          const {state, rows} = res.data
          if (state === true) {
            this.list = rows
            rows.forEach(item => {
              // console.log(item.f_manufacturer)
              // item.f_overtime = true
              if (item.f_overtime == true) {
                item.f_signal = 0;
              }
            })
          }
        })
    },
    // 删除 站点
    deleteSiteItem (id) {
      const con = confirm('确定删除')
      if (con == true) {
        this.$http
          .get(`${this.apiHost}charger/weixin/wxDeleteCharger.do?token=${this.token}&id=${id}`)
          .then(res => {
            const {data} = res
            if (data.state) {
              this.$vux.toast.text('删除成功')
            }
            if (!data.state) {
              this.$vux.toast.text(data.error)
            }
            this.getSitelist()
          })
      }
    },
    // 电桩上线
    upLine (id) {
      this.$http
        .get(`${this.apiHost}charger/weixin/wxOnLineChargers.do?token=${this.token}&id=${id}`)
        .then(res => {
          const {data} = res
          if (data.state) {
            this.$vux.toast.text('操作成功')
          }
          if (!data.state) {
            this.$vux.toast.text(data.error)
          }
          this.getSitelist()
        })
    },
    // 电桩下线
    downLine (id) {
      this.$http
        .get(`${this.apiHost}charger/weixin/wxOffLineChargers.do?token=${this.token}&id=${id}`)
        .then(res => {
          const {data} = res
          if (data.state) {
            this.$vux.toast.text('操作成功')
          }
          if (!data.state) {
            this.$vux.toast.text(data.error)
          }
          this.getSitelist()
        })
    },
    // 修改电桩
    updateSiteItem(id) {
      this.$router.push(`/register/${id}`)
    }
  }
}
</script>

<style scoped>
.comm-body {
  width: 100%;
  height: 100%;
  background-color: #efefef;
}
.search {
  padding: 5px 10px;
  border-bottom: 1px solid #dfdfdf;
}
.search input {
  width: 100%;
  height: 24px;
  border-radius: 3px;
  background-color: #fff;
  border: none;
  outline: none;
  text-align: center;
  line-height: 20px;
  font-size: 14px;
}
.content > p {
  padding: 10px;
}
.container li {
  padding: 10px;
  border-bottom: 1px solid #efefef;
  background-color: #fff;
}
.container li > div {
  float: left;
  width: 65%;
  box-sizing: border-box;
}
.container li > div.btn {
  width: 35%;
}
.container li h3 {
  font-weight: 400;
  font-size: 16px;
  color: #333;
}
.container li button {
  float: right;
  margin-left: 5px;
  padding: 0 10px;
}
.weui-btn + .weui-btn {
  margin-top: 0;
}
.container li > div {
  font-size: 12px;
  color: #aaa;
}
.siteinfo strong {
  margin-right: 4px;
}
</style>
