<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试视图 -->
    <el-card>
      <el-table :data="rightsList"
                stripe
                border
                highlight-current-row
                style="width: 100%">
        <el-table-column type="index"
                         label="#">
        </el-table-column>
        <el-table-column prop="id"
                         label="ID"
                         width="100px">
        </el-table-column>
        <el-table-column prop="authName"
                         label="权限名称">
        </el-table-column>
        <el-table-column prop="path"
                         label="路径">
        </el-table-column>
        <el-table-column prop="level"
                         label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag v-else-if="scope.row.level === '1'"
                    type="success">二级</el-tag>
            <el-tag v-else
                    type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
export default {
  created () {
    this.getRightsList()
  },
  data () {
    return {
      rightsList: []
    }
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$axios.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          msg: res.meta.msg
        })
      }
      this.rightsList = res.data
      console.log(this.rightsList)
    }
  }
}
</script>

<style lang="less" scoped>
</style>