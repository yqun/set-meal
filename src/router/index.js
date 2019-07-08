import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/home'
import Personal from '@/views/personal'           // 个人中心
import Login from '@/views/login'           // 登陆
import Expense from '@/views/personal/expense'    // 消费记录
import Enshrine from '@/views/personal/enshrine'  // 我的收藏
import Nearby from '@/views/personal/nearby'  // 附近设备
import Recharge from '@/views/personal/recharge'  // 充值中心
import Rechargeorder from '@/views/personal/rechargeorder'  // 充值记录
import Bankcard from '@/views/personal/bankcard'  // 我的卡包
import Employ from '@/views/personal/employ' // 正在使用
import Commercial from '@/views/commercial' //商户入口
import ItemList from '@/views/commercial/itemList'  //提现记录
import ChargAdmin from '@/views/commercial/chargAdmin'  //电桩管理
import ChargeWay from '@/views/commercial/chargeWay'  //收费方式
import SiteAdmin from '@/views/commercial/siteAdmin'  //站点管理
import Register from '@/views/commercial/register' // 扫码
// 提现记录
import DailyReport from '@/views/commercial/itemList/dailyReport' // 日报
import MonthlyReport from '@/views/commercial/itemList/monthlyReport' // 月报
import OrderForm from '@/views/commercial/itemList/orderForm' // 订单
// 站点管理
import AddSite from '@/views/commercial/siteAdmin/addSite' // 添加站点
// 订单详情
import Expenseinfo from '@/views/personal/expenseinfo' // 订单详情


Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/home',         name: 'Home',         component: Home},
    {path: '/personal',     name: 'personal',     component: Personal},
    {path: '/login',        name: 'login',        component: Login},
    {path: '/expense',      name: 'expense',      component: Expense},
    {path: '/enshrine',     name: 'enshrine',     component: Enshrine},
    {path: '/nearby',       name: 'nearby',       component: Nearby},
    {path: '/recharge',     name: 'recharge',     component: Recharge},
    {path: '/rechargeorder',name: 'rechargeorder',component: Rechargeorder},
    {path: '/bankcard',     name: 'bankcard',     component: Bankcard},
    {path: '/employ',       name: 'employ',       component: Employ},
    {path: '/commercial',   name: 'commercial',   component: Commercial},
    {path: '/itemList',     name: 'itemList',     component: ItemList},
    {path: '/chargAdmin',   name: 'chargAdmin',   component: ChargAdmin},
    {path: '/chargeWay',    name: 'chargeWay',    component: ChargeWay},
    {path: '/siteAdmin',    name: 'siteAdmin',    component: SiteAdmin},
    {path: '/register/:id', name: 'register',     component: Register},
    {path: '/dailyReport',  name: 'dailyReport',  component: DailyReport},
    {path: '/monthlyReport',name: 'monthlyReport',component: MonthlyReport},
    {path: '/orderForm',    name: 'orderForm',    component: OrderForm},
    {path: '/addSite/:id',  name: 'addSite',      component: AddSite},
    {path: '/expenseinfo/:id',name: 'expenseinfo',component: Expenseinfo},
  ]
})

// 在跳转之前会触发拦截
router.beforeEach((to, from, next) => {
  // console.log(to, from)
  if (to.path === '/home') {
    next()
  } else {
    const token = sessionStorage.getItem('token')
    if (!token) {
      router.push('/home')
      // next()
    } else {
      next()
    }
  }
  // if (to.path === '/expense' || to.path === '/personal') {
  //   console.log(1)
  //   next()
  // }
})

export default router
