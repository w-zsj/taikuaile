import request from '@/utils/request'
export function fetchList(parentId, params) {
  return request({
    url: '/productClassify/list/' + parentId,
    method: 'get',
    params: params
  })
}
export function deleteProductClassify(id) {
  return request({
    url: '/productClassify/delete/' + id,
    method: 'post'
  })
}

export function createProductClassify(data) {
  return request({
    url: '/productClassify/create',
    method: 'post',
    data: data
  })
}

export function updateProductClassify(id, data) {
  return request({
    url: '/productClassify/update/' + id,
    method: 'post',
    data: data
  })
}

export function getProductClassify(id) {
  return request({
    url: '/productClassify/' + id,
    method: 'get',
  })
}

export function updateShowStatus(data) {
  return request({
    url: '/productClassify/update/showStatus',
    method: 'post',
    data: data
  })
}

export function updateNavStatus(data) {
  return request({
    url: '/productClassify/update/navStatus',
    method: 'post',
    data: data
  })
}

export function fetchListWithChildren() {
  return request({
    url: '/productClassify/list/withChildren',
    method: 'get'
  })
}

// 根据店铺查询分类列表
export function fetchProductClassifyListByBiz(bizCode) {
  return request({
    url: '/productClassify/list/all/' + bizCode,
    method: 'post'
  })
}
