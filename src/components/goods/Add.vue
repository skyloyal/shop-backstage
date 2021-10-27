<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试视图 -->
    <el-card>
      <el-alert title="添加商品信息"
                type="info"
                center
                show-icon
                :closable="false">
      </el-alert>
      <el-steps :space="200"
                align-center
                :active="parseInt(activeIndex)"
                finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form :model="addGoodForm"
               label-position="top"
               :rules="addGoodFormRules"
               ref="addGoodFormRef">
        <el-tabs tab-position="left"
                 @tab-click="handleTabChange"
                 :before-leave="beforeTabLeave"
                 v-model="activeIndex">
          <!-- 商品基本信息 -->
          <el-tab-pane label="基本信息"
                       name="0">
            <el-form-item label="商品分类"
                          prop="goods_cat">
              <el-cascader v-model="addGoodForm.goods_cat"
                           :options="cateList"
                           :props="cateProps"
                           @change="handleCateChange"></el-cascader>
            </el-form-item>
            <el-form-item label="商品名称"
                          prop="goods_name">
              <el-input v-model="addGoodForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格（元）"
                          prop="goods_price">
              <el-input v-model="addGoodForm.goods_price"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量（克）"
                          prop="goods_weight">
              <el-input v-model="addGoodForm.goods_weight"
                        type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量（个/件）"
                          prop="goods_number">
              <el-input v-model="addGoodForm.goods_number"
                        type="number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!--  -->
          <el-tab-pane label="商品参数"
                       name="1">
            <el-form-item :label="item.attr_name"
                          v-for="item in manyTableData"
                          :key="item.attr_id">
              <el-checkbox-group v-model="item.selectedVals">
                <el-checkbox v-for="(vals,i) in item.attr_vals"
                             :key="i"
                             border
                             :label="vals"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性"
                       name="2">
            <el-form-item v-for="item in onlyTableData"
                          :key="item.attr_id"
                          :label="item.attr_name">
              <el-input v-model="item.attr_vals">

              </el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片"
                       name="3">
            <el-upload :action="uploadURL"
                       :headers="headerObj"
                       :on-preview="handlePreview"
                       :on-remove="handleRemove"
                       :on-success="handleSuccess"
                       list-type="picture">
              <el-button size="small"
                         type="primary">点击上传</el-button>
              <div slot="tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容"
                       name="4">
            <el-form-item>
              <quill-editor v-model="addGoodForm.goods_introduce"
                            class="editor"></quill-editor>

            </el-form-item>
            <el-button type="primary"
                       @click="sumbitAddGoodForm"
                       class="btnAdd">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 图片预览对话框 -->
      <el-dialog title="图片预览"
                 :visible.sync="previewVisible"
                 width="50%">
        <img :src="previewPath"
             class="previewimg">
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  created () {
    this.getCateList()
  },
  data () {
    return {
      // 
      activeIndex: '0',
      // lo:29;op:添加商品表单对象
      addGoodForm: {
        goods_name: '',
        goods_cat: [],
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: [],
        attrs: []
      },
      // lo:null;op:表单项填写规则
      addGoodFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
      },
      // Tab1-商品分类级联选择器
      cateList: [],
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
      },
      // Tab2-动态参数
      manyTableData: [],
      // Tab3-静态属性
      onlyTableData: [],
      // Tab4-上传图片
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false,
    }
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$axios.get(`categories`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表失败')
      }
      this.cateList = res.data
      console.log(this.cateList)
    },
    handleCateChange () {
      if (this.addGoodForm.goods_cat.length !== 3) {
        this.addGoodForm.goods_cat = []
        this.$message.warning('只允许选择第三级商品分类')
      }

    },
    beforeTabLeave (newActiveIndex) {
      if (newActiveIndex !== '0') {
        if (this.addGoodForm.goods_cat.length !== 3) {
          this.activeIndex = '0'
          this.$message.warning('必须选择商品分类后，才可填写其他页签内容')
          return false
        }
      }
      return true
    },
    async handleTabChange () {
      // 切换动态参数页签,获取参数/属性
      // 获取动态参数
      if (this.activeIndex === '1') {
        const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取该分类参数失败')
        }
        this.manyTableData = res.data
        this.manyTableData.forEach((item) => {
          if (item.attr_vals.length === 0) {
            item.attr_vals = []
          } else {
            item.attr_vals = item.attr_vals.split(' ')
          }
          this.$set(item, 'selectedVals', [])
        })
        // 获取静态属性
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$axios.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'only'
          }
        })
        if (res.meta.status !== 200) {
          return this.$message.error('获取静态属性失败')
        }
        // console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    // lo:74;op:test
    // alertSelectedVals () {
    //   console.log(this.manyTableData)
    // },

    // lo:94;op:处理图片预览效果
    handlePreview (file) {
      // console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove (file) {
      // console.log(file)
      const filePath = file.response.data.tem_path
      const i = this.addGoodForm.pics.findIndex(x => {
        x.pic === filePath
      })
      this.addGoodForm.pics.splice(i, 1)
      console.log(this.addGoodForm)
    },
    // op:监听图片上传位置
    handleSuccess (response) {
      // console.log(response)
      const picInfo = { pic: response.data.tmp_path }
      this.addGoodForm.pics.push(picInfo)
      console.log(this.addGoodForm)
    },
    sumbitAddGoodForm () {
      // console.log(this.addGoodForm)
      this.$refs.addGoodFormRef.validate(async valid => {
        // 校验
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        // 数据处理
        let submitForm = _.cloneDeep(this.addGoodForm)
        submitForm.goods_cat = submitForm.goods_cat.join(',')
        // console.log(submitForm)
        this.manyTableData.forEach(item => {
          const attrInfo = {
            attr_id: item.attr_id,
            attr_value: item.selectedVals.join(' ')
          }
          submitForm.attrs.push(attrInfo)
        })
        this.onlyTableData.forEach(item => {
          const attrInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          submitForm.attrs.push(attrInfo)
        })
        console.log(submitForm)

        // 发送请求
        const { data: res } = await this.$axios.post('goods', submitForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败')
        }
        this.$message.success('添加商品成功')

        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      if (this.addGoodForm.goods_cat.length === 3) {
        return this.addGoodForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-steps {
  margin: 10px 0px;
}
.el-checkbox {
  margin: 0px 0px 0px 0px;
}
.previewimg {
  width: 100%;
}
</style>