var sql = require("mssql");
var sqlConnection = require("../utility/sqlConnection");
var moment = require("moment");

exports.persistAuthToken = function (username, tokenid) {

    let ExpiryTime = new Date(moment().add(1, 'days').format());
    let CreatedDate = new Date();

    return new Promise((resolve, reject) => {
        sqlConnection.getConnection().then(pool => {
            const request = new sql.Request(pool);
            request.input('UserName', sql.VarChar, username)
                .input('AuthNToken', sql.VarChar, tokenid)
                .input('TokenExpiry', sql.DateTime, ExpiryTime)
                .input('CreatedDate', sql.DateTime, CreatedDate)
                .query(`
                    Begin	
                        declare @cuser int
                        select @cuser = count(1) from MobileCRMUsers where UserName=@UserName 
                        if(@cuser > 0)
                        begin
                            Update MobileCRMUsers set AuthNToken = @AuthNToken, TokenExpiry=GetDate(), CreatedDate=GetDate()
                        end
                        else 
                        begin
                            Insert into MobileCRMUsers (UserName, AuthNToken, TokenExpiry, CreatedDate) VALUES (@UserName, @AuthNToken, @TokenExpiry, @CreatedDate);
                        end
                        SELECT * from MobileCRMUsers where UserName=@UserName
                    END`, (nerr, recordsets, returnValue) => {
                    if (nerr) {
                        sqlConnection.closeConnectionAndReject(sql, reject, nerr);
                    } else {
                        sqlConnection.closeConnectionAndResolve(sql, resolve, {
                            Data: recordsets.recordsets[0]
                        });
                    }
                });
        }).catch(err => {
            reject(err);
        })
    });
}

exports.validateToken = function (username, token) {
    return new Promise((resolve, reject) => {
        sqlConnection.getConnection().then(pool => {
            const request = new sql.Request(pool);
            request.input('UserName', sql.VarChar, username)
                .input('AuthNToken', sql.VarChar, token)
                .query(`Update MobileCRMUsers set RecentLoginDate=GetDate() 
                            where UserName=@UserName and AuthNToken=@AuthnToken and TokenExpiry<GetDate();
                            SELECT * FROM MobileCRMUsers where UserName=@UserName and AuthNToken=@AuthnToken and TokenExpiry<GetDate()`, (nerr, recordsets, returnValue) => {
                    if (nerr) {
                        sqlConnection.closeConnectionAndReject(sql, reject, nerr);
                    } else {
                        sqlConnection.closeConnectionAndResolve(sql, resolve, {
                            Data: recordsets.recordset
                        });
                    }
                })
        }).catch(err => {
            reject(err);
        })
    })
}

exports.validateAppKey = function (appKey) {
    return new Promise((resolve, reject) => {
        sqlConnection.getConnection().then(pool => {
            const request = new sql.Request(pool);
            request.input('appKey', sql.VarChar, appKey)
                .query(`SELECT * FROM MobileCRMApps WHERE AppSecretKey=@appKey`, (nerr, recordsets, returnValue) => {
                    if (nerr) {
                        sqlConnection.closeConnectionAndReject(sql, reject, nerr);
                    } else {
                        sqlConnection.closeConnectionAndResolve(sql, resolve, {
                            Data: recordsets.recordset
                        });
                    }
                })
        }).catch(err => {
            reject(err);
        })
    })
}