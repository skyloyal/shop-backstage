<template>
  <el-container>
    <el-header>
      <div class="logo_box">
        <img src="../assets/heima.png"
             alt="">
        <router-link to="/home">电商后台</router-link>
      </div>
      <div class="user_box">

        <el-button type="info"
                   @click="logout">退出</el-button>
      </div>

    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-main>Main</el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$message({
        message: '您已退出',
        type: 'success'
      })
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less">
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-header {
  display: flex;
  justify-content: space-between;
  .logo_box {
    // float: left;
  }
}
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>