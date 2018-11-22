<template>
  <div class="wk-content">
    <el-row>
      <el-col :span="24" class="btn-row">
        <el-button size="medium" @click="compare">比较 <i class="el-icon-arrow-right"></i></el-button>
      </el-col>
      <el-col :span="24">
        <el-table :data="data" border ref="multipleTable" @row-click="handleDetail"  @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter" @selection-change="handleSelectionChange" >
          <el-table-column type="selection" width="65"></el-table-column>
          <el-table-column sortable prop="run_id" label="Run ID"></el-table-column>
          <el-table-column sortable prop="name" label="Name"></el-table-column>
          <el-table-column prop="real_bug_num" label="Real Bug Num"></el-table-column>
          <el-table-column prop="unknown_bug_num" label="Unknown Bug Num"></el-table-column>
          <el-table-column prop="fp_bug_num" label="Fp Bug Name"></el-table-column>
          <el-table-column sortable prop="date" label="Date"></el-table-column>          
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="" :visible.sync="result_show">
      <p class="rtnBtn">
        <el-button size="medium" @click="result_show = false"><i class="el-icon-arrow-left"></i>返回 </el-button>
      </p>
      <el-table :data="compareData" @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter">
        <el-table-column property="run_id" label="Run ID"></el-table-column>
        <el-table-column property="bug_id" label="Bug ID"></el-table-column>
        <el-table-column property="file_path" label="file Path"></el-table-column>
        <el-table-column property="line" label="Line"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'WkCompare',
  data () {
    return {
      msg: 'run比较页面',
      data: [],
      compareData: [],
      multipleSelection: [],
      result_show: false
    }
  },
  computed: {
    
  },
  watch: {
    'result_show'(newVal, oldVal) {
      if(!newVal) {
        this.compareData = []
      }
    }
  },
  mounted() {
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
        token: that.$cookie.get('wk_token'),
        cmd: 'runs'
      }
      that.$ajax.post('/', "msg="+JSON.stringify(data) ).then(res => {
        if(res.data && res.data.length >0) {
          that.data = res.data
        }else {
          that.$message({
            showClose: true,
            message: '暂无数据',
            type: 'warning'
          })
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleDetail(row) {
      this.$router.push({name: 'report', query: {run_id: row.run_id}})
    },
    compare() {
      var data = this.multipleSelection;
      if(data.length !== 2) {
        this.$message({
          type: 'warning',
          showClose: true,
          message: '请选择两条记录进行对比'
        })
      }else {
        var run_ids = data.map(item => item.run_id)
        this.request_compare(run_ids)
      }
    },
    request_compare(ids) {
      var that = this
      var data = {
        run_id1: ids[0],
        run_id2: ids[1],
        cmd: 'runs_compare',
        token: that.$cookie.get('wk_token')
      }
      that.$ajax.post('/', "msg="+JSON.stringify(data) ).then(res => {
        if(res.data) {
          that.compareData = Array.isArray(res.data)? res.data: [res.data]
          that.result_show = true
        }else {
          that.$message({
            type: 'warning',
            showClose: true,
            message: '没有对比结果'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~static/styles/common";
.btn-row {
  margin: 5px 0px 20px 0px ;
}
.rtnBtn {
  margin: 0;
  padding-bottom: 10px; 
}
</style>
