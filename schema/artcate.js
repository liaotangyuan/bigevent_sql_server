// 1.导入定义验证规则的中间件 joi
const joi = require('joi')

// 2.定义验证规则
// 2.1 定义文章类别名称 name 和别名 alias 的验证规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()
// 2.2 定义删除文章分类的 id 的校验规则
const id = joi.number().integer().min(1).required()



// 3.向外暴露出验证规则对象
// 3.1 新增文章类别的验证规则对象
exports.add_cate_schema = {
    // 客户端发送过来的数据是通过 req.body 来获取的
    body: {
        name,
        alias,   
    }
}
// 3.2 删除文章分类的验证规则对象
exports.delete_cate_schema = {
    // 客户端的查询字符串是通过 req.params 来获取的
    params: {
        id
    }
}
// 3.3 根据 id 获取文章分类信息的验证规则对象
exports.get_cate_schema = {
    params: {
        id
    }
}
// 3.4 根据 id 更新文章分类信息的验证规则对象
exports.update_cate_schema = {
    body: {
        Id: id,
        name,
        alias,
    }
}