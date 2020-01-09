const assert = require('chai').assert;
const rewiremock = require('rewiremock/node');
const mocks = require("./mocks/dbGenerator-mocks.js");
const migrationSetup = require("../assignables/mysql/setup/dbMigrationSetup.js");
const willCoreProxy = require("../proxies/willCore/willCoreProxy.js");
const users = require("./mocks/jsonTestData/userAccount.js");
const carMakes = require("./mocks/jsonTestData/carMakes.js");
const cars = require("./mocks/jsonTestData/cars.js");

describe('mysql-car-db-test', function () {
    let db = null;
    before(function () {
        return new Promise(async (resolve, reject) => {
            migrationSetup.migrationTablesEnabled = true;
            rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
            rewiremock.enable();
            //defines db
            let proxy = willCoreProxy.new();
            proxy.cars.mysql = ["localhost", "root", "Bandit1250s"];
            //defines person table
            proxy.cars.person.table;
            proxy.cars.person.id.column.int;
            proxy.cars.person.id.primary;
            proxy.cars.person.firstName.column.string;
            proxy.cars.person.lastName.column.string;
            proxy.cars.person.email.column.string;
            proxy.cars.person.gender.column.string;
            proxy.cars.person.ipAddress.column.string;
            //defines car make table
            proxy.cars.carMake.table;
            proxy.cars.carMake.id.column.int;
            proxy.cars.carMake.id.primary;
            proxy.cars.carMake.name.column.string;
            //defines cars table
            proxy.cars.car.table;
            proxy.cars.car.id.column.int;
            proxy.cars.car.id.primary;
            proxy.cars.car.make = proxy.cars.carMake.id;
            proxy.cars.car.model.column.string;
            proxy.cars.car.year.column.int;
            proxy.cars.car.owner.column.int = proxy.cars.person.id;
            proxy.cars.car.color.column.string;
            proxy.cars.car.price.column.decimal;
            //creates db
            await proxy.cars.init(true);

            proxy.cars.person["+"] = users;
            await proxy.cars.save();
            proxy.cars.carMake["+"] = carMakes;
            await proxy.cars.save();
            proxy.cars.car["+"] = cars;
            await proxy.cars.save();

            rewiremock.disable();
            migrationSetup.migrationTablesEnabled = false;
            resolve();
        });
    });
    it('db-create-end-to-end', async function () {

    });
});