<template>
  <div class="app-container">
    <div class="dataUpdateTime">{{ dataUpdateTime }} 更新</div>
    <div class="overview-layout">
      <el-row :gutter="20">
        <!-- 今天交易额 -->
        <el-col :span="12">
          <unit :source="3" :payMOney="payMOney"></unit>
        </el-col>
        <!-- 待处理订单 -->
        <el-col :span="12">
          <unit :source="1" :waitingPayOrderCount="waitingPayOrderCount"></unit>
        </el-col>
        <!-- 商品数据 -->
        <el-col :span="12">
          <unit :source="2" :productInfo="productInfo" :lowStockNumber="lowStockNumber"></unit>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { homeApi } from "@/api/home.js";
import unit from "./comps/unit";
export default {
  name: "Dashboard",
  components: { unit },
  data() {
    return {
      dataUpdateTime: "", // 更新日期
      orderInfo: [], // 订单相关数据
      productInfo: [], // 商品相关数据
      waitingPayOrderCount: [], // 代付款订单。。。
      lowStockNumber: null, // 最下库存数
      payMOney: [],
    };
  },
  created() {
    this.getInfo();
  },
  methods: {
    getInfo() {
      homeApi().then((res) => {
        if (res.code == 1) {
          let info = res.data;
          if (info) {
            let waitingHandleOrderCount = info.waitingHandleOrderCount;
            let payMOney = this.payMOney
            waitingHandleOrderCount = waitingHandleOrderCount.filter(i => i.type != 4)
            waitingHandleOrderCount = [
              ...waitingHandleOrderCount,
              {
                type: 5,
                value: info.orderCount
              },

            ]
            payMOney = [
              {
                type: 1,
                value: info.orderMoneyCount
              },
              {
                type: 2,
                value: info.recharge
              }
            ]
            console.log('waitingHandleOrderCount', waitingHandleOrderCount)
            Object.assign(this, {
              dataUpdateTime: info.dataUpdateTime,
              lowStockNumber: info.lowStockNumber,
              productInfo: info.productCount,
              waitingPayOrderCount: waitingHandleOrderCount,
              orderInfo: info.orderCount,
              payMOney,
            });
          }
        }
      });
    },
  },
};
</script>

<style src="./index.scss" lang="scss" scoped></style>
