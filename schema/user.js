// 导入定义验证规则的包
const joi = require('joi')

// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

// 定义 id, nickname, email 的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

// 定义用户头像 avatar 的验证规则
const avatar = joi.string().dataUri().required()



// 定义验证注册和登录表单数据的验证规则对象并向外暴露出去
exports.reg_login_schema = {
    // 需要对 req.body 里面的数据进行验证
    // 注：body对象里面的属性和值相同时才可以简写
    body: {
        username,
        password,
    },
}

// 定义更新用户基本信息的表单验证规则对象并向外暴露出去
exports.update_userinfo_chema = {
    body: {
        id,
        nickname,
        email
    }
}

// 定义重置用户密码的表单验证规则对象并暴露出去
exports.update_password_chema = {
    body: {
        oldPwd: password,  // 使用 password 这个规则，验证 req.body.oldPwd 的值

        newPwd: joi.not(joi.ref('oldPwd')).concat(password),
        // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
        // 解读：
        // 1. joi.ref('oldPwd') 表示 newPwd 的值必须和 oldPwd 的值保持一致
        // 2. joi.not(joi.ref('oldPwd')) 表示 newPwd 的值不能等于 oldPwd 的值
        // 3. .concat() 用于合并 joi.not(joi.ref('oldPwd')) 和 password 这两条验证规则
    }
}

// 定义更新用户头像的表单验证规则对象并暴露出去
exports.update_avatar_chema = {
    body: {
        avatar
    }
}