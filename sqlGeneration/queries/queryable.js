const chainableProxy = require("../../proxies/chainable/chainableProxyHandler.js");
const query = require("../../sqlGeneration/queries/queryGenerator.js");
class queryFactory{
    static get(dbConfig,tableName){
        let scopedVariables = {
            dbConfig:dbConfig,
            tableName:tableName,
            filter:{
                filterExpression:null,
                queryScope:null
            },
            select:{
                selectObj:null
            },
            sort:{
                desending:null,
                sortFunc:null
            },
            take:{
                takeCount:null,
                skipCount:null
            }
        };
        /**
         * Query. Executes a query.
         */
        const queryable = function(){
            

        };

        /**
         * Adds a filter clause to a SQL query.
         */
        queryable.filter = function(filterExpression, queryScope){
            scopedVariables.filter.filterExpression = filterExpression;
            scopedVariables.filter.queryScope = queryScope;
            let selectQuery = new query();
            return queryable;
        };

        /** 
         * Adds a select clause to a SQL query.
        */
        queryable.select = function(selectFunc){
            scopedVariables.select.selectObj = selectFunc;
            scopedVariables.select.selectParts = selectFunc(chainableProxy.new(scopedVariables.tableName));
            for (var key in scopedVariables.select.selectParts){
                scopedVariables.select.selectParts[key] = scopedVariables.select.selectParts[key]._name;
            }
            return queryable;
        };

        /**
         * Adds a sort clause to a SQL query
         */
        queryable.sort = function(desending, sortFunc){
            scopedVariables.sort.desending = desending;
            scopedVariables.sort.sortFunc = sortFunc;
            scopedVariables.sort.sortParts = sortFunc(chainableProxy.new(scopedVariables.tableName))._name;
            return queryable;
        };

        /**
         * Adds a take clause a SQL query
         */
        queryable.take = function(takeCount){
            scopedVariables.take.takeCount = takeCount;
            return queryable;
        };

        /**
         * Adds a skip clause a SQL query
         */
        queryable.skip = function(skipCount){
            scopedVariables.take.skipCount = skipCount;
            return queryable;
        };

        /**
         * Gets the SQL of the query
         */
        queryable.toString = function(){
            return "aa";
        }

        queryable.getValues = function(){
            return scopedVariables;
        }
        return queryable;
    }
}
module.exports = queryFactory;