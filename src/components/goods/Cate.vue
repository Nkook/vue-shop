<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <!-- :data数据源
           :columns定义列的内容,是一个数组，数组中的每个对象就代表一个列所要展示的内容
           :selection-type是否为多选类型的表格
           :expand-type 展开行效果
           show-index显示数据的索引值
           index-text自定义索引名称，默认的是‘序号’两个字
           border表格竖行分割线
           :show-row-hover 鼠标选中当前行时 是否高亮 -->
      <!-- 自定义渲染就需要用到作用域插槽
           需要先将这一列用type指定为template
           再通过template属性去指定具体的作用域插槽的名字
           在表格中间用 template 定义插槽，slot的名字和当前列的template的值相对应，slot-scope接收这行的数据 -->
      <tree-table
        class="treeTable"
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false">
        <!-- 通过template定义模板，它的名字叫isok，将来会被第二列所引用。通过作用域插槽用scope接收这行的数据 -->
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="warning" size="mini" v-if="scope.row.cat_level===2">三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类的对话框 -->
    <!-- 如果只填写了分类名称则 是一级分类
    如果填写了分类名称，并选择了一个父级分类，则填写的为二级分类
    如果填写了分类名称，并选择了一个父级分类下的一个分类，则填写的为三级分类 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose">
      <el-form ref="addCateFormRef" :rules="addCateFormRules" :model="addCateForm" label-width="100px" >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options用来指定数据源
           props 用来指定配置对象
           v-model 是将选中的值双向绑定到data中 必须是个数组
           change 只要级联选择器发生了触发就会执行绑定的函数-->
            <el-cascader
              v-model="selectKeys"
              :options="parentCateList"
              :props="cascaderProps"
              clearable
              @change="parentCateChange"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 查询条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表，默认为空
      catelist: [],
      // 总条数
      total: 0,
      // 为table指定列的定义
      // label 属性 指定标题
      // prop 属性 指定具体的值
      // width 宽度
      // type: template 将这列渲染为 自定义列
      // template: 自定义 模版列的名字
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        }, {
          label: '是否有效',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示，当前这一列使用的模板名称
          template: 'isok'
        }, {
          label: '排序',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示，当前这一列使用的模板名称
          template: 'order'
        }, {
          label: '操作',
          // 表示，将当前列定义为模板列
          type: 'template',
          // 表示，当前这一列使用的模板名称
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: ''
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        rules: {
          cat_name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ]
        }
      },
      // 父级分类列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        expandTrigger: 'hover',
        // 具体选中的属性
        value: 'cat_id',
        // 看到的属性
        label: 'cat_name',
        // 父子嵌套的属性
        children: 'children'
      },
      // 选中的父级 分类的Id数组
      selectKeys: []
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类数据
    async getCateList () {
      const {data: res} = await this.$http.get('categories', { params: this.querInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      // 把数据列表，赋值给 catelist
      this.catelist = res.data.result
      // 给总条数赋值
      this.total = res.data.total
    },
    // 监听pagesize改变的事件，可以拿到最新的pagesize
    handleSizeChange (newSize) {
      this.querInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听pagenum改变的事件，可以拿到最新的pagenum
    handleCurrentChange (newPage) {
      this.querInfo.pagenum = newPage
      this.getCateList()
    },
    // 点击按钮，展示添加分类的对话框
    showCateDialog () {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败！')
      }
      console.log(res.data)
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChange () {
      console.log(this.selectKeys)
      // 如果selectKeys 数组中的length 大于0，证明选中的父级分类
      // 反之，就说明没有选中任何父级分类
      if (this.selectKeys.length > 0) {
        // 父级分类的ID
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectKeys.length
        // return
      } else {
        // 父级分类id置为 0
        this.addCateForm.cat_pid = 0
        // 当前分类的等级赋值 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮，添加新的分类
    addCate () {
      // console.log(this.addCateForm)
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const {data: res} = await this.$http.post('categories', this.addCateForm)
        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败！')
        }
        // 添加成功提示
        this.$message.success('添加分类成功！')
        // 重新获取列表数据
        this.getCateList()
        // 隐藏对话框
        this.addCateDialogVisible = false
      })
    },
    // 监听对话框的关闭事件，重置表单数据
    addCateDialogClose () {
      this.$refs.addCateFormRef.resetFields()
      this.selectKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>
