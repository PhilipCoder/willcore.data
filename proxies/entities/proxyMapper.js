const entityProxy = require("./entityProxy.js");
class proxyMapper {
    constructor(dbInfo) {
        this.dbInfo = dbInfo;
    }

    mapValues(values) {
        return this.buildProxyTree(values);
    }

    buildProxyTree(values) {
        let container = {};
        let result = [];
        values.forEach(value => {
            let target = entityProxy.newSubProxy();
            for (let key in value) {
                let currentTarget = target;
                let keyParts = key.split(".");
               // let currentTable = this.dbInfo.tables[keyParts[0]];
                for (let treeLevel = 1; treeLevel < keyParts.length - 1; treeLevel++) {
              //      currentTable = this.dbInfo.tables[currentTable.columns[keyParts[treeLevel]].reference.table];
                    let tmpTarget = currentTarget[keyParts[treeLevel]];
                    if (tmpTarget === undefined) {
                        tmpTarget = entityProxy.newSubProxy();
                        currentTarget[keyParts[treeLevel]] = tmpTarget;
                    }
                    currentTarget = tmpTarget
                }
                currentTarget[keyParts[keyParts.length - 1]] = value[key];
                result.push(currentTarget);
            }
        });
        return result;
    }

    getTablePrimary(tableName) {
        let table = this.dbInfo.tableList[tableName];
        if (!table) throw `Table ${tableName} not found for proxy mapper.`;
        let result = table.columnList.filter(x => x.primary);
        if (result.length === 0) throw `Table ${tableName} does not have a primary column.`;
        return result[0];
    }

    
    getDBCopyObj(source,status) {
        let dbInfo = {};
        Object.assign(dbInfo, source);
        dbInfo.tables = {};
        dbInfo.tableList = [];
        if (status){
            dbInfo.status = status;
        }
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
}

module.exports = proxyMapper;