<template>
  <div class="login">
    <div class="login-main">
    	<p class="login-logo"><img src="../../static/images/logo-black.png" /></p>
    	<p class="login-title">先进的静态分析检测工具</p>
    	<div class="login-alert">
	    	<template>
			  <el-alert
			    title="登录名或登录密码不正确"
			    type="warning"
			    show-icon>
			  </el-alert>
			</template>
		</div>
    	<div class="login-form">
    		<el-form ref="form" :model="form">
			  <el-form-item label="用户名">
			    <el-input v-model="form.username"></el-input>
			  </el-form-item>
			  <el-form-item label="密码">
			    <el-input type="password" v-model="form.password"></el-input>
			  </el-form-item>
    		  <el-form-item>
    			<el-button type="primary" @click="onSubmit">注册</el-button>
    			<el-button type="primary" @click="onSubmit">登录</el-button>
    		  </el-form-item>
			</el-form>
    	</div>
    </div>
    <div class="copyRight">中科天齐-Copyright @copyright 2018 宁波中科天齐信息技术有限公司</div>
  </div>
</template>

<script>
export default {
  name: 'WkLogin',
  data() {
      return {
        form: {
          username: '',
          password: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
				var data = this.form
				data.cmd = 'login'
				this.$ajax.post('/index.php', "msg="+JSON.stringify(data) ).then(res => {
					console.log(res)
				})
      }
    }
}
</script>

<style lang="scss" scpoed>
@import "~static/styles/common";
@import "~static/styles/login";
</style>
