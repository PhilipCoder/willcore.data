const assert = require('chai').assert;
const query = require("../assignables/mysql/query/query.js");

describe('query', function () {
  it('query-select-expression', function () {
    let selectQuery = new query();
    selectQuery.select(() => ({ name, age, ownerName: owner.name }));
    assert(selectQuery.run.selectExpression.length === 11, "The assigned select expression an incorrect number of tokens.");
  });
  it('query-select-expression-validate', function () {
    let selectQuery = new query();
    assert.throws(() => selectQuery.select(() => "sss"), "Invalid argument passed to the query select statement. The select statement should be an arrow function returning an object with the fields selected.", "The validation did not block the assignment.");
  });
  it('query-filter-expression', function () {
    let selectQuery = new query();
    selectQuery.filter(() => name === "one" && age > 10 && owner.name === "Philip");
    assert(selectQuery.run.filterExpression.length === 13, "The assigned select expression has an incorrect type.");
  });
})