<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-mima"></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <!-- 在发起请求前，先对表单进行验证，合法后，再进行请求发送
                表单验证步骤：
                1、通过this.$refs.loginFormRef拿到组件实例
                2、拿到实例后，调用validate函数，它接收的是一个回调函数，从而拿到我们验证的结果
                3、写一个匿名的箭头函数，第一个形参是 验证的结果布尔值，通常写valid
                4、通过判断这个valid，就可以知道表单是否验证通过。true验证成功，false验证失败
           -->
          <el-button type="primary" @click="login">登录</el-button>
          <!-- 表单重置步骤：
              只需要拿到表单的实例对象，调用resetFields函数。就能重置整个表单
              1、需要给el-form表单 添加一个ref引用，它的等号后面的值就是 表单组件的实例对象
              2、给按钮绑定一个click事件
              3、通过this可以访问到$refs,然后 . 出来表单对象，调用resetFields函数方法就可以重置了
           -->
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单校验步骤
      // 1、在el-form上通过属性绑定 rules 校验对象
      // 2、在data数据中定义这个校验对象，每一个属性都是一个验证规则
      // 3、在el-form-item上，为不同的item项，通过prop来指定不同的校验规则
      // 表单的验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        userName: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码是否合法
        passWord: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetLoginForm () {
      // console.log(this)
      // 这个 this 就指向当前login.vue 登录组件的实例对象
      // 通过this.$refs可以直接获取到表单的引用对象 loginFormRef
      // 这个引用对象loginFormRef 就是 这个el-form表单组件 的实例
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      // 在调用login的时候，先拿到表单的引用对象this.$refs.loginFormRef
      // 拿到表单的实例，可以直接 调用 validate，它接收一个回调函数，从而拿到我们验证的结果，
      // 写一个匿名的箭头函数，第一个形参是 验证的结果布尔值，通常写valid
      // 通过判断这个valid，就可以知道表单是否验证 通过
      this.$refs.loginFormRef.validate(async (valid) => {
        // console.log(valid)
        // 如果valid不等于true 直接return
        if (!valid) return
        // const {result} = await this.$http.post('login', this.loginForm)
        // console.log(result)
        // post请求返回值是个promiss，result打印的值是promiss，如果方法的返回值是promiss，可以用async和await来简化这次的pomiss操作
        // 在this.$http之前加一个 await；await只能 用在被 async 修饰的方法中，把紧挨着await的那个方法 修饰成异步的 async的方法

        // 通过 解构赋值把data解构出来，并重命名为 res 对象
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        this.$message.success('登录成功！')
        // token
        // 1、将登录成功后的 token,保存到客户端的 sessionStorage 中
        //     因为项目中除了登录之外的其他api接口，必须在登录之后才能访问
        //     token只应在当前网站打开期间生效，所以将token 保存在sessionStorage 中
        //  2、通过编程式导航跳转 到  后台主页，路由地址是 /home
        console.log(res)
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login_container {
    background-color: pink;
    height: 100%;
  }
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #ccc;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
  .login_form {
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    justify-content: flex-end;
  }
</style>
