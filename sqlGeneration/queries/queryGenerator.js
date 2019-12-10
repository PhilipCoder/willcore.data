const esprima = require('esprima');
const escodegen = require("escodegen");

class queryGenerator {
    constructor(db, tableName) {
        this.run = function () { };
        this.db = db;
        this.tableName = tableName;
    }

    getQuerySQL() {

    }

    getJoinObj(selectParts, queryParts) {
        let joinObj = {};
        let tableAliases = {};
        let table = this.db.tables[this.tableName];
        for (let i = 0; i < selectParts.length; i++) {
            let currentTable = table;
            let currentParts = selectParts[i];
            //let 
        }
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
            filterExpression = filterExpression.body[0].expression.body;
            let expressionString = escodegen.generate(filterExpression);
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