const queryAble = require("../queries/queryable.js")
const query = require("../../sqlGeneration/queries/queryGenerator.js");

class queryFactory{
    constructor(db,table){
        this.db = db;
        this.table = table;
    }
    getQuery(){
        this.generator = new ( require("../dbGenerator.js"))(this.db);
        this.generator.dropDB = true;
        this.generator.sql;
        this.dbInfo = this.generator._comparisonTarget;
        this.queryAble = queryAble.get(this.dbInfo,this.table);
        return this.queryAble;
    }
    getCalculationValues(){
        let queryValues = this.queryAble.getValues();
        let selectQuery = new query(this.dbInfo, this.table);
        let joinObj =  selectQuery.getJoinObj(queryValues.select.selectParts, queryValues.filter.parts);
        let joinTree = selectQuery.getJoinTree(joinObj);
        this.calulationValues = {
            joinTree:joinTree,
            selects:joinObj.selects,
            tableAliases : joinObj.tableAliases,
            queryNodes: joinObj.queryNodes
        };
        return this.calulationValues;
    }
    
}

module.exports = queryFactory;