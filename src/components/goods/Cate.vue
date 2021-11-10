<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试视图 -->
    <el-card>
      <!-- 添加分类 -->
      <el-row>
        <el-col>
          <el-button type="primary"
                     @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 商品分类表格 -->
      <zk-table class="zk-table"
                ref="TableRef"
                index-text="序号"
                border
                show-index
                tree-type
                :columns="columns"
                :data="cateList"
                :expand-type="false"
                :selection-type="false">
        <template v-slot:isok="scope">
          <i v-if="!scope.row.cat_deleted"
             class="el-icon-success greenIcon"></i>
          <i v-else
             class="el-icon-error redIcon"></i>
        </template>
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.cat_level ===0"
                  type="primary">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level ===1"
                  type="success">二级</el-tag>
          <el-tag v-else
                  type="warning">三级</el-tag>
        </template>
        <template v-slot:operate="scope">
          <el-button type="primary"
                     @click="showEditCateDialog(scope.row)"
                     size="mini"
                     icon="el-icon-edit"></el-button>
          <el-button type="danger"
                     @click="delCate(scope.row.cat_id)"
                     size="mini"
                     icon="el-icon-delete"></el-button>

        </template>
      </zk-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryCateInfo.pagenum"
                     :page-sizes="[5, 10, 30, 50]"
                     :page-size="queryCateInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <el-dialog title="添加分类"
               :visible.sync="addCateDialogVisible"
               @close="closeAddCateDialog">
      <el-form :model="addCateForm"
               :rules="addCateFormRules"
               ref="addCateFormRef"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="分类名称"
                      prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectedKeys"
                       :props="cascaderProps"
                       :options="parentCateList"
                       @change="parentCateChange"
                       clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeAddCateDialog">取 消</el-button>
        <el-button type="primary"
                   @click="submitAddCateDialog">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类的对话框 -->
    <el-dialog title="编辑分类"
               :visible.sync="editCateDialogVisible"
               @close="closeEditCateDialog">
      <el-form :model="editCateForm"
               :rules="editCateFormRules"
               ref="editCateFormRef"
               label-width="100px"
               class="demo-ruleForm">
        <el-form-item label="分类名称"
                      prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeEditCateDialog">取 消</el-button>
        <el-button type="primary"
                   @click="submitEditCateDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  created () {
    this.getCateList()
  },
  data () {
    return {
      // [Standard]基本数据
      // 商品分类请求参数对象
      queryCateInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表
      cateList: [],
      // 分类总条数
      total: 0,
      // zk-table 表格列配置
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        {
          label: '是否有效', prop: 'cat_deleted',
          type: 'template', template: 'isok'
        },
        {
          label: '排序', prop: 'cat_level',
          type: 'template', template: 'order'
        },
        {
          label: '操作', type: 'template', template: 'operate'
        }
      ],
      // [Add]添加分类
      addCateDialogVisible: false,
      addCateForm: {
        cat_name: '',
        cat_pid: 0,
        cat_level: 0,
      },
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      parentCateList: [],
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: true,
      },
      // 选中的父级分类的id数组
      selectedKeys: [],
      // [Edit]编辑分类
      // 编辑分类对话框
      editCateDialogVisible: false,
      editCateForm: {
        cat_id: 0,
        cat_name: '',
      },

    }
  },
  computed: {
    editCateFormRules () {
      return this.addCateFormRules
    }
  },
  methods: {
    // 获取分类列表
    async getCateList () {
      const { data: res } = await this.$axios.get('categories', {
        params: this.queryCateInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      console.log(res)
      // console.log(this.total)
      this.cateList = res.data.result
      this.total = res.data.total
    },
    // 每页数据量改变
    handleSizeChange (newPageSize) {
      this.queryCateInfo.pagesize = newPageSize
      this.getCateList()
    },
    // 页码改变
    handleCurrentChange (newPagenum) {
      this.queryCateInfo.pagenum = newPagenum
      this.getCateList()
    },

    // 展示添加分类对话框
    showAddCateDialog () {
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 关闭添加分类对话框
    closeAddCateDialog () {
      this.addCateForm.cat_name = ''
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
      this.selectedKeys = []
      this.addCateDialogVisible = false
    },
    // 提交添加分类对话框
    submitAddCateDialog () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$axios.post('categories', this.addCateForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加商品分类失败')
          }
          this.$message.success('添加商品分类成功')
          this.getCateList()
          this.closeAddCateDialog()
        } else {
          return this.$message.info('请输入商品分类名称')
        }
      })

    },
    // 获取父级分类数据列表
    async getParentCateList () {
      // if (this.parentCateList.length !== 0) {
      //   return
      // }
      const { data: res } = await this.$axios.get('categories', {
        params: {
          type: 2
        }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      // console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChange () {
      // console.log(value)
      let len = this.selectedKeys.length
      if (len > 0) {
        this.addCateForm.cat_pid = this.selectedKeys[len - 1]
        this.addCateForm.cat_level = len
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 删除分类
    delCate (cateId) {
      this.$confirm('此操作将永久删除该分类，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.$axios.delete(`categories/${cateId}`)
      }).then(({ data: res }) => {
        console.log(res)
        if (res.meta.status !== 200) {
          this.$message.error('删除分类失败')
        }
        this.$message.success(res.meta.msg)
        this.getCateList()
      }).catch(() => {
        this.$message.info('已取消删除分类')
      })
    },
    // [edit]编辑分类名称
    showEditCateDialog (cate) {
      // console.log(cate)
      this.editCateForm.cat_id = cate.cat_id
      this.editCateForm.cat_name = cate.cat_name
      this.editCateDialogVisible = true
    },
    closeEditCateDialog () {
      this.editCateForm.cat_id = 0
      this.editCateForm.cat_name = ''
      this.editCateDialogVisible = false
    },
    submitEditCateDialog () {
      // console.log(this.editCateForm)
      this.$refs.editCateFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.info('请输入正确的商品分类名称')
        }
        const { data: res } = await this.$axios.put(`categories/${this.editCateForm.cat_id}`, {
          cat_name: this.editCateForm.cat_name
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新商品分类失败')
        }
        this.$message.success('更新商品分类成功')
        this.closeEditCateDialog()
        this.getCateList()
      })

    }
  },
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 10px;
  // margin-bottom: 10px;
}
.greenIcon {
  color: green;
}
.redIcon {
  color: red;
}
.el-cascader {
  width: 100%;
}
</style>