// 1.导入定义验证规则的中间件 joi
const joi = require('joi')

// 2.定义验证规则
// 2.1 定义验证 文章标题、所属分类Id、文章内容、状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()



// 3.向外暴露出验证规则对象
exports.add_article_schema  = {
    body: {
        title,
        cate_id,
        content,
        state
    }
}