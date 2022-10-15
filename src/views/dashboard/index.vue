<template>
  <div class="app-container">
    <!-- <div class="dataUpdateTime">{{ dataUpdateTime }} 更新</div> -->
    <div class="list">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="item">
            <div class="tit">待收货</div>
            <div class="cont flex-aic">
              <img src="../../assets/images/home_2.jpg" alt="" srcset="">
              <span>77</span>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="item">
            <div class="tit">待入库</div>
            <div class="cont flex-aic">
              <img src="../../assets/images/home_4.jpg" alt="" srcset="">
              <span>77</span>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="item">
            <div class="tit">待检货</div>
            <div class="cont flex-aic">
              <img src="../../assets/images/home_3.jpg" alt="" srcset="">
              <span>77</span>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="item">
            <div class="tit">待出库</div>
            <div class="cont flex-aic">
              <img src="../../assets/images/home_1.jpg" alt="" srcset="">
              <span>77</span>
            </div>
          </div>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
import { homeApi } from "@/api/home.js";
export default {
  name: "Dashboard",
  components: {},
  data() {
    return {
      info: {}
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

        }
      });
    },
  },
};
</script>

<style src="./index.scss" lang="scss" scoped></style>
