const baseProxyHandler = require("./baseProxyHandler.js");
const assignable = require("../../assignables/assignable.js");
const intermediateAssignableProxy = require("../intermediateAssignable/intermediateAssignableProxy.js");

class assignableProxyHandler extends baseProxyHandler {
    constructor() {
        super();
        this.getTraps = [this.getStraightValue, this.getAssignable];
        this.setTraps = [this.assignStraightValue, this.assignArray, this.assignAssignable, this.assignAssignableValue, this.assignCompleted];
        this.hiddenVariables = {};
    }

    assignStraightValue(target, property, value, proxy) {
        console.log( property );
        if (property.startsWith("_")) {
            this.hiddenVariables[property] = value;
            return { value: true };
        }
        return { value: false, status: false };
    }

    assignArray(target, property, value, proxy) {
        if (Array.isArray(value) && (target[property] instanceof assignable || (value.length > 0 && value[0].prototype instanceof assignable))) {
            value.forEach(item => {
                proxy[property] = item;
            });
            return { value: true };
        }
        return { value: false, status: false };
    }

    assignAssignable(target, property, value, proxy) {
        if (target[property] === undefined && value.prototype instanceof assignable) {
            let result = new value();
            if (result.canAssign(proxy, property)) {
                return { value: new value(), status: true }
            } else {
                throw "Invalid target proxy type for the assignable!";
            }
        }
        return { value: false, status: false }
    }

    assignAssignableValue(target, property, value, proxy) {
        if (target[property] instanceof assignable) {
            target[property].setValue(value);
        }
        return { value: false, status: false };
    }

    assignCompleted(target, property, value, proxy) {
        if (target[property] instanceof assignable && target[property].isCompleted) {
            let completionResult = target[property].completionResult();
            if (completionResult === false) {
                delete target[property];
                return { value: true };
            } else if (completionResult !== undefined) {
                target[property] = completionResult;
                return { value: true };
            }
        }
        if (target[property] instanceof assignable) {
            return { value: true };
        }
        return { value: false, status: false };
    }

    getStraightValue(target, property, proxy){
        if (property.startsWith("_")) {
            return { value: this.hiddenVariables[property], status: true };
        }
        return { value: false, status: false };
    }

    getAssignable(target, property, proxy) {

        if (target[property]) {
            return { value: target[property], status: true };
        }
        else {
            return { value: intermediateAssignableProxy.new(proxy, property), status: true };
        }
    }

}

module.exports = assignableProxyHandler;