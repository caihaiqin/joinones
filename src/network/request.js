import axios from 'axios'
export function request(config) {
  const instance = axios.create({
    baseURL: 'http://81.68.227.246:3000',
    // timeout: 5000
  })
  //添加请求拦截器添加token
  instance.interceptors.request.use(config => {
    console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
  })
  instance.interceptors.response.use(res => {
    return res.data
  }, err => {
    return err
  })
  return instance(config)
}
