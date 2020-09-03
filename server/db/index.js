const dbOption = require('./config')
const mysql = require('mysql')
    //创建连接池
const connPool = mysql.createPool(dbOption)

function query(sql, prarms) {
    return new Promise((resolve, reject) => {
        connPool.getConnection((err, conn) => {
            if (err) {
                reject(err)
                return;
            }
            conn.query(sql, prarms, (err, result) => {
                if (err) {
                    reject(err)
                    return;
                }
                resolve(result)
                conn.release()
            })
        })
    })
}
module.exports = query