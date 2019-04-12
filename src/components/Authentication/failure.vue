<template>    
    <div class="appBg">
        <div class="bgPostion"></div>
        <div class="bar_nav bar_nav_Boder">提示</div>
        <div class="success">
            <img src="@/assets/images/Authentication/prompt@2x.png">
            <h2>提交失败</h2>
            <p>原因：您的综合信用评分不足，不予通过！</p>
        </div>
        <div class="nextBtn">重试</div>
        <div class="nextBtn returnIndex">首页</div>
    </div>
</template>
<script>
    export default {
       
    }
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
.bgPostion{
    position: fixed;
    z-index: -99;
    background: #F0F0F0;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
}
.success{
    padding: 5.75rem 0 1.25rem;
    text-align: center;
    background: #fff;
    img{
        width: 5rem;
    }
    h2{
        font-size: 1.25rem;
        font-weight: bold;
        color: #1A1A1A;
        margin-top: .63rem;
    }
    p{
        font-size: 1rem;
        margin-top: .63rem;
        color: #999;
    }
}
.nextBtn{
    margin: 1.56rem 1.72rem;
    height: 2.66rem;
    line-height: 2.66rem;
    text-align: center;
    font-size: 1.06rem;
    color: #fff;
    border-radius: 1.31rem;
    background: #F6AB00;
}
.returnIndex{
    color: #F6AB00;
    background: #fff;
    border: 1px solid #F6AB00;
}
.mgt50{
    margin-top: 1.56rem;
}
</style>
