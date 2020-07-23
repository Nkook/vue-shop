<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 双层for循环 渲染 一级菜单和二级菜单 -->
      <el-aside :width="isCollapse ? '64px': '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏 -->
        <!-- 为了保证是布尔值，一定要使用动态数据绑定
            unique-opened 保持一个子菜单的展开,其他子菜单闭合
            collapse 是否 水平折叠收起菜单，默认为false,也就是默认是展开的
            collapse-transition 是否开启折叠动画
            通过toggleCollapse事件控制左侧菜单的显示和隐藏；并且动态绑定:collapse和:width
         -->
         <!-- router开启路由模式：是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
              当router开启后，我们点击菜单，会跳转到对应的链接，就是当前菜单对应的index,也就是我们绑定的id值
              以id值作为跳转路径，不合适，应该以返回的path属性为跳转路径
              所有的路由 都要以/开头  :index="'/' + subItem.path"
          -->
          <!-- default-active当前激活菜单的 index
              default-active="/users",那么用户管理下的用户列表就会高亮
              1、在每次点击链接的时候，将对应的path地址保存到sessionStorage中，先把需要激活的链接保存起来。
              2、当我们刷新页面的时候（home组件被创建的时候），可以从sessionStorage中取出来，动态的赋值给default-active
              3、动态给default-active赋值：整个home组件一被创建的时候，就立即把值从sessionStorage中取出来，赋值。
                这个组件被创建的时候，肯定 会执行 created 这个函数，那么就在 这里面直接赋值就好了
           -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color   ="#409EFF"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath">
          <!-- 一级菜单 -->
          <!-- 让index唯一，并且只接收字符串，这样就能保证点击哪个就展开哪个了 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模版区域 指定图标和文本   -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
             :index="'/' + subItem.path"
             v-for="subItem in item.children"
             :key="subItem.id"
              @click="saveNavState('/' + subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单
      menuList: [],
      // 一级菜单自定义图标：拿id当作key,拿图标值当作value
      iconsObj: {
        '125': 'iconfont icon-leaflet-yonghuguanli',
        '103': 'iconfont icon-xing',
        '101': 'iconfont icon-shangpinguanli',
        '102': 'iconfont icon-logooo_huabanfuben',
        '145': 'iconfont icon-shuju'
      },
      // 左侧菜单是否 折叠，默认不折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  methods: {
    logout () {
      // 1、清空token
      // 2、跳转到登录页
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      // console.log(res)
      // 将获取到的数据，立即挂载到自己的data中去
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    // 点击按钮，切换菜单的折叠与展开，给默认值取反
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  },
  created () {
    this.getMenuList()
    // 当home组件被创建的时候，从sessionStorage中取出来并赋值
    this.activePath = window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }
  .el-header {
    background-color: #373d41;
    display: flex;
    // 两边对齐
    justify-content: space-between;
    padding-left: 0;
    // 上下居中
    align-items: center;
    color: #fff;
    > div {
      // 上下居中
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
    img {
      height: 30px;
      width: 30px;
    }
  }
  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
    .toggle-button {
      background-color: #4a5064;
      color: #fff;
      text-align: center;
      cursor: pointer;
      // 用于设置文本字符间距
      letter-spacing: 0.2em;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }

  .iconfont {
    margin-right: 10px;
  }

</style>
