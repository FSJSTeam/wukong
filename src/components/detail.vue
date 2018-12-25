<template>
  <div class="wk-content">
    <!-- bug 类型 -->
    <el-row v-show="bugshow">
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="searchForm">
          <el-form-item :label="name">
            <el-select v-model="formInline.reportType" @change="reportTypeChange" placeholder="please selected">
              <el-option label="All" value="All"></el-option>
              <el-option label="RealBug" value="real bug"></el-option>
              <el-option label="FalsePositive" value="false positive"></el-option>
              <el-option label="Unknown" value="unknown"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="formInline.reportBug" placeholder="please selected">
              <el-option label="All" value="All"></el-option>
              <el-option label="True" value="1"></el-option>
              <el-option label="False" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="comment 筛选" style="float: right;margin-right: 0;">
            <el-input
              placeholder=""
              v-model="formInline.commet">
              <i slot="suffix" @click="commentFixed" class="el-input__icon el-icon-close"></i>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-table :data="bugpagedata" border @row-click="handleDetail" @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter" >
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
          <el-form-item :label="name">
            <el-select v-model="formInline.reportType" placeholder="please selected">
              <el-option label="All" value="All"></el-option>
              <el-option label="RealBug" value="real bug"></el-option>
              <el-option label="FalsePositive" value="false positive"></el-option>
              <el-option label="Unknown" value="unknown"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select v-model="formInline.reportBug" placeholder="please selected">
              <el-option label="All" value="All"></el-option>
              <el-option label="True" value="1"></el-option>
              <el-option label="False" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="comment 筛选" style="float: right;margin-right: 0;">
            <el-input
              placeholder=""
              v-model="formInline.commet">
              <i slot="suffix" @click="commentFixed" class="el-input__icon el-icon-close"></i>
            </el-input>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-table :data="filepagedata" border @row-click="handleDetail" @cell-mouse-leave="cellMouseLeave" @cell-mouse-enter="cellMouseEnter" >
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
      name: '',
      msg: '详细报告列表页',
      type: '',
      // pageTotal: 0,
      currentPage: 1,
      pageSize: 5,
      formInline: {
        reportType: 'All',
        reportBug: 'All',
        commet: '',
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
    'pageTotal'() {
      return this.filedata.length || this.bugdata.length;
    },
    'bugshow'() {
      return this.type ==  'bug' ? true : false
    },
    'bugdata': {
      get: function() {
        var type = this.formInline.reportType
        var comment = this.formInline.reportBug
        var comments = this.formInline.commet
        return this.bugData.filter(item => {
            if (type == 'All') {
              if(comment == 'All') {
                return item && item.comment.indexOf(comments) > -1
              }else {
                return (item.comment.length > 0) == comment && item.comment.indexOf(comments) > -1
              }
            }else {
              if(comment == 'All') {
                return item.report_type == type && item.comment.indexOf(comments) > -1
              }else {
                return (item.comment.length > 0) == comment && item.report_type == type && item.comment.indexOf(comments) > -1
              }
            }
        })
      },
      set: function() {

      }
    },
    'filepagedata'() {
      return this.filedata.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    },
    'bugpagedata'() {
      return this.bugdata.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    },
    'filedata'() {
      var type = this.formInline.reportType
      var comment = this.formInline.reportBug
      var comments = this.formInline.commet
      return this.filebugData.filter(item => {
          if (type == 'All') {
            if(comment == 'All') {
              return item && item.comment.indexOf(comments) > -1
            }else {
              return (item.comment.length > 0) == comment && item.comment.indexOf(comments) > -1
            }
          }else {
            if(comment == 'All') {
              return item.report_type == type && item.comment.indexOf(comments) > -1
            }else {
              return (item.comment.length > 0) == comment && item.report_type == type && item.comment.indexOf(comments) > -1
            }
          }
      })
    }
  },
  watch: {

  },
  mounted() {
    this.type = this.$route.query.type
    this.run_id = this.$route.query.run_id
    this.bug_num = this.$route.query.bug_num
    this.name = this.$route.query.name
    // this.pageTotal = parseInt(this.bug_num)
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
    commentFixed() {
      this.formInline.commet = ''
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
        // bug_num: this.currentPage * this.pageSize,
        token: that.$cookie.get('wk_token'),
        cmd: 'detail_file'
      }
      that.$ajax.post('/', "msg="+JSON.stringify(data) ).then(res => {
        if(res.data) {
          that.filebugData = Array.isArray(res.data)? res.data: [res.data]
          if(that.filebugData.length > 0) {
            that.filebugData.map(item => {
              item.comment = item.comment == '' ? 'null' : comment
              return item
            })
          }
        }
      })
    },
    loadBugData() {
      var that = this
      var data = {
        run_id: this.run_id,
        bugtype: this.bug_type,
        // bug_num: this.currentPage * this.pageSize,
        token: that.$cookie.get('wk_token'),
        cmd: 'detail_bugtype'
      }
      that.$ajax.post('/', "msg="+JSON.stringify(data) ).then(res => {
        if(res.data) {
          that.bugData = Array.isArray(res.data)? res.data: [res.data]
          if(that.bugData.length > 0) {
            that.bugData.map(item => {
              item.file_name = item.file_name == null ? 'null': item.file_name
              item.comment = item.comment == '' ? 'null' : comment
              return item
            })
          }
          this.bugdata = this.bugData
        }
      })
    },
    handleDetail(row) {
      var type = this.type
      this.$router.push({name: 'code', query: {type, run_id: this.run_id, bug_id: row.bug_id, file_name:row.file_name}})
    },
    onSubmit() {

    },
    reportTypeChange() {
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~static/styles/common";
.searchForm {
  margin-top: 5px ;
}
.el-form-item{
  margin-bottom: 10px ;
}
</style>
