<template>
  <!-- 头部 -->
  <el-container class="home-container">

    <el-header>
      <div class="logo_box">
        <img src="../assets/heima.png"
             alt="">
        <span>电商后台管理系统</span>
      </div>
      <div class="user_box">

        <el-button type="info"
                   @click="logout">退出</el-button>
      </div>

    </el-header>

    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="asideWidth">
        <!-- 侧边栏菜单区域 -->
        <div class="toggle-button"
             @click="toggleCollapse">
          <!-- <span>|||</span> -->
          <i class="el-icon-arrow-left"
             v-show="!isCollapse"></i>
          <i class="el-icon-arrow-right"
             v-show="isCollapse"></i>
        </div>
        <el-menu :default-active="activePath"
                 background-color="#333744"
                 text-color="#fff"
                 active-text-color="#007ACC"
                 unique-opened
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 router>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''"
                      v-for="item in menuList"
                      :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path"
                          v-for="subItem in item.children"
                          :key="subItem.id"
                          @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <!-- 内容主体 -->
        <el-main>
          <router-view></router-view>
        </el-main>
        <el-footer>Footer</el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconsObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,
      asideWidth: '200px',
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$message({
        message: '您已退出',
        type: 'success'
      })
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList () {
      const { data: res } = await this.$axios.get('menus')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message({
          message: res.meta.msg,
          type: 'error'
        })
      }
      this.menuList = res.data
      // console.log(this.menuList)
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
      if (this.isCollapse) {
        this.asideWidth = '64px'
      } else {
        this.asideWidth = '200px'
      }
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = window.sessionStorage.getItem('activePath')
    }
  }
}
</script>

<style lang="less">
.home-container {
  height: 100%;
}

.el-header {
  color: white;
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  .logo_box {
    display: flex;
    align-items: center;
    img {
      width: 50px;
    }
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333744;
  .toggle-button {
    background-color: #4a4f61;
    font-size: 12px;
    line-height: 24px;
    height: 24px;
    color: white;
    text-align: center;
    cursor: pointer;
    letter-spacing: 0.2em;
  }
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
  line-height: 60px;
}
body > .el-container {
  margin-bottom: 40px;
}

.iconfont {
  margin-right: 10px;
}
</style>