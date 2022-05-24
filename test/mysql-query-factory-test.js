const assert = require('chai').assert;
const migrationSetup = require("../assignables/mysql/setup/dbMigrationSetup.js");
const queryFactory = require("../sqlGeneration/queries/queryFactory.js");
const rewiremock = require('rewiremock/node');
const mocks = require("./mocks/dbGenerator-mocks.js");
const selectGenerator = require("../sqlGeneration/sqlGenerator/selectGenerator.js");
const joinGenerator = require("../sqlGeneration/sqlGenerator/joinGenerator.js");
const whereGenerator = require("../sqlGeneration/sqlGenerator/whereGenerator.js");

describe('mysql-query-factory-test', function () {
    migrationSetup.migrationTablesEnabled = false;
    //---------------------------------------------------
    it('get-query-able', function () {
        migrationSetup.migrationTablesEnabled = true;
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
        rewiremock.enable();

        let factory = new queryFactory(mocks.dbSelectJoin(), "product");
        factory.getQuery().filter((product) =>
            product.name.equals("TV") &&
            product.owner.name.like("Philip") || (
                product.owner.name.notLike("Bella") &&
                product.name.notEquals("Radio") &&
                product.owner.profiles.name.equals(99)
            ), {}).
            include((product) => product.owner).
            include((product) => product.owner.profiles).
            select((product) => ({
                ownerCount: product.owner.count
            }));
        let calculationValues = factory.getCalculationValues();
        rewiremock.disable();
        migrationSetup.migrationTablesEnabled = false;
        let selectSQL = selectGenerator.getSQL(calculationValues.selects);
        let joinSQL = joinGenerator.getSQL(calculationValues.joinTree);
        let whereSQL = whereGenerator.getSQL(calculationValues.queryNodes);
        let fullSQL = selectSQL + joinSQL + whereSQL;
        const targetSQL = "SELECT\n    product.id `product.id`,\n    product.name `product.name`,\n    product_owner.id `product.owner.id`,\n    product_owner.name `product.owner.name`,\n    user_profiles.id `product.owner.profiles.id`,\n    COUNT(user_profiles.name) `product.owner.profiles.name`\nFROM product\n        LEFT JOIN user product_owner ON product.owner = product_owner.id\n        LEFT JOIN profile user_profiles ON product_owner.id = user_profiles.person\nWHERE product.name = 'TV' AND product_owner.name LIKE 'Philip' OR ( product_owner.name NOT LIKE 'Bella' AND product_name.name <> 'Radio' AND product_profiles.name = 99 )";
        assert(fullSQL === targetSQL, "Generated SQL incorrect.");
    });

    it('get-query-able-string', function () {
        migrationSetup.migrationTablesEnabled = true;
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
        rewiremock.enable();

        let factory = new queryFactory(mocks.dbSelectJoin(), "product");
        factory.getQuery().filter("(product) => product.name.equals(\"TV\") && product.owner.name.like(\"Philip\") || ( product.owner.name.notLike(\"Bella\") && product.name.notEquals(\"Radio\") && product.owner.profiles.name.equals(99) )", {}).
            include("(product) => product.owner").
            include("(product) => product.owner.profiles").
            select("(product) => ({ownerCount: product.owner.count})");
        let calculationValues = factory.getCalculationValues();
        rewiremock.disable();
        migrationSetup.migrationTablesEnabled = false;
        let selectSQL = selectGenerator.getSQL(calculationValues.selects);
        let joinSQL = joinGenerator.getSQL(calculationValues.joinTree);
        let whereSQL = whereGenerator.getSQL(calculationValues.queryNodes);
        let fullSQL = selectSQL + joinSQL + whereSQL;
        const targetSQL = "SELECT\n    product.id `product.id`,\n    product.name `product.name`,\n    product_owner.id `product.owner.id`,\n    product_owner.name `product.owner.name`,\n    user_profiles.id `product.owner.profiles.id`,\n    COUNT(user_profiles.name) `product.owner.profiles.name`\nFROM product\n        LEFT JOIN user product_owner ON product.owner = product_owner.id\n        LEFT JOIN profile user_profiles ON product_owner.id = user_profiles.person\nWHERE product.name = 'TV' AND product_owner.name LIKE 'Philip' OR ( product_owner.name NOT LIKE 'Bella' AND product_name.name <> 'Radio' AND product_profiles.name = 99 )";
        assert(fullSQL === targetSQL, "Generated SQL incorrect.");
    });

});