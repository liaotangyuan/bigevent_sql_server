// 导入 express 
const express = require('express')

// 创建 express 服务器实例
const app = express()

// 导入并配置 cors 中间件
const cors = require('cors')
app.use(cors())     // 将 cors 注册为全局中间件

// 导入 Joi
const joi = require('joi')

// 配置解析 application/x-www-form-urlencoded 格式的表单数据的中间件
app.use(express.urlencoded({extended: false}))

// 在路由之前为全局的res挂载一个 res.cc 函数，用于向客户端响应请求消息
app.use((req, res, next) => {
    // status 默认值为 1, 表示失败的情况
    // err 的值可能是一个错误对象，也可能是一个错误的描述字符串
    res.cc = function(err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
        })
    }
    next()
})

// 托管静态资源文件(文章封面就保存在此文件夹中)
app.use('/uploads', express.static('./uploads'))

// 导入 config 配置文件
const config = require('./config')
// 导入解析 Token 的中间件
const expressJWT = require('express-jwt')
// 使用 .unless({ path: [/^\/api\//] }) 指定哪些接口不需要进行 Token 的身份认证
app.use(expressJWT({ secret: config.jwtSecretKey }).unless({ path: [/^\/api\//] }))


// 导入并使用 userinfo 用户信息路由模块
const userinfoRouter = require('./router/userinfo')
app.use('/my', userinfoRouter)



// 导入并注册用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)
// 导入并注册文章类别模块
const artcateRouter = require('./router/artcate')
app.use('/my/article', artcateRouter)
// 导入并注册文章模块
const articleRouter = require('./router/article')
app.use('/my/article', articleRouter)


// 定义获取错误的全局中间件
app.use((err, req, res, next) => {
    // 验证表单数据失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 捕获身份认证失败的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败！')

    // 未知的错误
    res.cc(err)
})



// 启动服务器
app.listen(3007, () => {
    console.log('api server running at http://127.0.0.1:3007');
})