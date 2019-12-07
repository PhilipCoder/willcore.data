const keywords = require("./mySQLConstants.js").keywords;
const column = require("./column.js");

class table{
    constructor(tableInfo){
        this.tableInfo = tableInfo;
    }
    getSQL(){
        let columnList = this.tableInfo.columnList || this.tableInfo.columns;
        if (!this.tableInfo.exists && columnList.length > 0){
            let columnsString = columnList.map(x=>new column(x).getSQL()).join(",\n");
            return `\n${keywords.createTable.createComment}\n${keywords.createTable.createStatement} \`${this.tableInfo.name}\` (\n${columnsString}\n) ${keywords.createTable.engineStatement};`;
        }
        else{
            return '';
        }
    }
}

module.exports = table;