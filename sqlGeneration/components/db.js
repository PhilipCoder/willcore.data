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
   
}

module.exports = db;