const assignableProxyHandler = require("../../../proxies/base/assignableProxyHandler.js");
const columnProxy = require("../column/dbColumnProxy.js");
const queryFactory = require("../../../sqlGeneration/queries/queryFactory.js");

class dbTableProxyHandler extends assignableProxyHandler {
  constructor() {
    super();
    this.setTraps.unshift(this.assignReference);
    this.setTraps.unshift(this.assignReferenceNewColumn);
    this.getTraps.unshift(this.getAddFunction);
    this.getTraps.unshift(this.getQueryableFunction);
    this.deleteTraps.unshift(this.deleteRow);
  }

  assignReference(target, property, value, proxy) {
    if (value instanceof columnProxy && target[property] instanceof columnProxy) {
      let targetColumnName = value._dbColumnAssignable.columnInfo.name;
      let targetTableName = value._dbColumnAssignable.parentProxy._dbTableAssignable.tableInfo.name;
      let tableName = proxy[property]._dbColumnAssignable.parentProxy._dbTableAssignable.tableInfo.name;
      target[property]._dbColumnAssignable.columnInfo.reference = {
        table: targetTableName,
        column: targetColumnName,
        thisTable: tableName,
        primary: !value._dbColumnAssignable.columnInfo.reference
      };
      return { value: true };
    }
    return { value: false, status: false };
  }

  assignReferenceNewColumn(target, property, value, proxy) {
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
        thisTable: tableName,
        primary: !value._dbColumnAssignable.columnInfo.reference
      };
      return { value: true };
    }
    return { value: false, status: false };
  }

  getAddFunction(target, property, proxy) {
    if (property === "add") {
      let addFunction = function (data) {
        let statemanager = proxy._dbTableAssignable.parentProxy._mysqlAssignable.contextStateManager;
        let tableName = proxy._dbTableAssignable.tableInfo.name;
        statemanager.addRow(tableName, data);
      };
      addFunction.bind(proxy);
      return { value: addFunction, status: true };
    }
    return { value: false, status: false };
  }

  getQueryableFunction(target, property, proxy) {
    if (property === "filter" || property === "select" || property === "include" || property === "sort" || property === "take" || property === "skip") {
      let factory = new queryFactory(proxy._dbTableAssignable.parentProxy, proxy._dbTableAssignable.tableInfo.name);
      let query = factory.getQuery();
      return { value: query[property], status: true };
    }
    return { value: false, status: false };
  }

  deleteRow(target, property,proxy) {
    let stateManager = proxy._dbTableAssignable.parentProxy._mysqlAssignable.contextStateManager;
    stateManager.deleteRow(proxy.$tableName,proxy.$primaryIndicator,proxy[proxy.$primaryIndicator]);
    return { status: true };
  }
}

module.exports = dbTableProxyHandler;