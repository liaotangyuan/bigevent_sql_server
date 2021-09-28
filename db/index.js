// 在此自定义模块中创建数据库的连接对象
// 导入 mysql
const mysql = require('mysql')

// 连接 MySQL 数据库
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'my_db_01',
})


// 向外共享 db 数据库连接对象
module.exports = db