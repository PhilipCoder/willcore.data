const migrationComparitor = require("./migration/migrationComparitor.js");
const db = require("./components/db.js");
const migrationSource = require("./migration/migrationSource.js");
const dbStatus = require("../sqlGeneration/migration/statusEnum.js");
const mysql = require("mysql2/promise");
const queryExecutor = require("../sqlExecutor/runQuery.js");
/**
 * Core DB / Migration class.
 */
class dbGenerator {
    /**
     * @param {assignable} mySqlAssignable 
     */
    constructor(mySqlProxy) {
        this._dbInfo = mySqlProxy._mysqlAssignable.dbInfo;
        this._comparisonInfo = null;
        this._comparisonTarget = null;
        this._comparisonSource = null;
        this._dropDB = false;
    }

    get dropDB() {
        return this._dropDB;
    }

    set dropDB(value) {
        this._dropDB = value;
    }

    get dbInfo() {
        return this._dbInfo;
    }

    get comparisonInfo() {
        this._comparisonInfo = this._comparisonInfo || require("./migration/migrationSource.js").getSource(this.dbInfo.name);
        return this._comparisonInfo;
    }

    get comparisonTarget() {
        privateLogic.assignComparisonValues.call(this);
        return this._comparisonTarget;
    }

    get comparisonSource() {
        privateLogic.assignComparisonValues.call(this);
        return this._comparisonSource;
    }

    get sql() {
        return new db(this.comparisonTarget, this.comparisonSource, this._dropDB).getSQL();
    }

    getSQL() {
        return new db(this.comparisonTarget, this.comparisonSource, this._dropDB).getSQL();
    }

    generateDB() {
        return new Promise(async (resolve, reject) => {
            await queryExecutor.initDB(this._dbInfo.connectionString, this._dbInfo.userName, this._dbInfo.password,this._dbInfo.name);
            let result = queryExecutor.execute(this.sql);
            resolve(result);
        });
    }

    getTablesWithStatus(status) {
        if (status === dbStatus.deleted) {
            return this.comparisonSource.tableList.filter(x => x.status === status || !status);
        }
        return this.comparisonTarget.tableList.filter(x => x.status === status || !status);
    }

    getColumnsWithStatus(status) {
        if (status === dbStatus.deleted) {
            return privateLogic.getColumnsWithStatus.call(this, this.comparisonSource, status);
        }
        return privateLogic.getColumnsWithStatus.call(this, this.comparisonTarget, status);
    }
}


/**
 * privateLogic logic method used in the dbGenerator class
 * @privateLogic
 * @constant
 */
const privateLogic = {
    assignComparisonValues: function () {
        if (!this._comparisonTarget) {
            let result = migrationComparitor.runMigrationComparison(this.comparisonInfo, this.dbInfo);
            this._comparisonTarget = result.target;
            this._comparisonSource = result.source;
        }
    },
    getColumnsWithStatus: function (data, status) {
        return data.tableList.reduce((accumulator, table) => {
            table.columnList.forEach(column => {
                accumulator.push({ table, column });
            });
            return accumulator;
        }, []).filter(x => x.status === status || !status);
    }
};

module.exports = dbGenerator;