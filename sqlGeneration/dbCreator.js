const keywords = require("./mySQLConstants.js");

class dbCreator{
    constructor(dbInfo){
        this.dbInfo = dbInfo;
    }
    getSQL(){
        if (!this.dbInfo.exists){
            return `${keywords.createDB.createComment}\n; ${keywords.createDB.createStatement} ${this.dbInfo.name};\n`;
        }
    }
}