const keywords = require("./mySQLConstants.js").keywords;

class db{
    constructor(dbInfo){
        this.dbInfo = dbInfo;
    }
    getSQL(){
        if (!this.dbInfo.exists){
            return `${keywords.createDB.createComment}\n${keywords.createDB.createStatement} ${this.dbInfo.name};\n${keywords.createDB.useStatement} ${this.dbInfo.name};`;
        }
        else{
            return '';
        }
    }
}

module.exports = db;