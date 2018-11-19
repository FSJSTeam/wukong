<template>
  <div class="wk-content">
    <el-row>
        <el-tabs v-model="activeName">
          <el-tab-pane label="view by file" name="file">
            <el-table :data="table1data" stripe border @row-click="handleDetail" @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter"  >
              <el-table-column sortable prop="filename" label="File Name"></el-table-column>
              <el-table-column prop="file_id" label="File Id"></el-table-column>
              <el-table-column sortable prop="bug_number" label="Bug Number"></el-table-column>
              <el-table-column prop="real_bug_num" label="Real Bug"></el-table-column>
              <el-table-column prop="fp_bug_num" label="False Positive"></el-table-column>
              <el-table-column prop="unknown_bug_num" label="Unknown"></el-table-column>
              <el-table-column prop="usetime" label="TimeSpeed"></el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="view by bug type" name="bugtype">
            <el-table :data="table2data" stripe border @row-click="handleDetail" @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter" >
              <el-table-column prop="bugtype" label="Bug Type"></el-table-column>
              <el-table-column sortable prop="bug_number" label="Bug Number"></el-table-column>
              <el-table-column prop="real_bug_num" label="Real Bug"></el-table-column>
              <el-table-column prop="fp_bug_num" label="False Positive"></el-table-column>
              <el-table-column prop="unknown_bug_num" label="Unknown"></el-table-column>
            </el-table>
            <div class="chart-container">
              <div class="chart-title">Chart</div>
              <div id="container"></div>
            </div>
          </el-tab-pane>
        </el-tabs>
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
      run_id: 0,
      activeName: 'file',
      table1data: [],
      table2data: []
    }
  },
  mounted() {    
    this.run_id = this.$route.query.run_id
    this.loadData()
  },
  methods: {
    cellMouseEnter(row, column, cell, event) {
      cell.parentNode.classList.add('tr-highlight')
    },
    cellMouseLeave(row, column, cell, event) {
      cell.parentNode.classList.remove('tr-highlight')
    },
    loadData() {
      var that = this
      var data = {
        run_id: that.run_id,
        token: that.$cookie.get('wk_token'),
        cmd: 'list'
      }
      that.$ajax.post('/', "msg="+JSON.stringify(data) ).then(res => {
        if(res.data) {
          that.table1data = Array.isArray(res.data)? res.data: [res.data]
          if(that.table1data.length > 0) {
            // 计算总bug数
            that.table1data.map(item => {
              item.bug_number = item.real_bug_num + item.fp_bug_num + item.unknown_bug_num
              return item
            })
          }          
        }
      })
      var datas = {
        run_id: that.run_id,
        token: that.$cookie.get('wk_token'),
        cmd: 'list_bugtype'
      }
      that.$ajax.post('/', "msg="+JSON.stringify(datas) ).then(res => {
        if(res.data) {
          that.table2data = Array.isArray(res.data)? res.data: [res.data]
          if(that.table2data.length > 0) {
            // 计算总bug数
            that.table2data.map(item => {
              item.bug_number = item.real_bug_num + item.fp_bug_num + item.unknown_bug_num
              return item
            })
            that.setChart(that.table2data)
          }
          
        }
      })
    },
    setChart(data) {
      var total = 0
      data.map(item => {
        total += item.bug_number
      })
      data.map( item => {
        item.name = item.bugtype
        item.y = item.bug_number / total
      })
      Highcharts.chart('container', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        colors: ['rgb(47,187,254)', 'rgb(29,230,184)', 'rgb(160,136,210)', 'rgb(247,163,91)','#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9', 
    '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1'],
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
          data
        }]
    });
    },
    handleDetail(row) {
      var type = this.activeName == 'file'? 'file' : 'bug'
      if(type == 'file') {
        this.$router.push({name: 'detail', query: {type, run_id: this.run_id, _id: row.file_id, bug_num: row.bug_number}})
      }else if(type == 'bug') {
        this.$router.push({name: 'detail', query: {type, run_id: this.run_id, bugtype: row.bugtype, bug_num: row.bug_number}})
      }      
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
    min-height: 300px;
    overflow: hidden;
    border: 1px solid #323334;
  }
}
</style>
