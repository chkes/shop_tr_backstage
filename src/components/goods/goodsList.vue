<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/category">分类管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <!-- 搜索框区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="goodsParams.title"
            class="input-width"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="serachGoods"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4"
          ><el-button
            class="addUser"
            type="primary"
            @click="openaddDialogVisibles"
            >添加商品</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格区域 -->
      <el-table
        class="tabbox"
        :data="goodsList"
        style="width: 100%"
        stripe
        border
      >
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="cover_url" label="封面" width="60">
          <template slot-scope="scope">
            <img
              class="table-img"
              :src="scope.row.cover_url"
              alt=""
              @click="openImgdialogVisible(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="商品名"> </el-table-column>
        <el-table-column prop="stock" label="库存"> </el-table-column>
        <el-table-column prop="sales" label="销量"> </el-table-column>
        <el-table-column prop="price" label="价格"> </el-table-column>
        <el-table-column label="是否上架">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_on"
              active-color="#13ce66"
              inactive-color="#dcdfe6"
              :active-value="1"
              :inactive-value="0"
              @change="is_on(scope.row.id)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="是否推荐">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_recommend"
              active-color="#13ce66"
              inactive-color="#dcdfe6"
              :active-value="1"
              :inactive-value="0"
              @change="is_recommend(scope.row.id)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-tooltip effect="dark" content="修改按钮" placement="top">
              <el-button
                type="primary"
                icon="el-icon-edit"
                @click="openeditDialogVisibles(scope.row)"
              ></el-button>
            </el-tooltip>
            <!-- 删除按钮 -->
            <el-tooltip effect="dark" content="删除按钮" placement="top">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="delDialogVisible = true"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="goodsParams.current"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog :title="pigname" :visible.sync="imgdialogVisible" width="30%">
      <img class="pigImage" :src="pigImg" alt="" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="imgdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="imgdialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改商品模态框 -->
    <el-dialog
      title="修改商品"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form
        label-width="100px"
        ref="editFormRef"
        :rules="addFormrules"
        :model="editGoodsInfo"
      >
        <el-form-item label="书名" prop="title">
          <el-input v-model="editGoodsInfo.title"></el-input>
        </el-form-item>
        <el-form-item label="分类id" prop="category_id">
          <el-input v-model="editGoodsInfo.category_id"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="editGoodsInfo.description"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="editGoodsInfo.price"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="editGoodsInfo.stock"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-input v-model="editGoodsInfo.cover"></el-input>
        </el-form-item>
        <el-form-item label="详情" prop="details">
          <el-input v-model="editGoodsInfo.details"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsInfos">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加商品模态框 -->
    <el-dialog
      title="添加商品"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <el-form
        label-width="100px"
        ref="addFormRef"
        :rules="addFormrules"
        :model="addGoodsInfo"
      >
        <el-form-item label="书名" prop="title">
          <el-input v-model="addGoodsInfo.title"></el-input>
        </el-form-item>
        <el-form-item label="分类id" prop="category_id">
          <el-input v-model="addGoodsInfo.category_id"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="addGoodsInfo.description"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="addGoodsInfo.price"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="addGoodsInfo.stock"></el-input>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <el-input v-model="addGoodsInfo.cover"></el-input>
        </el-form-item>
        <el-form-item label="详情" prop="details">
          <el-input v-model="addGoodsInfo.details"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addGoodsInfos">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除用户信息模态框 -->
    <el-dialog title="删除用户" :visible.sync="delDialogVisible" width="30%">
      当前接口未开放
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类请求参数
      goodsParams: {
        // 搜索框内容
        title: '',
        current: 1
      },
      // 商品分类
      goodsList: [],
      // 商品总数
      total: null,
      // 图片放大图
      imgdialogVisible: false,
      // 当前方大的图片地址
      pigImg: '',
      // 当前图片的名称
      pigname: '',
      //  模态框
      editDialogVisible: false,
      addDialogVisible: false,
      delDialogVisible: false,
      // 修改商品信息临时存储
      editGoodsInfo: {
        category_id: '',
        title: '',
        description: '',
        price: '',
        stock: '',
        cover: '',
        pics: null,
        details: ''
      },
      // 添加商品信息临时存储
      addGoodsInfo: {
        category_id: '',
        title: '',
        description: '',
        price: '',
        stock: '',
        cover: '',
        pics: [],
        details: ''
      },
      // 当前修改商品的id
      currentGoodsID: '',
      // 验证规则
      addFormrules: {
        title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
        category_id: [
          { required: true, message: '请输入分类id', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入描述', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入库存', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        cover: [{ required: true, message: '请输入封面', trigger: 'blur' }],
        details: [{ required: true, message: '请输入详情', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const res = await this.$http.get('/api/admin/goods', {
        params: this.goodsParams
      })
      // 当前商品页
      this.goodsParams.current = res.data.meta.pagination.current_page
      // 当前商品总数
      this.total = res.data.meta.pagination.total
      // 赋值当前商品列表
      this.goodsList = res.data.data
      // console.log(this.goodsList)
    },
    // 打开图片模态框
    openImgdialogVisible(info) {
      this.imgdialogVisible = true
      this.pigImg = info.cover_url
      this.pigname = info.title
    },
    // 当前页数发生变化
    handleCurrentChange(val) {
      this.goodsParams.current = val
      // 重新请求商品数据
      this.getGoodsList()
    },
    // 当前商品是否上架
    async is_on(id) {
      await this.$http.patch(`/api/admin/goods/${id}/on`)
      this.getGoodsList()
    },
    // 当前商品是否推荐
    async is_recommend(id) {
      await this.$http.patch(`/api/admin/goods/${id}/recommend`)
      this.getGoodsList()
    },

    // 监听修改商品对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 监听添加商品对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 打开修改商品的模态框
    openeditDialogVisibles(info) {
      this.editDialogVisible = true
      this.currentGoodsID = info.id
      this.editGoodsInfo.category_id = info.category_id
      this.editGoodsInfo.title = info.title
      this.editGoodsInfo.description = info.description
      this.editGoodsInfo.price = info.price
      this.editGoodsInfo.stock = info.stock
      this.editGoodsInfo.cover = info.cover
      this.editGoodsInfo.pics = []
      this.editGoodsInfo.details = info.details
    },
    // 打开添加商品的模态框
    openaddDialogVisibles() {
      this.addDialogVisible = true
    },
    // 修改商品
    async editGoodsInfos() {
      await this.$http.put(
        `/api/admin/goods/${this.currentGoodsID}`,
        this.editGoodsInfo
      )
      this.editDialogVisible = false
      // 重新请求商品数据
      this.getGoodsList()
    },
    // 添加商品
    async addGoodsInfos() {
      await this.$http.post('/api/admin/goods', this.addGoodsInfo)
      this.addDialogVisible = false
      this.getGoodsList()
    },
    // 搜索按钮被点击
    serachGoods() {
      this.getGoodsList()
    }
  },
  created() {
    this.getGoodsList()
  }
}
</script>
<style lang="less" scoped>
.tabbox {
  margin-top: 15px;
}
.table-img {
  width: 35px;
  height: 35px;
}
.pigImage {
  width: 100%;
  height: 100%;
}
</style>
