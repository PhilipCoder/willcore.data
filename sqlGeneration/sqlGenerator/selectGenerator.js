const functionMappings = require("../queries/functionMappings.js")
class selectGenerator{
    /**
     * Gets the select statement for a query
     * @param {Array<Array<String>>} selectStatements 
     */
    static getSQL(selectStatements){
        let selectParts = selectStatements.map(selectArray => {
            if (selectArray.length === 2){
                return `${selectArray[0]}.${selectArray[1]} \`${selectArray[0]}.${selectArray[1]}\``;
            } else if (selectArray.length === 3){
                return `${functionMappings.aggregationFunctions[selectArray[2](selectArray[0],selectArray[1])]}${}.${} \`${selectArray[0]}.${selectArray[1]}\``;
            }
        });
        return `SELECT\n    `;
    }
}