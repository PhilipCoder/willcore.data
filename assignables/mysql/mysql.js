const assignable = require("../assignable.js");
const willCoreProxy = require("../../proxies/willCore/willCoreProxy.js");
const mysqlProxy = require("./db/mysqlProxy.js");

class mysql extends assignable {
    constructor() {
        super({ string: 3 }, willCoreProxy);
    }

    completionResult(){

    }

    completed(){
        
    }
}

module.exports = mysql;