<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试视图 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="addRole">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表 -->
      <el-table :data="rolesList"
                stripe
                border>
        <!-- 下拉 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <!-- 一级权限 -->
            <el-row :class="['bdbottom','vcenter', i1 ===0?'bdtop':'']"
                    v-for="(item1,i1) in scope.row.children"
                    :key="item1.id">
              <el-col :span="5">
                <el-tag closable
                        @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二,三级权限 -->
              <el-col :span="19">
                <el-row v-for="(item2,i2) in item1.children"
                        :key="item2.id"
                        :class="['vcenter',i2===0?'':'bdtop']">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success"
                            closable
                            @close="removeRightById(scope.row,item2.id)">
                      {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning"
                            closable
                            @close="removeRightById(scope.row,item3.id)"
                            v-for="item3 in item2.children"
                            :key="item3.id">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 序号 -->
        <el-table-column type="index"
                         label="#">
        </el-table-column>
        <!-- 角色名称 -->
        <el-table-column prop="roleName"
                         label="角色名称">
        </el-table-column>
        <!-- 角色描述 -->
        <el-table-column prop="roleDesc"
                         label="角色描述">
        </el-table-column>
        <!-- 操作角色 -->
        <el-table-column label="操作"
                         width="300px">
          <template v-slot="scope">
            <!-- 编辑角色 -->
            <el-button type="primary"
                       size="mini"
                       icon="el-icon-edit">
              编辑</el-button>
            <!-- 删除角色 -->
            <el-button type="danger"
                       size="mini"
                       icon="el-icon-delete">
              删除</el-button>

            <!-- 分配权限 -->
            <el-button type="warning"
                       size="mini"
                       icon="el-icon-setting"
                       @click="showSetRigthDialog(scope.row)">
              分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限"
               :visible.sync="setRigthDialogVisible"
               width="50%"
               @close="closeSetRightDialog">
      <el-tree :data="rightsTree"
               show-checkbox
               :props="treeProps"
               default-expand-all
               :default-checked-keys="defaultKeys"
               node-key="id"
               ref="rightsTreeRef">
      </el-tree>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeSetRightDialog">取 消</el-button>
        <el-button type="primary"
                   @click="submitSetRightDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  created () {
    this.getRolesList()
  },
  data () {
    return {
      rolesList: [],
      setRigthDialogVisible: false,
      rightsTree: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的权限id值
      defaultKeys: [],
      // 当前即将分配权限的roleId
      roleId: ''
    }
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          msg: res.meta.msg
        })
      }
      this.rolesList = res.data
      console.log(this.rolesList)
    },
    // 添加角色
    addRole () {
      console.log('addrole')
    },
    // 移除指定角色的权限
    async removeRightById (role, rightid) {
      console.log(role, rightid)
      let roleid = role.id
      const confirmResult = await this.$confirm('此操作将永久移除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消移除权限操作')
      }
      // console.log(confirmResult)
      const { data: res } = await this.$axios.delete(`roles/${roleid}/rights/${rightid}`)
      if (res.meta.status !== 200) {
        return this.$message.error('移除权限失败')
      }
      // this.getRolesList()
      role.children = res.data
      this.$message.success('移除权限成功')
    },
    async showSetRigthDialog (role) {
      // console.log(role)
      this.roleId = role.id
      const { data: res } = await this.$axios.get(`rights/tree`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.rightsTree = res.data

      this.getLeafKeys(role, this.defaultKeys)
      // this.getLeafKeys(role)
      this.setRigthDialogVisible = true
    },
    closeSetRightDialog () {
      this.defaultKeys = []
      this.setRigthDialogVisible = false
    },
    async submitSetRightDialog () {
      const keys = [
        ...this.$refs.rightsTreeRef.getCheckedKeys()
        , ...this.$refs.rightsTreeRef.getHalfCheckedKeys()
      ]
      console.log(keys)
      const idStr = keys.join(',')
      const { data: res } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$$message.error('分配权限失败')
      } else {
        this.$message.success('分配权限成功')
      }
      this.closeSetRightDialog()
      this.getRolesList()
    },
    // 通过递归的形式获取角色下三级权限的ID,并保存到defaultKeys数组中
    getLeafKeys (node, arr) {
      if (!node.children) {
        // 如果当前node节点不包含children属性,则是最下级节点
        return arr.push(node.id)
      } else {
        node.children.forEach(item => {
          this.getLeafKeys(item, arr)
        });
      }
      // if (node.children) {
      //   node.children.forEach(item => {
      //     this.getLeafKeys(item)
      //   });
      // } else {
      //   return this.defaultKeys.push(node.id)
      // }
    }
  }
}
</script>

<style>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>