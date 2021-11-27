<template>
  <div>
      <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/category">分类管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>添加分类</el-breadcrumb-item>
    </el-breadcrumb>
      <el-result icon="info" title="信息提示" subTitle="当前功能已移动到分类列表">
      <template slot="extra">
        <a href="/category"><el-button type="primary" size="medium">点击跳转</el-button></a>
      </template>
    </el-result>
  </div>
</template>

<script>
export default {}
</script>
<style lang="less" scoped></style>
