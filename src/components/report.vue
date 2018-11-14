<template>
  <div class="wk-content">
    <el-row>
      <el-col :span="20" :offset="2">
        <el-tabs v-model="activeName">
          <el-tab-pane label="view by file" name="file">
            <el-table :data="table1data" stripe border>
              <el-table-column sortable prop="filename" label="File Name"></el-table-column>
              <el-table-column prop="fileid" label="File Id"></el-table-column>
              <el-table-column sortable prop="bug_number" label="Bug Number"></el-table-column>
              <el-table-column prop="real_bug" label="Real Bug"></el-table-column>
              <el-table-column prop="false_positive" label="False Positive"></el-table-column>
              <el-table-column label="操作" width="130">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleDetail(scope.$index, scope.row, 'file')">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="view by bug type" name="bugtype">
            <el-table :data="table2data" stripe border>
              <el-table-column prop="bug_type" label="Bug Type"></el-table-column>
              <el-table-column sortable prop="bug_number" label="Bug Number"></el-table-column>
              <el-table-column label="操作" width="130">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleDetail(scope.$index, scope.row, 'bug')">查看</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="chart-container">
              <div class="chart-title">Chart</div>
              <div id="container"></div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Highcharts from 'highcharts'

export default {
  name: 'WkReport',
  data () {
    return {
      msg: '报告显示页',
      activeName: 'file',
      table1data: [{
        filename: '/sed/utils.c',
        fileid: '20325',
        bug_number: '13',
        real_bug: '13',
        false_positive: '0'
      },{
        filename: '/sed/exectude.c',
        fileid: '20326',
        bug_number: '3',
        real_bug: '0',
        false_positive: '0'
      },{
        filename: '/sed/qute.c',
        fileid: '20327',
        bug_number: '4',
        real_bug: '0',
        false_positive: '1'
      },{
        filename: '/sed/teeare.c',
        fileid: '20328',
        bug_number: '3',
        real_bug: '0',
        false_positive: '1'
      },{
        filename: '/sed/local.c',
        fileid: '20329',
        bug_number: '8',
        real_bug: '0',
        false_positive: '1'
      }],
      table2data: [{
        bug_type: 'use-after-free',
        bug_number: 13
      },{
        bug_type: 'null-ptr',
        bug_number: 12
      },{
        bug_type: 'uninit-var',
        bug_number: 10
      }]
    }
  },
  mounted() {
    this.setChart()
  },
  methods: {
    setChart() {
      Highcharts.chart('container', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        title: {
          text: 'bugType Pie'
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b>: {point.percentage:.1f} %',
              style: {
                  color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
              }
            }
          }
        },
        series: [{
          name: 'Brands',
          colorByPoint: true,
          data: [{
            name: 'use-after-free',
            y: 35.7,
            sliced: true,
            selected: true
          }, {
              name: 'null-ptr',
              y: 7.1
          }, {
              name: 'uninit-var',
              y: 57.1
          }]
        }]
    });
    },
    handleDetail(index, row, type) {
      console.log(index, row, type)
      this.$router.push({name: 'detail', query: {type}})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~static/styles/common";
.chart-container {
  width: 100%;
  margin-top: 25px;
  float: left;
  .chart-title {
    height: 35px;
    line-height: 35px;
    font-size: 16px;
    color: white;
    background-color: #323334;
    width: calc(100% - 2em);
    float: left;
    padding-left: 2em;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    border-bottom-left-radius: 2px;
    border-bottom-right-radius: 2px;
  }
  #container {
    width: calc(100% - 2px);
    float: left;
    overflow: hidden;
    border: 1px solid #323334;
  }
}
</style>
