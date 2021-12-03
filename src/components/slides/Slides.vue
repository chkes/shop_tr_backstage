<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>轮播管理</el-breadcrumb-item>
      <el-breadcrumb-item>轮播列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容 -->
    <el-card class="box-card">
      <!-- 搜索框区域 -->
      <el-row :gutter="20">
        <el-col :span="4"
          ><el-button class="addUser" type="primary"
            >添加轮播图</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格区域 -->
      <el-table
        class="tabbox"
        :data="SlidesList"
        style="width: 100%"
        stripe
        border
      >
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="cover_url" label="封面" width="60">
          <template slot-scope="scope">
            <img
              class="table-img"
              :src="scope.row.img_url"
              alt=""
              @click="openImgdialogVisible(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="title" label="轮播图名称"> </el-table-column>
        <el-table-column prop="seq" label="排序"> </el-table-column>
        <el-table-column prop="url" label="跳转链接"> </el-table-column>
        <el-table-column label="是否禁用">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#dcdfe6"
              :active-value="1"
              :inactive-value="0"
              @change="is_on(scope.row.id)"
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
                @click="opendelDialogVisible(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 删除用户信息模态框 -->
    <el-dialog
      title="删除当前轮播图"
      :visible.sync="delDialogVisible"
      width="30%"
    >
      是否删除当前轮播图
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delSlide">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改轮播图模态框 -->
    <el-dialog
      title="修改轮播图"
      :visible.sync="editDialogVisible"
      width="30%"
      @close="editDialogClosed"
    >
      <el-form
        label-width="100px"
        ref="editFormRef"
        :rules="Formrules"
        :model="editSlides"
      >
        <el-form-item label="名称" prop="title">
          <el-input v-model="editSlides.title"></el-input>
        </el-form-item>
        <el-form-item
          label="图片地址"
          prop="img"
        >
          <el-input v-model="editSlides.img"></el-input>
        </el-form-item>
        <el-form-item
          label="跳转链接"
          prop="url"
        >
          <el-input v-model="editSlides.url"></el-input>
        </el-form-item>
        <el-form-item label="启用?1:0" prop="status">
          <el-input v-model="editSlides.status"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSlide">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 轮播图列表
      SlidesList: [],
      // 打开删除轮播图模态框
      delDialogVisible: false,
      // 修改删除轮播图模态框
      editDialogVisible: false,
      // 当前要删除的轮播图的id
      delSpidesId: null,
      // 当前要修改的轮播图的id
      editSpidesId: null,
      // 修改的参数临时存放
      editSlides: {
        title: '',
        img: '',
        url: '',
        status: 0
      },
      // 验证规则
      Formrules: {
        title: [
          { required: true, message: '请输入轮播图名称', trigger: 'blur' }
        ],
        img: [{ required: true, message: '请输入图片地址', trigger: 'blur' }],
        url: [{ required: true, message: '请输入跳转链接', trigger: 'blur' }],
        status: [
          { required: true, message: '请输入状态', trigger: 'blur' },
          { min: 1, max: 1, message: ' 0 或 1', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getSlidesList() {
      const res = await this.$http.get('/api/admin/slides')
      this.SlidesList = res.data.data
      console.log(res.data.data)
    },
    // 当前轮播图是否禁用
    async is_on(slide) {
      await this.$http.patch(`/api/admin/slides/${slide}/status`)
      this.getSlidesList()
    },
    // 打开删除轮播图模态框
    opendelDialogVisible(id) {
      this.delDialogVisible = true
      // 保存当前要删除的轮播图的id
      this.delSpidesId = id
    },
    // 删除轮播图
    async delSlide() {
      await this.$http.delete(`/api/admin/slides/${this.delSpidesId}`)
      this.getSlidesList()
    },
    // 打开修改轮播图模态框
    openeditDialogVisibles(info) {
      this.editDialogVisible = true
      // 保存当前要删除的轮播图的id
      this.editSpidesId = info.id
      this.editSlides.title = info.title
      this.editSlides.img = info.img
      this.editSlides.url = info.url
      this.editSlides.status = info.status
    },
    // 监听修改轮播图对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改轮播图
    async editSlide() {
      console.log(this.editSlides)
      await this.$http.put(`/api/admin/slides/${this.editSpidesId}`, this.editSlides)
      this.getSlidesList()
    }
  },
  created() {
    this.getSlidesList()
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
