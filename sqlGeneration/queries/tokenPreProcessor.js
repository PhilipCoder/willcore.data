const functionMappings = require("../../sqlGeneration/queries/functionMappings.js");
/**
 * Class that preprocess a list of tokens and matches JS statement operators to SQL generator functions.
 * 
 * Author: Philip Schoeman
 */
class tokenPreProcessor {
    constructor() {
        /**
         * Map of JS statement operators to SQL generator functions.
         */
        this.generatorMappings = {
            "==": ["queryValuesFunctions", "equals"],
            "===": ["queryValuesFunctions", "equals"],
            "!=": ["queryValuesFunctions", "notEquals"],
            "!==": ["queryValuesFunctions", "notEquals"],
            ">": ["queryValuesFunctions", "greaterThan"],
            "<": ["queryValuesFunctions", "smallerThan"],
            "<=": ["queryValuesFunctions", "greaterOrEqualThan"],
            "=>": ["queryValuesFunctions", "smallerOrEqualThan"]
        };
    }
    /**
     * Translate JS statement operators in a expression token array to SQL generator functions.
     * 
     * @param {ArrayLike<Object>} parts Array of expression tokens to preprocess.
     */
    process(parts){
        let results = parts.slice();
        for (let partI = 0; partI < parts.length; partI++){
            let part = parts[partI];
            let generatorMapping = part.type === "Punctuator" ? this.generatorMappings[part.value] : null;
        }
    }
}

module.exports = tokenPreProcessor;