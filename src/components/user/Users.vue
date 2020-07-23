<template>
<!-- 1、定义对应的用户列表组件
     2、通过路由形式，在右侧 主体 区域，把用户列表组件展示出来
        2-1、首先在index.js中导入 users组件
        2-2、在home路由的children属性中将users组件作为子路由定义进来
 -->
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <div>
        <!-- el-row 每一行
             el-col 每一列
             gutter 每一列中间的间距
             span 每一列所占的宽度
         -->
        <el-row :gutter="20">
          <el-col :span="7">
            <!-- 搜索 -->
            <!-- 1、为文本框双向数据绑定数据
                 2、为按钮绑定事件获取新的列表
                 3、添加清空属性。clearable是否可清空
                 4、绑定清空事件并获取新的列表。clear在点击由 clearable 属性生成的清空按钮时触发
             -->
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
          </el-col>
        </el-row>
        <!-- 用户列表区域 -->
        <!-- :data 指定数据源
             label 指定列名
             prop 列名对应的值
             border 给表格加边框
             stripe 隔行变色
             type="index" 索引列
         -->
        <el-table
          :data="userList"
          border
          stripe
          style="width: 100%">
          <el-table-column type="index" label="#"></el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
            width="180">
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话">
          </el-table-column>
          <el-table-column
            prop="role_name"
            label="角色">
          </el-table-column>
          <el-table-column label="状态">
            <!-- 作用域插槽会覆盖 当前列el-table-column里的prop。通过 {{scope.row}}就可以获取当前行的数据 -->
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="userSateChanged(scope.row)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="181px">
            <!-- 通过作用域插槽实现操作，并且要拿到当前行的ID，比如编辑删除，也只能通过当前行的id对其进行操作；所以只能通过作用域 插槽 的形式  -->
            <template slot-scope="scope">
              <!-- 修改 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
              <!-- 删除 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
              <!-- 分配角色 -->
              <!-- el-tooltip消息提示：因为有些按钮不知道是什么意思，需要用到消息提示。enterable鼠标是否可进入到tooltip 中,设置为 false,因为false是布尔值，设置成：数据绑定 -->
              <el-tooltip :enterable="false" effect="dark" content="分配角色" placement="top">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <!-- size-change 切换每页多少条的事件，可以拿到最新的 pageSize
             current-change 在页码改变的时候，可以拿到最新的 page
             current-page 当前 展示的 第几页，通过queryInfo里的pagenum可以拿到
             page-sizes 选择多少条/每页 的下拉选项
             page-size  当前每页显示 多少条  数据
             layout 决定展示哪些内容 共多少条，几条/每页，前一页，页数，后一页，前往哪一页
             total  总共多少条 数据
         -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <!-- 添加用户的弹框
        1、按需导入对话框，稍加修改
        2、在添加按钮中绑定事件，将addDialogVisible置为true
        3、完善表单的项
          title 标题
          visible 属性绑定，用来控制 显示隐藏
          width 控制 对话框的  宽度
          before-close  在 对话框关闭 之前会触发这个事件
          close 关闭时触发的事件函数
     -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed">
      <!-- 内容主体区域  -->
      <!-- model属性 绑定的数据
           rules属性  验证规则
           ref  引用名称
           label-width  表单宽度
       -->
      <el-form :model="addForm" :rules="addFormrules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的弹框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed">
      <!-- :model 数据绑定对象  :rules 验证规则绑定对象  ref 表单的引用-->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed">
      <div>
        <p>当前的用户: {{userInfo.username}}</p>
        <p>当前的角色: {{userInfo.role_name}}</p>
        <p>分配新角色:
          <!-- 通过v-model属性把用户选中的值双向同步到data中
          placeholder 默认展示的文本
          通过for循环生成下拉的每一个选项：每个item都是一个角色
          :key 指定 item的ID值
          :label指定看到的文本名称
          :value指定选中的名称对应的值 真正记录到model绑定的数据中的值 -->
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    // 自定义校验规则
    // 1、首先在 data 中，定义 变量的形式定义一个校验规则，它的值指向的是一个箭头函数；在箭头函数的形参中包含三个变量，分别是rule，要校验的值value，callback回调函数。
    // 2、直接调用callback()代表校验通过；如果在调用callback()的时候提供了一个Error对象,证明校验失败
    // 3、在校验期间，一般都是通过先定义正则表达式，然后再调用test，来检验这个value值是否合法
    // 4、用的时候，通过validator属性来指定具体的校验规则；通过trigger来指定校验时机
    // 验证邮箱规则
    var checkEmail = (rule, value, callback) => {
      // 通过正则 通过regEmail的test，就可以校验指定的value值是否合法
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机号规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 获取用户数据列表的参数
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页多少条
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加表单的验证规则对象
      addFormrules: {
        // 必填项和长度的校验
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码的长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制修改用户对话框的显示与隐藏
      editDialogVisible: false,
      // 修改弹框查询到的用户信息的对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 控制分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      rolesList: [],
      // 已选中的角色id值
      selectedRoleId: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      // get请求会返回一个promiss对象，为了简化promiss操作，我们可以用async、await，来优化这次异步操作。
      // 那既然用到了 await 就会得到一个数据对象，从这个数据对象身上解构赋值一个 data属性，然后重命名为res
      const {data: res} = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      this.userList = res.data.users
      this.total = res.data.total
      // console.log(res)
    },
    // 监听 pageSize 改变的事件
    handleSizeChange (newSize) {
      // 将监听到的pageSize值 赋值给queryInfo.pagesize
      // 根据最新的pagesize发起列表的请求
      // console.log('最新的pagesize', newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange (newPage) {
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听 switch  开关状态的改变
    // 1、监听switch开关的 change事件，拿到最新的状态后
    // 2、立即调用ajax请求，把状态同步到服务器中
    async userSateChanged (userInfo) {
      const {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        // 如果失败了，因为页面上状态已经改变了，此时应将状态重置回去，做个取反就好了
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },

    // 监听添加用户对话框的关闭事件，重置对话框内容
    // 1、监听对话框的close关闭事件
    // 2、在close关闭事件中，拿到表单的引用，调用resetFields对整个表单进行重置
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定按钮，添加新用户
    // 1、如果valid校验失败的话（为false），就直接return，不走添加逻辑
    // 2、如果valid校验成功的话（为true）,发起添加用户的网络请求
    // 3、添加用户成功后，要关闭对话框；并更新用户列表数据
    addUser () {
      this.$refs.addFormRef.validate(async valid => {
        // console.log('valid', valid)
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    // 1、
    async showEditDialog (id) {
      // console.log(id)
      const {data: res} = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      // 把查询到的数据保存到data上，供页面使用
      this.editForm = res.data
      this.editDialogVisible = true
    },

    // 监听修改用户对话框的关闭事件
    // 拿到表单的ref引用，调用resetFields函数对表单进行重置
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 监听修改用户对话框的确定事件
    // 拿到表单的ref引用，调用validate函数对表单项的合法进行验证
    // 通过valid可以得到验证是否通过,如果不通过直接return；通过发起请求
    editUserInfo () {
      this.$refs.editFormRef.validate(async valid => {
        // console.log(valid)
        // eslint-disable-next-line no-useless-return
        if (!valid) return
        // 发起修改用户信息的数据请求
        const {data: res} = await this.$http.put('users/' + this.editForm.id, {email: this.editForm.email, mobile: this.editForm.mobile})
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getUserList()
        // 提示修改成功
        this.$message.success('更新用户信息成功！')
      })
    },

    // 删除用户
    // 先element.js中按需导入了MessageBox组件
    // 然后通过原型挂载的形式把MessageBox.confirm这个函数挂载到了vue的原型对象中
    // 这样在 每一个vue组件中，通过this.$confirm可以弹出一个提示框
    // 在这里面通过catch捕获了用户的取消行为
    // 当用户无论点击了确定还是取消，都可以通过await和async来简化这次promiss操作，通过confirmResult接收到用户的操作结果
    // 拿着confirmResult结果去进行判断，来提示是点了取消还是确定；如果用户点了取消弹个提示，如果点了确定就发起请求删除用户
    async removeUserById (id) {
      // console.log(id)
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => {
        return err
      })
      // 如果用户确认删除，则返回值为字符串 confirm
      // 如果用户取消了删除，则返回值为字符串 cancel
      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // console.log('确认了删除')
      const {data: res} = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }
      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    // 展示分配角色的对话框
    async setRole (userInfo) {
      this.userInfo = userInfo
      // 在展示对话框之前，获取所有的角色列表
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
      this.setRoleDialogVisible = true
    },
    // 点击确定按钮，分配角色
    async saveRoleInfo () {
      if (!this.selectedRoleId) {
        this.$message.error('请选择要分配的角色！')
      }
      const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) {
        this.$message.error('更新用户角色失败！')
      }
      this.$message.success('更新用户角色成功！')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed () {
      // 将下拉框重置为空；将当前角色的用户信息清空
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>

<style lang="less" scoped>

</style>
