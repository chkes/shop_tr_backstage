<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/users">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="input"
            class="input-width"
            clearable
            @clear="getUsersList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="serachUser"
            ></el-button> </el-input
        ></el-col>
        <el-col :span="4"
          ><el-button class="addUser" type="primary" @click="addDialogVisibles"
            >添加用户</el-button
          ></el-col
        >
      </el-row>
      <!-- 表格区域 -->
      <el-table
        class="tabbox"
        :data="usersList"
        style="width: 100%"
        stripe
        border
      >
        <el-table-column type="index" label="#" width="50"> </el-table-column>
        <el-table-column prop="avatar_url" label="头像" width="60">
          <template slot-scope="scope">
            <img class="table-img" :src="scope.row.avatar_url" alt="" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="updated_at" label="日期"> </el-table-column>
        <el-table-column label="状态(接口bug)">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.is_locked"
              active-color="#13ce66"
              inactive-color="#dcdfe6"
              @change="isLock(scope.row.id)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
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
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="10"
        layout="total, prev, pager, next, jumper"
        :total="this.total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改用户信息模态框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      @close="editDialogClosed"
      width="30%"
    >
      <el-form
        label-width="100px"
        ref="editFormRef"
        :rules="addFormrules"
        :model="editUser"
      >
        <el-form-item label="用户名">
          <el-input v-model="editUser.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
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
    <!-- 添加用户模态框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <el-form
        label-width="100px"
        ref="addFormRef"
        :rules="addFormrules"
        :model="addUser"
      >
        <el-form-item label="用户名" prop="name">
          <el-input v-model="addUser.name"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password"></el-input>
        </el-form-item>
        <el-form-item label="确定密码" prop="password">
          <el-input v-model="addUser.password_confirmation"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 邮箱验证规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    return {
      // 搜索框 输入的值
      input: '',
      // 当前用户列表
      usersList: [],
      // 当前用户页数
      currentPage: 1,
      // 总条数
      total: null,
      // 验证规则
      addFormrules: {
        username: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 8, message: '长度在 1 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 1,
            max: 11,
            message: '长度在 1 到 11 个字符',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ]
      },
      // 修改用户模态框
      editDialogVisible: false,
      // 删除用户模态框
      delDialogVisible: false,
      // 添加用户模态框
      addDialogVisible: false,
      // 修改用户的临时信息
      editUser: {
        name: '',
        email: '',
        id: ''
      },
      // 添加用户的临时信息
      addUser: {
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
      },
      value: true
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    // 请求菜单列表
    async getUsersList() {
      // 请求参数
      var params = {
        current: this.currentPage
      }
      // 判断用户搜索框输入的是什么类型的
      if (this.input.length !== 0) {
        var email = this.input.search(/@/)
        var phone = this.input.search(/^[0-9]*$/)
        var name = this.input.search(/[a-zA-Z]/)
        if (email !== -1) params.email = this.input
        if (phone !== -1) params.phone = this.input
        if (name !== -1 && email === -1) params.name = this.input
      }
      const res = await this.$http.get('/api/admin/users', {
        params
      })
      if (res.status !== 200) return this.$message.error('请求菜单失败')
      // console.log(res.data.data)
      this.usersList = res.data.data
      // 总条数
      this.total = res.data.meta.pagination.total
    },
    // 点击其他页
    handleCurrentChange(val) {
      this.currentPage = val
      // 重新请求接口
      this.getUsersList()
    },
    // 搜索按钮被点击
    serachUser() {
      this.getUsersList()
    },
    // 用户禁用按钮
    async isLock(id) {
      // 禁用和启用
      await this.$http.patch(`/api/admin/users/${id}/lock`)
      // console.log(res)
      // 重新请求接口
      this.getUsersList()
    },
    // 修改用户弹出框
    editDialogVisibles(User) {
      this.editDialogVisible = true
      // 存储当前修改用户的信息
      this.editUser.id = User.id
      this.editUser.name = User.name
      this.editUser.email = User.email
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息
    async editUserInfo() {
      await this.$http.put(`/api/admin/users/${this.editUser.id}`, {
        name: this.editUser.name,
        email: this.editUser.email
      })
      this.editDialogVisible = false
      this.getUsersList()
    },
    // 添加用户弹出框
    addDialogVisibles() {
      this.addDialogVisible = true
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户信息
    async addUserInfo() {
      await this.$http.post('/api/auth/register', {
        name: this.addUser.name,
        email: this.addUser.email,
        password: this.addUser.password,
        password_confirmation: this.addUser.password_confirmation
      })
      this.addDialogVisible = false
      this.getUsersList()
    }
  }
}
</script>

<style lang="less" scoped>
.input-width {
}
.tabbox {
  margin-top: 15px;
}
.table-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
