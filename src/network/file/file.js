import {
  request
} from '../request.js'
export function downFile(fileType) {
  return request({
    url: '/file/download',
    method: 'get',
    // query: {
    //   filename: filename
    // }
    params: {
      fileType: fileType
    }
  })
}
