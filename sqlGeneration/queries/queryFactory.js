const queryAble = require("../queries/queryable.js")
const query = require("../../sqlGeneration/queries/queryGenerator.js");
const selectGenerator = require("../../sqlGeneration/sqlGenerator/selectGenerator.js");
const joinGenerator = require("../../sqlGeneration/sqlGenerator/joinGenerator.js");
const whereGenerator = require("../../sqlGeneration/sqlGenerator/whereGenerator.js");
const queryExecutor = require("../../sqlExecutor/runQuery.js");
const entityMapper = require("../../proxies/entities/proxyMapper.js");

class queryFactory {
    constructor(db, table) {
        this.db = db;
        this.table = table;
    }
    getQuery() {
        this.generator = new (require("../dbGenerator.js"))(this.db);
        this.generator.dropDB = true;
        this.generator.sql;
        this.dbInfo = this.generator._comparisonTarget;
        this.runQuery.bind(this);
        this.queryAble = queryAble.get(this.dbInfo, this.table, this);
        this.queryAble.runFunc = this.runQuery;
        return this.queryAble;
    }
    getCalculationValues() {
        let queryValues = this.queryAble.getValues();
        let selectQuery = new query(this.dbInfo, this.table);
        let joinObj = selectQuery.getJoinObj(queryValues.select.selectParts, queryValues.filter.parts);
        let joinTree = selectQuery.getJoinTree(joinObj);
        this.calulationValues = {
            joinTree: joinTree,
            selects: joinObj.selects,
            tableAliases: joinObj.tableAliases,
            queryNodes: joinObj.queryNodes
        };
        return this.calulationValues;
    }
    getSQL() {
        let calculationValues = this.getCalculationValues();
        let selectSQL = selectGenerator.getSQL(calculationValues.selects);
        let joinSQL = joinGenerator.getSQL(calculationValues.joinTree);
        let whereSQL = whereGenerator.getSQL(calculationValues.queryNodes);
        let fullSQL = selectSQL + joinSQL + whereSQL;
        return fullSQL;
    }
    runQuery() {
        return new Promise(async (resolve, reject) => {
            let sql = this.getSQL();
            let results = await queryExecutor.runQuery(sql, []);
            let mapper = new entityMapper(this.db._mysqlAssignable.dbInfo);
            let entities = mapper.mapValues(results);
            console.log(sql);
            resolve(entities);
        });
    }
}

module.exports = queryFactory;