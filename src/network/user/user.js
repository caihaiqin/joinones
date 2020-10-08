import {
  request
} from '../request'
export function getAllUser() {

  return request({
    url: '/user/getAllUser',
    method: 'get',
  })
}
