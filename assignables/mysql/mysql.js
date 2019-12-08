const assignable = require("../assignable.js");
const willCoreProxy = require("../../proxies/willCore/willCoreProxy.js");
const mysqlProxy = require("./db/mysqlProxy.js");
const dbMigrationSetup = require("./setup/dbMigrationSetup.js");

class mysql extends assignable {
    constructor() {
        super({ string: 3 }, willCoreProxy);
        this.dbInfo = {
            name: null,
            connectionString: null,
            userName: null,
            password: null,
            tables: []
        };
    }

    completionResult() {
        let proxyResult = mysqlProxy.new(this);
        dbMigrationSetup.setupTables(proxyResult, this.propertyName);
        return proxyResult;
    }

    completed() {
        this.dbInfo.name = this.propertyName;
        this.dbInfo.connectionString = this.bindedValues.string[0];
        this.dbInfo.userName = this.bindedValues.string[1];
        this.dbInfo.password = this.bindedValues.string[2];
    }

    getDBJson() {
        return JSON.stringify(this.dbInfo);
    }
}

module.exports = mysql;