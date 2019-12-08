let addMigrationSetup = true;
class dbMigrationSetup {
    static setupTables(proxy, dbName) {
        if (addMigrationSetup) {
            proxy.migration.table;
            proxy.migration.migrationState.column.string;
            proxy.migration.migrationState.size = 16000;
        }
    }
    static set migrationTablesEnabled(value){
        addMigrationSetup = value;
    }
};

module.exports = dbMigrationSetup;