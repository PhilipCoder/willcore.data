const willCoreProxy = require("../willCoreProxy.js");
const assert = require('chai').assert;

describe('mysql-query-test', function () {
    it('test-arrow-function-parameter-renaming', async function () {
        let proxyInstance = willCoreProxy.new();
        proxyInstance.jurgDemoDB.mysql = ["127.0.0.1","root","mySQLPassword01"];
        proxyInstance.jurgDemoDB.users.table;
        proxyInstance.jurgDemoDB.users.id.column.int;
        proxyInstance.jurgDemoDB.users.id.primary;
        proxyInstance.jurgDemoDB.users.name.column.string;
        proxyInstance.jurgDemoDB.users.name.index;
        proxyInstance.jurgDemoDB.users.email.column.string;
        proxyInstance.jurgDemoDB.product.table;
        proxyInstance.jurgDemoDB.product.id.column.int;
        proxyInstance.jurgDemoDB.product.id.primary;
        proxyInstance.jurgDemoDB.product.name.column.string;
        proxyInstance.jurgDemoDB.product.description.column.string;
        proxyInstance.jurgDemoDB.product.buyer = proxyInstance.jurgDemoDB.users.id;
        await proxyInstance.jurgDemoDB.init(true);
        let db = proxyInstance.jurgDemoDB.queryDB;
        let newUserA = {name:"john",email:"aaa@gmail.com"};
        let newUserB = {name:"doe",email:"bbbb@gmail.com"};
        db.users["+"] = [newUserA,newUserB];
        await db.save();
        let john = await db.users.filter((user) => user.name === "john")()
        assert(john.length === 1);
        assert(john[0].name === "john");

    });

});