// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './router'
// import HttpTool from './pulign/axios'
import global from './static/global'
// 自定义全局组件
import commAdmin from '@/component/commAdmin'

// 全局组件
import { Swiper, SwiperItem } from 'vux'
import { Flexbox, FlexboxItem } from 'vux'
import { Icon } from 'vux'
import { XButton } from 'vux'
import { Tab, TabItem } from 'vux'
import { Cell } from 'vux'
import { Calendar } from 'vux'
import { Selector  } from 'vux'
import { Group } from 'vux'
import { FormPreview } from 'vux'
import { ButtonTab, ButtonTabItem } from 'vux'
import { AjaxPlugin } from 'vux'
import { Confirm } from 'vux'
import { Toast } from 'vux'
import { Scroller, LoadMore  } from 'vux'
import { XInput } from 'vux'
import { XTable } from 'vux'
import { Loading } from 'vux'
import { Datetime } from 'vux'
import { XTextarea } from 'vux'
import  { ToastPlugin } from 'vux'
import  { ConfirmPlugin } from 'vux'
import  { LoadingPlugin } from 'vux'


// 导入css
import './assets/font/iconfont.css'
import './assets/font01/iconfont.css'
import './assets/css/commont.css'

// Vue.use(HttpTool)
Vue.use(AjaxPlugin)
Vue.prototype.apiHost = global.apiHost

FastClick.attach(document.body)

Vue.config.productionTip = false

Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
Vue.component('icon', Icon)
Vue.component('x-button', XButton)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('cell', Cell)
Vue.component('calendar', Calendar)
Vue.component('selector', Selector )
Vue.component('group', Group)
Vue.component('form-preview', FormPreview)
Vue.component('Swiper', Swiper)
Vue.component('SwiperItem', SwiperItem)
Vue.component('button-tab', ButtonTab)
Vue.component('button-tab-item', ButtonTabItem)
Vue.component('confirm', Confirm)
Vue.component('toast', Toast)
Vue.component('scroller', Scroller)
Vue.component('LoadMore', LoadMore )
Vue.component('commAdmin', commAdmin ) // 自定义全局组件
Vue.component('x-input', XInput)
Vue.component('x-table', XTable)
Vue.component('loading', Loading)
Vue.component('datetime', Datetime)
Vue.component('x-textarea', XTextarea)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(LoadingPlugin)



new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
