// 这是文章类别部分的路由处理函数模块

// 导入数据库操作模块
const db = require('../db/index')

// 获取文章分类信息的处理函数
exports.getArticleCates = (req, res) => {
    // 定义查询文章类别信息的 SQL 语句（只需要没有被标记删除的数据）
    const sql = `select * from ev_artide_cate where is_delete=0 order by id asc`
    // 调用 db.query() 函数执行 SQL 语句
    db.query(sql, (err, results) => {
        // 执行 SQL 语句失败
        if(err) return res.cc(err)
        // 执行 SQL 语句成功
        res.send({
            status: 0, 
            message: '获取文章分类数据成功！',
            data: results,
        })

    })
}

// 新增文章类别的处理函数
exports.addArticleCats = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from ev_artide_cate where name=? or alias=?`
    // 执行 SQL 语句
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        // 执行 SQL 语句失败
        if(err) return res.cc(err)
        // 判断查询到的结果条数以及是分类名称还是分类别名被占用
        if(results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试！')
        if(results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试！')
        if(results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称已被占用，请更换后重试！')
        if(results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名已被占用，请更换后重试！')

        // TODO: 客户端的数据通过验证和查重后即可执行插入操作
        // 定义新增文章分类的 SQL 语句
        const sql = `insert into ev_artide_cate set ?`
        // 执行 SQL 语句
        db.query(sql, req.body, (err, results) => {
            // 执行 SQL 语句失败
            if(err) return res.cc(err)
            // 判断影响条数
            if(results.affectedRows !== 1) return res.cc('新增文章分类失败！')
            // 成功
            res.cc('新增文章分类成功！', 0)
        })
    })

}

// 根据 id 删除文章分类信息的处理函数
exports.deleteCateById = (req, res) => {
    // 定义删除文章分类的 SQL 语句（注意：其实是标记删除，不是执行 delete 语句）
    const sql = `update ev_artide_cate set is_delete=1 where id=?`
    // 执行 SQL 语句，根据 id 修改该条数据的 is_delete 字段
    db.query(sql, req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if(err) return res.cc(err)
        // 判断影响条数
        if(results.affectedRows !== 1) return res.cc('删除文章分类失败！')
        // 删除文章分类成功
        res.cc('删除文章分类成功！', 0)
    })
}

// 根据 id 获取文章分类信息的处理函数
exports.getArtCateById = (req, res) => {
    // 定义 SQL 查询语句
    const sql = `select * from ev_artide_cate where id=?`
    // 执行 SQL 语句
    db.query(sql, req.params.id, (err, results) => {
        // 执行 SQL 语句失败
        if(err) return res.cc(err)
        // 判断 results 数组长度是否为 1
        if(results.length !== 1) return res.cc('获取文章分类数据失败！')
        // 获取文章分类数据成功
        res.send({
            status: 0, 
            message: '获取文章分类数据成功！',
            data: results[0],
        })
    })
}

// 根据 id 更新文章分类信息的处理函数
exports.updateCateById = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = `select * from ev_artide_cate where id!=? and (name=? or alias=?)`
    // 执行 SQL 语句
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        // 执行 SQL 语句失败
        if(err) return res.cc(err)
        // 执行 SQL 语句成功，对分类名称和分类别名的数据进行查重
        if(results.length === 2) return res.cc('分类名称与别名已被占用，请更换后重试！')
        if(results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名已被占用，请更换后重试！')
        if(results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称已被占用，请更换后重试！')
        if(results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名已被占用，请更换后重试！')
        // 分类名称符合修改条件，执行 SQL 语句更新该条分类数据
        // 定义 SQL 语句
        const sql = `update ev_artide_cate set ? where Id=?`
        // 执行 SQL 语句
        db.query(sql, [req.body, req.body.Id], (err, results) => {
            if(err) return res.cc(err)
            if(results.affectedRows !== 1) return res.cc('更新文章分类失败！')
            res.cc('更新文章分类成功！', 0)
        })

    })
}