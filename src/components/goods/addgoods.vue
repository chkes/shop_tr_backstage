<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/goodsList">商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 内容 -->
    <el-card class="box-card">
      <el-result
        icon="info"
        title="信息提示"
        subTitle="当前功能已移动到商品列表"
      >
        <template slot="extra">
          <a href="/users"
            ><el-button type="primary" size="medium" @click="saveNavState"
              >点击跳转</el-button
            ></a
          >
        </template>
      </el-result>
    </el-card>
  </div>
</template>

<script>
export default {
  methods: {
    // 保持连接的激活状态
    saveNavState() {
      window.sessionStorage.setItem('activePath', '/goodsList')
    }
  }
}
</script>
<style lang="less" scoped></style>
