<template>
  <header class="wk-header">
  	<img class="logo" src="../../static/images/logo.png" />
  	<div class="user">
  		<el-dropdown trigger="click" @command="action">
	      <span class="el-dropdown-link">
	        {{username}}<i class="el-icon-arrow-down el-icon--right"></i>
	      </span>
	      <el-dropdown-menu slot="dropdown">
	        <el-dropdown-item command="logout">退出</el-dropdown-item>
	      </el-dropdown-menu>
	    </el-dropdown>
  	</div>
  </header>
</template>

<script>
export default {
	name: 'WkHeader',
	data() {
		return {

		}
	},
	computed: {
		'username'() {
			return this.$cookie.get('wk_username') || 'User'
		}
	},
	methods: {
		action(command) {
			if(command == 'logout') {
				this.$cookie.delete('wk_token')
				this.$cookie.delete('wk_username')
				this.$router.push({name: 'login'})
			}
		}
	}
	
}
</script>

<style lang="scss" scoped>
@import "~static/styles/common";

.wk-header {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  width: 100%;
	height: $headerHeight;
	z-index: 6;
  background-color: #323334;

  .logo{
  	float: left ;
  	margin: 18px 0 0 35px ;
  }

  .user{
  	float: right ;
  	margin: 45px 45px 0 0 ; 

  	.el-dropdown-link{
	  	color: #fff ;
	}

	i{
		margin-left: 5px ;
	}
  }
}
</style>
