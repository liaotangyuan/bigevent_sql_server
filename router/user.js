// 这是用户路由模块，主要用于挂载与用户相关的路由对象

// 导入 express
const express = require('express')
// 创建路由对象
const router = express.Router()

// 挂载具体的路由成员，注意我们的路由模块中只负责定义具体的路由处理规则
// 具体的路由处理函数全部定义到了 router_handler 下的 user.js 中，导入使用即可
const router_handler = require('../router_handler/user')

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const { reg_login_schema } = require('../schema/user')

// 注册新用户
router.post('/reguser',expressJoi(reg_login_schema), router_handler.reguser)

// 登录
router.post('/login', expressJoi(reg_login_schema), router_handler.login)



// 将路由对象共享出去供外界导入使用
module.exports = router