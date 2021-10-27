<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试视图 -->
    <el-card>
      <el-row :gutter="10">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input v-model="queryInfo.query"
                    placeholder="请输入商品名称"
                    clearable
                    @clear="getGoodsList">
            <el-button slot="append"
                       @click="getGoodsList"
                       icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品 -->
        <el-col :span="4">
          <el-button type="primary"
                     @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 展示商品列表表格 -->
      <el-table :data="goodsList"
                border
                stripe>
        <el-table-column type="index"
                         label="#">
        </el-table-column>
        <el-table-column prop="goods_name"
                         label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price"
                         width="95px"
                         label="商品单价（元）">
        </el-table-column>
        <el-table-column prop="goods_weight"
                         width="95px"
                         label="商品重量（kg）">
        </el-table-column>
        <el-table-column width="160px"
                         label="创建时间">
          <template v-slot="scope">
            {{scope.row.add_time | dateFomat}}
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="130px">
          <template v-slot="scope">
            <!-- {{scope.row.goods_id}} -->
            <el-button type="primary"
                       icon="el-icon-edit"
                       size="mini"></el-button>
            <el-button type="danger"
                       @click="removeGood(scope.row.goods_id)"
                       icon="el-icon-delete"
                       size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[10, 50, 100, 200]"
                     :page-size="10"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'List',
  created () {
    this.getGoodsList()
  },
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      goodsList: []
    }
  },
  methods: {
    // 获取商品列表
    // [standard]
    async getGoodsList () {
      const { data: res } = await this.$axios.get('goods', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      console.log(res.data)
      this.total = res.data.total
      this.goodsList = res.data.goods
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getGoodsList()
    },
    // [add]
    // [delete]
    removeGood (goodId) {
      this.$confirm('该操作将会永久移除商品条目是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return this.$axios.delete(`goods/${goodId}`)
      }).then(({ data: res }) => {
        console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('移除商品失败')
        }
        this.$message.success('移除商品成功')
        this.getGoodsList()
      }).catch(err => {
        this.$message.info('已取消操作')
        return err
      })
    },
    // [edit]
    // [router]
    goAddPage () {
      this.$router.push('/goods/add')
    },
  },

}
</script>

<style lang="less" scoped>
// .el-col {
//   margin-right: 10px;
// }
</style>