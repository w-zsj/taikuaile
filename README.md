# taihai-admin

## 前言

该项目为前后端分离项目的前端部分，后端项目`mall`地址：[传送门](https://github.com/macrozheng/mall)。

## 项目介绍

`mall-admin-web`是一个电商后台管理系统的前端项目，基于 Vue+Element 实现。主要包括商品管理、订单管理、会员管理、促销管理、运营管理、内容管理、统计报表、财务管理、权限管理、设置等功能。

### 项目演示

项目在线演示地址：[http://www.macrozheng.com/admin/](http://www.macrozheng.com/admin/)

![后台管理系统功能演示](http://img.macrozheng.com/mall/project/mall_admin_show.png)

### 技术选型

| 技术              | 说明                    | 官网                                                                                               |
| ----------------- | ----------------------- | -------------------------------------------------------------------------------------------------- |
| Vue               | 前端框架                | [https://vuejs.org/](https://vuejs.org/)                                                           |
| Vue-router        | 路由框架                | [https://router.vuejs.org/](https://router.vuejs.org/)                                             |
| Vuex              | 全局状态管理框架        | [https://vuex.vuejs.org/](https://vuex.vuejs.org/)                                                 |
| Element           | 前端 UI 框架            | [https://element.eleme.io/](https://element.eleme.io/)                                             |
| Axios             | 前端 HTTP 框架          | [https://github.com/axios/axios](https://github.com/axios/axios)                                   |
| v-charts          | 基于 Echarts 的图表框架 | [https://v-charts.js.org/](https://v-charts.js.org/)                                               |
| Js-cookie         | cookie 管理工具         | [https://github.com/js-cookie/js-cookie](https://github.com/js-cookie/js-cookie)                   |
| nprogress         | 进度条控件              | [https://github.com/rstacruz/nprogress](https://github.com/rstacruz/nprogress)                     |
| vue-element-admin | 项目脚手架参考          | [https://github.com/PanJiaChen/vue-element-admin](https://github.com/PanJiaChen/vue-element-admin) |

### 项目布局

```lua
src -- 源码目录
├── api -- axios网络请求定义
├── assets -- 静态图片资源文件
├── components -- 通用组件封装
├── icons -- svg矢量图片文件
├── router -- vue-router路由配置
├── store -- vuex的状态管理
├── styles -- 全局css样式
├── utils -- 工具类
└── views -- 前端页面
    ├── home -- 首页
    ├── layout -- 通用页面加载框架
    ├── login -- 登录页
    ├── oms -- 订单模块页面
    ├── pms -- 商品模块页面
    └── sms -- 营销模块页面
```

## 搭建步骤

- 下载 node 并安装：[https://nodejs.org/dist/v12.14.0/node-v12.14.0-x64.msi](https://nodejs.org/dist/v12.14.0/node-v12.14.0-x64.msi);
- 该项目为前后端分离项目，访问本地访问接口需搭建后台环境，搭建请参考后端项目[传送门](https://github.com/macrozheng/mall);
- 访问在线接口无需搭建后台环境，只需将`config/dev.env.js`文件中的`BASE_API`改为[http://admin-api.macrozheng.com](http://admin-api.macrozheng.com)即可;
- 如果你对接的是[mall-swarm](https://github.com/macrozheng/mall-swarm)微服务后台的话，所有接口都需要通过网关访问，需要将`config/dev.env.js`文件中的`BASE_API`改为[http://localhost:8201/mall-admin](http://localhost:8201/mall-admin)；
- 克隆源代码到本地，使用 IDEA 打开，并完成编译;
- 在 IDEA 命令行中运行命令：npm install,下载相关依赖;  101.43.82.253
- 在 IDEA 命令行中运行命令：npm run dev,运行项目; root/9&FSX1KexTv%
- 访问地址：[http://localhost:5431](http://localhost:5431) 即可打开后台管理系统页面;
- 具体部署过程请参考：[mall 前端项目的安装与部署](http://www.macrozheng.com/#/deploy/mall_deploy_web)
- `注意`：如果遇到无法运行 npm 命令，需要配置 npm 的环境变量，如在 path 变量中添加：C:\Users\zhenghong\AppData\Roaming\npm;
- `注意`：如果遇到 npm install 无法成功下载依赖，请参考[使用 Jenkins 一键打包部署前端应用，就是这么 6！](http://www.macrozheng.com/#/reference/jenkins_vue) 中`遇到的坑`部分。
