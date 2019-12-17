const assignableProxyHandler = require("../../../proxies/base/assignableProxyHandler.js");
const columnProxy = require("../column/dbColumnProxy.js");

class dbTableProxyHandler extends assignableProxyHandler {
  constructor() {
    super();
    this.setTraps.unshift(this.assignReference);
    this.setTraps.unshift(this.assignReferenceNewColumn);

  }
  assignReference(target, property, value, proxy) {
    if (value instanceof columnProxy && target[property] instanceof columnProxy) {
      let targetColumnName = value._dbColumnAssignable.columnInfo.name;
      let targetTableName = value._dbColumnAssignable.parentProxy._dbTableAssignable.tableInfo.name;
      let tableName = proxy[property]._dbColumnAssignable.parentProxy._dbTableAssignable.tableInfo.name;
      target[property]._dbColumnAssignable.columnInfo.reference = {
        table: targetTableName,
        column: targetColumnName,
        thisTable:tableName
      };
      return { value: true };
    }
    return { value: false, status: false };
  }
  assignReferenceNewColumn(target, property, value, proxy){
    if (value instanceof columnProxy && !target[property]) {
      proxy[property].column.int;
      target[property]._dbColumnAssignable.columnInfo.type = value._dbColumnAssignable.columnInfo.type;
      target[property]._dbColumnAssignable.columnInfo.size = value._dbColumnAssignable.columnInfo.size;

      let targetColumnName = value._dbColumnAssignable.columnInfo.name;
      let targetTableName = value._dbColumnAssignable.parentProxy._dbTableAssignable.tableInfo.name;
      let tableName = proxy[property]._dbColumnAssignable.parentProxy._dbTableAssignable.tableInfo.name;
      target[property]._dbColumnAssignable.columnInfo.reference = {
        table: targetTableName,
        column: targetColumnName,
        thisTable:tableName
      };
      return { value: true };
    }
    return { value: false, status: false };
  }
}

module.exports = dbTableProxyHandler;