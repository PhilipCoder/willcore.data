const mysql = require("mysql2");

class runQuery {
    constructor() {
        this.connectionString = null;
        this.userName = null;
        this.password = null;
        this.promisePool = null;
        this.connection = null;
    }

    initDB(connection, userName, password) {
        return new Promise((resolve, reject) => {
            this.connection = mysql.createConnection({
                host: connection,
                user: userName,
                password: password,
                multipleStatements: true,
                flags: '-CONNECT_WITH_DB,IGNORE_SPACE'
            });
            resolve();
        });
    }

    execute(sql) {
        return new Promise((resolve, reject) => {
            this.connection.connect((err) => {
                if (err) {
                    reject(err);
                } else {
                    this.connection.query(sql, (err, result) => {
                        this.connection.end();
                        if (err) { reject(err); }
                        else { resolve(result); }
                    });
                }
            });;
        });
    }
}

const queryInstance = new runQuery();

module.exports = queryInstance;