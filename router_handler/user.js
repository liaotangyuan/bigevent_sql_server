// 这里主要是整合的路由模块中各个路由规则具体的处理函数

// 导入数据库操作模块
const db = require('../db/index')

// 导入 bcryptjs 对用户密码进行明文加密操作
const bcrypt = require('bcryptjs')

// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入 config 配置文件将用户信息加密成 Token 字符串
const config = require('../config')

// 注册用户的处理函数
exports.reguser = (req, res) => {
    // 接收表单数据
    const userinfo = req.body
    // 判断数据是否合法
    // if(!userinfo.username || !userinfo.password) {
    //     return res.cc('用户名或密码不合法！')
    // }
    // 注：表单数据的验证已经交给 @escook/express-joi 这个中间件，此处无需再验证，且不推荐使用if验证表单

    // 数据合法则对用户名进行数据库查重，判断该用户名是否已被使用
    // 定义 SQL 语句
    const sqlStr = 'select * from ev_users where username=?'
    db.query(sqlStr, userinfo.username, (err, results) => {
        // 连接数据库失败
        if(err) {
            return res.cc(err)
        }
        // 连接数据库成功后就判断查询返回的数组的长度，如果长度不为0，则表示已经被占用
        if(results.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名！')
        }
        // 至此则用户名可以使用，我们需要先对用户的密码进行加密后再保存数据到数据库
        // 调用 bcrypt.hashSync(明文密码, 随机的长度) 方法，对用户的密码进行加密处理
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // 定义添加用户的 SQL 语句
        const sql = 'insert into ev_users set ?'
        // 调用 db.query() 执行 SQL 语句，插入新用户
        db.query(sql, {username: userinfo.username, password: userinfo.password}, (err, results) => {
            // 判断 SQL 语句是否执行成功
            if(err) {
                return res.cc(err)
            }
            // 判断执行后的影响数据条数是否为 1
            if(results.affectedRows !== 1) {
                return res.cc('注册用户失败，请稍后再试！')
            }
            // 注册成功
            // res.send({status: 0, message: '注册成功！'})
            res.cc('注册成功！', 0)
        })
    })

}

// 登录的处理函数
exports.login = (req, res) => {
    // 获取到用户的表单数据
    const userinfo = req.body
    // 定义 SQL 语句，根据用户名查询用户数据
    const sql = `select * from ev_users where username=?`
    // 执行 sql 查询用户信息
    db.query(sql, userinfo.username, (err, results) => {
        // 执行 SQL 语句失败
        if(err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询到的数据条数不为1
        if(results.length !== 1) return res.cc('登录失败！')
        // 根据该用户名查询到唯一的一条数据后验证用户数据的密码是否正确
        // 使用 bcrypt.compareSync('用户输入的密码', '数据库中的密码') 值为 true 即密码验证成功
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if(!compareResult) return res.cc('密码错误！')
        // 密码正确后生成 JWT 的 Token 字符串发送给客户端（Token 中不包含密码和头像）
        const user = { ...results[0], password: '', user_pic: ''}
        // 生成 Token 字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {expiresIn: config.expiresIn})
        // 将生成的 Token 字符串响应给客户端
        res.send({
            status: 0,
            message: '登录成功！',
            // 为了方便客户端使用 Token，在服务器端直接拼接上 Bearer 的前缀
            token: 'Bearer ' + tokenStr,
        })
    })
}