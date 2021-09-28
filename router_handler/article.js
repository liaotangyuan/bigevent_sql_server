// 文章路由模块的路由处理函数模块
// 导入处理路径的 path 核心模块
const path = require('path')
// 导入数据库操作对象
const db = require('../db/index')

// 发布新文章的处理函数模块
exports.addArticle = (req, res) => {
    // 首先自行校验 req.file 即客户端发送过来的文章封面信息是否符合要求
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')

    // TODO: 证明数据都是合法的，才可以进行后续的业务逻辑处理
    // 定义一个对象 articleInfo 将新增文章所需的数据整合好
    const articleInfo = {
        // 标题、内容、状态、所属的分类Id 对 req.body 对象进行解构赋值即可
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章作者的Id
        author_id: req.user.id,
    }
    // 定义新增数据的 SQL 语句
    const sql = `insert into ev_articles set ? `
    // 执行 SQL 语句
    db.query(sql, articleInfo, (err, results) => {
        if(err) return res.cc(err)
        if(results.affectedRows !== 1) return res.cc('发布新文章失败！')
        // 发布新文章成功
        res.cc('发布新文章成功！', 0)
    })
}