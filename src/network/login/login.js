import axios from 'axios'
import {
  request
} from '../request'

export function loginCheck(data) {
  // axios.post('/user/getMailCode', {
  //   "mail": "175934443@qq.com"
  // })
  return request({
    url: '/user/login',
    method: 'post',
    data: data
  })
}
