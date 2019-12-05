const assert = require('chai').assert;
const willCoreProxy = require("../proxies/willCore/willCoreProxy.js");
const mysqlProxy = require("../assignables/mysql/db/mysqlProxy.js");
const db = require("../sqlGeneration/db.js");
const table = require("../sqlGeneration/table.js");
const column = require("../sqlGeneration/column.js");


describe('mySQL-comparison-test', function () {
    let proxy = willCoreProxy.new();
    proxy.baseDB.mysql = ["connection", "userName", "connection"];
    proxy.baseDB.user.table;
    proxy.baseDB.user.id.column.int;
    proxy.baseDB.user.id.primary;
    proxy.baseDB.user.name.column.string;

    proxy.baseDB.product.table;
    proxy.baseDB.product.id.column.int;
    proxy.baseDB.product.id.primary;
    proxy.baseDB.product.name.column.string;
    proxy.baseDB.product.owner.column.int;
    proxy.baseDB.product.owner = proxy.baseDB.user.id;
    it('test-no-changes', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["connection", "userName", "connection"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;
        proxyScoped.baseDB.user.name.column.string;
        proxyScoped.baseDB.product.table;
        proxyScoped.baseDB.product.id.column.int;
        proxyScoped.baseDB.product.id.primary;
        proxyScoped.baseDB.product.name.column.string;
        proxyScoped.baseDB.product.owner.column.int;
        proxyScoped.baseDB.product.owner = proxyScoped.baseDB.user.id;

        let sqlCreator = new db(proxyScoped.baseDB._mysqlAssignable.dbInfo);
        let comparisonResult = sqlCreator.runMigrationComparison(proxy.baseDB._mysqlAssignable.dbInfo);
        assert(getTablesWithStatus(comparisonResult.target, "new").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "new").length === 0);
        assert(getTablesWithStatus(comparisonResult.source, "deleted").length === 0);
        assert(getTablesWithStatus(comparisonResult.source, "deleted").length === 0);
        assert(getTablesWithStatus(comparisonResult.target, "skip").length === 2);
        assert(getColumnsWithStatus(comparisonResult.target, "skip").length === 5);
        assert(getColumnsWithStatus(comparisonResult.target, "typeChanged").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "addReference").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "removeReference").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "changeReference").length === 0);
    });

    it('test-create-new', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["connection", "userName", "connection"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;
        proxyScoped.baseDB.user.name.column.string;
        proxyScoped.baseDB.product.table;
        proxyScoped.baseDB.product.id.column.int;
        proxyScoped.baseDB.product.id.primary;
        proxyScoped.baseDB.product.name.column.string;
        proxyScoped.baseDB.product.owner.column.int;
        proxyScoped.baseDB.product.owner = proxyScoped.baseDB.user.id;

        let sqlCreator = new db(proxyScoped.baseDB._mysqlAssignable.dbInfo);
        let comparisonResult = sqlCreator.runMigrationComparison();
        assert(getTablesWithStatus(comparisonResult.target, "new").length === 2);
        assert(getColumnsWithStatus(comparisonResult.target, "new").length === 5);
        assert(getTablesWithStatus(comparisonResult.source, "deleted").length === 0);
        assert(getTablesWithStatus(comparisonResult.source, "deleted").length === 0);
        assert(getTablesWithStatus(comparisonResult.target, "skip").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "skip").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "typeChanged").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "addReference").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "removeReference").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "changeReference").length === 0);
    });
    it('test-add-table', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["connection", "userName", "connection"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;
        proxyScoped.baseDB.user.name.column.string;

        proxyScoped.baseDB.store.table;
        proxyScoped.baseDB.store.id.column.int;
        proxyScoped.baseDB.store.id.primary;
        proxyScoped.baseDB.store.name.column.string;
        proxyScoped.baseDB.store.owner.column.int;

        proxyScoped.baseDB.product.table;
        proxyScoped.baseDB.product.id.column.int;
        proxyScoped.baseDB.product.id.primary;
        proxyScoped.baseDB.product.name.column.string;
        proxyScoped.baseDB.product.owner.column.int;
        proxyScoped.baseDB.product.owner = proxyScoped.baseDB.user.id;

        let sqlCreator = new db(proxyScoped.baseDB._mysqlAssignable.dbInfo);
        let comparisonResult = sqlCreator.runMigrationComparison(proxy.baseDB._mysqlAssignable.dbInfo);
        assert(getTablesWithStatus(comparisonResult.target, "new").length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, "new").length === 3);
        assert(getTablesWithStatus(comparisonResult.source, "deleted").length === 0);
        assert(getTablesWithStatus(comparisonResult.source, "deleted").length === 0);
        assert(getTablesWithStatus(comparisonResult.target, "skip").length === 2);
        assert(getColumnsWithStatus(comparisonResult.target, "skip").length === 5);
        assert(getColumnsWithStatus(comparisonResult.target, "typeChanged").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "addReference").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "removeReference").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "changeReference").length === 0);
    });
    it('test-type-change', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["connection", "userName", "connection"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;
        proxyScoped.baseDB.user.name.column.string;
        proxyScoped.baseDB.product.table;
        proxyScoped.baseDB.product.id.column.int;
        proxyScoped.baseDB.product.id.primary;
        proxyScoped.baseDB.product.name.column.int;
        proxyScoped.baseDB.product.owner.column.int;
        proxyScoped.baseDB.product.owner = proxyScoped.baseDB.user.id;

        let sqlCreator = new db(proxyScoped.baseDB._mysqlAssignable.dbInfo);
        let comparisonResult = sqlCreator.runMigrationComparison(proxy.baseDB._mysqlAssignable.dbInfo);
        assert(getTablesWithStatus(comparisonResult.target, "new").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "new").length === 0);
        assert(getTablesWithStatus(comparisonResult.source, "deleted").length === 0);
        assert(getTablesWithStatus(comparisonResult.source, "deleted").length === 0);
        assert(getTablesWithStatus(comparisonResult.target, "skip").length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, "skip").length === 4);
        assert(getColumnsWithStatus(comparisonResult.target, "typeChanged").length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, "addReference").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "removeReference").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "changeReference").length === 0);
    });
    it('test-reference-change', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["connection", "userName", "connection"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;
        proxyScoped.baseDB.user.name.column.string;
        proxyScoped.baseDB.product.table;
        proxyScoped.baseDB.product.id.column.int;
        proxyScoped.baseDB.product.id.primary;
        proxyScoped.baseDB.product.name.column.string;
        proxyScoped.baseDB.product.owner.column.int;
        proxyScoped.baseDB.product.owner = proxyScoped.baseDB.user.name;

        let sqlCreator = new db(proxyScoped.baseDB._mysqlAssignable.dbInfo);
        let comparisonResult = sqlCreator.runMigrationComparison(proxy.baseDB._mysqlAssignable.dbInfo);
        assert(getTablesWithStatus(comparisonResult.target, "new").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "new").length === 0);
        assert(getTablesWithStatus(comparisonResult.source, "deleted").length === 0);
        assert(getTablesWithStatus(comparisonResult.source, "deleted").length === 0);
        assert(getTablesWithStatus(comparisonResult.target, "skip").length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, "skip").length === 4);
        assert(getColumnsWithStatus(comparisonResult.target, "typeChanged").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "addReference").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "removeReference").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "changeReference").length === 1);
    });
    it('test-reference-add', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["connection", "userName", "connection"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;
        proxyScoped.baseDB.user.name.column.string;
        proxyScoped.baseDB.product.table;
        proxyScoped.baseDB.product.id.column.int;
        proxyScoped.baseDB.product.id.primary;
        proxyScoped.baseDB.product.name.column.string;
        proxyScoped.baseDB.product.owner.column.int;
        proxyScoped.baseDB.product.owner = proxyScoped.baseDB.user.name;
        proxyScoped.baseDB.product.name = proxyScoped.baseDB.user.name;

        let sqlCreator = new db(proxyScoped.baseDB._mysqlAssignable.dbInfo);
        let comparisonResult = sqlCreator.runMigrationComparison(proxy.baseDB._mysqlAssignable.dbInfo);
        assert(getTablesWithStatus(comparisonResult.target, "new").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "new").length === 0);
        assert(getTablesWithStatus(comparisonResult.source, "deleted").length === 0);
        assert(getTablesWithStatus(comparisonResult.source, "deleted").length === 0);
        assert(getTablesWithStatus(comparisonResult.target, "skip").length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, "skip").length === 3);
        assert(getColumnsWithStatus(comparisonResult.target, "typeChanged").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "addReference").length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, "removeReference").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "changeReference").length === 1);
    });
    it('test-reference-remove', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["connection", "userName", "connection"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;
        proxyScoped.baseDB.user.name.column.string;
        proxyScoped.baseDB.product.table;
        proxyScoped.baseDB.product.id.column.int;
        proxyScoped.baseDB.product.id.primary;
        proxyScoped.baseDB.product.name.column.string;
        proxyScoped.baseDB.product.owner.column.int;

        let sqlCreator = new db(proxyScoped.baseDB._mysqlAssignable.dbInfo);
        let comparisonResult = sqlCreator.runMigrationComparison(proxy.baseDB._mysqlAssignable.dbInfo);
        assert(getTablesWithStatus(comparisonResult.target, "new").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "new").length === 0);
        assert(getTablesWithStatus(comparisonResult.source, "deleted").length === 0);
        assert(getTablesWithStatus(comparisonResult.source, "deleted").length === 0);
        assert(getTablesWithStatus(comparisonResult.target, "skip").length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, "skip").length === 4);
        assert(getColumnsWithStatus(comparisonResult.target, "typeChanged").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "addReference").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "removeReference").length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, "changeReference").length === 0);
    });
    it('test-columns-remove', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["connection", "userName", "connection"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;
        proxyScoped.baseDB.product.table;
        proxyScoped.baseDB.product.id.column.int;
        proxyScoped.baseDB.product.id.primary;
        proxyScoped.baseDB.product.name.column.string;

        let sqlCreator = new db(proxyScoped.baseDB._mysqlAssignable.dbInfo);
        let comparisonResult = sqlCreator.runMigrationComparison(proxy.baseDB._mysqlAssignable.dbInfo);
        assert(getTablesWithStatus(comparisonResult.target, "new").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "new").length === 0);
        assert(getTablesWithStatus(comparisonResult.source, "deleted").length === 0);
        assert(getColumnsWithStatus(comparisonResult.source, "deleted").length === 2);
        assert(getTablesWithStatus(comparisonResult.target, "skip").length === 2);
        assert(getColumnsWithStatus(comparisonResult.target, "skip").length === 3);
        assert(getColumnsWithStatus(comparisonResult.target, "typeChanged").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "addReference").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "removeReference").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "changeReference").length === 0);
    });
    it('test-table-column-remove', function () {
        let proxyScoped = willCoreProxy.new();
        proxyScoped.baseDB.mysql = ["connection", "userName", "connection"];
        proxyScoped.baseDB.user.table;
        proxyScoped.baseDB.user.id.column.int;
        proxyScoped.baseDB.user.id.primary;

        let sqlCreator = new db(proxyScoped.baseDB._mysqlAssignable.dbInfo);
        let comparisonResult = sqlCreator.runMigrationComparison(proxy.baseDB._mysqlAssignable.dbInfo);
        assert(getTablesWithStatus(comparisonResult.target, "new").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "new").length === 0);
        assert(getTablesWithStatus(comparisonResult.source, "deleted").length === 1);
        assert(getColumnsWithStatus(comparisonResult.source, "deleted").length === 1);
        assert(getTablesWithStatus(comparisonResult.target, "skip").length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, "skip").length === 1);
        assert(getColumnsWithStatus(comparisonResult.target, "typeChanged").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "addReference").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "removeReference").length === 0);
        assert(getColumnsWithStatus(comparisonResult.target, "changeReference").length === 0);
    });
});

function getTablesWithStatus(dbInfo, status) {
    return dbInfo && dbInfo.tableList ? dbInfo.tableList.filter(x => x.status === status) : [];
}

function getColumnsWithStatus(dbInfo, status) {
    return dbInfo.tableList.reduce((accumulator, table)=>{
        table.columnList.forEach(col=>{
            accumulator.push(col);
        });
        return accumulator;
    },[]).filter(x => x.status === status);
}