const assignableProxyHandler = require("../../../proxies/base/assignableProxyHandler.js");
const columnProxy = require("../column/dbColumnProxy.js");

class dbTableProxyHandler extends assignableProxyHandler {
  constructor() {
    super();
    this.setTraps.unshift(this.assignStraightValue);
  }
  assignStraightValue(target, property, value, proxy) {
    if (value instanceof columnProxy && target[property] instanceof columnProxy) {
      let targetColumnName = value._dbColumnAssignable.columnInfo.name;
      let targetTableName = value._dbColumnAssignable.parentProxy._dbTableAssignable.tableInfo.name;
      target[property]._dbColumnAssignable.parentProxy._dbColumnAssignable.columnInfo.reference = {
        table: targetTableName,
        column: targetColumnName
    };
        return { value: true };
    }
    return { value: false, status: false };
}
}

module.exports = dbTableProxyHandler;