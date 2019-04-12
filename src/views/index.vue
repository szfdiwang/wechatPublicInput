<template>
  <div class="warpper">
    <header class="navi">
      <img src="../assets/img/return@2x.png" onclick="bancFn()" class="backIcon">
      实地验车拍摄
    </header>
    <div class="content">
      <div class="zabra"></div>
      <div class="title">
        <p>含车体前后左右4张 、里程表 、中控台 、车架号 、发动机、 人车合照 ， 及其他可以反映车辆配置的照片和视频。</p>
      </div>
      <div class="imgWarpper">
        <input
          id="camera"
          ref="camera"
          type="file"
          capture="camera"
          accept="image/*, video/*"
          style="display:none"
        >
        <video class="img_box" @click="getVedio()" id="userVedio"></video>
        <div class="img_box" v-for="cameraItem in cameraList" :key="cameraItem.id">
          <img v-if="cameraItem.type =='image'" :id="cameraItem.id" :src="cameraItem.src">
          <video v-else :src="cameraItem.src"></video>
          <i :id="cameraItem.id" @click="deleteImg($event)"></i>
        </div>
        <div class="img_box addPhoto" v-if="showAddBtn" @click="addPhoto"></div>
      </div>
    </div>
    <footer class="footer" @click="submitBtn()">提交</footer>
  </div>
</template>

<script>
/* eslint-disable */
// @ is an alias to /src
import { loginApi } from "@/Api/index";
export default {
  name: "index",
  data() {
    return {
      cameraList: [], //展示层
      imageMaxSzie: 3 * 1024 * 1024,
      vedioMaxSize: 8 * 1024 * 1024,
      imgIndex: 0,
      newList: [], //上传层
      showAddBtn: true
    };
  },
  mounted() {
    this.getToken();
  },
  methods: {
    compressFn(result, file) {
      let _that = this;
      let img = new Image();
      //图片方向角
      img.src = result;
      img.onload = function() {
        var degree = 0,
          drawWidth,
          drawHeight,
          width,
          height;
        drawWidth = this.width;
        drawHeight = this.height;
        //以下改变一下图片大小
        let maxSide = Math.max(drawWidth, drawHeight);
        if (maxSide > 1024) {
          let minSide = Math.min(drawWidth, drawHeight);
          minSide = (minSide / maxSide) * 1024;
          maxSide = 1024;
          if (drawWidth > drawHeight) {
            drawWidth = maxSide;
            drawHeight = minSide;
          } else {
            drawWidth = minSide;
            drawHeight = maxSide;
          }
        }
        let canvas = document.createElement("canvas");
        canvas.width = width = drawWidth;
        canvas.height = height = drawHeight;
        let context = canvas.getContext("2d");
        context.drawImage(img, 0, 0, drawWidth, drawHeight);
        // 压缩0.5就是压缩百分之50
        let data = canvas.toDataURL("image/jpeg", 0.5);
        if (file.size > _that.imageMaxSzie) {
          data = canvas.toDataURL("image/jpeg", 0.7);
        }
        canvas = context = null;
        _that.newList.push(_that.dataURLtoFile(data, file.name));
      };
    },
    dataURLtoFile(dataurl, filename) {
      //将base64转换为文件
      var arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    deleteImg(e) {
      this.cameraList.map(m => {
        if (m.id == e.target.id) {
          this.cameraList.pop(m);
        }
      });
      // if (this.cameraList.length <= 1) this.btnShow = true;
    },
    getVedio() {
      // 想要获取一个最接近 1280x720 的相机分辨率
      var constraints = { audio: false, video: true };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(mediaStream) {
          var video = document.querySelector("video");
          video.srcObject = mediaStream;
          video.onloadedmetadata = function(e) {
            video.play();
          };
        })
        .catch(function(err) {
          console.log(err.name + ": " + err.message);
        });
    },
    addPhoto() {
      let that = this;
      //清空一次
      let obj = new Object();
      //正面上传
      $("#camera").click();
      $("#camera").off("change");
      $("#camera").change(function(e) {
        let files = e.target.files || e.dataTransfer.files;
        let file = files[0];
        if (!this.files.length) return;
        // if (!/\/(?:jpeg|png|gif)/i.test(files[0].type)) return;
        // _that.zhengPhoto = files[0];
        let reader = new FileReader();
        reader.onload = function(e) {
          obj.src = this.result;
          obj.id = that.imgIndex;

          // if (that.cameraList.length > 20) {
          //   that.btnShow = false;
          // }
          let type = file.type.split("/")[0];
          if (type == "image") {
            obj.type = "image";
            that.cameraList.push(obj);
            that.compressFn(this.result, file);
          } else if (type == "video") {
            obj.type = "video";
            if (file.size > that.vedioMaxSize) {
              that.$toast("请您上传8M以下的视频", 3000);
              return;
            }
            that.cameraList.push(obj);
            that.newList.push(that.dataURLtoFile(this.result, file.name));
          } else {
            that.$toast("请上传图片或者视频", 3000);
          }
        };
        that.imgIndex++;
        reader.readAsDataURL(files[0]);
        //项目中只限定上传单张图片。
      });
    },
    getParamsFn() {
      console.log(window.location.href);
      console.log(window.location.search);
      console.log(this.$route.path);
      let obj = {};
      let arr1 = window.location.href.split("?")[1];
      let arr2 = arr1.split("&");
      arr2.forEach(item => {
        let res = item.split("=");
        obj[res[0]] = res[1];
      });
      return obj;
    },
    getToken() {
      userApi
        .getUserToekn()
        .then(result => {
          console.log(result);
          if (typeof result.data.access_token != "undefined") {
            sessionStorage.token = result.data.access_token;
          }
        })
        .catch(err => {});
    },
    submitBtn() {
      let params = this.getParamsFn();
      console.log(params);
      let formData = new FormData();
      formData.append("appNo", params["appNo"]);
      formData.append("fileTypeId", params["fileTypeId"]);
      this.newList.forEach(item => {
        formData.append("files", item);
      });
      this.$message("loading", "上传中,请稍后");
      userApi
        .uploadFile(formData)
        .then(result => {
          this.$hideMessage();
          if (result.data.resultCode == "1") {
            this.$toast("上传成功", 3000);
            this.newList = [];
            this.cameraList = [];
          } else {
            this.$toast(result.data.errorDesc, 2000);
          }
        })
        .catch(err => {
          this.$toast(result.data.errorDesc, 2000);
          this.$hideMessage();
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.warpper {
  width: 100vw;
  .navi {
    width: 100vw;
    height: 2.75rem;
    text-align: center;
    background: #ffffff;
    position: fixed;
    color: #000000;
    line-height: 2.75rem;
    font-size: 1.13rem;
    border-bottom: 1px solid #ccc;
    z-index: 1000;
    font-size: 1.125rem;
    top: 0;
    .backIcon {
      width: 1.25rem;
      height: 1.25rem;
      color: #000;
      position: absolute;
      top: 0.75rem;
      left: 1.03125rem;
      z-index: 1000;
    }
  }
  .content {
    margin-top: 3.5625rem;
    width: 100vw;
    height: auto;
    min-height: calc(100vh - 7.75rem); //3.5625rem);
    background: #ffffff;
    margin-bottom: 4rem;
    .title {
      p {
        text-align: justify;
        font-size: 0.8125rem;
        /* width: 21.4375rem; */
        /* height: 1.8125rem; */
        color: rgba(180, 180, 180, 1);
        padding: 1.25rem 0.9375rem;
      }
    }
    .imgWarpper {
      width: 21.4375rem;
      height: auto;
      margin: 0 auto;
      display: flex;
      flex-wrap: wrap;
      align-content: flex-start;
      overflow-y: scroll;
      .img_box {
        position: relative;
        box-sizing: border-box;
        width: 10.1875rem;
        height: 6.78125rem;
        background: url(../assets/img/shooting.png) no-repeat;
        background-size: 100%;
        // display: inline-block;
        /* padding: .9375rem; */
        cursor: pointer;
        margin-bottom: 1.03125rem;
        img {
          width: 100%;
          height: 100%;
        }
        video {
          width: 100%;
          height: 100%;
        }
        i {
          position: absolute;
          right: 0.31rem;
          top: 0.31rem;
          width: 1.25rem;
          height: 1.25rem;
          background: url(../assets/img/delete2@2x.png) no-repeat;
          background-size: 100%;
        }
      }
      .addPhoto {
        width: 10.1875rem;
        height: 6.78125rem;
        background: url(../assets/img/upload.png) no-repeat;
        background-size: 100%;
        cursor: pointer;
        margin-bottom: 1.03125rem;
      }
      .img_box:nth-child(odd) {
        margin-left: 1rem;
      }
    }
  }

  .footer {
    width: 100vw;
    height: 3.125rem;
    text-align: center;
    background: rgba(246, 171, 0, 1);
    position: fixed;
    bottom: 0;
    color: #ffffff;
    font-size: 1rem;
    font-weight: 500;
    line-height: 3.125rem;
    z-index: 1000;
  }
}
</style>
