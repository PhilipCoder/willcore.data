const queue = require("./queue.js");
const addOperation = require("./operations/addOperation.js");
const updateOperation = require("./operations/updateOperation.js");
const deleteOperation = require("./operations/deleteOperation.js");

/**
 * Contains and handles the change operations on a database context.
 * Author: Philip Schoeman
 */
class contextStateManager {
    constructor() {
        this.operations = new queue();
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
}

module.exports = contextStateManager;