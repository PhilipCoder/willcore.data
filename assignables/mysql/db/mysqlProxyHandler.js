const assignableProxyHandler = require("../../../proxies/base/assignableProxyHandler.js");

class mysqlProxyHandler extends assignableProxyHandler {
  constructor() {
    super();
    this.getTraps.unshift(this.getUpdateFunction);
    this.getTraps.unshift(this.getSaveFunction);
  }

  getUpdateFunction(target, property, proxy) {
    if (property === "init") {
      let initFunction = function(dropDB){
        proxy._mysqlAssignable.dbGenerator.dropDB = !!dropDB;
        return proxy._mysqlAssignable.dbGenerator.generateDB();
      };
      initFunction.bind(proxy);
      return { value: initFunction, status:true };
    }
    return { value: false, status: false };
  }

  getSaveFunction(target, property, proxy) {
    if (property === "save") {
      let saveFunction = function(){
        return proxy._mysqlAssignable.contextStateManager.run();
      };
      saveFunction.bind(proxy);
      return { value: saveFunction, status:true };
    }
    return { value: false, status: false };
  }
}

module.exports = mysqlProxyHandler;