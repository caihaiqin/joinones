import axios from 'axios'
import {
  request
} from '../request'

export function getCode(data) {
  // axios.post('/user/getMailCode', {
  //   "mail": "175934443@qq.com"
  // })
  return request({
    url: '/user/getMailCode',
    method: 'post',
    data: data
  })
}
