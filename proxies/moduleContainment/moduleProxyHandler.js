const moduleProxy = require("./moduleProxy.js");

class willCoreModules {
    constructor() {
        this.factories = {};
    }

    get(target, property) {
        if (target[property]) {
            return target[property];
        } else if (this.factories[property]) {
            target[property] = this.factories[property]();
            return target[property];
        }
        throw `Module ${property} does not exists!`;
    }

    set(target, property, value) {
        if (value instanceof moduleProxy) {
            target[property] = value;
        }else{
            this.factories[property] = value;
        }
        return true;
    }

    static new() {
        return new Proxy(new moduleProxy(), new willCoreModules());
    }

}

module.exports = willCoreModules;