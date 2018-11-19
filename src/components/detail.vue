<template>
  <div class="wk-content">
    <!-- bug 类型 -->
    <el-row v-show="bugshow">
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="searchForm">
          <el-form-item label="">
            <el-select v-model="formInline.reportType" placeholder="please selected">
              <el-option label="All" value="All"></el-option>
              <el-option label="RealBug" value="RealBug"></el-option>
              <el-option label="FalsePositive" value="FalsePositive"></el-option>
              <el-option label="Unknown" value="Unknown"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="formInline.reportBug" placeholder="please selected">
              <el-option label="All" value="All"></el-option>
              <el-option label="True" value="True"></el-option>
              <el-option label="False" value="False"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item> -->
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-table :data="bugData" stripe border @row-click="handleDetail" @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter" >
          <el-table-column width="80" prop="bug_id" label="bug ID"></el-table-column>
          <el-table-column prop="file_name" label="File"></el-table-column>
          <el-table-column prop="message" label="Message"></el-table-column>
          <el-table-column prop="report_type" label="Report Type"></el-table-column>
          <el-table-column prop="comment" label="Comment"></el-table-column>
          <!-- <el-table-column label="操作" width="90">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleDetail(scope.$index, scope.row, 'bug')">查看</el-button>
            </template> -->
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="24">
        <el-pagination class="mt20"
          background
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :total="pageTotal">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 文件类型 -->
    <el-row v-show="!bugshow">
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="searchForm">
          <el-form-item label="">
            <el-select v-model="formInline.reportType" placeholder="please selected">
              <el-option label="All" value="All"></el-option>
              <el-option label="RealBug" value="RealBug"></el-option>
              <el-option label="FalsePositive" value="FalsePositive"></el-option>
              <el-option label="Unknown" value="Unknown"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="formInline.reportBug" placeholder="please selected">
              <el-option label="All" value="All"></el-option>
              <el-option label="True" value="True"></el-option>
              <el-option label="False" value="False"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-table :data="filebugData" stripe border @row-click="handleDetail" @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter" >
          <el-table-column width="80" prop="bug_id" label="bug ID"></el-table-column>
          <el-table-column prop="message" label="Message"></el-table-column>
          <el-table-column sortable prop="bug_type" label="Bug Type"></el-table-column>
          <el-table-column prop="report_type" label="Report Type"></el-table-column>
          <el-table-column prop="comment" label="Comment"></el-table-column>
         
        </el-table>
      </el-col>
      <el-col :span="24">
        <el-pagination class="mt20"
          background
          layout="prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="pageTotal">
        </el-pagination>
      </el-col>
    </el-row>
    
  </div>
</template>

<script>
export default {
  name: 'WkDetail',
  data () {
    return {
      msg: '详细报告列表页',
      type: '',
      pageTotal: 0,
      currentPage: 1,
      pageSize: 10,
      formInline: {
        reportType: '',
        reportBug: '',
        run_id: 0,
        bug_num: 0,
        _id: 0,
        bug_type: ''
      },
      bugData: [],
      filebugData: [],
    }
  },
  computed: {
    'bugshow'() {
      return this.type ==  'bug' ? true : false
    }
  },
  watch: {

  },
  mounted() {
    this.type = this.$route.query.type
    this.run_id = this.$route.query.run_id
    this.bug_num = this.$route.query.bug_num
    this.pageTotal = parseInt(this.bug_num)
    if(this.type == 'file') {
      this._id = this.$route.query._id   
      this.loadFileData()   
    }else if(this.type == 'bug') {
      this.bug_type = this.$route.query.bugtype
      this.loadBugData()
    }else {}
  },
  methods: {
    cellMouseEnter(row, column, cell, event) {
      cell.parentNode.classList.add('tr-highlight')
    },
    cellMouseLeave(row, column, cell, event) {
      cell.parentNode.classList.remove('tr-highlight')
    },
    handleView() {

    },
    handleCurrentChange(val) {
      this.currentPage = val
      if(this.type == 'file') {  
        this.loadFileData()   
      }else if(this.type == 'bug') {
        this.loadBugData()
      }else {}
    },
    loadFileData() {
      var that = this
      var data = {
        run_id: this.run_id,
        file_id: this._id,
        bug_num: this.currentPage * this.pageSize,
        token: that.$cookie.get('wk_token'),
        cmd: 'detail_file'
      }
      that.$ajax.post('/', "msg="+JSON.stringify(data) ).then(res => {
        if(res.data) {
          that.filebugData = Array.isArray(res.data)? res.data: [res.data]
        }
      })
    },
    loadBugData() {
      var that = this
      var data = {
        run_id: this.run_id,
        bugtype: this.bug_type,
        bug_num: this.currentPage * this.pageSize,
        token: that.$cookie.get('wk_token'),
        cmd: 'detail_bugtype'
      }
      that.$ajax.post('/', "msg="+JSON.stringify(data) ).then(res => {
        if(res.data) {
          that.bugData = Array.isArray(res.data)? res.data: [res.data]
        }
      })
    },
    handleDetail(row) {
      var type = this.type
      this.$router.push({name: 'code', query: {type, run_id: this.run_id, bug_id: row.bug_id, bug_num: this.bug_num}})
    },
    onSubmit() {

    }
  }
}
</script>

<style lang="scss" scoped>
@import "~static/styles/common";

$margin: 22px;
.searchForm {
  margin-top: $margin;
}
</style>
