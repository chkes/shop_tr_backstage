<template>
  <el-container class="home_con">
    <!-- 头部开始 -->
    <el-header>
      <div class="login_box">
        <img src="../assets/logo.png" alt="" />
        <span class="title">小熊商城</span>
      </div>
      <el-button class="exitlogin" type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 头部结束 -->

    <el-container>
      <!-- 侧边开始 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <span class="tollgel-btn" @click="changeCollapse" :v-model="isCollapse"
          >|||</span
        >
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#313743"
          text-color="#fff"
          active-text-color="#4896ef"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
        :default-active="activePath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="(item, i) in menuList"
            :key="i"
          >
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span class="text">{{ item.name }}</span>
            </template>
              <el-menu-item
                :index="'/'+ pathsObj[item1.id]"
                v-for="(item1, i1) in item.children"
                :key="i1"
                @click="saveNavState('/' + pathsObj[item1.id])"
              >
                <i class="el-icon-menu"></i>
                <span>{{ item1.name }}</span>
              </el-menu-item>
          </el-submenu>
        </el-menu>
        <!-- 侧边栏菜单区域 -->
      </el-aside>
      <!-- 侧边结束 -->
      <!-- 内容开始 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 内容结束 -->
    </el-container>
  </el-container>
</template>
<script>
export default {
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      // 菜单列表
      menuList: [],
      // icon 列表
      iconsObj: {
        24: 'iconfont icon-user',
        26: 'iconfont icon-tijikongjian',
        29: 'iconfont icon-shangpin',

        32: 'iconfont icon-showpassword',
        34: 'iconfont icon-danju',
        36: 'iconfont icon-baobiao',
        39: 'iconfont icon-lock_fill'
      },
      // path 列表
      pathsObj: {
        25: 'users',
        27: 'category',
        28: 'addCategary',
        30: 'goodsList',
        31: 'addgoods',
        33: 'users',
        35: 'users',
        37: 'slides',
        38: 'users',
        40: 'users',
        41: 'users'
      },
      // 展开折叠
      isCollapse: false,
      // 获取当前的page
      activePath: ''
    }
  },
  methods: {
    // 退出登录
    logout() {
      window.sessionStorage.clear()
      this.$router.push('login')
    },
    // 获取菜单列表
    async getMenuList() {
      // 请求菜单列表
      const res = await this.$http.get('/api/admin/menus')
      if (res.status !== 200) return this.$message.error('请求菜单失败')
      this.menuList = res.data
    },
    // 点击折叠与展开
    changeCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保持连接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.el-menu {
  border: none;
}
.home_con {
  height: 100%;
}
.text {
  padding-left: 10px;
}
.tollgel-btn {
  display: flex;
  text-align: center;
  justify-content: center;
  color: white;
  padding: 5px 0;
  cursor: pointer;
  font-size: 20px;
}

.el-header {
  background-color: #363d40;
  display: flex;
  justify-content: space-between;
  .login_box {
    display: flex;
    img {
      overflow: hidden;
      border-radius: 50%;
      width: 60px;
      height: 60px;
    }
    .title {
      font-size: 30px;
      color: white;
      vertical-align: bottom;
      display: flex;
      justify-content: center;
      align-items: center;
      padding-left: 20px;
    }
  }
  .exitlogin {
    border-radius: 5px;
    margin: 10px 0;
  }
}
.el-aside {
  background-color: #313743;
}
.el-main {
  background-color: #e9edf1;
}
</style>
