const willCoreProxy = require("../../proxies/willCore/willCoreProxy.js");

const migrationSourceStub = {
    getSource:(name)=>{
      let proxy = willCoreProxy.new();
      proxy.myDB.mysql = ["", "", ""];
      proxy.myDB.user.table;
      proxy.myDB.user.id.column.int;
      proxy.myDB.user.id.primary;
      proxy.myDB.user.name.column.string;

      proxy.myDB.product.table;
      proxy.myDB.product.id.column.int;
      proxy.myDB.product.id.primary;
      proxy.myDB.product.name.column.string;
      proxy.myDB.product.owner.column.int;
      proxy.myDB.product.owner = proxy.myDB.user.id;

      return proxy.myDB._mysqlAssignable.dbInfo;
    }
};

const emptyMigrationSource = {
    getSource:(name)=>{
    }
};

const defaultTwoTableDBFactory = () =>{
    let proxy = willCoreProxy.new();
    proxy.myDB.mysql = ["", "",""];
    proxy.myDB.user.table;
    proxy.myDB.user.id.column.int;
    proxy.myDB.user.id.primary;
    proxy.myDB.user.name.column.string;

    proxy.myDB.product.table;
    proxy.myDB.product.id.column.int;
    proxy.myDB.product.id.primary;
    proxy.myDB.product.name.column.string;
    proxy.myDB.product.owner.column.int;
    proxy.myDB.product.owner = proxy.myDB.user.id;
    return proxy.myDB;
};

exports.migrationSourceStub = migrationSourceStub;
exports.emptyMigrationSource = emptyMigrationSource;
exports.defaultTwoTableDBFactory = defaultTwoTableDBFactory;
