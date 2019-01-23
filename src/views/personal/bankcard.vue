<template>
  <div class="bankcard">
    <!-- 搜索卡 -->
    <!--<div class="inputcard">-->
      <!--<input type="text" v-model="bankcard" placeholder="请输入卡名/卡号">-->
      <!--<icon type="search"></icon>-->
    <!--</div>-->
    <!-- 添加银行卡 -->
    <div class="card clearfix">
      <div style="float: left">
        <span class="cardnum"><i class="iconfont icon-yinhangqia"></i>卡({{list.length}})</span>
      </div>
      <div style="float: right" @click="addCard()">
        <x-icon type="ios-plus-empty" size="28"></x-icon>
        <span class="addcard">添加新卡</span>
      </div>
    </div>
    <!-- 卡列表 -->
    <div class="cardlist">
      <flexbox orient="vertical">
        <flexbox-item v-for="(item,index) in list" :key="index">
          <div class="flex-demo"
               @touchstart.prevent="cardtouchstart(item.id)"
               @touchmove.prevent="cardtouchmove()"
               @touchend.prevent="cardtouchend()">
            <p>智联充冲电卡</p>
            <p>创建日期：{{item.f_band_time}}</p>
            <p>{{item.f_card_sn}}</p>
          </div>
        </flexbox-item>
      </flexbox>
    </div>
    <!-- 添加充电卡 -->
    <confirm v-model="addCardconshow"
             :title="contitle"
             @on-cancel="addCardonCancel()"
             @on-confirm="addCardonConfirm()">
      <group>
        <x-input title="卡号" v-model="cardid" :show-clear="false" :max="16"></x-input>
      </group>
    </confirm>
    <!-- 删除充电卡 -->
    <confirm v-model="deleteCardconshow"
             content="是否删除该充电卡"
             @on-confirm="deleteCardonConfirm()">
    </confirm>
    <!-- 信息提示 -->
    <toast type="text" v-model="toastshow" is-show-mask :text="toastMsg"></toast>
  </div>
</template>

<script>
export default {
  name: "bankcard",
  data () {
    return {
      token: '',
      bankcard: '',
      list: [],
      addCardconshow: false, // 弹框显示隐藏
      deleteCardconshow: false, //
      contitle: '添加冲电卡',
      cardid: '',
      pagesizeAll: 1, // 总数据分页
      timeOutEvent: 0, // 定时器
      deleteCardId: '', // 删除充电卡的id
      toastshow: false, // 提示信息展示
      toastMsg: '',
    }
  },
  created () {
    this.judgeToken()
    this.getAllCardInfo()
  },
  methods: {
    // 判断token
    judgeToken() {
      this.token = window.sessionStorage.getItem('token');
    },
    // 获取所有卡信息
    getAllCardInfo() {
      this.$http
        .get(`${this.apiHost}cashCard/weixin/wxFindMyCashCardByPage.do?token=${this.token}`)
        .then(res => {
          const {state, rows} = res.data
          this.list = rows
        })
    },
    // 点击添加卡的按钮
    addCard () {
      this.addCardconshow = true
    },
    // 点击取消 清空输入框的值
    addCardonCancel () {
      this.cardid = ''
    },
    // 点击确定  保存冲电卡
    addCardonConfirm () {
      if (this.cardid.trim()) {
        // 添加充电卡
        this.$http
          .get(`${this.apiHost}cashCard/weixin/wxBandCashCard.do?token=${this.token}&f_card_sn=${this.cardid}`)
          .then(res => {
            const {state} = res.data
            // console.log(res)
            if (state == true) {
              this.toastshow = true
              this.toastMsg = '添加成功'
              this.getAllCardInfo()
            }
          })
        this.cardid = ''
      } else {
        this.toastshow = true
        this.toastMsg = '请填写正确的卡号'
      }

    },
    // 长按事件
    cardtouchstart (id) {
      this.deleteCardId = id
      this.timeOutEvent = setTimeout(this.deleteCard, 800)
    },
    cardtouchmove () {
      clearTimeout(this.timeOutEvent)
      this.timeOutEvent = 0
    },
    cardtouchend () {
      clearTimeout(this.timeOutEvent)
    },
    // 弹框是否删除该冲电卡
    deleteCard() {
      this.deleteCardconshow = true
    },
    // 点击确定删除
    deleteCardonConfirm() {
      this.$http
        .get(`${this.apiHost}cashCard/weixin/wxUnbandCashCard.do?token=${this.token}&id=${this.deleteCardId}`)
        .then(res => {
          this.getAllCardInfo()
          this.toastshow = true
          this.toastMsg = '删除成功'
        })
    }
  }
}
</script>

<style scoped>
/*清除浮动*/
.clearfix::before, .clearfix::after {
  content:"";
  display: block;
  overflow: hidden;
  height: 0;
}
.clearfix::after {
  clear: both;
}
.inputcard {
  border-bottom: 1px solid #ccc;
  padding: 10px 20px 10px 10px;
  position: relative;
}
input {
  width: 100%;
  border: none;
  background-color: #eee;
  padding: 10px 5px;
  border-radius: 5px;
  outline-color: transparent;
}
.inputcard i {
  position: absolute;
  right: 20px;
  top: 20px;
}
.card {
  padding: 10px 16px;
}
.card svg {
  position: relative;
  right: -3px;
  top: -1px;
}
.cardnum i {
  color: #1E9FFF;
  font-size: 20px;
  vertical-align: middle;
  padding-right: 4px;
}
.addcard {
  float: right;
}
.cardlist {
  padding: 0 20px;
}
.flex-demo {
  height: 110px;
  background-color: #6388e0;
  border-radius: 10px;
  padding-top: 10px;
  box-sizing: border-box;
}
.vux-flexbox-item {
  margin-top: 14px !important;
}
.flex-demo p {
  color: #fff;
  margin: 10px 0 0 30px;
  font-size: 14px;
}
</style>
