class orderByGenerator {
    //Todo: implement recursion here
    static getSQL(sortDetails) {
        if (!sortDetails.sortParts) return '';
        let sortColumn = sortDetails.sortParts.length > 2 ?
            `${sortDetails.sortParts[sortDetails.sortParts.length - 3]}_${sortDetails.sortParts[sortDetails.sortParts.length - 2]}.${sortDetails.sortParts[sortDetails.sortParts.length - 1]}` :
            `${sortDetails.sortParts[sortDetails.sortParts.length - 2]}.${sortDetails.sortParts[sortDetails.sortParts.length - 1]}`;
        return `\nORDER BY ${sortColumn} ${sortDetails.descending ? 'DESC' : 'ASC'}`;
    }
}

module.exports = orderByGenerator;