<template>
  <div class="wk-content">
    {{ msg }}
    <el-row>
      <el-col :span="8"></el-col>
      <el-col :span="18"></el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'WkCode',
  data () {
    return {
      msg: '代码错误展示页',
      filename: '',
      run_id: 0,
      bug_id: 0,
    }
  },
  mounted() {
    this.run_id = this.$route.query.run_id
    this.bug_id = this.$route.query.bug_id
    this.loadBugs()
    // this.loadfile()
    // this.mark()
  },
  methods: {
    loadBugs() {
      var that = this
      var data = {
        run_id: that.run_id,
        bug_id: that.bug_id,
        bug_num: 10,
        token: that.$cookie.get('wk_token'),
        cmd: 'report'
      }
      that.$ajax.post('/', "msg="+JSON.stringify(data) ).then(res => {
        console.log(res.data)
      })
    },
    loadfile() {
      var that = this
      var data = {
        cmd: 'request_file',
        file_name: that.filename,
        token: that.$cookie.get('wk_token')
      }
      that.$ajax.post('/', "msg="+JSON.stringify(data) ).then(res => {
        console.log(res.data)
      })
    },
    mark() {
      var that = this
      var data = {
        cmd: 'report_markbug',
        run_id: that.run_id,
        bug_id: that.bug_id,
        comment: 'comment test',
        bugtype: 0,
        token: that.$cookie.get('wk_token')
      }
      that.$ajax.post('/', "msg="+JSON.stringify(data) ).then(res => {
        console.log(res.data)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~static/styles/common";

</style>
