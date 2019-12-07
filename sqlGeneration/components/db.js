const keywords = require("./mySQLConstants.js").keywords;
const table = require("./table.js");
const status = require("../migration/statusEnum.js");

class db {
    constructor(dbInfo) {
        this.dbInfo = dbInfo;
    }
    getSQL() {
        let result = '';
        if (this.dbInfo.status !== status.skip) {
            result = `${keywords.createDB.createComment}\n${keywords.createDB.createStatement} ${this.dbInfo.name};\n`;
        }
        result += `${keywords.createDB.useStatement} ${this.dbInfo.name};`;
        let tables =  this.dbInfo.tableList || this.dbInfo.tables;
        if (tables.length > 0) {
            result = result + tables.filter(x=>x.status !== status.skip ).map(x => new table(x).getSQL()).join("\n");
        }
        return result;
    }
   
}

module.exports = db;