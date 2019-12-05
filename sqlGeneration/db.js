const keywords = require("./mySQLConstants.js").keywords;
const table = require("./table.js");

class db {
    constructor(dbInfo) {
        this.dbInfo = dbInfo;
    }
    getSQL() {
        let result = '';
        if (!this.dbInfo.exists) {
            result = `${keywords.createDB.createComment}\n${keywords.createDB.createStatement} ${this.dbInfo.name};\n`;
        }
        result += `${keywords.createDB.useStatement} ${this.dbInfo.name};`;
        if (this.dbInfo.tables.length > 0) {
            result = result + this.dbInfo.tables.map(x => new table(x).getSQL()).join("\n");
        }
        return result;
    }

    /*
    If Comparison source is passed in, the DB exists else if undefined, it creates the db.
    Step 1, get new or modified tables and columns.
        Loop through the target's (this) tables and check if the table exists on the source. If it does not exist, leave unmodified and skip to the next table, this is a new table.
        If it does exists, mark the status as skip.
        Tables can only be created or dropped.
        If it does exist, declare a counter property and start looping. 
        Step 2: mark the columns new
    */
    runMigrationComparison(source) {
        if (source && source.name !== this.dbInfo.name) {
            return "DB names does not match.";
        }
        let dbInfo = {};
        Object.assign(dbInfo, this.dbInfo);
        if (!source) {
            dbInfo.status = "new";
            return { target:  this.getDBCopyObj(this.dbInfo,"new") };;
        }
        let sourceDBTables = this.getDBCopyObj(source);
        let targetDBTables = this.getDBCopyObj(this.dbInfo);

        //New tables
        targetDBTables.tableList.forEach(currentTargetTable => {
            let currentSourceTable = sourceDBTables.tables[currentTargetTable.name];
            if (!currentSourceTable) {
                currentTargetTable.status = "new";
                currentTargetTable.columnList.forEach(targetColumn => {
                    targetColumn.status = "new";
                });
            } else {
                let modifiedColumnCounter = 0;
                currentTargetTable.columnList.forEach(targetColumn => {
                    let sourceColumn = currentSourceTable.columns[targetColumn.name];
                    if (!sourceColumn) {
                        modifiedColumnCounter++;
                        targetColumn.status = "new";
                    } else {
                        if (sourceColumn.type !== targetColumn.type ||
                            (Array.isArray(targetColumn.size) && targetColumn.size.filter((x, i) => targetColumn.size[i] !== sourceColumn.size[i]).length !== 0) ||
                            (!Array.isArray(targetColumn.size) && targetColumn.size !== sourceColumn.size)) {
                            modifiedColumnCounter++;
                            targetColumn.status = "typeChanged";
                        } else if (targetColumn.reference && !sourceColumn.reference) {
                            modifiedColumnCounter++;
                            targetColumn.status = "addReference";
                        } else if (!targetColumn.reference && sourceColumn.reference) {
                            modifiedColumnCounter++;
                            targetColumn.status = "removeReference";
                        } else if (targetColumn.reference && sourceColumn.reference && (sourceColumn.reference.column !== targetColumn.reference.column || sourceColumn.reference.table !== targetColumn.reference.table)) {
                            modifiedColumnCounter++;
                            targetColumn.status = "changeReference";
                        }
                        else {
                            targetColumn.status = "skip";
                        }
                    }

                });
                currentTargetTable.status = modifiedColumnCounter === 0 ? "skip" : "modified";
            }
        });
        //Deleted tables
        sourceDBTables.tableList.forEach(currentSourceTable => {
            let currentTargetTable = targetDBTables.tables[currentSourceTable.name];
            if (!currentTargetTable) {
                currentSourceTable.status = "deleted";
            } else {
                currentSourceTable.columnList.forEach(sourceColumn => {
                    let targetColumn = currentTargetTable.columns[sourceColumn.name];
                    if (!targetColumn) {
                        sourceColumn.status = "deleted";
                    }
                });
            }
        });
        return { source: sourceDBTables, target: targetDBTables };
    }

    getDBCopyObj(source,status) {
        let dbInfo = {};
        Object.assign(dbInfo, source);
        dbInfo.tables = {};
        dbInfo.tableList = [];
        source.tables.forEach(t => {
            let sourceTable = {};
            Object.assign(sourceTable, t);
            sourceTable.columns = {};
            if (status){
                sourceTable.status = status;
            }
            sourceTable.columnList = [];
            t.columns.forEach(c => {
                let sourceColumn = {};
                Object.assign(sourceColumn, c);
                sourceTable.columns[c.name] = sourceColumn;
                if (status){
                    sourceColumn.status = status;
                }
                sourceTable.columnList.push(sourceColumn);
            });
            dbInfo.tables[t.name] = sourceTable;
            dbInfo.tableList.push(sourceTable);
        });
        return dbInfo;
    }

    objectsSame(source, target) {
        let same = typeof source === "object" && typeof target === "object";
        if (same) {
            same = Object.keys(source).filter(x => typeof source[x] !== "object" && source[x] !== target[x]).length === 0 &&
                Object.keys(target).filter(x => typeof target[x] !== "object" && target[x] !== source[x]).length === 0
        }
        return same;
    }
}

module.exports = db;