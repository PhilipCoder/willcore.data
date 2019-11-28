const baseProxyHandler = require("./baseProxyHandler.js");
const assignable = require("../../assignables/assignable.js");
const intermediateAssignableProxy = require("../intermediateAssignable/intermediateAssignableProxy.js");

class assignableProxyHandler extends baseProxyHandler {
    constructor() {
        super();
        this.getTraps = [this.getAssignable];
        this.setTraps = [this.assignAssignable,this.assignAssignableValue,this.assignCompleted];
    }

    assignAssignable(target, property, value, proxy) {
        return target[property] === undefined && value.prototype instanceof assignable ? { value: new value(), status: true } : { value: null, status: false };
    }

    assignAssignableValue(target, property, value, proxy) {
        console.log("=========");
        console.log(value);
        console.log(target[property]);
        if (target[property] instanceof assignable) {
            target[property].setValue(value);
        }
        return  { value: false, status:false };
    }

    assignCompleted(target, property, value, proxy){
        if (target[property] instanceof assignable && target[property].isCompleted) {
            let completionResult = target[property].completionResult();
            if (completionResult === false){
                delete target[property];
                return  { value: true };
            }else if (completionResult !== undefined){
                target[property] = completionResult;
                return  { value: true };
            }
        }
        if (target[property] instanceof assignable){
            return  { value: true };
        }
        return  { value: false, status:false };
    }

    getAssignable(target, property,proxy){
    
        if (target[property]){
            return { value: target[property], status:true } ;
        }
        else{
            return { value: intermediateAssignableProxy.new(proxy, property), status:true } ;
        }
    }

}

module.exports = assignableProxyHandler;