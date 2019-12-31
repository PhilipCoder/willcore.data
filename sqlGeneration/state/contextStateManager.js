const queue = require("./queue.js");
const addOperation = require("./operations/addOperation.js");
const updateOperation = require("./operations/updateOperation.js");
const deleteOperation = require("./operations/deleteOperation.js");

/**
 * Contains and handles the change operations on a database context.
 * Author: Philip Schoeman
 */
class contextStateManager {
    constructor(queryExecutor) {
        this.operations = new queue();
        this.queryExecutor = queryExecutor;
    }

    addRow(table, rowData){
        this.operations.enqueue(new addOperation(table, rowData))
    }  
    
    updateField(table, column, value, whereField, whereValue){
        this.operations.enqueue(new updateOperation(table, column, value, whereField, whereValue));
    }

    deleteRow(table, whereField, whereValue){
        this.operations.enqueue(new deleteOperation(table, whereField, whereValue));
    }

    run(){
        return new Promise(async (resolve, reject)=>{
            while(!this.operations.isEmpty()){
                let operation = this.operations.dequeue();
                let toRun = operation.getSQL();
                let result = await this.queryExecutor.runQuery(toRun.sql, toRun.parameter);
                if (result.insertId > 0){
                    operation.value.id = result.insertId;
                }
            }
            resolve();
        });
    }
}

module.exports = contextStateManager;