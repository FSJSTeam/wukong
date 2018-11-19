<template>
  <div class="wk-content">
    <!-- <ul>
      <li><router-link :to="{ name: 'report'}">报告显示页</router-link></li>
      <li><router-link :to="{ name: 'detail'}">详细报告列表页</router-link></li>
      <li><router-link :to="{ name: 'code'}">代码错误展示页</router-link></li>
    </ul> -->
    <el-row>
      <el-col :span="20" :offset="2">
        <div class="item" v-for="(name, index) in names" keys="name">
          <div class="item-title">
            <router-link :to="{ name: 'compare', query: {name}}">{{name}}</router-link>
            <span class="compare" @click="toCompare(name)">比较 ></span>
          </div>
          <div class="item-chart" :id="'item'+(index)"></div>
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
      msg: '',
      names: []
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    loadData() {
      var that = this
      var data = {
        token: that.$cookie.get('wk_token'),
        cmd: 'runs'
      }
      that.$ajax.post('/', "msg="+JSON.stringify(data) ).then(res => {
        if(res.data && res.data.length >0) {
          that.handleData(res.data)
        }else {
          that.$message({
            showClose: true,
            message: '暂无数据',
            type: 'warning'
          })
        }
      })
    },
    handleData(list) {
      var that = this
      var names = []
      for(var i=0; i<list.length; i++) {
        if(!names.includes(list[i].name) ) {
          names.push(list[i].name)
        }
      }
      that.names = names
      for(let n=0; n<names.length; n++) {
        var data = list.filter(item => item.name = names[n])
        var categories = data.map(item => item.date)
        var unknownList = data.map(item => item.unknown_bug_num)
        var realBugList = data.map(item => item.real_bug_num)
        var falsePositiveList = data.map(item => item.fp_bug_num)
        setTimeout(() => {
          that.setChart('item'+n, names[n], categories, unknownList, realBugList, falsePositiveList)
        }, 100)
        
      }
    },
    setChart(chartContainerId, name, categories, unknownList, realBugList, falsePositiveList) {
      var chart = Highcharts.chart(chartContainerId, {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Every RUN\'S BUGS OF PROJECT'
        },
        subtitle: {
          text: 'SOURSE: '+ name
        },
        xAxis: {
          categories
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
          data: unknownList,
          color: 'rgb(244,92,91)'
        }, {
          name: 'FALSE POSITIVE',
          data: falsePositiveList,
          color: 'rgb(33,195,146)'
        }, {
          name: 'REAL BUG',
          data: realBugList,
          color: 'rgb(72,121,223)'
        }]
    });
    },
    toCompare(name) {
      this.$router.push({name: 'compare', query: {name}})
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
