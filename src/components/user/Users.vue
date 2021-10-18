<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试视图 -->
    <el-card>
      <!-- 操作区域 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <!-- 搜索框 -->
          <el-input placeholder="请输入内容"
                    v-model="queryInfo.query"
                    class="input-with-select"
                    clearable
                    @clear="getUserList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <el-button type="primary"
                     @click="addEditDialog">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表单区域 -->
      <el-table :data="userList"
                style="width: 100%"
                border
                stripe>
        <el-table-column type="index"
                         width="50">
        </el-table-column>
        <el-table-column prop="username"
                         label="姓名">
        </el-table-column>
        <el-table-column prop="email"
                         label="邮箱">
        </el-table-column>
        <el-table-column prop="role_name"
                         label="角色">
        </el-table-column>
        <el-table-column prop="mobile"
                         label="电话">
        </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state"
                       @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作"
                         width="180px">
          <template v-slot="scope">
            <!-- {{scope.row.id}} -->
            <!-- 编辑用户 -->
            <el-tooltip effect="dark"
                        :enterable="false"
                        content="编辑"
                        placement="top">
              <el-button type="primary"
                         size="mini"
                         icon="el-icon-edit"
                         @click="showEditDialog(scope.row.id)">
              </el-button>
            </el-tooltip>
            <!-- 删除用户 -->
            <el-tooltip effect="dark"
                        :enterable="false"
                        content="删除"
                        placement="top">
              <el-button type="danger"
                         size="mini"
                         icon="el-icon-delete"
                         @click="showRemoveDialog(scope.row.id)"></el-button>
            </el-tooltip>
            <!-- 设置角色 -->
            <el-tooltip effect="dark"
                        :enterable="false"
                        content="设置角色"
                        placement="top">
              <el-button type="warning"
                         size="mini"
                         icon="el-icon-setting"
                         @click="showSetDialog(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[2, 5, 10, 20,50,100]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户"
               :visible.sync="addDialogVisible"
               width="50%">
      <el-form :model="addForm"
               :rules="addFormRules"
               label-width="70px"
               ref="addFormRef">
        <el-form-item label="姓名"
                      prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码"
                      prop="password">
          <el-input type="password"
                    v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机"
                      prop="mobile">
          <el-input v-model.number="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeAddDialog">取 消</el-button>
        <el-button type="primary"
                   @click="submitAddDialog">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="修改用户信息"
               :visible.sync="editDialogVisible"
               width="50%">
      <el-form :model="editForm"
               :rules="editFormRules"
               ref="editFormRef"
               label-position="right"
               label-width="70px">

        <el-form-item label="姓名">
          <el-input v-model="editForm.username"
                    disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱"
                      prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话"
                      prop="mobile">
          <el-input v-model.number="mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeEditDialog">取 消</el-button>
        <el-button type="primary"
                   @click="submitEditDialog">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="设置用户角色"
               :visible.sync="setDialogVisible"
               width="30%">
      <p>当前用户名称:{{setForm.userInfo.username}}</p>
      <p>当前用户角色:{{setForm.userInfo.role_name}}</p>
      <el-radio-group v-model="setForm.checkedRoleId"
                      class="vertical">
        <el-radio v-for="role in rolesList"
                  :key="role.id"
                  :label="role.id"
                  border
                  class="roleCheckbox">
          {{role.roleName}}
        </el-radio>
      </el-radio-group>

      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeSetDialog">取 消</el-button>
        <el-button type="primary"
                   @click="submitSetDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      // 获取用户列表参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 用户总数
      total: 0,
      // 用户列表
      userList: [],

      // 添加用户
      addDialogVisible: false,
      // 添加用户的表单信息
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户的表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { required: true, min: 3, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { required: true, min: 6, max: 15, message: '用户名的长度在6-15个字符之间', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { type: 'number', message: '请输入正确的电话号码', trigger: 'blur' }
        ],
      },
      // 设置用户
      editDialogVisible: false,
      editForm: {
      },
      // 修改用户的表单验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }

        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { type: 'number', message: '请输入正确的电话号码', trigger: 'blur' }
        ],
      },

      // 分配用户
      rolesList: [],
      setForm: {
        userInfo: {},
        checkedRoleId: '',
        userId: ''
      },
      setDialogVisible: false,
    }
  },
  computed: {
    mobile: {
      get: function () {
        return parseInt(this.editForm.mobile)
      },
      set: function (val) {
        this.editForm.mobile = val
      }
    }
  },
  methods: {
    // 获取用户列表
    async getUserList () {
      const { data: res } = await this.$axios.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message({
          message: res.meta.msg,
          type: 'error'
        })
      }
      this.total = res.data.total
      this.userList = res.data.users
    },
    // 展示添加用户对话框
    addEditDialog () {
      this.addDialogVisible = true
    },
    closeAddDialog () {
      this.$refs.addFormRef.resetFields()
      this.addDialogVisible = false
    },
    submitAddDialog () {
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        if (!valid) return
        else {
          // 结构赋值data属性，重命名为res
          const { data: res } = await this.$axios.post('/users', this.addForm)
          // console.log(res)
          if (res.meta.status !== 201) {
            return this.$message({
              type: 'error',
              msg: res.meta.msg
            })
          }
          this.$message.success(res.meta.msg)

          this.closeAddDialog()
          this.getUserList()
        }

      })


    },
    // 展示修改用户对话框
    async showEditDialog (userid) {
      const { data: res } = await this.$axios.get(`/users/${userid}`)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          msg: res.meta.msg
        })
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 关闭修改用户对话框
    closeEditDialog () {
      this.$refs.editFormRef.resetFields()
      this.editDialogVisible = false
    },
    // 修改用户
    submitEditDialog () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          this.$message({
            type: 'error',
            msg: res.meta.msg
          })
        }
        this.$message.success(`用户：${res.data.username},${res.meta.msg}`)
        this.closeEditDialog()
        this.getUserList()
      })

    },
    // 每页展示数量改变
    handleSizeChange (newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      window.sessionStorage.setItem('pagesize', newSize)
      this.getUserList()
    },
    // 页码改变
    handleCurrentChange (newPagenum) {
      // console.log(newPagenum)
      this.queryInfo.pagenum = newPagenum
      this.getUserList()
    },
    // 修改用户状态
    async userStateChange (userInfo) {
      // console.log(`id:${user.id},newState:${user.mg_state}`)
      const { data: res } = await this.$axios.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message({
          type: 'error',
          message: res.meta.msg
        })
      }
      this.$message.success(`更新用户状态成功`)
    },
    // 删除用户
    async showRemoveDialog (userId) {
      // console.log(userid)
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      // console.log(confirmResult, userid)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除')
      }
      const { data: res } = await this.$axios.delete(`users/${userId}`)
      if (res.meta.status !== 200) {
        return this.$message({
          type: 'error',
          msg: res.meta.msg
        })
      }
      this.$message.success('成功删除用户')
      this.getUserList()
    },
    // 展示设置用户角色对话框
    async showSetDialog (user) {
      // console.log(user.id)
      // 获取角色列表
      let userId = user.id
      const { data: res } = await this.$axios.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
      // 根据ID查询用户的角色ID
      const { data: res2 } = await this.$axios.get(`users/${userId}`)
      if (res2.meta.status !== 200) {
        return this.$message.error('获取当前用户信息失败')
      }
      console.log(res.data)
      this.$set(this.setForm, 'userInfo', user)
      this.setForm.userId = userId
      this.setForm.checkedRoleId = res2.data.rid
      console.log(this.setForm)
      this.setDialogVisible = true
    },
    // 关闭设置用户角色对话框
    closeSetDialog () {
      this.setDialogVisible = false
    },
    // 提交设置用户角色对话框
    async submitSetDialog () {
      if (this.setForm.checkedRoleId === '' || this.setForm.checkedRoleId === -1) {
        return this.closeSetDialog()
      }
      const { data: res } = await this.$axios.put(`users/${this.setForm.userId}/role`, {
        rid: this.setForm.checkedRoleId
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配用户角色失败')
      }
      this.$message.success(`用户${res.data.username}已成功分配角色`)
      this.getUserList()
      this.closeSetDialog()
    }
  }
}
</script>

<style lang="less" scoped>
.vertical {
  display: flex;
  flex-direction: column;
}
.roleCheckbox {
  margin: 0px 0px 10px 10px;
}
</style>