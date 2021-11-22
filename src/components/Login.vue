<template>
  <div class="login_container">
    <div class="login_wrap">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form ref="loginFormRef" label-width="0px" class="loginFrom" :model="loginForm"  :rules="rules">
        <el-form-item label="" prop="username">
          <el-input prefix-icon="iconfont icon-user"  v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input type="password" prefix-icon="iconfont icon-3702mima"  v-model="loginForm.password"></el-input>
        </el-form-item>
        <div class="login_btn">
        <el-button  type="primary" @click="submitLoginForm">登录</el-button>
        <el-button type="primary" @click="resetForm">重置</el-button>
        </div>

      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 表单属性
      loginForm: {
        username: 'super@a.com',
        password: '123123'
      },
      // 表单验证规则
      rules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 15, message: '长度在 1 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 点击重置重置表单
    resetForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 提交登录
    submitLoginForm () {
      this.$refs.loginFormRef.validate(async (valid) => {
        // 如果验证通过
        if (!valid) return false
        // 请求登录
        try {
          const res = await this.$http.post('/api/auth/login', { email: this.loginForm.username, password: this.loginForm.password })
          console.log(res)
          // 状态码不等于200
          if (res.status !== 200) return this.$message.error('账号或密码不对')
          this.$message.success('登陆成功')
          // 登录成功后保持token
          window.sessionStorage.setItem('token', res.data.token_type + ' ' + res.data.access_token)
          // 跳转页面
          this.$router.push('/home')
        } catch {
          this.$message.error('账号或密码不对')
        }
      })
    }

  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: rgb(184, 173, 173);
  height: 100%;
  position: relative;
  .login_wrap {
    width: 450px;
    height: 300px;
    background-color: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 3px;
    .avatar_box {
      width: 100px;
      height: 100px;
      border: 1px solid #ccc;
      border-radius: 50%;
      overflow: hidden;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 10px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .loginFrom {
      position: absolute;
      bottom: 10px;
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;
      .login_btn{
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
