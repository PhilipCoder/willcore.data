const assert = require('chai').assert;
const rewiremock = require('rewiremock/node');
const mocks = require("./mocks/dbGenerator-mocks.js");
const migrationSetup = require("../assignables/mysql/setup/dbMigrationSetup.js");
const contextStateManager = require("../sqlGeneration/state/contextStateManager.js");

describe('context-state-manager-tests', function () {
    migrationSetup.migrationTablesEnabled = false;
    it('test-add-row', function () {
        let manager = new contextStateManager();
        assert(manager.operations.isEmpty(), "Queue should be empty.");
        manager.addRow("person", { name: "John", surname: "Doe", age: 47 });
        assert(manager.operations.isEmpty() === false, "Queue should contain items.");
        let queryObj = manager.operations.dequeue().getSQL();
        assert(manager.operations.isEmpty(), "Queue should be empty.");
        assert(queryObj.sql === "INSERT INTO person SET ? ", "Wrong SQL generated.");
        assert(queryObj.parameter.name === "John", "Wrong query parameter returned.");
    });
    it('test-update-row', function () {
        let manager = new contextStateManager();
        assert(manager.operations.isEmpty(), "Queue should be empty.");
        manager.updateField("person", "name", "Johnny", "id", 32);
        assert(manager.operations.isEmpty() === false, "Queue should contain items.");
        let queryObj = manager.operations.dequeue().getSQL();
        assert(manager.operations.isEmpty(), "Queue should be empty.");
        assert(queryObj.sql === "UPDATE person SET name = ? WHERE id = ?", "Wrong SQL generated.");
        assert(queryObj.parameter[0] === "Johnny", "Wrong query parameter returned.");
        assert(queryObj.parameter[1] === 32, "Wrong query parameter returned.");
    });
    it('test-delete-row', function () {
        let manager = new contextStateManager();
        assert(manager.operations.isEmpty(), "Queue should be empty.");
        manager.deleteRow("person", "id", 32);
        assert(manager.operations.isEmpty() === false, "Queue should contain items.");
        let queryObj = manager.operations.dequeue().getSQL();
        assert(manager.operations.isEmpty(), "Queue should be empty.");
        assert(queryObj.sql === "DELETE FROM person WHERE id = ?", "Wrong SQL generated.");
        assert(queryObj.parameter[0] === 32, "Wrong query parameter returned.");
    });
    it('db-create-with-add-row', async function () {
        migrationSetup.migrationTablesEnabled = true;
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
        rewiremock.enable();
        let myDB = mocks.manyFKCreateDB();
        await myDB.init(true);
        let userA = {name:"Philip"};
        myDB.user.add(userA);
        let userB = {name:"Jurgens"};
        myDB.user.add(userB);
        let userC = {name:"The Great White"};
        myDB.user.add(userC);
        myDB.profile.add({name:"balhaarA",person:1});
        myDB.profile.add({name:"balhaarB",person:1});
        myDB.profile.add({name:"vlooi",person:2});
        await myDB.save();
        let query = await myDB.user.filter((user)=>user.id.equals(2)).include((user)=>user.profiles)();
        rewiremock.disable();
        migrationSetup.migrationTablesEnabled = false;
    });
});