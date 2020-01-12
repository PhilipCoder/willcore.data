const assert = require('chai').assert;
const rewiremock = require('rewiremock/node');
const mocks = require("./mocks/dbGenerator-mocks.js");
const migrationSetup = require("../assignables/mysql/setup/dbMigrationSetup.js");
const willCoreProxy = require("../proxies/willCore/willCoreProxy.js");
const users = require("./mocks/jsonTestData/userAccount.json");
const carMakes = require("./mocks/jsonTestData/carMakes.json");
const cars = require("./mocks/jsonTestData/cars.json");

describe('mysql-car-db-test', function () {
    let db = null;
    before(async function () {
        this.timeout(10000);
        migrationSetup.migrationTablesEnabled = true;
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
        rewiremock.enable();
        //defines db
        let proxy = willCoreProxy.new();
        proxy.cars.mysql = ["127.0.0.1", "root", "Bandit1250s"];
        //defines person table
        proxy.cars.person.table;
        proxy.cars.person.id.column.int;
        proxy.cars.person.id.primary;
        proxy.cars.person.firstName.column.string;
        proxy.cars.person.lastName.column.string;
        proxy.cars.person.email.column.string;
        proxy.cars.person.gender.column.string;
        proxy.cars.person.ipAddress.column.string;
        proxy.cars.person.dateCreated.column.date;
        //defines car make table
        proxy.cars.carMake.table;
        proxy.cars.carMake.id.column.int;
        proxy.cars.carMake.id.primary;
        proxy.cars.carMake.name.column.string;
        //defines cars table
        proxy.cars.car.table;
        proxy.cars.car.id.column.int;
        proxy.cars.car.id.primary;
        proxy.cars.car.model.column.string;
        proxy.cars.car.year.column.int;
        proxy.cars.car.color.column.string;
        proxy.cars.car.price.column.decimal;
        //make relation
        proxy.cars.car.make = proxy.cars.carMake.id;
        proxy.cars.carMake.cars = proxy.cars.car.make;
        //owner relation
        proxy.cars.car.owner = proxy.cars.person.id;
        proxy.cars.person.cars = proxy.cars.car.owner;

        //creates db
        await proxy.cars.init(true);

        proxy.cars.person["+"] = users;
        await proxy.cars.save();
        proxy.cars.carMake["+"] = carMakes;
        await proxy.cars.save();
        proxy.cars.car["+"] = cars;
        await proxy.cars.save();
        db = proxy;
    });
    after(function () {
        rewiremock.disable();
        migrationSetup.migrationTablesEnabled = false;
    });
    it('db-test-sort-asc', async function () {
        let carResults = await db.cars.car.include((car) => car.make).sort((car) => car.make.name)();
        let previousEntry = "Aston Martin";
        assert(carResults.length === cars.length, "Not all car entries were retrieved.");
        carResults.forEach(car => {
            assert(car.make[0].name >= previousEntry, "Sorting failed.");
            previousEntry = car.make[0].name;
        });
    });
    it('db-test-sort-desc', async function () {
        let carResults = await db.cars.car.include((car) => car.make).sort((car) => car.make.name, true)();
        let previousEntry = "Volvo";
        assert(carResults.length === cars.length, "Not all car entries were retrieved.");
        carResults.forEach(car => {
            assert(car.make[0].name <= previousEntry, "Sorting failed.");
            previousEntry = car.make[0].name;
        });
    });
    it('db-test-skip', async function () {
        let allCarResults = await db.cars.car.include((car) => car.make).sort((car) => car.make.name, true)();
        let last100Results = await db.cars.car.include((car) => car.make).skip(900).sort((car) => car.make.name, true)();
        let index = 0;
        for (let i = allCarResults.length - 100; i < allCarResults.length; i++) {
            assert(allCarResults[i].id === last100Results[index].id, "Skipping failed.");
            index++;
        }
    });
    it('db-test-take', async function () {
        let allCarResults = await db.cars.car.include((car) => car.make).sort((car) => car.make.name, true)();
        let first100Results = await db.cars.car.include((car) => car.make).take(100).sort((car) => car.make.name, true)();
        for (let i = 0; i < first100Results.length; i++) {
            assert(allCarResults[i].id === first100Results[i].id, "Taking failed.");
        }
    });
    it('db-test-skip-take', async function () {
        let allCarResults = await db.cars.car.include((car) => car.make).sort((car) => car.make.name, true)();
        let first100Results = await db.cars.car.include((car) => car.make).take(100).skip(100).sort((car) => car.make.name, true)();
        for (let i = 100; i < first100Results.length; i++) {
            assert(allCarResults[i].id === first100Results[i].id, "Skip, taking failed.");
        }
    });
});