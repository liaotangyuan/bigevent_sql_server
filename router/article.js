// 文章路由模块
const express = require('express')
const router = express.Router()

// 文章路由模块的路由处理函数模块
const article_handler = require('../router_handler/article')

// 导入解析 formdata 格式表单数据的包
const multer = require('multer')
// 导入处理路径的核心模块
const path = require('path')
// 创建 multer 的实例对象，通过 dest 属性指定文件的存放路径
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章的验证模块（即验证规则对象）
const {add_article_schema} = require('../schema/article')

// 挂载具体的路由对象
router.post('/add', upload.single('cover_img'), expressJoi(add_article_schema), article_handler.addArticle)


// 向外暴露 router 成员
module.exports = router