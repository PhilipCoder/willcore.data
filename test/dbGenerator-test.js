const assert = require('chai').assert;
const rewiremock = require('rewiremock/node');
const mocks = require("./mocks/dbGenerator-mocks.js");
const willCoreProxy = require("../proxies/willCore/willCoreProxy.js");
const status = require("../sqlGeneration/migration/statusEnum.js");
const sqlResults = require("./mocks/sqlResults.js");

describe('dbGenerator-test', function () {
    it('test-get-comparison-info', function () {
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.migrationSourceStub);
        rewiremock.enable(); 
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.defaultTwoTableDBFactory());
        let comparisonTarget = dbGenerator.comparisonInfo;
        assert(dbGenerator.getTablesWithStatus(status.skip).length === 2 );
        rewiremock.disable();
    });
    it('test-get-new-db-sql', function () {
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.emptyMigrationSource);
        rewiremock.enable(); 
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.defaultTwoTableDBFactory());
        assert(dbGenerator.sql === sqlResults.getNewDBSql, "New DB sql incorrect" );
        rewiremock.disable();
    });
    it('test-no-changes', function () {
        rewiremock(() => require("../sqlGeneration/migration/migrationSource.js")).with(mocks.migrationSourceStub);
        rewiremock.enable(); 
        const dbGenerator = new (require("../sqlGeneration/dbGenerator.js"))(mocks.defaultTwoTableDBFactory());
        assert(dbGenerator.sql === sqlResults.noChangeSQL, "No change sql incorrect" );
        rewiremock.disable();
    });
});