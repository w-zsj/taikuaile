<template>
  <div>
    <template v-if="source!=5">
      <div class="out-border">
        <div class="layout-title">{{source |title}}</div>
        <!-- 当天交易额 -->
        <div style="padding: 40px" v-if="source==3">
          <el-row>
            <el-col :span="12" class="color-danger big red overview-item-value flex-ctr" v-for="(item,idx) in payMOney" :key="idx">
              <span class="cur-point">{{(item.value||'0')|split}}</span>
            </el-col>
          </el-row>
          <el-row class="font-medium">
            <el-col :span="12" class="overview-item-title flex-ctr" v-for="(item,idx) in payMOney" :key="idx">
              <span class="cur-point"> {{item.type | moneyType}}</span>
            </el-col>
          </el-row>
        </div>

        <!-- 待处理订单 -->
        <div style="padding: 40px" v-if="source==1">
          <el-row>
            <el-col :span="4" class="color-danger big red overview-item-value flex-ctr" v-for="(item,idx) in waitingPayOrderCount" :key="idx">
              <span class="cur-point" @click="goto(item.type)">{{(item.value||'0')|split}}</span>
            </el-col>
          </el-row>
          <el-row class="font-medium">
            <el-col :span="4" class="overview-item-title flex-ctr" v-for="(item,idx) in waitingPayOrderCount" :key="idx">
              <span class="cur-point" @click="goto(item.type)"> {{item.type | orderType}}</span>
            </el-col>
          </el-row>
        </div>
        <!-- 商品数据 -->
        <div style="padding: 40px" v-else-if="source==2">
          <el-row>
            <el-col :span="6" class="color-danger big overview-item-value flex-ctr" v-for="(item,idx) in productInfo" :key="idx">
              {{(item.value||'0')|split}}</el-col>
          </el-row>
          <el-row class="font-medium">
            <el-col :span="6" class="overview-item-title flex-ctr" v-for="(item,idx) in productInfo" :key="idx">
              {{item.type|prodDiff}}
              <el-tooltip v-if="item.type==3" class="item" effect="dark" :content="'统计已上架商品;库存小于或等于'+lowStockNumber+'个'" placement="bottom-start">
                <span class="tip">?</span>
              </el-tooltip>
            </el-col>
          </el-row>
        </div>

      </div>
    </template>

  </div>
</template>
<script>
import { addHomeAdminDataLog } from '@/api/home.js'
export default {
  props: {
    source: {
      type: Number,
      default: 0
    },
    productInfo: {
      type: Array,
      default: () => []
    },
    lowStockNumber: {
      type: [Number, String],
      default: 5
    },
    waitingPayOrderCount: {
      type: Array,
      default: () => []
    },
    payMOney: {
      type: Array,
      default: () => []
    },
    orderInfo: {
      default: () => []
    }
  },
  data() {
    return {
      userSwich: false,
      vipSwiich: false,
      orderSwich: []
    }
  },
  filters: {
    split(value) {
      if (value) {
        var money = (value.toString().indexOf('.') > -1) ?
          value.toString().replace(/(?!^)(?=(\d{3})+\.)/g, ',') :
          value.toString().replace(/(?!^)(?=(\d{3})+$)/g, ',')
        return money
      } else return ''
    },
    title(key) {
      switch (key) {
        case 1:
          return '待处理订单'
        case 2:
          return '商品数据'
        case 3:
          return '今日交易额'
        case 5:
          return ''
      }
    },
    moneyType(key) {
      switch (key) {
        case 1:
          return '今日流水'
        case 2:
          return '今日充值'
      }
    },
    orderType(key) {
      switch (key) {
        case 1:
          return '待付款'
        case 2:
          return '待审核'
        case 3:
          return '待收货'
        case 4:
          return '待退款'
        case 5:
          return '今日订单'
        case 6:
          return '今日流水'
        case 7:
          return '今日充值'
      }
    },
    prodDiff(key) {
      switch (key) {
        case 1:
          return '已上架'
        case 2:
          return '已下架'
        case 3:
          return '库存紧张'
        case 4:
          return '全部商品'
      }
    },
  },
  methods: {
    checkSwich(idx) {
      let orderSwich = JSON.parse(JSON.stringify(this.orderSwich))
      orderSwich[idx] = !orderSwich[idx]
      this.orderSwich = orderSwich
      orderSwich[idx] && addHomeAdminDataLog({ dataType: idx + 3 })
    },
    goto(status) {
      // let path = `/oms/order?status=${status - 1}`
      // if (status == 4) path = '/oms/returnApply'
      // this.$router.push(path);
    }
  }
}
</script>
<style scoped lang="scss">
.out-border {
  border: 1px solid #dcdfe6;
  margin-bottom: 20px;
  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #f2f6fc;
    font-weight: bold;
  }
  //   .color-main {
  //     width: 12px;
  //     height: 12px;
  //   }
  .color-danger {
    margin-bottom: 12px;
    line-height: 24px;
    height: 24px;
    color: rgb(25, 137, 250);
    &.big {
      font-size: 24px;
    }
    &.red {
      color: #f56c6c;
    }
  }
  .cur-point {
    cursor: pointer;
  }
  .tit {
    height: 24px;
    font-size: 16px;
    color: #606266;
    margin-bottom: 12px;
    line-height: 24px;
  }
  ._tit {
    font-size: 14px;
  }
  .grow {
    color: #606266;
    font-size: 12px;
    margin-bottom: 10px;
  }
  .up {
    color: #67c23a;
  }
  .down {
    color: #f56c6c;
  }
  .user {
    .color-danger {
      margin-bottom: 42px;
    }
  }
  .bottom {
    clear: both;
    text-align: center;
  }
  .tip {
    font-size: 12px;
    color: #606266;
    border-radius: 50%;
    border: 1px solid #606266;
    width: 14px;
    height: 14px;
    display: inline-block;
    line-height: 14px;
    text-align: center;
  }
}
.order-layout {
  .layout-title {
    color: #606266;
    padding: 15px 20px;
    background: #f2f6fc;
    font-weight: bold;
  }
  .big {
    color: #1989fa;
    font-size: 24px;
    padding: 10px 0;
  }
  .small {
    color: #c0c4cc;
    font-size: 12px;
    margin-bottom: 10px;
  }
  .up {
    color: #67c23a;
  }
  .down {
    color: #f56c6c;
    font-size: 12px;
  }
}
</style>