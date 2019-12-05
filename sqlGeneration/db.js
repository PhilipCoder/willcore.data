const keywords = require("./mySQLConstants.js").keywords;
const table = require("./table.js");

class db{
    constructor(dbInfo){
        this.dbInfo = dbInfo;
    }
    getSQL(){
        let result = '';
        if (!this.dbInfo.exists){
            result = `${keywords.createDB.createComment}\n${keywords.createDB.createStatement} ${this.dbInfo.name};\n${keywords.createDB.useStatement} ${this.dbInfo.name};`;
        }
        if (this.dbInfo.tables.length > 0){
            result = result + this.dbInfo.tables.map(x=>new table(x).getSQL()).join("\n");
        }
        return result;
    }

    runMigrationComparison(source){
        if (!source){
            return;
        }
        if (source.name !== this.dbInfo.name){
            return "DB names does not match.";
        }

        let dbInfo = {};
        Object.assign(dbInfo,this.dbInfo);
        dbInfo.exists = true;
        let sourceDBTables = this.getDBCopyObj(source);
        let targetDBTables = this.getDBCopyObj(this.dbInfo);

        //New tables
        targetDBTables.tables.foreach(t=>{
            if (sourceDBTables.tables[t.name]){
                sourceDBTables.tables[t.name].alter = true;
                let targetTable = sourceDBTables.tables[t.name];
                sourceDBTables.tables[t.name].columns.foreach(c=>{
                  if (c)
                });
            }
        });
        
    }

    getDBCopyObj(source){
        let dbInfo = {};
        Object.assign(dbInfo,source);
        dbInfo.tables = {};
        source.tables.forEach(t=>{
            let sourceTable = {};
            Object.assign(sourceTable,t);
            sourceTable.columns = {};
            t.columns.forEach(c=>{
                let sourceColumn = {};
                Object.assign(sourceColumn,c);
                sourceTable.columns[c.name] = sourceColumn
            });
            dbInfo.tables[t.name] = sourceTable;
        });
        return dbInfo;
    }
}

module.exports = db;