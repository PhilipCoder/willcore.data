const willCoreModules = require("../proxies/moduleContainment/moduleProxyHandler.js");

const willCoreModuleInstance = willCoreModules.new();
willCoreModuleInstance.assignables = willCoreModules.new();
willCoreModuleInstance.assignables.mysql = () => require("../assignables/mysql/mysql.js");
willCoreModuleInstance.assignables.table = () => require("../assignables/mysql/table/dbTable.js");
willCoreModuleInstance.assignables.column = () => require("../assignables/mysql/column/dbColumn.js");
willCoreModuleInstance.assignables.reference = () => require("../assignables/mysql/reference/reference.js");


module.exports = willCoreModuleInstance;