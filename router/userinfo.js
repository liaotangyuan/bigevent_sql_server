const express = require('express')
const router = express.Router()

// 导入路由的具体处理函数模块
const userinfo_handler = require('../router_handler/userinfo')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要的验证规则对象
const {update_userinfo_chema, update_password_chema, update_avatar_chema} = require('../schema/user')

// 挂载具体的路由
// 获取用户基本信息的路由
router.get('/userinfo', userinfo_handler.getUserInfo)

// 更新用户基本信息的路由
router.post('/userinfo', expressJoi(update_userinfo_chema), userinfo_handler.setUserInfo)

// 重置用户密码的路由
router.post('/updatepwd', expressJoi(update_password_chema), userinfo_handler.updatePassword)

// 更换用户头像的路由
router.post('/update/avatar', expressJoi(update_avatar_chema), userinfo_handler.updateAvatar)




// 把路由模块向外暴露出去供外加导入使用
module.exports = router