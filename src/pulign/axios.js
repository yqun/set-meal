import Vue from 'vue'
import axios from 'axios'
import queryString from 'querystring'

const urlStr = 'http://10.1.9.34:1444/platform/'

const HttpTool = axios.create({
  baseURL: urlStr,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  transformRequest: [function (data) {
    return queryString.stringify(data);
  }],
});
axios.interceptors.request.use(
  response => {
    // console.log('请求拦截器响应成功')
    const AUTH_TOKEN = window.sessionStorage.getItem('token');
    // header 添加token
    response.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    return response
  },
  error => {

  }
)
Vue.prototype.axios = HttpTool
// HttpTool.install = (Vue) => {
//
//   axios.defaults.baseURL = 'http://10.1.9.34:1444/platform/'
//   // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
//   // 请求拦截器
//   // Add a request interceptor
//   axios.interceptors.request.use(function (config) {
//     // 除了登录功能，其他功能接口都需要token
//     // const AUTH_TOKEN = window.sessionStorage.getItem('token');
//     // header 添加token
//     // config.headers.common['Authorization'] = AUTH_TOKEN;
//     // Do something before request is sent
//     return config
//   }, function (error) {
//     // Do something with request error
//     return Promise.reject(error)
//   })
//   // 相应拦截器
//   // Add a response interceptor
//   axios.interceptors.response.use(function (response) {
//     // Do something with response data
//     // console.log(response)
//     return response
//   }, function (error) {
//     // Do something with response error
//     return Promise.reject(error)
//   })
// }




export default HttpTool
