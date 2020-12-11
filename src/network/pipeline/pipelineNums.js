import {
  request
} from '../request.js'
export function setPipelineNums(options) {

  return request({
    url: '/pipeline/setNums',
    method: 'post',
    data: options
  })
}
export function getPipelineNums() {

  return request({
    url: '/pipeline/getNums',
    method: 'get',

  })
}
