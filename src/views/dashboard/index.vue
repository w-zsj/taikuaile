<template>
  <div class="app-container">
    <!-- <div class="dataUpdateTime">{{ dataUpdateTime }} 更新</div> -->
    <div class="list">
      <el-row :gutter="20">
        <el-col :span="12" v-for="(item,idx) in info" :key="idx">
          <div class="item">
            <div class="tit">{{item.status |statusTxt }}</div>
            <div class="cont flex-aic">
              <img :src="item.icon||arr[idx]" alt="" srcset="">
              <span>{{item.count||0}}</span>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { countOrder } from "@/api/order.js";
import icon1 from '@/assets/images/home_2.jpg';
import icon2 from '@/assets/images/home_4.jpg';
import icon3 from '@/assets/images/home_3.jpg';
import icon4 from '@/assets/images/home_1.jpg';
export default {
  name: "Dashboard",
  components: {},
  data() {
    return {
      info: [],
      arr: [icon1, icon2, icon3, icon4]
    };
  },
  created() {
    this.getInfo();
  },
  filters: {
    statusTxt(status) {
      switch (status) {
        case 0:
          return '待收货';
        case 1:
          return '待入库';
        case 2:
          return '待检货';
        case 3:
          return '待出库';
      }
    }
  },
  methods: {
    getInfo() {
      countOrder().then((res) => {
        if (res.code == 1) {
          this.info = res.data || [];
          if (this.info.length != 4) {
            for (let i = 0; i < 4; i++) {
              if (!this.info[i]) {
                this.info[i] = {
                  count: 0,
                  status: i,
                  icon: this.arr[i]
                }
              }
            }
          }
        }
      });
    },
  },
};
</script>

<style src="./index.scss" lang="scss" scoped></style>
