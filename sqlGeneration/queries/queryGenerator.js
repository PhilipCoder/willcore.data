/**
 * Creates query SQL
 */
class queryGenerator{
    constructor(dbInfo){
        this.dbInfo = dbInfo;
    }

    generateInsert(tableName, values){
        const getInsertRowValues = () => {
            let valuesToInsert = [];
        let table = this.dbInfo.tables[tableName];
        for (key in values){
            if (table.columns[key]){
                valuesToInsert.push({field:key, value:values[key]});
            }
        }
    };
        
    }

}