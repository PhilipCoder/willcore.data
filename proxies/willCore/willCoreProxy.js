const proxyHandler = require("./willCoreProxyHandler.js");
/**
 * Proxy class for the main willCore instance.
 */
class willCoreProxy{
    constructor(){
        
    }
    /**
     * Factory method.
     * @type {InstanceType<willCoreProxy>}
     */
    static new(){
        return new Proxy(new willCoreProxy(), new proxyHandler());
    }
}

module.exports = willCoreProxy;