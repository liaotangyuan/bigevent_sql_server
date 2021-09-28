
// 导入数据库操作模块
const db = require('../db/index')
// 导入 bcryptjs 包
const bcrypt = require('bcryptjs')

// 获取用户基本信息的处理函数
 exports.getUserInfo = (req, res) => {
    // 定义 SQL 查询语句(注意不能直接使用 * 号查询，为了防止密码泄露，需要排除 password 字段)
    const sql = `select id, username, nickname, email, user_pic from ev_users where id=?`
    // 调用 db.query() 执行 SQL 语句
    db.query(sql, req.user.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询到的数据条数不等于 1
        if (results.length !== 1) return res.cc('获取用户信息失败！')
        // 查询数据成功，将信息响应给客户端
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: results[0],
        })
    })
}

// 更新用户基本信息的处理函数
exports.setUserInfo = (req, res) => {
    // 定义 SQL 语句
    const sql = `update ev_users set ? where id=?`
    // 执行 SQL 语句
    db.query(sql, [req.body, req.body.id], (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是影响行数不为 1
        if (results.affectedRows !== 1) return res.cc('更新用户基本信息失败！')
        // 更新用户基本信息成功
        res.cc('更新用户信息成功！', 0)
    })
}

// 重置用户密码的处理函数
exports.updatePassword = (req, res) => {
    // 定义根据 id 查询用户是否存在的 SQL 语句
    const sql = `select * from ev_users where id=?`
    // 执行 SQL 语句
    db.query(sql, req.user.id, (err, results) => {
        // 执行 SQL 语句失败
        if (err) return res.cc(err)
        // 执行 SQL 语句成功，判断返回的 results 的长度是否为 1
        if (results.length !== 1) return res.cc('用户不存在！')
        // 匹配到了唯一的用户后验证用户输入的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码错误！')
        // 密码输入正确则修改用户的旧密码为新密码
        // 定义修改用户密码的 SQL 语句
        const sql = `update ev_users set password=? where id=?`
        // 对用户提供的新密码进行加密
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        // 执行 SQL 语句根据 id 重置用户的密码
        db.query(sql, [newPwd, req.user.id], (err, results) => {
            // 执行 SQL 语句失败
            if (err) return res.cc(err)
            // 执行 SQL 语句成功，但是影响条数不为 1
            if (results.affectedRows !== 1) return res.cc('重置密码失败！')
            // 重置密码成功
            res.cc('重置密码成功！', 0)
        })
    })
}

// 更换用户头像的处理函数
exports.updateAvatar = (req, res) => {
    // 定义根据 id 修改用户头像信息的 SQL 语句
    const sql = `update ev_users set user_pic=? where id=?`
    // 执行 SQL 语句更换用户头像
    db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
        // 执行 SQL 语句失败
        if(err) return res.cc(err)
        // 判断影响数据条数是否为 1
        if(results.affectedRows !== 1) return res.cc('更换头像失败！')
        // 更换头像成功
        res.cc('更换头像成功！', 0)
    })
}