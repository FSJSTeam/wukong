<template>
  <div class="login">
    <div class="login-main">
    	<p class="login-logo"><img src="../../static/images/logo-black.png" /></p>
    	<p class="login-title">先进的静态分析检测工具</p>
    	<div class="login-alert" v-show="loginError">
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
    			<el-button type="primary" @click="register">注册</el-button>
    			<!-- <el-button type="primary" @click="login">登录</el-button> -->
    		  </el-form-item>
			<el-form-item>
				<p class="tar redirect"><router-link :to="{ name: 'login'}">去登录>></router-link></p>
			</el-form-item>
			</el-form>
    	</div>
    </div>
    <div class="copyRight">中科天齐-Copyright @copyright 2018 宁波中科天齐信息技术有限公司</div>
  </div>
</template>

<script>
export default {
  name: 'WkSign',
  data() {
      return {
        form: {
          username: '',
          password: ''
				},
				loginError: false
      }
    },
    methods: {
			validate() {
				if(this.form.username.trim() == '') {
					this.$message({
						showClose: true,
						message: '请输入用户名',
						type: 'warning'
					});
					return false
				}else if(this.form.username.trim().length < 3) {
					this.$message({
						showClose: true,
						message: '用户名不可少于4位字符',
						type: 'warning'
					});
					return false
				}else if(this.form.password.trim() == '') {
					this.$message({
						showClose: true,
						message: '请输入密码',
						type: 'warning'
					});
					return false
				}else if(this.form.password.trim().length < 6) {
					this.$message({
						showClose: true,
						message: '密码不可少于6位',
						type: 'warning'
					});
					return false
				}else {
					return true
				}
			},
			register() {
				if(this.validate()) {
					var that = this
					var data = this.form
					data.cmd = 'signup'
					this.$ajax.post('/', "msg="+JSON.stringify(data) ).then(res => {
						console.log(res)
						if(res.data && res.data.result == 0) {
							// 注册成功
							that.$message({
								showClose: true,
								message: '注册成功,请登录',
								type: 'success'
							});
						}else {
							// 注册失败
							that.$message({
								showClose: true,
								message: '注册失败,请重试',
								type: 'warning'
							});
						}
					})
				}				
			},
      login() {
				if(this.validate()) {
					var that = this
					var data = this.form
					data.cmd = 'login'
					this.$ajax.post('/', "msg="+JSON.stringify(data) ).then(res => {
						if(res.data && res.data.result == 0) {
							// 登录成功
							that.$message({
								showClose: true,
								message: '登录成功',
								type: 'success'
							});
							that.$cookie.set('wk_token', res.data.token, 8)
							that.$cookie.set('wk_username', data.username, 8)
							that.$router.push({name: 'list'})
						}else {
							that.loginError = true
						}
					})
				}				
      }
    }
}
</script>

<style lang="scss" scpoed>
@import "~static/styles/common";
@import "~static/styles/login";
</style>
