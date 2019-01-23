<template>
  <div class="content">
    <h3>订单详情</h3>
    <v-chart @on-render="getPowerData" prevent-render></v-chart>
    <v-chart @on-render="getRestsData" prevent-render></v-chart>
  </div>
</template>

<script>
import { VChart, VLine, VArea, VTooltip, VLegend, VScale } from 'vux'
export default {
  name: "expenseinfo",
  components: {
    VChart,
    VLine,
    VTooltip,
    VArea,
    VLegend,
    VScale
  },
  data() {
    return {
      token: '',
      power: [],
      rests: [],
    }
  },
  created() {
    this.judgeToken()
  },
  methods: {
    judgeToken() {
      this.token = window.sessionStorage.getItem('token');
    },
    // 获取功率的数据信息
    getPowerData({chart}) {
      const expenseId = this.$route.params.id
      this.$http
        .get(`${this.apiHost}/Order/weixin/wxFindOrderDetail.do?token=${this.token}&f_order_id=${expenseId}`)
        .then(res => {
          let {powers, f_order_type} = res.data.order
          let maxvalue;
          f_order_type==1?maxvalue = 300:maxvalue=7000
          if (powers) {
            this.power = []
            // 循环 得到 powers数据
            powers.forEach(item => {
              const {f_power, f_time} = item
              if (f_power) this.power.push({name: "功率", value: f_power,date: f_time})
            })
            chart.source(this.power, {
              date: {
                range: [0, 1],
                type: 'timeCat',
                mask: 'HH:mm'
              },
              value: {
                max: maxvalue,
                tickCount: 4
              }
            });
            // draw a column chart
            chart.line().position('date*value').color('name');
            const width = chart.get('width')
            chart.changeSize(width - 14)
          }// end if
        })
    },
    // 获取 其他数据信息
    getRestsData({chart}) {
      const expenseId = this.$route.params.id
      this.$http
        .get(`${this.apiHost}/Order/weixin/wxFindOrderDetail.do?token=${this.token}&f_order_id=${expenseId}`)
        .then(res => {
          const {powers} = res.data.order
          if (powers) {
            this.rests = []
            // 循环 得到 powers数据
            powers.forEach(item => {
              const {f_battery_temp, f_electric_current, f_electric_wire_temp, f_voltage, f_time} = item
              if (f_battery_temp) this.rests.push({name: '电池温度',value: f_battery_temp,date: f_time})
              if (f_electric_current) this.rests.push({name: '电流',   value: f_electric_current,date: f_time})
              if (f_electric_wire_temp) this.rests.push({name: '线缆温度',value: f_electric_wire_temp,date: f_time})
              if (f_voltage) this.rests.push({name: '电压',   value: f_voltage,date: f_time})
            })
            chart.source(this.rests, {
              date: {
                range: [0, 1],
                type: 'timeCat',
                mask: 'HH:mm'
              },
              value: {
                max: 300,
                tickCount: 4
              }
            });
            // draw a column chart
            chart.line().position('date*value').color('name');
            const width = chart.get('width')
            chart.changeSize(width - 14)
          }// end if
        })
    },
  }
}
</script>

<style scoped>
.content {
  padding: 10px 0px;
  box-sizing: border-box;
}
h3 {
  text-align: center;
}
</style>
