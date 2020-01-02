class entityProxyHandler{
    get(target, property, proxy){
        return target[property];
    }
    set(target,property,value,proxy){
        target[property] = value;
        return true;
    }
}

module.exports = entityProxyHandler;