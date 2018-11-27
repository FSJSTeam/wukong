<template>
  <div class="wk-content">
    
    <el-row >
      <el-col :span="24">
        
      </el-col>
      <el-col :span="24">
        <el-form :inline="true" :model="formInline" class="searchForm">
          <el-form-item :label="'Bug List Of'+ filename">
            <el-select v-model="formInline.reportType" placeholder="please selected">
              <el-option label="All" value="All"></el-option>
              <el-option label="RealBug" value="RealBug"></el-option>
              <el-option label="FalsePositive" value="FalsePositive"></el-option>
              <el-option label="Unknown" value="Unknown"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formInline.reportBug" placeholder="please selected">
              <el-option label="All" value="All"></el-option>
              <el-option label="True" value="True"></el-option>
              <el-option label="False" value="False"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8" class="bug-list">
        <!-- <ol>
          <li @click="bugClick(index, item)" :class="{active: currentIndex==index}"  v-for="(item, index) in bugList" :key="index">            
            <p>[{{ bug_id }}] Line {{item.line}} {{ item.message }}</p>             
          </li>
        </ol> -->
        <el-collapse v-model="activeName" accordion>
          <div v-for="(item, index) in bugList" :name="index" :key="index"
          @click="bugClick(index, item)"
          @contextmenu.prevent="rightClick">
            <el-collapse-item :name="index" :title="'['+ bug_id +'] Line '+item.line+'  '+ item.message">
            <template slot="title">
              <el-checkbox v-model="item.isCheck"  @change="checkBugs(index,item)"></el-checkbox>
              [ Line {{item.line}} ]  {{item.message}}
            </template>
              <ul>
                <li v-for="(step, i) in item.steps" 
                :key="i"
                @click.stop="stepClick(i, step)">
                  <!-- <span @click="addCommet(index, item)">标记</span>  -->
                  step{{i+1}}: {{step.message}}
                </li>
              </ul> 
            </el-collapse-item>
          </div>        
        </el-collapse>
        <p style="padding-left:20px;">
          <el-button @click="muiltmark">标记</el-button>
        </p>
        
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
    <el-dialog
      title="Commet"
      :visible.sync="commetShow"
      width="70%">
      <p class="commentRadio">
        <el-radio v-model="commentType" label="1">real bug</el-radio>
        <el-radio v-model="commentType" label="2">false positive</el-radio>
      </p>
      
      <el-input
        type="textarea"
        :rows="8"
        placeholder="多行输入"
        v-model="commet">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="commetShow = false">取 消</el-button>
        <el-button type="primary" @click="saveCommet()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { codemirror } from "vue-codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/clike/clike.js";
// import 'codemirror/theme/base16-light.css'
export default {
  name: "WkCode",
  data() {
    return {
      msg: "代码错误展示页",
      code: "",
      commentType: "1",
      commetShow: false,
      commet: "",
      activeName: "",
      currentIndex: 0,
      filename: "",
      run_id: 0,
      bug_id: 0,
      bugList: [],
      selectedIds: [],
      formInline: {
        reportType: "",
        reportBug: ""
      },
      cmOptions: {
        tabSize: 4,
        height: "400px",
        mode: "text/x-csrc",
        theme: "default",
        lineNumbers: true,
        line: true,
        readOnly: true,
        viewportMargin: 20,
        gutters: ["CodeMirror-linenumbers", "breakpoints"]
      }
    };
  },
  components: {
    codemirror
  },
  computed: {
    codemirror() {
      return this.$refs.cm.codemirror;
    }
  },
  watch: {
    commetShow(val) {
      if (!val) {
        this.commet = "";
      }
    }
  },
  mounted() {
    this.run_id = this.$route.query.run_id;
    this.bug_id = this.$route.query.bug_id;
    this.loadBugs();
  },
  methods: {
    onCmReady(cm) {
      cm.setSize("auto", "560px");
    },
    bugClick(index, item) {
      this.currentIndex = index;
      var lineNumber = item.line - 1;
      this.codemirror.clearGutter("breakpoints");
      this.codemirror.setGutterMarker(
        lineNumber,
        "breakpoints",
        this.makeMarker(lineNumber)
      );
      var brekpoints = document.getElementsByClassName("code-brekpoints")[0];
      brekpoints.parentNode.classList.add("breakpoint");
      this.clearWidget();
      // this.codemirror.addWidget(
      //   { line: lineNumber },
      //   this.makeMsgMarker(item.message),
      //   true
      // );
      this.msgMarker(lineNumber, item.message)
    },
    stepClick(i, step) {
      var lineNumber = step.line - 1;
      this.codemirror.clearGutter("breakpoints");
      this.codemirror.setGutterMarker(
        lineNumber,
        "breakpoints",
        this.makeMarker(lineNumber)
      );
      var brekpoints = document.getElementsByClassName("code-brekpoints")[0];
      brekpoints.parentNode.classList.add("breakpoint");
      this.clearWidget();
      this.msgMarker(lineNumber, step.message)
    },
    msgMarker(lineNumber, msg) {
      var pNode = document.getElementsByClassName('CodeMirror-code')[0]
      pNode.insertBefore(this.makeMsgMarker(msg), pNode.childNodes[lineNumber+1])
    },
    clearWidget() {
      var widgets = document.getElementsByClassName("code-message");
      if (widgets.length > 0) {
        for (let i = 0; i < widgets.length; i++) {
          widgets[i].parentNode.removeChild(widgets[i]);
        }
      }
    },
    makeMarker(lineNumber) {
      var marker = document.createElement("div");
      marker.className = "code-brekpoints CodeMirror-linenumber";
      marker.innerHTML = lineNumber + 1;
      return marker;
    },
    makeMsgMarker(msg) {
      var marker = document.createElement("div");
      marker.className = "code-message";
      // marker.style.color = "white";
      marker.innerHTML = msg;
      return marker;
    },
    addCommet() {
      this.commetShow = true;
    },
    loadBugs() {
      var that = this;
      var data = {
        run_id: that.run_id,
        bug_id: that.bug_id,
        bug_num: 10,
        token: that.$cookie.get("wk_token"),
        cmd: "report"
      };
      that.$ajax.post("/", "msg=" + JSON.stringify(data)).then(res => {
        if (res.data) {
          this.filename = res.data[0].file_name;
          this.bug_id = res.data[0].bug_id;
          this.bugList = res.data
          this.bugList = this.bugList.map(item => {
            item.isCheck = false
            return item
          })
          this.loadfile();
        }
      });
    },
    loadfile() {
      var that = this;
      var data = {
        cmd: "request_file",
        file_name: that.filename,
        token: that.$cookie.get("wk_token")
      };
      that.$ajax.post("/", "msg=" + JSON.stringify(data)).then(res => {
        that.code = res.data.file_content + "\r\n\r\n";
      });
    },
    saveCommet() {
      if (this.commet.length > 0) {
        this.mark();
      } else {
        this.$message({
          showClose: true,
          message: "请输入后再保存",
          type: "warning"
        });
      }
    },
    mark() {
      var that = this;
      var data = {
        cmd: "report_markbug",
        run_id: that.run_id,
        bug_id: that.bug_id,
        comment: this.commet,
        bugtype: 0,
        token: that.$cookie.get("wk_token")
      };
      that.$ajax.post("/", "msg=" + JSON.stringify(data)).then(res => {
        if (res.data && res.data.result == "0") {
          this.$message({
            showClose: true,
            message: "保存成功",
            type: "success"
          });
          this.commetShow = false;
        } else {
          this.$message({
            showClose: true,
            message: "保存失败，请重试",
            type: "warning"
          });
        }
      });
    },
    rightClick(event) {
      var el1 = event.currentTarget;
      var targetClass = event.target.classList[0];
      console.log(el1, targetClass)
      if('el-collapse-item__header' == targetClass){
        this.commetShow = true
      }        
    },
    muiltmark() {
      this.commetShow = true
    },
    checkBugs(index, item) {
      console.log(item)     
      
    },
    onSubmit() {},
  }
};
</script>

<style lang="scss" scoped>
@import "~static/styles/common";
$minHeight: 600px;
.searchForm {
  margin-top: 5px;
}
.commentRadio {
  padding: 0 0 30px 0;
  margin: 0;
}
.code-title {
  background: #cdcdcd;
  margin: 0;
  height: 40px;
  line-height: 40px;
  font-weight: bold;
  padding-left: 2em;
}
.bug-list {
  height: $minHeight;
  background: $whiteBackground;
  border: 1px solid $BlackBackground;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 20px 0;
  ul {
    list-style: none;
    margin: 0;
    padding: 0 20px;
    > li {
      min-height: 30px;
      line-height: 30px;
      padding: 0 1em;
      user-select: none;
      position: relative;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      > span {
        padding: 3px 4px;
        font-size: 12px;
        color: white;
        background: rgb(217, 83, 79);
        cursor: pointer;
        border-radius: 3px;
      }
      &.active {
        // background: #D3DCE6;
      }
    }
  }
}

.code-container {
  min-height: $minHeight;
  background: white;
}
.el-collapse {
  border-top: 0px;
}
</style>
 