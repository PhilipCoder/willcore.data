/**
 * SQL operation to add an entry to a table.
 */
class updateOperation {
    constructor(table, column, value, whereField, whereValue) {
        this.value = value;
        this.column = column;
        this.table = table;
        this.whereField = whereField;
        this.whereValue = whereValue;
    }

    getSQL() {
        return { sql: `UPDATE ${this.table} SET ${this.column} = ? WHERE ${this.whereField} = ?`, parameter: [this.value, this.whereValue] };
    }
}

module.exports = updateOperation;