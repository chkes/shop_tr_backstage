<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">分类管理</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/users">分类列表</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-button type="primary" @click="openAddCateinfo"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 分类表格 -->
      <tree-table
        :data="categoryList"
        :columns="columns"
        :selection-type="false"
        border
        :show-row-hover="false"
        :expand-type="false"
        index-text="#"
        :show-index="true"
      >
        <template slot="isok" slot-scope="scope">
          <!-- <i
            v-if="scope.row.status === 0"
            style="color: red"
            class="el-icon-error"
          ></i>
          <i v-if="scope.row.status === 1" style="color: lightgreen" class="el-icon-success"></i> -->
          <el-switch
            v-model="scope.row.status"
            active-color="#13ce66"
            inactive-color="#dcdfe6"
            :active-value="1"
            :inactive-value="0"
            @change="switchchange(scope.row.id)"
          >
          </el-switch>
        </template>
        <template slot="level" slot-scope="scope">
          <el-tag v-if="scope.row.level === 1">一级</el-tag>
          <el-tag v-else type="success">二级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <!-- 修改按钮 -->
          <el-tooltip effect="dark" content="修改按钮" placement="top">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="editDialogVisibles(scope.row)"
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
      </tree-table>
    </el-card>
    <!-- 修改分类信息模态框 -->
    <el-dialog
      title="修改分类信息"
      :visible.sync="editDialogVisible"
      @close="editDialogClosed"
      width="30%"
    >
      <el-form
        label-width="100px"
        ref="editFormRef"
        :rules="categoryRule"
        :model="editCate"
      >
        <el-form-item label="分类名" prop="name">
          <el-input v-model="editCate.name"></el-input>
        </el-form-item>
        <el-form-item label="分类等级" prop="pid">
          <el-input v-model="editCate.pid"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除分类信息模态框 -->
    <el-dialog title="删除分类" :visible.sync="delDialogVisible" width="30%">
      当前接口未开放
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 添加分类信息模态框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <el-form
        label-width="100px"
        ref="addFormRef"
        :rules="categoryRule"
        :model="addCate"
      >
        <el-form-item label="分类名" prop="name">
          <el-input v-model="addCate.name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="addCate.pid"
            :options="categoryList"
            :props="cateProps"
            @change="addhandleChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 当前分类列表
      categoryList: [],
      // 表格组件
      columns: [
        {
          label: '分类名称',
          prop: 'name'
        },
        {
          label: '是否启用',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          type: 'template',
          template: 'level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'opt'
        }
      ],
      // 删除分类模态框
      delDialogVisible: false,
      // 编辑分类模态框
      editDialogVisible: false,
      // 添加分类模态框
      addDialogVisible: false,
      // 修改分类的临时信息
      editCate: {
        name: '',
        pid: '',
        id: ''
      },
      // 添加分类的临时信息
      addCate: {
        name: '',
        pid: []
      },
      cateProps: {
        expandTrigger: 'hover',
        label: 'name',
        value: 'id'
      },
      // 验证规则
      categoryRule: {
        name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        pid: [
          { message: '请输入分类id', trigger: 'blur' },
          {
            min: 1,
            max: 2,
            message: '长度在 1 到 2 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 获取分类列表
    async getCategoryList() {
      const res = await this.$http.get('/api/admin/category')

      this.categoryList = res.data
      console.log(res.data)
    },
    // 打开修改分类模态框
    editDialogVisibles(cateInfo) {
      this.editDialogVisible = true
      this.editCate.name = cateInfo.name
      this.editCate.pid = cateInfo.pid
      // 当前修改分类的id
      this.editCate.id = cateInfo.id
    },
    // 监听修改分类对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改当前分类
    async editCateInfo() {
      const res = await this.$http.put(
        `/api/admin/category/${this.editCate.id}`,
        {
          name: this.editCate.name,
          pid: this.editCate.pid
        }
      )
      console.log(res)
      this.getCategoryList()
      this.editDialogVisible = false
    },
    // 打开添加分类模态框
    openAddCateinfo() {
      this.addDialogVisible = true
    },
    // 添加分类的选择项变化时
    addhandleChange(value) {
      console.log(value)
    },
    // 添加分类
    async addCateInfo() {
      // 根据接口 判断当前的父级分类
      if (this.addCate.pid.length === 2) {
        this.addCate.pid = this.addCate.pid[0]
      } else {
        this.addCate = {
          name: this.addCate.name
        }
      }
      console.log(this.addCate)
      await this.$http.post('/api/admin/category', {
        name: this.addCate.name,
        pid: this.addCate.pid
      })
      this.addDialogVisible = false
      this.getCategoryList()
    },
    // 添加分类对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 是否启用变化
    async switchchange(category) {
      await this.$http.patch(`/api/admin/category/${category}/status`)
      this.getCategoryList()
    }
  },
  created() {
    this.getCategoryList()
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-bottom: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
