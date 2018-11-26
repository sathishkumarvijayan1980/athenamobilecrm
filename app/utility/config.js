module.exports = {
    app: {
        prod: {
            port: 1337,
            domain: "./",
            db: {
                server: 'athenaproduction.database.windows.net',
                database: 'athena',
                user: 'athena',
                password: 'Appa2709$$',
                port: 1433,
                pool: {
                    max: 10,
                    min: 0,
                    requestTimeout: 300000
                },
                options: {
                    encrypt: false
                },
                parseJSON: true
            }
        }
    }
}