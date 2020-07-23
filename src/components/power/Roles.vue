<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button>添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 首先通过作用域插槽拿到了 scope.row 当前的角色数据
          通过.children拿到了所有的一级权限，通过第一次for循环，把每一个渲染成tag标签
          让一级权限独占一行，左边的5列交给一级权限；右边剩余的19列交给二级三级权限
          在第一层for循环中嵌套了第二层 for循环，二级权限也是整行，把左边6列交给二级权限使用，把右边18列交给三级权限使用 -->
          <template slot-scope="scope">
            <!-- 三层for循环渲染角色 -->
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
              <!-- 第一列 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 第二列 渲染二级三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable @close="removeRightById(scope.row, item3.id)" type="warning" v-for="(item3) in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
              {{scope.row}}
            </pre> -->

          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <!-- 通过作用域插槽 来自定义它的展示格式  -->
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <!-- 通过:data绑定了数据源；通过:props指定了数据绑定对象
           show-checkbox给节点前面添加选择框
           node-key唯一的标识属性
           default-expand-all默认展开所有节点
           :default-checked-keys默认勾选的节点的 key 的数组 对勾是全选，横线是半选 -->
      <!-- 默认把角色已有的权限加载出来：
         先在点击按钮的同时，立即把当前角色身上已有的三级权限的id都添加到数组中
         这样在展开树的时候，默认就会选中已有的权限 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 角色列表
      roleList: [],
      // 控制分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightsList: [],
      // 树形控件的属性绑定对象
      // label 指定展示的文字；children 父子嵌套使用的children
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认选中的节点Id值的数组
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: ''
    }
  },
  created () {
    // 获取所有的角色
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.roleList = res.data
      console.log(this.roleList)
    },
    // 根据id删除对应的权限
    async removeRightById (role, rightId) {
      console.log(role, rightId)
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除！')
      }
      // console.log('确认了删除！')
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败！')
      }
      // this.getRolesList()
      // 更新当前行数据中的children 即可；防止列表刷新
      role.children = res.data
    },
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败！')
      }
      this.rightsList = res.data
      // console.log(this.rightsList)

      // 递归获取三级节点的id
      this.getdefKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys数组中
    getdefKeys (node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item =>
        this.getdefKeys(item, arr))
    },
    // 监听分配权限对话框的关闭事件 对选中的数组进行清空操作，避免下次进来还选中上次的内容
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 权限对话框的确定按钮
    // 点击为角色分配权限 getCheckedKeys获取所有已选中的ID值组成一个数组；getHalfCheckedKeys 获取所有半选中的ID值组成一个数组
    // 通过展开运算符把两个数组合并成一个新数组
    // 1、在点击分配权限按钮的时候，立即把当前角色的id，先保存到data中供后续使用
    // 2、在点击确定按钮时，先获取到全选和半选状态的id值合成一个数组，然后字符串拼接
    // 3、发起请求，把保存的角色id和字符串发送到服务器端
    // 4、当我们请求失败时，提示用户分配权限失败
    // 5、如果成功，提示用户分配权限成功 ，刷新角色列表，关闭分配角色对话框
    async allotRights () {
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      // 拿到数组之后，把它拼接成以逗号分割的字符串
      console.log('keys', keys)
      const idStr = keys.join(',')
      // 请求参数 通过请求体发送给后端
      const {data: res} = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
