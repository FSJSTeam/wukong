<template>
  <div class="wk-content">
    <!-- bug 类型 -->
    <el-row v-show="bugshow">
      <el-col :span="20" :offset="2">
        <el-form :inline="true" :model="formInline" class="searchForm">
          <el-form-item label="Report Type">
            <el-select v-model="formInline.reportType" placeholder="please selected">
              <el-option label="RealBug" value="RealBug"></el-option>
              <el-option label="FalsePositive" value="FalsePositive"></el-option>
              <el-option label="Unknown" value="Unknown"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Marked">
            <el-select v-model="formInline.reportBug" placeholder="please selected">
              <el-option label="True" value="True"></el-option>
              <el-option label="False" value="False"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="20" :offset="2">
        <el-table :data="bugData" stripe border>
          <el-table-column prop="bug_id" label="bug ID"></el-table-column>
          <el-table-column prop="file_name" label="File"></el-table-column>
          <el-table-column prop="message" label="Message"></el-table-column>
          <el-table-column sortable prop="bug_type" label="Bug Type"></el-table-column>
          <el-table-column prop="report_type" label="Report Type"></el-table-column>
          <el-table-column prop="comment" label="Comment"></el-table-column>
          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleDetail(scope.$index, scope.row, 'bug')">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="20" :offset="2">
        <el-pagination class="mt20"
          background
          layout="prev, pager, next"
          :total="500">
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 文件类型 -->
    <el-row v-show="!bugshow">
      <el-col :span="20" :offset="2">
        <el-form :inline="true" :model="formInline" class="searchForm">
          <el-form-item label="Report Type">
            <el-select v-model="formInline.reportType" placeholder="please selected">
              <el-option label="RealBug" value="RealBug"></el-option>
              <el-option label="FalsePositive" value="FalsePositive"></el-option>
              <el-option label="Unknown" value="Unknown"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Marked">
            <el-select v-model="formInline.reportBug" placeholder="please selected">
              <el-option label="True" value="True"></el-option>
              <el-option label="False" value="False"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="20" :offset="2">
        <el-table :data="filebugData" stripe border>
          <el-table-column prop="bug_id" label="bug ID"></el-table-column>
          <el-table-column prop="message" label="Message"></el-table-column>
          <el-table-column sortable prop="bug_type" label="Bug Type"></el-table-column>
          <el-table-column prop="report_type" label="Report Type"></el-table-column>
          <el-table-column prop="comment" label="Comment"></el-table-column>
          <el-table-column label="操作" width="130">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleDetail(scope.$index, scope.row, 'file')">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="20" :offset="2">
        <el-pagination class="mt20"
          background
          layout="prev, pager, next"
          :total="500">
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
      formInline: {
        reportType: '',
        reportBug: ''
      },
      bugData: [
        {
          bug_id: '56021',
          file_name: 'code.vue',
          message: 'bugffer',
          bug_type: 'bugtype',
          report_type: 'report_type',
          comment: 'comment'
        }
      ],
      filebugData: [
        {
          bug_id: '550179',
          message: 'message',
          bug_type: 'use-after-free',
          report_type: 'RealBug',
          comment: 'comment'
        }
      ],
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
  },
  methods: {
    handleView() {

    },
    handleDetail(index, row, type) {
      console.log(index, row, type)
      this.$router.push({name: 'code', query: {type}})
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
