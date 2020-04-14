'use strict'

import axios from 'axios'
import qs from 'qs'
// axios.defaults.baseURL=process.env.baseURL||process.env.apiUrl||'';
// axios.defaults.headers.common['Authorization']=AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded';

const baseURL = window.SYSTEM_CONFIG.webServer // 基础服务地址
export default class Ajax {
  constructor(config = {
    baseURL,
    // baseURL:process.env.baseURL||process.env.apiUrl||""
    Token: '',
    TIMEOUT: 60000
  }) {
    // 创建一个新的axios实例，并设置默认请求地址和请求头
    this._axios = axios.create(config)
    this._axios.interceptors.request.use(
      config => {
        return config
      },
      error => {
        return Promise.reject(error)
      }
    )
    this._axios.interceptors.response.use(
      response => {
        return response.data
      },
      error => {
        return Promise.reject(error)
      }
    )
  }

  // 请求方式优化
  get (url, params = {}) {
    return this._axios({ method: 'get', url, params })
  }

  patch (url, params = {}) {
    return this._axios({ method: 'patch', url, params })
  }

  post (url, data = {}, params = {}) {
    return this._axios({
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      url,
      data: qs.stringify(data),
      params
    })
  }
}
