import axios from 'axios'

const HttpTool = {}
HttpTool.install = (Vue) => {

  axios.defaults.baseURL = 'http://10.1.9.34:1444/platform/'
  // axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
  // 请求拦截器
  // Add a request interceptor
  axios.interceptors.request.use(function (config) {
    // 除了登录功能，其他功能接口都需要token
    // const AUTH_TOKEN = window.sessionStorage.getItem('token');
    // header 添加token
    // config.headers.common['Authorization'] = AUTH_TOKEN;
    // Do something before request is sent
    return config
  }, function (error) {
    // Do something with request error
    return Promise.reject(error)
  })
  // 相应拦截器
  // Add a response interceptor
  axios.interceptors.response.use(function (response) {
    // Do something with response data
    // console.log(response)
    return response
  }, function (error) {
    // Do something with response error
    return Promise.reject(error)
  })
  Vue.prototype.$ajax = axios
}




export default HttpTool
