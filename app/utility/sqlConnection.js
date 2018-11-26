var config = require('../utility/config');
var sql = new require("mssql");

exports.getConnection = function () {
    const sqlConfig = config.app.prod.db;
    return new Promise((resolve, reject) => {
        new sql.ConnectionPool(sqlConfig).connect().then(pool => {
            resolve(pool);
        }).catch(err => {
            reject(err);
        });
    });
}

sql.on('error', err => {
    sql.close();
    next(err);
});

exports.closeConnectionAndReject = function (sql, reject, error) {
    sql.close();
    reject(error);
}

exports.closeConnectionAndResolve = function (sql, resolve, data) {
    sql.close();
    resolve(data);
}