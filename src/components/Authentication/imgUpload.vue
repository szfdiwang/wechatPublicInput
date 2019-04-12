<template>
  <div class="appBg">
    <div class="bar_nav">
      <i @click="fhBtn">
        <img src="@/assets/images/index/return@2x.png">
      </i> 上传名片/工牌 (选传)
    </div>
    <div class="imgUploadTips">为完成申请，请上传有效的工作证明</div>
    <input id="useCamera1" type="file" accept="image/*" style="display:none">
    <div class="imgUpload clearfix">
      <div class="carIdUpdate" :key="item.id" v-for="item in imgList" v-show="imgshow">
        <img :id="item.id" :src="item.src">
        <i :id="item.id" @click="deleteImg($event)"></i>
      </div>
      <div class="carIdUpdate" @click="checkPositive" v-if="btnShow">
        <img id="zheng" src="@/assets/images/Authentication/upload@2x.png">
      </div>
    </div>
    <div class="nextBtn" @click="uploadFile()">提交</div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";
import { imgUploadApi } from "@/Api/index";
export default {
  data() {
    return {
      maxSize: 3 * 1024 * 1024,
      zhengPhoto: {},
      photoFiles: [],
      imgList: [],
      imgshow: true,
      imgIndex: 0,
      btnShow: true,
      newList: []
    };
  },
  methods: {
    fhBtn() {
      this.$router.go(-1);
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
        if (file.size > _that.maxSize) {
          data = canvas.toDataURL("image/jpeg", 0.7);
        }
        canvas = context = null;
        _that.newList.push(_that.dataURLtoFile(data, file.name));
      };
    },
    checkPositive() {
      let _that = this;

      //清空一次
      let obj = new Object();
      //正面上传
      $("#useCamera1").click();
      $("#useCamera1").off("change");
      $("#useCamera1").change(function(e) {
        let files = e.target.files || e.dataTransfer.files;
        let file = files[0];
        if (!this.files.length) return;
        if (!/\/(?:jpeg|png|gif)/i.test(files[0].type)) return;
        // _that.zhengPhoto = files[0];
        let reader = new FileReader();
        reader.onload = function(e) {
          obj.src = this.result;
          obj.id = _that.imgIndex;
          _that.imgList.push(obj);
          if (_that.imgList.length > 1) {
            _that.btnShow = false;
          }
          _that.compressFn(this.result, file);
        };
        _that.imgIndex++;
        reader.readAsDataURL(files[0]);
        //项目中只限定上传单张图片。
      });
    },
    deleteImg(e) {
      this.imgList.map(m => {
        if (m.id == e.target.id) {
          this.imgList.pop(m);
        }
      });
      if (this.imgList.length <= 1) this.btnShow = true;
    },
    uploadFile() {
      let formData = new FormData();
      for (var i = 0; i < this.newList.length; i++) {
        formData.append("files", this.newList[i]);
      }
      formData.append("userId", sessionStorage.userId);
      formData.append("appNo", sessionStorage.appNo);
      formData.append("bankcardId", "100");
      formData.append("uploadType", "YHMP");
      imgUploadApi
        .userCertPhotoUpload(formData)
        .then(result => {
          console.log(result.data.errorDesc);
          if (result.data.resultCode == "1") {
            this.$toast("上传成功", 2000);
            setTimeout(() => {
              this.$router.push({
                name: "basicInfo"
              });
            }, 2000);
          } else {
            this.$toast(result.data.errorDesc, 2000);
          }
        })
        .catch(e => {});

      // console.log(formData);
    }
  }
};
</script>

<style lang="scss" scoped>
.bar_nav{
  width: 100%;
  height: 2.75rem;
  text-align: center;
  background: #fff;
  position: fixed;
  color: #333;
  line-height: 2.75rem;
  font-size: 1.13rem;
  border-bottom: 1px solid #ccc;
  z-index: 1000;
}
.nextBtn {
  margin: 1.56rem 1.72rem;
  height: 2.66rem;
  line-height: 2.66rem;
  text-align: center;
  font-size: 1rem;
  color: #fff;
  border-radius: 1.31rem;
  background: #f6ab00;
}
.imgUploadTips {
  padding-top: 2.75rem;
  line-height: 2.5rem;
  text-align: center;
  background: #f2f2f2;
  font-size: 0.94rem;
  color: #333;
}
.imgUpload {
  padding: 0.94rem;
  .carIdUpdate {
    width: 10.31rem;
    height: 6.88rem;
    float: left;
    margin-right: 0.31rem;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    i {
      position: absolute;
      right: 0.31rem;
      top: 0.31rem;
      width: 1.25rem;
      height: 1.25rem;
      background: url(../../assets/images/Authentication/delete2@2x.png)
        no-repeat;
      background-size: 100%;
    }
  }
  .carIdUpdate:last-child {
    margin-right: 0;
  }
}
</style>
