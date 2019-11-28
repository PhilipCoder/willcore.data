const mysqlProxyHandler = require("./mysqlProxyHandler.js");
/**
 * Proxy class for the main willCore instance.
 */
class mysqlProxy{
    constructor(){
        
    }
    /**
     * Factory method.
     * @type {InstanceType<mysqlProxy>}
     */
    static new(){
        return new Proxy(new mysqlProxy(), new mysqlProxyHandler());
    }
}

module.exports = mysqlProxy;