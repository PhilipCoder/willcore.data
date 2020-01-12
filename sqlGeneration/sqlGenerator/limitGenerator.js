class limitGenerator {
    //Todo: implement recursion here
    static getSQL(takeDetails) {
        if (takeDetails.skipCount === null && takeDetails.takeCount === null) return ``;
        if (takeDetails.skipCount === null && takeDetails.takeCount) return `\nLIMIT ${takeDetails.takeCount}`;
        if (takeDetails.takeCount === null) return `\nLIMIT ${takeDetails.skipCount},99999`;
        return `\nLIMIT ${takeDetails.skipCount},${takeDetails.takeCount}`;
    }
}

module.exports = limitGenerator;