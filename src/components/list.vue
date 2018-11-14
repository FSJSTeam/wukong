<template>
  <div class="wk-content">
    <!-- <ul>
      <li><router-link :to="{ name: 'report'}">报告显示页</router-link></li>
      <li><router-link :to="{ name: 'detail'}">详细报告列表页</router-link></li>
      <li><router-link :to="{ name: 'code'}">代码错误展示页</router-link></li>
    </ul> -->
    <el-row>
      <el-col :span="20" :offset="2">
        <div class="item">
          <div class="item-title">
            <router-link :to="{ name: 'report'}">SED</router-link>
            <span class="compare" @click="toCompare('1')">比较 ></span>
          </div>
          <div class="item-chart" id="item1"></div>
        </div>
        <div class="item">
          <div class="item-title">
            <router-link :to="{ name: 'report'}">SED</router-link>
            <span class="compare" @click="toCompare('1')">比较 ></span>
          </div>
          <div class="item-chart" id="item2"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Highcharts from 'highcharts'
export default {
  name: 'WkList',
  data () {
    return {
      msg: ''
    }
  },
  mounted() {
    this.setChart('item1')
    this.setChart('item2')
  },
  methods: {
    setChart(chartContainerId) {
      var chart = Highcharts.chart(chartContainerId, {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Every RUN\'S BUGS OF PROJECT'
        },
        subtitle: {
          text: 'SOURSE: SED'
        },
        xAxis: {
          categories: ['20171226220534', '20171226220834', '20171227220834', '20171227290834', '20171229290834']
        },
        yAxis: {
          min: 0,
          title: {
            text: 'BUG NUMBER'
          },
          stackLabels: {  // 堆叠数据标签
            enabled: true,
            style: {
              fontWeight: 'bold',
              color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
            }
          }
        },
        legend: {
          align: 'right',
          x: -30,
          verticalAlign: 'top',
          y: 25,
          floating: true,
          backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || 'white',
          borderColor: '#CCC',
          borderWidth: 1,
          shadow: false
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.x + '</b><br/>' +
              this.series.name + ': ' + this.y + '<br/>' +
              '总量: ' + this.point.stackTotal;
          }
        },
        plotOptions: {
          column: {
            stacking: 'normal',
            dataLabels: {
              enabled: true,
              color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
              style: {
                // 如果不需要数据标签阴影，可以将 textOutline 设置为 'none'
                textOutline: 'none'
              }
            }
          }
        },
        series: [{
          name: 'UNKNOWN',
          data: [5, 3, 4, 7, 2]
        }, {
          name: 'FALSE POSITIVE',
          data: [2, 2, 3, 2, 1]
        }, {
          name: 'REAL BUG',
          data: [3, 4, 4, 2, 5]
        }]
    });
    },
    toCompare(type) {
      this.$router.push({name: 'report', query: {type}})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~static/styles/common";
.item {
  width: 100%;
  float: left;
  margin-top: 25px;
  .item-title {
    height: 35px;
    line-height: 35px;
    font-size: 16px;
    background-color: #323334;
    width: calc(100% - 2em);
    float: left;
    padding-left: 2em;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
    a {
      color: white;
      text-decoration: none;
    }
    .compare {
      float: right;
      // margin-right: 1em;
      background: #ED1B23;
      font-size: 12px;
      color: white;
      padding: 0 13px;
      text-align: center;
      cursor: pointer;
      height: 100%;
    }
  }
  .item-chart {
    min-height: 300px;
    width: calc(100% - 2px);
    float: left;
    overflow: hidden;
    border: 1px solid #323334;
  }
}
</style>
