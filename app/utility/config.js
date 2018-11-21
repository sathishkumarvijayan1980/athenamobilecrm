module.exports = {
    app: {
        prod: {
            port: 3002,
            domain: "http://localhost",
            db: {
                server: 'athenaproduction.database.windows.net',
                database: 'athena',
                driver: "msnodesqlv8",
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