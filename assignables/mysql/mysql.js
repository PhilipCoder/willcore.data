const assignable = require("../assignable.js");
const willCoreProxy = require("../../proxies/willCore/willCoreProxy.js");
const mysqlProxy = require("./db/mysqlProxy.js");

class mysql extends assignable {
    constructor() {
        super({ string: 3 }, willCoreProxy);
        this.dbInfo = {
            name: null,
            connectionString: null,
            userName: null,
            password: null,
            tables:[]
        };
    }

    completionResult() {
        return mysqlProxy.new(this);
    }

    completed() {
        this.dbInfo.name = this.propertyName;
        this.dbInfo.connectionString = this.bindedValues.string[0];
        this.dbInfo.userName = this.bindedValues.string[1];
        this.dbInfo.password = this.bindedValues.string[2];
    }

    getDBJson(){
        return JSON.stringify(this.dbInfo);
    }
}

module.exports = mysql;