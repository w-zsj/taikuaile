/*
 * @Author: your name
 * @Date: 2021-08-25 10:34:20
 * @LastEditTime: 2021-10-13 13:44:49
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \project\mall-admin-web\src\api\order.js
 */
import request from '@/utils/request'
export function fetchList(params) {
  return request({
    url: '/order/list',
    method: 'post',
    data: params
  })
}
export function addOrder(params) {
  return request({
    url: '/order/addOrder',
    method: 'post',
    data: params
  })
}
export function updateOrder(params) {
  return request({
    url: '/order/update',
    method: 'post',
    data: params
  })
}

// 订单数量
export function countOrder(params) {
  return request({
    url: '/order/count',
    method: 'post',
    data: params
  })
}
// 
export function editPrice(params) {
  return request({
    url: '/order/modifyPrice',
    method: 'post',
    data: params
  })
}

export function closeOrder(params) {
  return request({
    url: '/order/update/close',
    method: 'post',
    params: params
  })
}

export function deleteOrder(params) {
  return request({
    url: '/order/delete',
    method: 'post',
    data: params
  })
}

// 催付
export function remind(id) {
  return request({
    url: '/order/remind',
    method: 'post',
    data: { id }
  })
}
// 到达泰国
export function updateArrive(id) {
  return request({
    url: '/order/update/arrive/?id=' + id,
    method: 'post',
    data: {}
  })
}

// 确认送达
export function updateConfirm(id) {
  return request({
    url: '/order/update/confirm/?id=' + id,
    method: 'post',
    data: {}
  })
}



export function deliveryOrder(data) {
  return request({
    url: '/order/update/delivery',
    method: 'post',
    data: data
  });
}

export function getOrderDetail(id) {
  return request({
    url: '/order/' + id,
    method: 'get'
  });
}

export function updateReceiverInfo(data) {
  return request({
    url: '/order/update/receiverInfo',
    method: 'post',
    data: data
  });
}

export function updateMoneyInfo(data) {
  return request({
    url: '/order/update/moneyInfo',
    method: 'post',
    data: data
  });
}

export function updateOrderNote(params) {
  return request({
    url: '/order/update/note',
    method: 'post',
    params: params
  })
}

export function getDeliveryDetail(data) {
  return request({
    url: '/order/queryDeliveryListDetail',
    method: 'post',
    data: data
  })
}
export function orderApprove(data) {
  return request({
    url: '/order/approve',
    method: 'post',
    data: data
  })
}
export function printOrder(data) {
  return request({
    url: '/order/print',
    method: 'post',
    data: data
  })
}

export function downloadOrderSnDetail(data) {
  return request({
    url: '/order/downloadOrderSnDetail',
    method: 'get',
    params: data,
    responseType: 'blob'
  })
}