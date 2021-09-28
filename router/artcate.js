// 文章类别管理路由模块

const express = require('express')
const router = express.Router()

// 导入文章类别部分的路由处理函数模块
const artcate_handler = require('../router_handler/artcate')

// 导入验证表单数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入验证规则对象模块
const {add_cate_schema, delete_cate_schema, get_cate_schema, update_cate_schema} = require('../schema/artcate')

// 挂载具体的路易模块
// 1.获取文章分类列表信息
router.get('/cates', artcate_handler.getArticleCates)

// 2.新增文章分类
router.post('/addcates', expressJoi(add_cate_schema), artcate_handler.addArticleCats)

// 3.根据 id 删除文章分类
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcate_handler.deleteCateById)

// 4.根据 id 获取文章分类信息
router.get('/cates/:id', expressJoi(get_cate_schema), artcate_handler.getArtCateById)

// 5.根据 id 更新文章分类信息
router.post('/updatecate', expressJoi(update_cate_schema), artcate_handler.updateCateById)


// 向外暴露出 router 对象供外界使用
module.exports = router