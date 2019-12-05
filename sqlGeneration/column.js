const keywords = require("./mySQLConstants.js").keywords;
const typeMappings =require("./mySQLConstants.js").typeMappings;

class column {
    constructor(columnInfo){
        this.columnInfo = columnInfo;
    }

    getSQL(){
        if (this.columnInfo.primary){
            return this.getPrimaryKey();
        }else if (this.columnInfo.reference){
            return this.getForeignKey();
        }else{
            return this.getColumn();
        }
    }

    getColumn(){
        return `\`${this.columnInfo.name}\` ${this.getSQLType(this.columnInfo.type, this.columnInfo.size)} null`;
    }

    getPrimaryKey(){
        return `\`${this.columnInfo.name}\` ${this.getSQLType(this.columnInfo.type, this.columnInfo.size)} ${keywords.createColumn.primaryKey}`;
    }

    getForeignKey(){
        let indexName = `${this.columnInfo.reference.thisTable}_${this.columnInfo.name}_${this.columnInfo.reference.table}_${this.columnInfo.reference.column}`;
        return this.getColumn() + `,\n${keywords.createColumn.index} ${indexName}(${this.columnInfo.name}),\n` +
        `${keywords.createColumn.foreignKey} (${this.columnInfo.name}) ${keywords.createColumn.reference} ${this.columnInfo.reference.table}(${this.columnInfo.reference.column}) ${keywords.createColumn.keyDelete}`;
    }

    getSQLType(name, typeSize){
        let typeMapping = typeMappings[name];
        if (typeMapping){
            let size = typeSize || typeMapping.defaultSize;
            let hasSize = typeMapping.resizeAble && size;
            let sqlSize = hasSize ? Array.isArray(size) ? `(${size.join(",")})` : `(${size})` : "";
            return `${typeMapping.dbType}${sqlSize}`;
        }else{
            throw `No MySQL type mapping for type ${name} found.`;
        }
    }
}

module.exports = column;