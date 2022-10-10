<!--
 * @Author: Ayan
 * @Date: 2022-04-02 14:38:20
 * @LastEditors: Ayan
 * @LastEditTime: 2022-04-08 14:01:29
 * @Description: file not
-->
<template> 
  <div class="updeta">
    <el-upload action="#" :auto-upload="false" accept="video" :multiple="false" :show-file-list="showFileList" :file-list="fileList" :on-change="getFile" :on-preview="handlePreview" :on-remove="handleRemove">
      <video v-if="videoUrl !== '' && videoUrl !== null" :src="videoUrl" class="avatar" controls="controls">您的浏览器不支持视频播放</video>
      <i v-if="!videoUrl && !isCheck" class="el-icon-plus uploadIcon"></i>
    </el-upload>
    <el-progress type="circle" v-if="videoUploadPercent>0" :percentage="videoUploadPercent" style="margin-top:30px;">
    </el-progress>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="fileList[0].url" alt="">
    </el-dialog>
  </div>
</template>
<script>
import { policy } from '@/api/oss'
import COS from 'cos-js-sdk-v5'
export default {
  name: 'videoUpload',
  props: {
    value: String,
    // 上传的最大体积M
    maxSize: { type: Number, default: 10 },
    isCheck: {
      type: Boolean,
      default: false
    },
    tipText: {
      type: String,
      default: ''
    },
  },
  data() {
    return {
      videoFlag: false,
      dialogVisible: false,
      videoUploadPercent: 0,
      consfigData: {},
    };
  },
  computed: {
    videoUrl() {
      return this.value;
    },
    videoName() {
      if (this.value != null && this.value !== '') {
        return this.value.substr(this.value.lastIndexOf("/") + 1);
      } else {
        return null;
      }
    },
    fileList() {
      return [{
        name: this.videoName,
        url: this.videoUrl
      }]
    },
    showFileList: {
      get: function() {
        return this.value !== null && this.value !== '' && this.value !== undefined;
      },
      set: function(newValue) {
      }
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    emitInput(val) {
      console.log('val', val)
      this.$emit('input', val)
    },
    handleRemove(file, fileList) {
      this.emitInput('');
    },
    handlePreview(file) {
      this.dialogVisible = true;
    },
    init() {
      policy().then(response => {
        if (response.code == 1) {
          this.consfigData = response.data;
        }
      })
    },
    getFile(file) {
      let _ = this, { consfigData } = this;
      var Bucket = consfigData.bucket;  /* 存储桶，必须字段 */
      // 存储桶region可以在COS控制台指定存储桶的概览页查看 https://console.cloud.tencent.com/cos5/bucket/ 
      // 关于地域的详情见 https://cloud.tencent.com/document/product/436/6224
      var Region = consfigData.region;    /* 存储桶所在地域，必须字段 */
      var cos = new COS({
        // getAuthorization 必选参数
        Protocol: 'https:',
        getAuthorization: function(options, callback) {
          // 初始化时不会调用，只有调用cos方法（比如cos.putObject）时才会进入
          // 异步获取临时密钥
          // 服务端 JS 和 PHP 例子：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
          // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
          // STS 详细文档指引看：https://cloud.tencent.com/document/product/436/14048
          callback({

            TmpSecretId: consfigData.tmpSecretId,
            TmpSecretKey: consfigData.tmpSecretKey,
            SecurityToken: consfigData.sessionToken,
            // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
            StartTime: consfigData.startTime, // 时间戳，单位秒，如：1580000000
            ExpiredTime: consfigData.expiredTime, // 时间戳，单位秒，如：1580000000
          });
        }
      });
      _.videoUploadPercent = 1
      // console.log('Bucket--', this.getBase64(file.raw), file)
      this.getBase64(file.raw).then((res) => {
        cos.putObject({
          Bucket: Bucket, /* 必须 */
          Region: Region,     /* 存储桶所在地域，必须字段 */
          Key: 'video/' + new Date().getTime() + '/' + file.name,              /* 必须 */
          StorageClass: 'STANDARD',
          Body: this.dataURLtoBlob(res), // 上传文件对象
          onProgress: function(progressData) {
            console.log('--->>', progressData);
            _.videoUploadPercent = progressData.percent * 100
          }
        }, function(err, data) {
          console.log(err || data);

          if (data) {
            _.videoUploadPercent = 0;
            _.showFileList = true;
            let url = data.Location.replace('taihaile-1313372796.cos.ap-bangkok.myqcloud.com', 'https://cdn.taihail.com')
            if (url.length > 255) {
              _.$message.error('视频链接过长 请控制在255个字符内')
            } else {
              _.fileList.push({ name: file.name, url: url });
              _.emitInput(_.fileList[1].url);
            }

          }

        });
      })

    },
    getBase64(file) {
      return new Promise(function(resolve, reject) {
        const reader = new FileReader();
        let imgResult = "";
        reader.readAsDataURL(file);
        reader.onload = function() {
          imgResult = reader.result;
        };
        reader.onerror = function(error) {
          reject(error);
        };
        reader.onloadend = function() {
          resolve(imgResult);
        };
      });
    },
    dataURLtoBlob(dataurl) {
      var arr = dataurl.split(',');
      var mime = arr[0].match(/:(.*?);/)[1];
      var bstr = atob(arr[1]);
      var n = bstr.length;
      var u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], { type: mime });
    },

    handleUploadSuccess(res, file) {
      this.showFileList = true;
      this.fileList.pop();
      let url = this.dataObj.host + '/' + this.dataObj.dir + '/' + file.name;
      if (!this.useOss) {
        //不使用oss直接获取图片路径
        url = res.data.url;
      }
      this.fileList.push({ name: file.name, url: url });
      this.emitInput(this.fileList[0].url);
      this.videoFlag = false;
      this.videoUploadPercent = 0;
    }
  }
}
</script>
<style lang="scss" scoped>
.updeta {
  display: flex;
  align-items: center;
  justify-items: center;
}
.uploadIcon {
  width: 100px;
  height: 100px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #c0ccda;
  background-color: #fbfdff;
  border-radius: 6px;
  font-size: 20px;
  color: #999;
}
.avatar {
  width: 150px;
  height: 150px;
}
.upload-tip {
  position: absolute;
  color: #666;
  font-size: 12px;
  bottom: -30px;
}
.el-progress {
  display: inline-block;
  margin-left: 20px;
}
</style>


