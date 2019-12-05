const assert = require('chai').assert;
const assignable = require("../assignables/assignable.js");
const willCoreProxy = require("../proxies/willCore/willCoreProxy.js");
const mysqlProxy = require("../assignables/mysql/db/mysqlProxy.js");
const dbTableProxy = require("../assignables/mysql/table/dbTableProxy.js");
const dbColumnProxy = require("../assignables/mysql/column/dbColumnProxy.js");

describe('mySQL-assignable', function () {
    let dbName = "myDB", connectionString = "myConnection", userName = "myUser", password = "myPassword", tableName = "testTable";
    //---------------------------------------------------
  
    it('create', function () {
        let proxy = willCoreProxy.new();
        proxy.myDB.mysql = [connectionString, userName, password];
        assert(proxy.myDB instanceof mysqlProxy);
        assert(proxy.myDB._mysqlAssignable.dbInfo.name == dbName);
        assert(proxy.myDB._mysqlAssignable.dbInfo.connectionString == connectionString);
        assert(proxy.myDB._mysqlAssignable.dbInfo.userName == userName);
        assert(proxy.myDB._mysqlAssignable.dbInfo.password == password);

    });
    it('create-table', function () {
        let proxy = willCoreProxy.new();
        proxy.myDB.mysql = [connectionString, userName, password];
        proxy.myDB.testTable.table;
        assert(proxy.myDB[tableName] instanceof dbTableProxy);
        assert(proxy.myDB[tableName]._dbTableAssignable.tableInfo.name == tableName);
    });
    it('create-column', function () {
        let proxy = willCoreProxy.new();
        proxy.myDB.mysql = [connectionString, userName, password];
        proxy.myDB.testTable.table;
        proxy.myDB.testTable.name.column.int;
        assert(proxy.myDB.testTable.name instanceof dbColumnProxy);
        assert(proxy.myDB.testTable.name._dbColumnAssignable.columnInfo.name == "name");
    });
    it('test-db-json', function () {
        let targetJSON = `{"name":"myDB","connectionString":"myConnection","userName":"myUser","password":"myPassword","tables":[{"name":"user","columns":[{"name":"name","type":"string"},{"name":"surname","type":"string"},{"name":"age","type":"int"}]},{"name":"product","columns":[{"name":"name","type":"string"},{"name":"description","type":"string"},{"name":"price","type":"float"}]}]}`;
        let proxy = willCoreProxy.new();
        proxy.myDB.mysql = [connectionString, userName, password];
        proxy.myDB.user.table;
        proxy.myDB.user.name.column.string;
        proxy.myDB.user.surname.column.string;
        proxy.myDB.user.age.column.int;
        proxy.myDB.product.table;
        proxy.myDB.product.name.column.string;
        proxy.myDB.product.description.column.string;
        proxy.myDB.product.price.column.float;
        let json = proxy.myDB._mysqlAssignable.getDBJson();
        assert(targetJSON === json,"The generated DB JSON is incorrect.");
    });
    it('test-primary-key', function () {
        let targetJSON = `{"name":"myDB","connectionString":"myConnection","userName":"myUser","password":"myPassword","tables":[{"name":"user","columns":[{"name":"id","type":"int","primary":true},{"name":"name","type":"string"}]},{"name":"product","columns":[{"name":"id","type":"int","primary":true},{"name":"name","type":"string"}]}]}`;
        let proxy = willCoreProxy.new();
        proxy.myDB.mysql = [connectionString, userName, password];
        proxy.myDB.user.table;
        proxy.myDB.user.id.column.int;
        proxy.myDB.user.id.primary;
        proxy.myDB.user.name.column.string;

        proxy.myDB.product.table;
        proxy.myDB.product.id.column.int;
        proxy.myDB.product.id.primary;
        proxy.myDB.product.name.column.string;

        let json = proxy.myDB._mysqlAssignable.getDBJson();
        assert(targetJSON === json,"The generated DB JSON is incorrect.");
    });
    it('test-foreign-key', function () {
        let proxy = willCoreProxy.new();
        proxy.myDB.mysql = [connectionString, userName, password];
        proxy.myDB.user.table;
        proxy.myDB.user.id.column.int;
        proxy.myDB.user.id.primary;
        proxy.myDB.user.name.column.string;

        proxy.myDB.product.table;
        proxy.myDB.product.id.column.int;
        proxy.myDB.product.id.primary;
        proxy.myDB.product.name.column.string;
        proxy.myDB.product.owner.column.int;
        proxy.myDB.product.owner.one_many.reference = proxy.myDB.user.id;

        let productOwnerColumn = proxy.myDB.product.owner._dbColumnAssignable.columnInfo;
        let userIdColumn = proxy.myDB.user.id._dbColumnAssignable.columnInfo;

        assert(productOwnerColumn.reference.column === "id");
        assert(productOwnerColumn.reference.table === "user");
        assert(productOwnerColumn.reference.multiplication === "one");

        assert(userIdColumn.reference.column === "owner");
        assert(userIdColumn.reference.table === "product");
        assert(userIdColumn.reference.multiplication === "many");
    });
    it('test-reference', function () {
        let proxy = willCoreProxy.new();
        proxy.myDB.mysql = [connectionString, userName, password];
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

       
    });


})