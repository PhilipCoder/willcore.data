const mysql = require("mysql2");

class runQuery {
    constructor() {
        this.connectionString = null;
        this.userName = null;
        this.password = null;
        this.promisePool = null;
        this.connection = null;
    }

    initDB(connection, userName, password,dbname) {
        this.connectionString = connection;
        this.userName = userName;
        this.password = password;
        this.dbname = dbname;
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

    runQuery(sql,parameters) {
        return new Promise((resolve, reject) => {
            let connection = mysql.createConnection({
                host: this.connectionString,
                user: this.userName,
                password: this.password,
                database:this.dbname,
                multipleStatements: true,
                flags: 'IGNORE_SPACE'
            });
            connection.connect((err) => {
                if (err) {
                    reject(err);
                } else {
                    connection.query(sql, parameters, (err, result) => {
                        connection.end();
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