import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'home',
      component: () => import('@/views/dashboard/index.vue'),
      meta: { title: '首页', icon: 'home', affix: true }
    },
    {
      path: 'updatePassWord',
      name: 'updatePassWord',
      component: () => import('@/views/updatepassword/index'),
      meta: { title: '修改密码', icon: 'home', affix: true },
      hidden: true
    }]
  },
]

export const asyncRouterMap = [

  {
    path: '/nwn',
    component: Layout,
    redirect: '/nwn/list',
    name: 'nwn',
    meta: { title: '无主件管理', icon: 'order-return-reason' },
    children: [
      {
        path: 'list',
        name: 'nwnOrder',
        component: () => import('@/views/nwn/index.vue'),
        meta: { title: '无主件管理', icon: 'order-return-reason' },
      },


    ]
  },
  {
    path: '/oms',
    component: Layout,
    redirect: '/oms/trade',
    name: 'oms',
    meta: { title: '交易管理', icon: 'total-week' },
    children: [
      {
        path: 'order',
        name: 'omsOrder',
        component: () => import('@/views/oms/order/index.vue'),
        meta: { title: '订单列表', icon: 'product-list' },
      },
      {
        path: 'orderDetail',
        name: 'orderDetail',
        component: () => import('@/views/oms/order/orderDetail'),
        meta: { title: '订单详情' },
        hidden: true
      },
      // {
      //   path: 'orderSetting',
      //   name: 'orderSetting',
      //   component: () => import('@/views/oms/order/setting'),
      //   meta: { title: '订单设置', icon: 'order-setting' }
      // },
    ]
  },
  {
    path: '/sms',
    component: Layout,
    redirect: '/sms/advertise',
    name: 'sms',
    meta: { title: '营销', icon: 'sms' },
    children: [
      {
        path: 'advertise',
        name: 'homeAdvertise',
        component: () => import('@/views/sms/advertise/index'),
        meta: { title: 'banner管理', icon: 'sms-ad' }
      },
      {
        path: 'addAdvertise',
        name: 'addHomeAdvertise',
        component: () => import('@/views/sms/advertise/add'),
        meta: { title: '添加广告' },
        hidden: true
      },
      {
        path: 'updateAdvertise',
        name: 'updateHomeAdvertise',
        component: () => import('@/views/sms/advertise/update'),
        meta: { title: '编辑广告' },
        hidden: true
      },
    ]
  },
  {
    path: '/rms',
    component: Layout,
    redirect: '/rms/pay',
    name: 'rms',
    meta: { title: '支付管理', icon: 'total-today' },
    children: [
      {
        path: 'recharge',
        name: 'rmsRecharge',
        component: () => import('@/views/rms/recharge/index.vue'),
        meta: { title: '充值列表', icon: 'sms-coupon-package' },
      },
      {
        path: 'pay/setting',
        name: 'rmsSetting',
        component: () => import('@/views/rms/paySetting/index.vue'),
        meta: { title: '支付设置', icon: 'order-setting' },
      },
    ]
  },
  {
    path: '/mms',
    component: Layout,
    redirect: '/mms/member',
    name: 'mms',
    meta: { title: '会员管理', icon: 'vip-manage' },
    children: [
      {
        path: 'member',
        name: 'mmsMember',
        component: () => import('@/views/mms/member/index.vue'),
        meta: { title: '会员列表', icon: 'order-setting' },
      },
      // {
      //   path: 'record',
      //   name: 'mmsRecord',
      //   component: () => import('@/views/mms/record/index.vue'),
      //   meta: { title: '记录管理', icon: 'vip' },
      // },
    ]
  },
  {
    path: '/ums',
    component: Layout,
    redirect: '/ums/admin',
    name: 'ums',
    meta: { title: '权限', icon: 'ums' },
    children: [
      {
        path: 'admin',
        name: 'admin',
        component: () => import('@/views/ums/admin/index.vue'),
        meta: { title: '用户列表', icon: 'ums-admin' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/ums/role/index'),
        meta: { title: '角色列表', icon: 'ums-role' }
      },
      {
        path: 'allocMenu',
        name: 'allocMenu',
        component: () => import('@/views/ums/role/allocMenu'),
        meta: { title: '分配菜单' },
        hidden: true
      },
      {
        path: 'allocResource',
        name: 'allocResource',
        component: () => import('@/views/ums/role/allocResource'),
        meta: { title: '分配资源' },
        hidden: true
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/ums/menu/index'),
        meta: { title: '菜单列表', icon: 'ums-menu' }
      },
      {
        path: 'addMenu',
        name: 'addMenu',
        component: () => import('@/views/ums/menu/add'),
        meta: { title: '添加菜单' },
        hidden: true
      },
      {
        path: 'updateMenu',
        name: 'updateMenu',
        component: () => import('@/views/ums/menu/update'),
        meta: { title: '修改菜单' },
        hidden: true
      },
      {
        path: 'resource',
        name: 'resource',
        component: () => import('@/views/ums/resource/index'),
        meta: { title: '资源列表', icon: 'ums-resource' }
      },
      {
        path: 'resourceCategory',
        name: 'resourceCategory',
        component: () => import('@/views/ums/resource/categoryList'),
        meta: { title: '资源分类' },
        hidden: true
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}
