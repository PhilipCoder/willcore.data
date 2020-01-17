const assert = require('chai').assert;
const mocks = require("./mocks/dbGenerator-mocks.js");
const migrationSetup = require("../assignables/mysql/setup/dbMigrationSetup.js");
const willCoreProxy = require("../proxies/willCore/willCoreProxy.js");
const users = require("./mocks/jsonTestData/userAccount.json");
const carMakes = require("./mocks/jsonTestData/carMakes.json");
const cars = require("./mocks/jsonTestData/cars.json");

describe('mysql-migration-end-to-end', function () {
    before(async function () {
        this.timeout(10000);
        migrationSetup.migrationTablesEnabled = true;
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

        // let queryDB = proxy.cars.queryDB;

        // queryDB.person["+"] = users;
        // await queryDB.save();
        // queryDB.carMake["+"] = carMakes;
        // await queryDB.save();
        // queryDB.car["+"] = cars;
        // await queryDB.save();
    });
    // after(function () {
    //     migrationSetup.migrationTablesEnabled = false;
    // });
    it('add-column', async function () {
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
        proxy.cars.car.additionalDetails.column.text;
        //make relation
        proxy.cars.car.make = proxy.cars.carMake.id;
        proxy.cars.carMake.cars = proxy.cars.car.make;
        //owner relation
        proxy.cars.car.owner = proxy.cars.person.id;
        proxy.cars.person.cars = proxy.cars.car.owner;
        //creates db
        await proxy.cars.init();
    });
    it('add-column-foreign-key', async function () {
       
    });
    it('add-table', async function () {
        
    });
    it('reference-add', async function () {
        
    });
    it('drop-column', async function () {
       
    });
    it('drop-column-foreign-key', async function () {
        
    });
    it('drop-table', async function () {
       
    });
    it('reference-remove', async function () {
        
    });

});