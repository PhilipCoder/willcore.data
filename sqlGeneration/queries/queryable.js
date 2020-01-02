const chainableProxy = require("../../proxies/chainable/chainableProxyHandler.js");
const query = require("../../sqlGeneration/queries/queryGenerator.js");
class queryFactory {
    static get(dbConfig, tableName,queryFactory ) {
        let scopedVariables = {
            dbConfig: dbConfig,
            tableName: tableName,
            includes: {

            },
            filter: {
                filterExpression: null,
                queryScope: null
            },
            select: {
                selectObj: null
            },
            sort: {
                desending: null,
                sortFunc: null
            },
            take: {
                takeCount: null,
                skipCount: null
            }
        };
        /**
         * Query. Executes a query.
         */
        const queryable = function () {
            queryFactory.runQuery.bind(queryFactory);
            return queryFactory.runQuery();
        };

        /**
         * Adds a filter clause to a SQL query.
         */
        queryable.filter = function (filterExpression, queryScope) {
            queryScope = queryScope || {};
            scopedVariables.filter.filterExpression = filterExpression;
            scopedVariables.filter.queryScope = queryScope;
            let selectQuery = new query();
            scopedVariables.filter.parts = selectQuery.filter(filterExpression.toString(), queryScope);
            return queryable;
        };

        /** 
         * Adds a select clause to a SQL query.
        */
        queryable.select = function (selectFunc) {
            scopedVariables.select.selectObj = selectFunc;
            scopedVariables.select.selectParts = scopedVariables.select.selectParts || {};
            let selectObj = selectFunc(chainableProxy.new(scopedVariables.tableName));
            for (let key in selectObj) {
                scopedVariables.select.selectParts[key] = selectObj[key]._name;
            }
            return queryable;
        };

        /**
         * Adds a table to the result of a query.
         */
        queryable.include = function (tableLinkedProxy) {
            if (typeof tableLinkedProxy !== "function") throw "Queryable include function expected a parameter of type function.";
            let proxyChain = chainableProxy.new(scopedVariables.tableName);
            let names = tableLinkedProxy(proxyChain)._name;
            let includeValue = names.join(".");
            scopedVariables.includes[includeValue] = true;
            if (names.length > 0) {
                let table = scopedVariables.dbConfig.tables[names[0]];
                if (!table) throw `Table ${names[0]} does not exist.`;
                for (let nameI = 1; nameI < names.length; nameI++) {
                    let column = table.columns[names[nameI]];
                    if (!column) throw `Table ${table.name} does not have a column ${names[nameI]}.`;
                    if (!column.reference) throw `Column ${names[nameI]} on table ${table.name} does not reference another table.`;
                    table = scopedVariables.dbConfig.tables[column.reference.table];
                    if (!table) throw `Table ${names[nameI]} does not exist.`;
                }
                scopedVariables.select.selectParts = scopedVariables.select.selectParts || {};
                Object.keys(table.columns).map(colName => `${includeValue}.${table.columns[colName].name}`).forEach(key => {
                    scopedVariables.select.selectParts[key] = key.split(".");
                });
            }
            return queryable;
        };

        /**
         * Adds a sort clause to a SQL query
         */
        queryable.sort = function (desending, sortFunc) {
            scopedVariables.sort.desending = desending;
            scopedVariables.sort.sortFunc = sortFunc;
            scopedVariables.sort.sortParts = sortFunc(chainableProxy.new(scopedVariables.tableName))._name;
            return queryable;
        };

        /**
         * Adds a take clause a SQL query
         */
        queryable.take = function (takeCount) {
            scopedVariables.take.takeCount = takeCount;
            return queryable;
        };

        /**
         * Adds a skip clause a SQL query
         */
        queryable.skip = function (skipCount) {
            scopedVariables.take.skipCount = skipCount;
            return queryable;
        };

        /**
         * Gets the SQL of the query
         */
        queryable.toString = function () {
            return "aa";
        }

        queryable.getValues = function () {
            return scopedVariables;
        }

        if (dbConfig.tables) {
            queryable.include((table) => table);
        }
        return queryable;
    }
}
module.exports = queryFactory;