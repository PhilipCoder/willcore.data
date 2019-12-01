const dbColumnProxyHandler = require("./dbColumnProxyHandler.js");
const baseProxy = require("../../../proxies/base/baseProxy.js");

/**
 * Proxy class for the main willCore instance.
 */
class dbColumnProxy extends baseProxy {
    constructor() {
        super();
    }
    /**
     * Factory method.
     * @type {InstanceType<mysqlProxy>}
     */
    static new(dbColumnAssignable, dbAssignable) {
        let result = new Proxy(new dbColumnProxy(), new dbColumnProxyHandler());
        result._dbColumnAssignable = dbColumnAssignable;
        return result;
    }
}

module.exports = dbColumnProxy;