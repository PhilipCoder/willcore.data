const esprima = require('esprima');
const escodegen = require("escodegen");

class queryGenerator{
    constructor(db, tableName){
        this.run = function(){};
    }

    select(selectFunc, scopeValues){
        scopeValues = scopeValues || {};
        let selectExpression = esprima.parseScript(selectFunc.toString());
        if (validateSelectExpression(selectExpression)){
            let expressionString = escodegen.generate(selectExpression.body[0].expression.body);
            selectExpression = esprima.tokenize(expressionString);
        }else{
            throw "Invalid argument passed to the query select statement. The select statement should be an arrow function returning an object with the fields selected.";
        }
        this.run.selectExpression = selectExpression;
        return this.run;

        function validateSelectExpression(selectExpression){
            return selectExpression.body && 
            selectExpression.body.length > 0 && 
            selectExpression.body[0].type === "ExpressionStatement" && 
            selectExpression.body[0].expression.type === "ArrowFunctionExpression" &&
            selectExpression.body[0].expression.body.type === "ObjectExpression";
        }
    }

    filter(filterFunc){
        let filterExpression = esprima.parseScript(filterFunc.toString());
        if (validateFilterExpression(filterExpression)){
            filterExpression = filterExpression.body[0].expression.body;
            let expressionString = escodegen.generate(filterExpression);
            filterExpression = esprima.tokenize(expressionString);
            this.run.filterExpression = filterExpression;
        }else{
            throw "Invalid argument passed to the query select statement. The select statement should be an arrow function returning an object with the fields selected.";
        }
        function validateFilterExpression(selectExpression){
            return selectExpression.body && 
            selectExpression.body.length > 0 && 
            selectExpression.body[0].type === "ExpressionStatement" && 
            selectExpression.body[0].expression.type === "ArrowFunctionExpression" &&
            selectExpression.body[0].expression.body.type === "LogicalExpression";
        }
        return this.run.filterExpression;
    }

    getScopeFields(scopeObj, fieldArray){
        let result = [];
        let isLoaded = true;
        let isAdding = false;
        let fieldParts = [];
        for (let i =0; i < fieldArray.length;i ++){
            let currentField = fieldArray[i];
            currentField.index = i;
            if (isLoaded && currentField.type === "Identifier"){
                isLoaded = false;
                if (scopeObj[currentField.value]){
                    isAdding = true;
                    fieldParts = [currentField];
                    result.push(fieldParts);
                }
            }else if (isAdding && currentField.type === "Identifier" ){
                fieldParts.push(currentField)
            }else if (currentField.type === "Punctuator" && currentField.value !== "." ){
                isLoaded = true;
                isAdding = false;
             }
        }
        return result;
    }

    getScopeValues(scopeObj, fieldArray){

    }
}

module.exports = queryGenerator;