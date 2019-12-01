const baseProxyHandler = require("../../../proxies/base/assignableProxyHandler.js");

class dbColumnProxyHandler extends baseProxyHandler {
  constructor() {
    super();
    this.getTraps.unshift(this.assignPrimaryKey);
  }

  assignPrimaryKey(target, property, proxy) {
    if (property === "primary") {
      proxy._dbColumnAssignable.columnInfo.primary = true;
      return { value: true };
    }
    return { value: false, status: false };
  }

}

module.exports = dbColumnProxyHandler;