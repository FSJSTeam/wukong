<template>
  <div class="wk-content content">
    <el-row>
      <el-col :span="24" class="btn-row">
        <el-button size="medium" @click="compare">对比</el-button>
      </el-col>
      <el-col :span="24">
        <el-table :data="data" stripe border ref="multipleTable" @selection-change="handleSelectionChange">>
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column sortable prop="run_id" label="run_id"></el-table-column>
          <el-table-column sortable prop="name" label="name"></el-table-column>
          <el-table-column prop="real_bug_num" label="real_bug_num"></el-table-column>
          <el-table-column prop="unknown_bug_num" label="unknown_bug_num"></el-table-column>
          <el-table-column prop="fp_bug_num" label="fp_bug_num"></el-table-column>
          <el-table-column sortable prop="date" label="date"></el-table-column>
          <el-table-column label="操作" width="90">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-dialog title="对比结果" :visible.sync="result_show">
      <el-table :data="compareData">
        <el-table-column property="run_id" label="run_id"></el-table-column>
        <el-table-column property="bug_id" label="bug_id"></el-table-column>
        <el-table-column property="file_path" label="file_path"></el-table-column>
        <el-table-column property="line" label="line"></el-table-column>
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
    handleDetail(index, row) {
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

$margin: 22px;
.content {
  margin-top: $margin;
}
.btn-row {
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
