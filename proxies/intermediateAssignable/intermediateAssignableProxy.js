const intermediateAssignableProxyHandler = require("./intermediateAssignableProxyHandler.js");
/**
 * Proxy class for the main intermediate assignable instanciation.
 */
class intermediateAssignableProxy{
   /**
    * Factory method.
    * @param {Proxy} parentProxy 
    * @param {String} parentProperty 
    */
    static new(parentProxy, parentProperty){
        return new Proxy(new intermediateAssignableProxy(), new intermediateAssignableProxyHandler(parentProxy,parentProperty));
    }
}

module.exports = intermediateAssignableProxy;