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
            <span class="compare" @click="toCompare(name)">比较 <i class="el-icon-arrow-right"></i></span>
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
          console.log(res)
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
    handleData(resData) {
      var list = resData
      var that = this
      var names = []
      for(var i=0; i<list.length; i++) {
        if(!names.includes(list[i].name) ) {
          names.push(list[i].name)
        }
      }
      that.names = names
      setTimeout(() => {
        for(var n=0; n<names.length; n++) {
          var data = list.filter(item => item.name == names[n])
          var categories = data.map(item => item.date)
          var run_ids = data.map(item => item.run_id)
          var unknownList = data.map(item => parseInt(item.unknown_bug_num))
          var realBugList = data.map(item => parseInt(item.real_bug_num))
          var falsePositiveList = data.map(item => parseInt(item.fp_bug_num))
            that.setChart('item'+n, names[n], categories, unknownList, realBugList, falsePositiveList, run_ids)    
        }
       }, 100)
    },
    setChart(chartContainerId, name, categories, unknownList, realBugList, falsePositiveList, run_ids) {
      var that = this
      var chart = Highcharts.chart(chartContainerId, {
        chart: {
          type: 'column'
        },
        title: {
          text: 'Every RUN\'S BUGS OF PROJECT'
        },
        credits: {
          enabled: false
        },
        subtitle: {
          //text: 'SOURSE: '+ name
        },
        exporting: {
          enabled: false
        },
        xAxis: {
          categories,
          
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
            },
            cursor: 'pointer',
            point: {
              events: {
                click: function(e) {
                  var run_id = this.series.options.id[event.point.x]
                  that.$router.push({name: 'report', query: {run_id}})
                }
              }
            }
          }
        },
        series: [{
          name: 'UNKNOWN',
          data: unknownList,
          id: run_ids,
          color: 'rgb(244,92,91)'
        }, {
          name: 'FALSE POSITIVE',
          id: run_ids,
          data: falsePositiveList,
          color: 'rgb(33,195,146)'
        }, {
          name: 'REAL BUG',
          id: run_ids,
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
  .item-title {
    height: 35px;
    line-height: 35px;
    font-size: 16px;
    //background-color: #323334;
    width: 100%;
    margin:20px 0;
    float: left;
    //padding-left: 2em;
    a {
      color: black;
      font-weight:bold;
      text-decoration: none;
    }
    .compare {
      border-radius: 4px;
      float: right;
      // margin-right: 1em;
      background: $RedBackground ;
      font-size: $fontSizeMedium ;
      color: $fontColorWhite ;
      padding: 3px 20px;
      text-align: center;
      cursor: pointer;
      height: 100%;

      i{
        font-weight: bold ;
      }
    }
  }
  .item-chart {
    float: left;
    min-height: 300px;
    width: calc(100% - 81px);
    padding: 40px ;
    overflow: hidden;
    background: $whiteBackground ;
    box-shadow: 1px 1px 6px 3px #d7e0f1;
    border-radius: 8px ;
  }
}
</style>
