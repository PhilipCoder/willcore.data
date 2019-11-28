/**
 * Base assignable class
 * 
 */
class assignable {
    /**Constructor, must be called from the inherting class
     * 
     * @param {object} bindingConstraints An object containing the types of values that can be assinged.
     */
    constructor(bindingConstraints){
        if (new.target === assignable) throw "An assignable class can't be created directly.";
        if (typeof bindingConstraints !== "object") throw "Binding constraints not provided.";
        this.bindingConstraints = bindingConstraints;
        this.bindedValues = {};
        this.name = new.target.name;
    }

    /**
     * Indicates if a assignable is fully assigned.
     * @type {boolean}
     */
    get isCompleted(){
        for (let key in this.bindingConstraints){
            if (!this.bindedValues[key] || this.bindingConstraints[key] !== this.bindedValues[key].length) return false;
        }
        return true;
    }

    /**
     * Assignes a value to an assignable
     * @param {any} value 
     */
    setValue(value){
        if (this.bindingConstraints[typeof value] && this.bindingConstraints[typeof value] > (this.bindedValues[typeof value] ? this.bindedValues[typeof value].length : 0)){
            this.bindedValues[typeof value] = this.bindedValues[typeof value] || [];
            this.bindedValues[typeof value].push(value);
            if (this.isCompleted){
                this.completed();
            }
        }else if (!this.bindingConstraints[typeof value]){
            throw `Unsupported assignment. The assignable ${this.name} does not support a binding of type ${typeof value}.`;
        }else{
            throw `Unsupported assignment. The assignable ${this.name} is already fully binded to value of type ${typeof value}.`;
        }
    }
}

module.exports = assignable;