<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试视图 -->
    <el-card>
      <el-row>
        <el-col :span="8">
          <el-input v-model="queryInfo.query"
                    placeholder="请输入内容">
            <el-button slot="append"
                       icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <el-table :data="orderList"
                border
                stripe>
        <el-table-column type="index"
                         label="#">

        </el-table-column>
        <el-table-column label="订单编号"
                         prop="order_number">
        </el-table-column>
        <el-table-column label="订单金额"
                         prop="order_price">
        </el-table-column>
        <el-table-column label="是否已付款">
          <template v-slot="scope">
            <el-tag type="success"
                    v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag v-else
                    type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否已发货"
                         prop="is_send">
        </el-table-column>
        <el-table-column label="下单时间">
          <template v-slot="scope">
            {{scope.row.create_time | dateFomat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button type="primary"
                       @click="showEditOrderDialog"
                       icon="el-icon-edit"
                       size="mini"></el-button>
            <el-button type="success"
                       @click="showProgressDialog"
                       icon="el-icon-location"
                       size="mini"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange"
                     @current-change="handleCurrentChange"
                     :current-page="queryInfo.pagenum"
                     :page-sizes="[10, 50, 100, 200]"
                     :page-size="queryInfo.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total">
      </el-pagination>
    </el-card>
    <!-- 编辑订单对话框 -->
    <el-dialog title="修改地址"
               width="50%"
               :visible.sync="editOrderDialogVisible">
      <el-form :model="addressForm"
               ref="addressFormRef"
               :rules="addressFormRules"
               label-width="100px">
        <el-form-item label="省市区/县"
                      prop="address1">
          <el-cascader :options="cityData"
                       v-model="addressForm.address1">

          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址"
                      prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeEditOrderDialog">取 消</el-button>
        <el-button type="primary"
                   @click="submitEditOrderDialog">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 展示进度对话框 -->
    <el-dialog title="物流进度"
               width="50%"
               :visible.sync="progressDialogVisible">
      <el-timeline :reverse="reverse"
                   class="timeline">
        <el-timeline-item v-for="(item,index) in progressForm"
                          :key="index"
                          :color="index===progressForm.length-1?'#0bbd87':''"
                          :icon="index===progressForm.length-1?'el-icon-check':''"
                          :timestamp="item.timestamp">
          <span>{{item.content}}</span>
        </el-timeline-item>

      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>

import cityData from './citydata.js'
export default {
  created () {
    this.getOrderList()
  },
  data () {
    return {
      // lo:13;op:获取订单列表的请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // lo:;op:;
      orderList: [],
      // 
      total: 0,
      editOrderDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区/县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData: cityData,
      progressDialogVisible: false,
      progressForm: [

        { content: '商品已经下单', timestamp: '2021-10-21 11:38' },
        { content: '包裹正在等待揽收', timestamp: '2021-10-21 13:53' },
        { content: '辽宁省盘锦市大硅县公司 已发出，下一站 盘锦转运中心', timestamp: '2021-10-21 15:13' },
        { content: '盘锦转运中心公司', timestamp: '2021-10-22 01:26' },
        { content: '盘锦转运中心公司 已发出，下一站 广州转运中心', timestamp: '2021-10-22 01:29' },
        { content: '广州转运中心公司 已收入', timestamp: '2021-10-23 21:02' },
        { content: '广州转运中心公司 已发出，下一站 佛山转运中心', timestamp: '2021-10-23 21:04' },
        { content: '佛山转运中心公司 已收入', timestamp: '2021-10-24 01:59' },
      ],
      reverse: true,

    }
  },
  methods: {
    async getOrderList () {
      const { data: res } = await this.$axios.get('orders', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败')
      }
      console.log(res)
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange (newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getOrderList()
    },
    showEditOrderDialog () {
      this.editOrderDialogVisible = true
    },
    closeEditOrderDialog () {
      this.$refs.addressFormRef.resetFields()
      this.editOrderDialogVisible = false
    },
    submitEditOrderDialog () {
      this.closeEditOrderDialog()
    },
    async showProgressDialog () {
      this.progressDialogVisible = true
    },


  },
}
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
.el-timeline-item:nth-child(1) span {
  color: green;
}
</style>