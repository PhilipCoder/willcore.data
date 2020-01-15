class migrationSource{
    static getSource(dbName){
        let dbExistsSQL = `SET @dbExists =  EXISTS( SELECT SCHEMA_NAME
            FROM INFORMATION_SCHEMA.SCHEMATA
           WHERE SCHEMA_NAME = '${dbName}');
           
           SELECT @dbExists dbExists`;

           let dbMigrationSource = ` SELECT 
           migrationState 
        FROM 
            ${dbName}.migration 
        ORDER BY ID DESC 
        LIMIT 1;`;
        return {};
    }
}

module.exports = migrationSource;