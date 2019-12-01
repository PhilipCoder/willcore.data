const assert = require('chai').assert;
const willCoreProxyHandler = require("../proxies/willCore/willCoreProxyHandler.js");
const willCoreProxy = require("../proxies/willCore/willCoreProxy.js");
const assignable = require("../assignables/assignable.js");
const intermediateAssignableProxy = require("../proxies/intermediateAssignable/intermediateAssignableProxy.js");
const willCoreModules = require("../willCoreModules.js");

class testAssingable extends assignable {
    constructor() {
        super({ string: 3 }, willCoreProxy);
        this.isCompletedAssignment = false;
        this.result = undefined;
    }
    completionResult() {
        return this.result;
    }
    completed() {
        console.log("completed");
        this.isCompletedAssignment = true;
    }
}

class testAssingableObj extends assignable {
    constructor() {
        super({ string: 3, object: 1 }, willCoreProxy);
    }
    completionResult() {
        return this.bindedValues;
    }
    completed() {
    }
}

describe('willCoreProxyHandler', function () {
    willCoreModules.assignables.testAssingableObj = () => testAssingableObj;
    willCoreModules.assignables.testAssingable = () => testAssingable;
    it('exception-invalid-assignment', function () {
        let proxyHandler = new willCoreProxyHandler();
        let proxy = new Proxy({}, proxyHandler);
        //    assert.throws(() => { proxy.one = 5 });
    });
    it('assignable-assignment-invalid-target-type', function () {
        let proxyHandler = new willCoreProxyHandler();
        let proxy = new Proxy({}, proxyHandler);
        assert.throws(() => proxy.myDB = testAssingable, "Invalid target proxy type for the assignable!");
    });
    it('willCore-factory', function () {
        let proxy = willCoreProxy.new();
        assert(proxy instanceof willCoreProxy, "The factory method did not return an instance of willCoreProxy");
        proxy.myDB = testAssingable;
        assert(proxy.myDB instanceof testAssingable);
    });
    it('willCore-assignment-complete', function () {
        let proxy = willCoreProxy.new();
        assert(proxy instanceof willCoreProxy, "The factory method did not return an instance of willCoreProxy");
        proxy.myDB = testAssingable;
        let myDB = proxy.myDB;
        proxy.myDB = "one";
        proxy.myDB = "two";
        assert.isFalse(myDB.isCompletedAssignment, "Assingmet should not be completed");
        proxy.myDB = "three";
        assert.isTrue(myDB.isCompletedAssignment, "Assingmet should not be completed");
    });
    it('willCore-assignment-complete-undefined-result', function () {
        let proxy = willCoreProxy.new();
        proxy.myDB = testAssingable;
        proxy.myDB = "one";
        proxy.myDB = "two";
        proxy.myDB = "three";
        assert(proxy.myDB instanceof testAssingable, "The assignable is not of a mysql type");
    });
    it('willCore-assignment-complete-false-result', function () {
        let proxy = willCoreProxy.new();
        proxy.myDB = testAssingable;
        proxy.myDB.result = false;
        proxy.myDB = "one";
        proxy.myDB = "two";
        proxy.myDB = "three";
        assert(proxy.myDB instanceof intermediateAssignableProxy, "The assignable is not removed");
    });
    it('willCore-assignment-complete-assigned-result', function () {
        let proxy = willCoreProxy.new();
        proxy.myDB = testAssingable;
        proxy.myDB.result = proxy.myDB.bindedValues;
        proxy.myDB = "one";
        proxy.myDB = "two";
        proxy.myDB = "three";
        assert(typeof proxy.myDB === "object", "The assignable is not an object.");
        assert(Object.keys(proxy.myDB).length === 1, "Assigned values are incorrect");
        assert(proxy.myDB["string"].length === 3, "Assigned values are incorrect");
        assert(proxy.myDB["string"][0] === "one" && proxy.myDB["string"][1] === "two" && proxy.myDB["string"][2] === "three", "Assigned values are incorrect");
    });
    it('willCore-assignment-property-return-intermediateAssignableProxy', function () {
        let proxy = willCoreProxy.new();
        let assignableProxy = proxy.myDB;
        assert(assignableProxy instanceof intermediateAssignableProxy, "An intermediateAssignableProxy was not returned.");
    });
    it('willCore-assignment-property-assign-assignable', function () {
        willCoreModules.assignables.testAssingable = () => testAssingable;
        let proxy = willCoreProxy.new();
        proxy.myDB.testAssingable;
        assert(proxy.myDB instanceof testAssingable, "Assignable instance not created.");
    });
    it('willCore-assignment-property-assign-values', function () {
        let proxy = willCoreProxy.new();
        proxy.myDB.testAssingableObj.one.two.three = { testing: 20 };
        assert(typeof proxy.myDB === "object", "The assignable is not an object.");
        assert(Object.keys(proxy.myDB).length === 2, "Assigned values are incorrect");
        assert(proxy.myDB["string"].length === 3, "Assigned values are incorrect");
        assert(proxy.myDB["string"][0] === "one" && proxy.myDB["string"][1] === "two" && proxy.myDB["string"][2] === "three", "Assigned values are incorrect");
        assert(proxy.myDB["object"].length === 1, "Assigned values are incorrect");
        assert(proxy.myDB["object"][0].testing === 20, "Assigned values are incorrect");
    });

    it('willCore-assignment-property-assign-array', function () {
        let proxy = willCoreProxy.new();
        proxy.myDB = [testAssingableObj, "one", "two", "three", { testing: 20 }];
        assert(typeof proxy.myDB === "object", "The assignable is not an object.");
        assert(Object.keys(proxy.myDB).length === 2, "Assigned values are incorrect");
        assert(proxy.myDB["string"].length === 3, "Assigned values are incorrect");
        assert(proxy.myDB["string"][0] === "one" && proxy.myDB["string"][1] === "two" && proxy.myDB["string"][2] === "three", "Assigned values are incorrect");
        assert(proxy.myDB["object"].length === 1, "Assigned values are incorrect");
        assert(proxy.myDB["object"][0].testing === 20, "Assigned values are incorrect");
    });
    it('willCore-assignment-property-assign-direct', function () {
        let proxy = willCoreProxy.new();
        console.log(proxy);
        proxy._name = "philip";
        assert(proxy._name === "philip", "Assigned values are incorrect");
    });
})
