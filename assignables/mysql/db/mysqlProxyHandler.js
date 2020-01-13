const assignableProxyHandler = require("../../../proxies/base/assignableProxyHandler.js");
const contextStateManager = require("../../../sqlGeneration/state/contextStateManager.js");

class mysqlProxyHandler extends assignableProxyHandler {
  constructor() {
    super();
    this.getTraps.unshift(this.getUpdateFunction);
    this.getTraps.unshift(this.getSaveFunction);
    this.getTraps.unshift(this.getQueryDB);
  }

  getUpdateFunction(target, property, proxy) {
    if (property === "init") {
      let initFunction = function (dropDB) {
        proxy._mysqlAssignable.dbGenerator.dropDB = !!dropDB;
        return proxy._mysqlAssignable.dbGenerator.generateDB();
      };
      initFunction.bind(proxy);
      return { value: initFunction, status: true };
    }
    return { value: false, status: false };
  }

  getSaveFunction(target, property, proxy) {
    if (property === "save") {
      let saveFunction = function () {
        return proxy._mysqlAssignable.contextStateManager.run();
      };
      saveFunction.bind(proxy);
      return { value: saveFunction, status: true };
    }
    return { value: false, status: false };
  }

  getQueryDB(target, property, proxy) {
    if (property === "queryDB") {
      let handler = new mysqlProxyHandler();
      for (let key in this.hiddenVariables) {
        handler.hiddenVariables[key] = this.hiddenVariables[key];
      }
      let mysqlAssignable ={};
      mysqlAssignable.queryExecutor = this.hiddenVariables._mysqlAssignable.queryExecutor;
      mysqlAssignable.dbInfo = this.hiddenVariables._mysqlAssignable.dbInfo;
      mysqlAssignable.dbGenerator = this.hiddenVariables._mysqlAssignable.dbGenerator;
      mysqlAssignable.contextStateManager = new contextStateManager(this.hiddenVariables._mysqlAssignable.queryExecutor);
      handler.hiddenVariables._mysqlAssignable = mysqlAssignable;
      let result = new Proxy(target, handler);
      return { value: result, status: true };
    }
    return { value: false, status: false };
  }
}

module.exports = mysqlProxyHandler;