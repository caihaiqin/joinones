import {
  request
} from '../request.js'
//解析简历
export function getCandidateByFile(filename) {
  return request({
    url: '/file/analysis',
    method: 'post',
    data: {
      filename: filename
    }
  })
}

export function getCandidateByPage(pageSize, page) {
  return request({
    url: '/candidate/getCandidateByPage',
    method: 'post',
    data: {
      pageSize: pageSize,
      page: page
    }
  })
}

export function getCandidateAll() {
  return request({
    url: '/candidate/getCandidateAll',
    method: 'post',

  })
}


export function getCandidateByKeyword(keyword) {
  return request({
    url: '/candidate/getCandidateByKeyword',
    method: 'post',
    data: {
      keyword: keyword,

    }
  })
}
export function getCandidateById(id) {
  return request({
    url: '/candidate/getCandidateById',
    method: 'post',
    data: {
      id: id,

    }
  })
}
export function updateCandidateById(id, update) {
  return request({
    url: '/candidate/updateCandidateById',
    method: 'post',
    data: {
      id: id,
      update: update

    }
  })
}

export function removeCandidateById(id) {
  return request({
    url: '/candidate/removeCandidateById',
    method: 'post',
    data: {
      id: id,

    }
  })
}

export function addCandidateOnline(options) {
  return request({
    url: '/candidate/add',
    method: 'post',
    data: options
  })
}

export function addCandidateFromExcel(options) {
  return request({
    url: '/candidate/addFromExcel',
    method: 'post',
    data: {
      candidateList: options
    }
  })
}
export function checkCandidate(options) {
  return request({
    url: '/candidate/checkCandidate',
    method: 'post',
    data: options
  })
}
