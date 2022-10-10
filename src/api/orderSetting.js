import request from '@/utils/request'
export function getOrderSetting(id) {
  return request({
    url: '/config/order/' + id,
    method: 'get',
  })
}

export function updateOrderSetting(id, data) {
  return request({
    url: '/config/order/update/' + id,
    method: 'post',
    data: data
  })
}
