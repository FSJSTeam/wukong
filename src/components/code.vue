<template>
  <div class="wk-content">
    
    <el-row >
      <el-col :span="24">
        Bug List Of {{ filename }}
      </el-col>
      <el-col :span="8" class="bug-list">
        <ol>
          <li @click="bugClick(index, item)" :class="{active: currentIndex==index}" v-for="(item, index) in bugList" :key="index">[{{ bug_id }}] Line {{item.line}} {{ item.message }}</li>
        </ol>
      </el-col>
      <el-col :span="16" class="code-container">
        <p class="code-title" v-text="filename"></p>
        <codemirror ref="cm"
          :value="code"
          :options="cmOptions"
          @ready="onCmReady"
        ></codemirror>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/clike/clike.js'
// import 'codemirror/theme/base16-light.css'
export default {
  name: 'WkCode',
  data () {
    return {
      msg: '代码错误展示页',
      code: '',
      currentIndex: 0,
      filename: '',
      run_id: 0,
      bug_id: 0,
      bugList: [],
      cmOptions: {
        tabSize: 4,
        height: '400px',
        mode: 'text/x-csrc',
        theme: 'default',
        lineNumbers: true,
        line: true,
        readOnly: true,
        gutters: ['CodeMirror-linenumbers', 'breakpoints']
      }
    }
  },
  components: {
    codemirror
  },
  computed: {
    codemirror() {
      return this.$refs.cm.codemirror
    }
  },
  mounted() {
    this.run_id = this.$route.query.run_id
    this.bug_id = this.$route.query.bug_id
    this.loadBugs()
  },
  methods: {
    onCmReady(cm) {
      cm.setSize('auto', '400px')
    },
    bugClick(index, item) {
      this.currentIndex = index
      var lineNumber = item.line - 1
      console.log(lineNumber)
      this.codemirror.clearGutter('breakpoints')
      this.codemirror.setGutterMarker(lineNumber, 'breakpoints', this.makeMarker())
      // this.codemirror.addWidget({lineNumber}, this.makeMarker(), true)
    },
    makeMarker() {
      var marker = document.createElement('div')
      marker.style.color = "#822"
      marker.innerHTML = "■"
      return marker
    },
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
        if(res.data) {
          this.filename = res.data[0].file_name
          this.bug_id = res.data[0].bug_id
          this.bugList = res.data
          this.loadfile()
        }        
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
        that.code = res.data.file_content
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
$minHeight: 400px;

.code-title {
  background: #D3DCE6;
  margin: 0;
  height: 40px;
  line-height: 40px;
  font-weight: bold;
  padding-left: 2em;
}
.bug-list {
  min-height: $minHeight + 40px;
  background: white;
  padding: 20px 0;
  ol {
    list-style: none;
    margin: 0;
    padding: 0 20px;
    li {
      min-height: 30px;
      line-height: 30px;
      padding: 0 1em;
      &.active {
        background: #D3DCE6;
      }
    }
  }
}
.code-container {
  min-height: $minHeight;
  background: white;
}
</style>
 