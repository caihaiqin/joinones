import {
  request
} from '../request.js'

export function getCandidate(data) {
  return request({
    url: '/goods.json',
    method: 'post',
    data: data
  })
}
