const assert = require('chai').assert;
const query = require("../sqlGeneration/queries/queryGenerator.js");
const queryFactory = require("../sqlGeneration/queries/queryable.js");
const chainableProxyHandler = require("../proxies/chainable/chainableProxyHandler.js");

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
  it('queryFactory-test', function () {
    let queryAble = queryFactory.get({},"person");
    let name = "Phil";
    queryAble.
    filter({name:name},
      (person) => person.name === name && person.details.age > 21 
      ).
      select((person) => ({
        name:person.name,
        surname:person.surname,
        age:person.details.age
      })).
      take(1).
      skip(2).
      sort(true,(person)=>person.name);

      let queryValues = queryAble.getValues();

  });
  it('chainableProxy-test', function () {
   let user = chainableProxyHandler.new("user");
   let chainResult = user.details.address.city;
   let value = chainResult._name;
   assert(value.length === 4);
   assert(value[0] === "user");
   assert(value[1] === "details");
   assert(value[2] === "address");
   assert(value[3] === "city");
  });

  it('query-getScopeFields-test', function () {
    let selectQuery = new query();
    let parts = selectQuery.filter(() => name === "one" && age > 10 && owner.name === "Philip");
    let scopeFields =selectQuery.getScopeFields({
      name:"DrPhil",
      owner:{
        name:"Life"
      }
    },parts);
    assert(scopeFields.length === 2);
    assert(scopeFields[0].length === 1);
    assert(scopeFields[1].length === 2);
  });
})