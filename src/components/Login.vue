<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png"
             alt="">
      </div>
      <!-- 登录表单区域 -->
      <div class="form_box">
        <!-- 用户名 -->
        <el-form label-width="80px"
                 ref="loginFormRef"
                 :rules="loginFormRules"
                 :model="loginForm">
          <el-form-item label="用户名"
                        prop="username">
            <el-input prefix-icon="el-icon-user"
                      v-model="loginForm.username"
                      placeholder="请输入用户名"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item label="密码"
                        prop="password">
            <el-input show-password
                      prefix-icon="el-icon-lock"
                      v-model="loginForm.password"
                      placeholder="请输入密码"></el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item class="btns">
            <el-button type="primary"
                       @click="submit">登录</el-button>
            <el-button type="info"
                       @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
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
      loginFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit () {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          // console.log(this)
          const { data: res } = await this.$axios.post('/login', this.loginForm)
          console.log(res)
          if (res.meta.status !== 200) {
            // return console.log('登录失败')
            return this.$message.error('登录失败')
          }
          // console.log('登录成功')
          this.$message({
            message: '登录成功',
            type: 'success'
          })
          window.sessionStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        }
      })
    },
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields();
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  .login_box {
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .avatar_box {
      background-color: #fff;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0px 0px 10px #ddd;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .form_box {
      position: absolute;
      bottom: 0px;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
}
.btns {
  display: flex;
  justify-content: right;
}
</style>