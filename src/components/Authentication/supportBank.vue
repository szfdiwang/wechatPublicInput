<template>
  <div class="appBg">
    <div class="bar_nav">
      <i @click="fhBtn">
        <img src="@/assets/images/Authentication/icon_40x40_1@2x.png">
      </i> 支持银行限额说明
    </div>
    <div class="bankTips">代扣支持银行的限额供您参考，以实际显示为准</div>
    <div class="bankCont">
      <ol>
        <li>
          <span>银行</span>
          <p>额度</p>
        </li>
      </ol>
      <ul>
        <li v-for="item in bankList" :key="item.bankNo">
          <span>{{item.bankName}}</span>
          <p>
            单笔{{item.single/10000}}万、单日{{item.day/10000}}万、单月无限额
            <br>
            <em v-if="item.status === 'TY'">代扣不稳定，建议不用</em>
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { supportBankApi } from "@/Api/index";
export default {
  data() {
    return {
      bankList: []
    };
  },
  mounted() {
    this.initList();
  },
  methods: {
    fhBtn() {
      this.$router.go(-1);
    },
    initList() {
      let data = {};
      supportBankApi
        .getSysBankList(data)
        .then(result => {
          if (result.status == "200") {
            let list = result.data;
            list.forEach(item => {
              this.bankList.push(item);
            });
          }
        })
        .catch(err => {
          this.$toast(result.data.statusText, 2000);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.bar_nav {
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
.bgPostion {
  position: fixed;
  z-index: -99;
  background: #f0f0f0;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
.bankTips {
  text-align: center;
  color: #999;
  font-size: 0.88rem;
  padding-top: 2.75rem;
  line-height: 2.5rem;
}
.bankCont {
  ol li {
    background: #f6ab00;
    span,
    p {
      color: #fff;
      line-height: 2.5rem;
      padding: 0 0 0 1.25rem;
    }
  }
  li {
    display: flex;
    display: -webkit-flex;
    font-size: 0.88rem;
    span {
      width: 6.25rem;
      padding: 0.63rem 0 0.63rem 1.25rem;
      border-right: 1px solid #dcdcdc;
    }
    p {
      padding: 0.63rem 0 0.63rem 1.25rem;
      -webkit-flex: 1;
      -ms-flex: 1;
      flex: 1;
      -webkit-box-flex: 1;
      -moz-box-flex: 1;
      width: 0%;
      display: block;
      padding-left: 1.25rem;
      em {
        line-height: 1.25rem;
        color: #f85050;
      }
    }
  }
  ul li {
    border-bottom: 1px solid #dcdcdc;
  }
}
</style>
