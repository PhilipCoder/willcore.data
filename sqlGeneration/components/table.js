const keywords = require("./mySQLConstants.js").keywords;
const column = require("./column.js");

class table{
    constructor(tableInfo){
        this.tableInfo = tableInfo;
    }
    getSQL(){
        if (!this.tableInfo.exists && this.tableInfo.columns.length > 0){
            let columnsString = this.tableInfo.columns.map(x=>new column(x).getSQL()).join(",\n");
            return `\n${keywords.createTable.createComment}\n${keywords.createTable.createStatement} \`${this.tableInfo.name}\` (\n${columnsString}\n) ${keywords.createTable.engineStatement};`;
        }
        else{
            return '';
        }
    }
}

module.exports = table;