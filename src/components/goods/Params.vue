<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试视图 -->
    <el-card>
      <!-- 头部警告区 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！"
                :closable="false"
                show-icon
                class="cat_opt"
                type="warning">
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row>
        <el-col>
          <!-- 查询指定的商品分类 -->
          <span>选择商品分类：</span>
          <el-cascader v-model="selectedKeys"
                       :props="cateProps"
                       :options="cateList"
                       @change="selectedKeysChange"></el-cascader>
        </el-col>
      </el-row>
      <!-- 展示指定的商品分类，并提供修改、删除功能 -->
      <el-tabs v-model="activeTabName"
               @tab-click="activeTabChange">
        <el-tab-pane label="动态参数"
                     name="many">
          <el-row>
            <el-button type="primary"
                       @click="showAddParamsDialog"
                       :disabled="isBtnDisabled"
                       size="mini">添加参数</el-button>
          </el-row>
          <!-- 展示商品动态参数 -->
          <el-table :data="manyTableData"
                    border
                    stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals"
                        :key="i"
                        closable
                        @close="removeTag(i,scope.row)">
                  {{item}}
                </el-tag>
                <el-input v-if="scope.row.inputVisible"
                          class="input-new-tag"
                          v-model="scope.row.inputValue"
                          ref="saveTagInputRef"
                          size="small"
                          @keyup.enter.native="submitSaveTagInput(scope.row)"
                          @blur="closeSaveTagInput(scope.row)">
                </el-input>
                <el-button v-else
                           size="small"
                           @click="showSaveTagInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index">
            </el-table-column>
            <el-table-column label="参数名称"
                             prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary"
                           size="mini"
                           icon="el-icon-edit"
                           @click="showEditParamsDialog(scope.row.attr_id)"></el-button>
                <el-button type="danger"
                           size="mini"
                           icon="el-icon-delete"
                           @click="removeParams(scope.row.attr_id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性"
                     name="only">
          <el-row>
            <el-button type="primary"
                       @click="showAddParamsDialog"
                       :disabled="isBtnDisabled"
                       size="mini">添加属性</el-button>
          </el-row>
          <!-- 展示商品静态属性 -->
          <el-table :data="onlyTableData"
                    border
                    stripe>
            <!-- 静态属性表格 -->
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals"
                        :key="i"
                        closable
                        @close="removeTag(i,scope.row)">
                  {{item}}
                </el-tag>
                <el-input v-if="scope.row.inputVisible"
                          class="input-new-tag"
                          v-model="scope.row.inputValue"
                          ref="saveTagInputRef"
                          size="small"
                          @keyup.enter.native="submitSaveTagInput(scope.row)"
                          @blur="closeSaveTagInput(scope.row)">
                </el-input>
                <el-button v-else
                           size="small"
                           @click="showSaveTagInput(scope.row)">+ New Tag
                </el-button>
              </template>
            </el-table-column>
            <el-table-column type="index">
            </el-table-column>
            <el-table-column label="属性名称"
                             prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="scope">
                <el-button type="primary"
                           size="mini"
                           icon="el-icon-edit"
                           @click="showEditParamsDialog(scope.row.attr_id)"></el-button>
                <el-button type="danger"
                           size="mini"
                           icon="el-icon-delete"
                           @click="removeParams(scope.row.attr_id)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加' + titleText"
               :visible.sync="addParamsDialogVisible"
               @close="closeAddParamsDialog"
               width="50%">
      <el-form :model="addParamsForm"
               :rules="addParamsFormRules"
               ref="addParamsFormRef"
               label-width="100px">
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeAddParamsDialog">取 消</el-button>
        <el-button type="primary"
                   @click="submitAddParamsDialog">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog :title="'编辑' + titleText"
               :visible.sync="editParamsDialogVisible"
               @close="closeEditParamsDialog"
               width="50%">
      <el-form :model="editParamsForm"
               :rules="editParamsFormRules"
               ref="editParamsFormRef"
               label-width="100px">
        <el-form-item :label="titleText"
                      prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeEditParamsDialog">取 消</el-button>
        <el-button type="primary"
                   @click="submitEditParamsDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Params',
  created () {
    this.getCateList()
  },
  data () {
    return {
      // [standard]
      // 获取商品分类列表
      cateList: [],
      // 选中的商品分类
      selectedKeys: [],
      // 商品分类级联选择器属性配置
      cateProps: {
        expandTrigger: 'click',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 动态/静态
      activeTabName: 'many',
      // 动态参数列表
      manyTableData: [],
      // 静态参数列表
      onlyTableData: [],
      // [add]
      addParamsDialogVisible: false,
      addParamsForm: {
        attr_name: ''
      },
      addParamsFormRules: {
        'attr_name': [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      // [edit]
      editParamsDialogVisible: false,
      editParamsForm: {
      },
      editParamsFormRules: {
        'attr_name': [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    // [standard]
    // 获取商品分类列表
    async getCateList () {
      const { data: res } = await this.$axios.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      // console.log(res.data)
      this.cateList = res.data
    },
    // 获取商品的动态参数/静态属性
    async getParamsData () {
      // console.log(this.selectedKeys)
      if (this.selectedKeys.length === 3) {
        const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, {
          params: { sel: this.activeTabName }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取商品参数失败')
        }
        console.log(res.data)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals ?
            item.attr_vals.split(' ')
            : []
          // 控制文本框的显示与隐藏
          item.inputVisible = false
          // 文本框的输入
          item.inputValue = ''
        })
        if (this.activeTabName === 'many') {
          this.manyTableData = res.data
        } else {
          this.onlyTableData = res.data
        }
      } else {
        this.manyTableData = []
        this.onlyTableData = []
      }
    },
    // 选择商品
    selectedKeysChange () {
      this.getParamsData()
    },
    // Tab页改变
    activeTabChange () {
      this.getParamsData()
    },
    // 保存参数tag标签
    async saveAttrVals (row) {
      const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
      if (res.meta.status !== 200) {
        row.attr_vals.pop()
        return this.$message.error('修改参数项失败')
      }
      this.$message.success('修改参数项成功')
    },
    // [add]
    // 添加新的动态参数/静态属性
    closeAddParamsDialog () {
      this.$refs.addParamsFormRef.resetFields()
      this.addParamsDialogVisible = false
    },
    submitAddParamsDialog () {
      this.$refs.addParamsFormRef.validate(async valid => {
        if (!valid) {
          return
        } else {
          const { data: res } = await this.$axios.post(`categories/${this.cateId}/attributes`, {
            attr_name: this.addParamsForm.attr_name,
            attr_sel: this.activeTabName
          })
          if (res.meta.status !== 201) {
            return this.$message.error('添加参数失败')
          }
          this.$message.success('添加参数成功')
          this.closeAddParamsDialog()
          this.getParamsData()
        }
      })
    },
    showAddParamsDialog () {
      this.addParamsDialogVisible = true
    },

    // [add]
    // 提交参数tag标签
    submitSaveTagInput (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false
      this.saveAttrVals(row)
    },
    showSaveTagInput (row) {
      row.inputVisible = true
      // 让文本框自动获得焦点
      this.$nextTick(() => {
        this.$refs.saveTagInputRef.$refs.input.focus()
      })
    },
    closeSaveTagInput (row) {
      this.submitSaveTagInput(row)
    },

    // [delete]
    // 移除动态参数/静态属性
    removeParams (attr_id) {
      // console.log(manyParamsId)
      this.$confirm(`此操作将永久删除该${this.titleText},是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$axios.delete(`categories/${this.cateId}/attributes/${attr_id}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除动态参数失败')
        }
        this.$message.success('删除动态参数成功')
        this.getParamsData()
      }).catch(() => {
        return this.$message.info('已取消删除')
      })
    },
    // 移除对应的tag参数和选项
    removeTag (i, row) {
      // console.log(i, row)
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)

    },
    // [edit]
    // 编辑动态参数/静态属性名字
    async showEditParamsDialog (attr_id) {
      this.editParamsDialogVisible = true
      const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes/${attr_id}`, {
        attr_sel: this.activeTabName
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      this.editParamsForm = res.data
    },
    closeEditParamsDialog () {
      this.$refs.editParamsFormRef.resetFields()
      this.editParamsDialogVisible = false
    },
    submitEditParamsDialog () {
      this.$refs.editParamsFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$axios.put(`categories/${this.cateId}/attributes/${this.editParamsForm.attr_id}`, {
          attr_name: this.editParamsForm.attr_name,
          attr_sel: this.editParamsForm.attr_sel,
          attr_vals: this.editParamsForm.attr_vals
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新参数失败')
        }
        console.log(res.data)
        this.$message.success('更新参数成功')

        this.closeEditParamsDialog()
        this.getParamsData()
      })
    }
  },
  computed: {
    // 如果按钮需要被禁用，则返回true，否则返回false
    isBtnDisabled () {
      if (this.selectedKeys.length === 3) {
        // return true
        return false
      } else {
        return true
      }
    },
    cateId () {
      let len = this.selectedKeys.length
      if (len > 0) {
        return this.selectedKeys[len - 1]
      } else {
        return null
      }
    },
    titleText () {
      if (this.activeTabName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 0px 0px 10px 0px;
}
.input-new-tag {
  width: 120px;
  vertical-align: center;
}
</style>