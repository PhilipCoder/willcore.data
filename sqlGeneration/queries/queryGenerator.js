const esprima = require('esprima');
const escodegen = require("escodegen");
const functionMappings = require("./functionMappings.js");

class queryGenerator {
    constructor(db, tableName) {
        this.run = function () { };
        this.db = db;
        this.tableName = tableName;
    }

    getQuerySQL() {

    }
    //steps: 
    //input : "{"product":["product"],"product.owner":["product","user"],"product.details":["product","productDetails"]}"
    /*output: {
        table:"product",
        joins:{
            owner:{
                table:"user",
                left:"details",
                right:"id",
                joins:{

                }
            },
            details:{
                table:"productDetails",
                left:"details",
                right:"id",
                joins:{}
            }
        }
    }*/
    //Loop through the tables
    //case direct reference, example product details
    //right is column product.details
    //left is target of product.details -> productDetails.Id
    //case of indirect reference, example productDetails.products
    //left is the target of the target of productDetails.product : productDetails.product -> product.details -> productDetails.id
    //right is the target of productDetails.product : productDetails.product
    getJoinTree(joinObj) {
        let tableAliases = joinObj.tableAliases;
        let joinDetails = {};
        for (let key in tableAliases) {
            let keyParts = key.split(".");
            let table = null;
            let currentJoinTable = joinDetails;
            let index = 0;
            keyParts.forEach(part => {
                if (table === null) {
                    if (!joinDetails.joins) {
                        joinDetails.table = part;
                        joinDetails.alias = part;
                        joinDetails.joins = {};
                    }
                    table = this.db.tables[part];
                } else if (!currentJoinTable.joins[part]) {
                    let tableName = tableAliases[key][index];
                    let column = table.columns[part];
                    let reference = this.db.tables[column.reference.table].columns[column.reference.column];
                    if (!reference.primary) {
                        column = reference;
                        reference = this.db.tables[column.reference.table].columns[column.reference.column];
                    }
                    currentJoinTable.joins[part] = {
                        joins: {},
                        table: tableName,
                        left: column.name,
                        right: reference.name,
                        alias: `${table.name}_${column.name}`
                    };
                    currentJoinTable = currentJoinTable.joins[part];
                    table = this.db.tables[tableName];
                }else{
                    let tableName = tableAliases[key][index];
                    currentJoinTable = currentJoinTable.joins[part];
                    table = this.db.tables[tableName];
                }
                index++;
            });
        }
        return joinDetails;
    }

    getJoinObj(selectParts, queryParts) {
        let { tableAliases, queryNodes, selects } = this.getSelectJoins(selectParts);
        if (queryParts) {
            this.getWhereJoins(queryParts, tableAliases);
            queryNodes = this.getWhereParts(queryParts, queryNodes);
        }
        return {
            selects: selects,
            tableAliases: tableAliases,
            queryNodes: queryNodes
        };
    }

    getSelectJoins(selectParts) {
        let tableAliases = {};
        let table = this.db.tables[this.tableName];
        let selects = [];
        let queryNodes = [];
        for (let i in selectParts) {
            let currentTable = table;
            let previousTable = table;
            let currentParts = selectParts[i];
            let currentPath = `${currentTable.name}`;
            let tableNames = [];
            let aggregateFunction = null;
            if (functionMappings.aggregationFunctions[currentParts[currentParts.length - 1]]) {
                aggregateFunction = currentParts[currentParts.length - 1];
                currentParts = currentParts.slice(0, currentParts.length - 1);
            }
            for (let pathI = 0; pathI < currentParts.length - 1; pathI++) {
                tableNames.push(currentTable.name);
                let path = currentParts[pathI + 1];
                let currentColumn = currentTable.columns[path];
                if (!currentColumn)
                    throw `Invalid column. Table ${currentTable.name} does not have a column named ${path}.`;
                if (pathI < currentParts.length - 2 && !currentColumn.reference)
                    throw `Column ${path} on table ${currentTable.name} is not a reference to another table.`;
                if (pathI < currentParts.length - 2) {
                    currentPath = `${currentPath}.${path}`;
                }
                else {
                    let tableAlias =this.tableName === previousTable.name ? 
                    previousTable.name : 
                    `${previousTable.name}_${path}`;
                    if (!currentColumn.reference){
                         selects.push([i,tableAlias , path]);
                    }
                }
                if (pathI < currentParts.length - 1 && currentColumn.reference) {
                    previousTable = currentTable;
                    currentTable = this.db.tables[currentColumn.reference.table];
                }
            }
            if (aggregateFunction) {
                selects[selects.length - 1].push(aggregateFunction);
            }
            tableAliases[currentPath] = tableNames;
        }
        return { tableAliases, queryNodes, selects };
    }

    getWhereJoins(queryParts, tableAliases) {
        let isTable = false;
        let currentPath = `${this.tableName}`;
        let index = 0;
        let table = this.db.tables[this.tableName];
        let currentTable = table;
        let tableNames = [currentTable.name];
        queryParts.forEach(queryPart => {
            if (!isTable && queryPart.type === "Identifier" && queryPart.value === this.tableName) {
                isTable = true;
            }
            else if (isTable && queryParts[index - 1].type === "Punctuator" && queryParts[index - 1].value === "." && queryPart.type === "Identifier") {
                let isFunction = index < queryParts.length - 2 && queryParts[index + 1].type === "Punctuator" && queryParts[index + 1].value === "(";
                if (!isFunction) {
                    let currentColumn = currentTable.columns[queryPart.value];
                    if (!currentColumn)
                        throw `Invalid column. Table ${currentTable.name} does not have a column named ${queryPart.value}.`;
                    currentPath = `${currentPath}.${queryPart.value}`;
                    if (currentColumn.reference) {
                        currentTable = this.db.tables[currentColumn.reference.table];
                        tableNames.push(currentTable.name);
                    }
                }
            }
            else if (queryPart.type !== "Punctuator") {
                isTable = false;
                if (currentPath.indexOf(".") > 0) {
                    currentPath = currentPath.substring(0, currentPath.lastIndexOf("."));
                }
                tableAliases[currentPath] = tableNames;
                currentPath = `${this.tableName}`;
                currentTable = table;
                tableNames = [currentTable.name];
            }
            index++;
        });
    }

    getWhereParts(queryParts, queryNodes) {
        let table = this.db.tables[this.tableName];
        let currentTable = table;
        let isTable = false;
        let lastTable = currentTable.name;
        let lastColumn = null;
        let index = 0;
        let isBusyWithFunction = false;
        let currentFunction = null;
        queryParts.forEach(queryPart => {
            if (!isTable && queryPart.type === "Identifier" && queryPart.value === this.tableName) {
                isTable = true;
            }
            else if (isTable && queryParts[index - 1].type === "Punctuator" && queryParts[index - 1].value === "." && queryPart.type === "Identifier") {
                let isFunction = index < queryParts.length - 2 && queryParts[index + 1].type === "Punctuator" && queryParts[index + 1].value === "(";
                if (!isFunction) {
                    isBusyWithFunction = true;
                    let currentColumn = currentTable.columns[queryPart.value];
                    if (!currentColumn)
                        throw `Invalid column. Table ${currentTable.name} does not have a column named ${queryPart.value}.`;
                    lastColumn = queryPart.value;
                    if (currentColumn.reference) {
                        currentTable = this.db.tables[currentColumn.reference.table];
                        lastTable = currentTable.name;
                    }
                }
                else {
                    currentFunction = queryPart.value;
                }
            }
            else if (isBusyWithFunction && queryPart.type === "Punctuator" && queryPart.value === ")") {
                isBusyWithFunction = false;
            }
            else if (queryPart.type !== "Punctuator" && isTable) {
                isTable = false;
                currentTable = table;
                queryNodes.push({ type: "tableColumn", column: lastColumn, table: lastTable });
                if (currentFunction) {
                    let functionType = functionMappings.aggregationFunctions[currentFunction] ? "aggregationFunction" :
                        functionMappings.queryColumnFunctions[currentFunction] ? "queryColumnFunction" :
                            functionMappings.queryValuesFunctions[currentFunction] ? "queryValuesFunction" :
                                functionMappings.queryValueFunctions[currentFunction] ? "queryValueFunction" :
                                    functionMappings.queryFunctions[currentFunction] ? "queryFunction" :
                                        functionMappings.statements[currentFunction] ? "statement" :
                                            null;
                    if (functionType === null)
                        throw `Function ${currentFunction} not supported.`;
                    queryNodes.push({ type: "function", functionType: functionType, function: currentFunction });
                    currentFunction = null;
                }
            }
            else if (queryPart.value !== "." && !(isBusyWithFunction && queryPart.type === "Punctuator" && queryPart.value === "(")) {
                queryNodes.push(queryPart.value);
            }
            else if (queryPart.type !== "Punctuator" && !isTable) {
                queryNodes.push(queryPart.value);
            }
            if (queryPart.type === "String" || queryPart.type === "Number" || queryPart.type === "Boolean" || queryPart.type === "null") {
                queryNodes.push({ type: "litteral", value: queryPart.value });
            }
            index++;
        });
        return queryNodes;
    }

    select(selectFunc) {
        let selectExpression = esprima.parseScript(selectFunc.toString());
        if (validateSelectExpression(selectExpression)) {
            let expressionString = escodegen.generate(selectExpression.body[0].expression.body);
            selectExpression = esprima.tokenize(expressionString);
        } else {
            throw "Invalid argument passed to the query select statement. The select statement should be an arrow function returning an object with the fields selected.";
        }
        this.run.selectExpression = selectExpression;
        return this.run;

        function validateSelectExpression(selectExpression) {
            return selectExpression.body &&
                selectExpression.body.length > 0 &&
                selectExpression.body[0].type === "ExpressionStatement" &&
                selectExpression.body[0].expression.type === "ArrowFunctionExpression" &&
                selectExpression.body[0].expression.body.type === "ObjectExpression";
        }
    }

    filter(filterFunc, scopeValues) {
        if (typeof scopeValues !== "object") {
            throw `Invalid scope values!`;
        }
        if (this.name in scopeValues) {
            throw `The scoped variable object contains a key with the same name as the expression table, ${this.name}. This is not allowed!`;
        }
        let filterExpression = esprima.parseScript(filterFunc.toString());
        if (validateFilterExpression(filterExpression)) {
            //   filterExpression = filterExpression.body[0].expression.body;
            filterFunc = typeof filterFunc === "string" ? filterFunc : filterFunc.toString();
            let expressionString = filterFunc.substring(filterFunc.indexOf("=>") + 2);//escodegen.generate(filterExpression);
            filterExpression = esprima.tokenize(expressionString);
            this.run.filterExpression = filterExpression;
        } else {
            throw "Invalid argument passed to the query select statement. The select statement should be an arrow function returning an object with the fields selected.";
        }
        function validateFilterExpression(selectExpression) {
            return selectExpression.body &&
                selectExpression.body.length > 0 &&
                selectExpression.body[0].type === "ExpressionStatement" &&
                selectExpression.body[0].expression.type === "ArrowFunctionExpression" &&
                selectExpression.body[0].expression.body.type === "LogicalExpression";
        }
        return this.getScopeValues(scopeValues, this.run.filterExpression);
    }

    getScopeValues(scopeObj, fieldArray) {
        let scopedFields = this.getScopeFields(scopeObj, fieldArray);
        scopedFields.forEach(fields => {
            if (fields.length === 0) return;
            fields[0].value = this.getObjectProperty(scopeObj, fields);
        });
        return fieldArray.filter(x => !x.delete);
    }

    getScopeFields(scopeObj, fieldArray) {
        let result = [];
        let isLoaded = true;
        let isAdding = false;
        let fieldParts = [];
        for (let i = 0; i < fieldArray.length; i++) {
            let currentField = fieldArray[i];
            currentField.index = i;
            if (isLoaded && currentField.type === "Identifier") {
                isLoaded = false;
                if (scopeObj[currentField.value]) {
                    isAdding = true;
                    fieldParts = [currentField];
                    result.push(fieldParts);
                }
            } else if (isAdding && currentField.type === "Identifier") {
                currentField.delete = true;
                fieldParts.push(currentField)
            } else if (isAdding && currentField.type === "Punctuator" && currentField.value === ".") {
                currentField.delete = true;
            } else if (currentField.type === "Punctuator" && currentField.value !== ".") {
                isLoaded = true;
                isAdding = false;
            }
        }
        return result;
    }

    getObjectProperty(obj, fieldArray) {
        let currentValue = obj;
        for (var i = 0; i < fieldArray.length; i++) {
            let currentField = fieldArray[i].value;
            currentValue = currentValue[currentField]
            if (i === (fieldArray.length - 1)) {
                return currentValue;
            }
            if (typeof currentValue !== "object") {
                return undefined;
            }
        }
    }
}

module.exports = queryGenerator;