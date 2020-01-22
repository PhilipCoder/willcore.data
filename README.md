<p align="center">
<h1 align="center">WillCore.Data</h1>
<h5 align="center">A MySQL ORM for NodeJS - By Philip Schoeman</h5>
</p>

___

> WillCore.Data is a small framework that provides ORM functionality for MySQL. Features:
> * Code-first database generation.
> * Queries via JavaScript like syntax.
> * Database migrations.

__

___
> ### A) Assignable-Introduction
___

In order to make the API as simple as possible, WillCore.Data uses the concept of assignables to instantiate and assign state to internal objects. The concept might be a bit weird at first, but it simplifies the API.

<br/>

E1) Let's take the following example:

```javascript
//Creates an instance of the database class and assign values to it.
let dataBase = new mySQL();
dataBase.connectionString = "127.0.0.1";
dataBase.userName = "root";
dataBase.password = "mypassword";
//Adds a table to the database
let userTable = new table();
userTable.name = "usersDB";
dataBase.tables.add(userTable);
```

In the example above we use traditional Class or Function instantiation and then we assign properties to the instance. But by doing so we are expecting the programmer to know the API and what values to assign. But what if the class itself knew what values to assign where? That is where assignables come in.

<br/>

E2) Doing it the assignable way:

```javascript
//Creating an instance of the mysql database named "usersDB"
dbProxy.usersDB.mysql = ["127.0.0.1", "userName", "password"];
//Defining a table on the database named "usersTable"
dbProxy.usersDB.usersTable.table;
```
<br/>

>The two examples above do the exact same thing. 
When the class is assigned to $elementId, the framework checks if the class inherits from an assignable. Then it creates an instance of the mysql class. The instance of the mysql class then tells WillCore.UI that it needs 3 strings to complete assignment. When the strings are assigned, the mysql class initiates itself.

 #### The syntax for assignables is:
> proxyInstance.newPropertyName.newObjectType = assignmentValues (optional)

* __Proxy Instance :__ An instance of a proxy that supports assignables. In the case of WillCore.Data, it can be the main proxy, a database proxy, table proxy or column proxy.
* __New Property Name :__  The name of the property that has to be created or set on the proxy.
* __New Object Type :__ The type of the value that is created on the parent proxy.

<br/>

___

## 1. Using WillCore.Data

#### Install via NPM:

Command will be added when NPM package is available.

## 2. Defining a database
All database operations is done via the willCore proxy. The willCore proxy factory can be imported from:

```javascript
const willCoreProxyFactory = require("willCore.Data");
```

An instance of the database proxy can be created via the new() function on the willCoreProxyFactory. 

__The database definition should be added to a function that gets called when the program starts up or only when the database should be created. It should not be called for every server request. Or the database can be defined as a singleton:__

```javascript
const willCoreProxyFactory = require("willCore.Data");
//Creates an instance of the database proxy via the factory method
let dbProxy = willCoreProxyFactory.new();

module.exports = dbProxy;
```

### 2.1 Define a database instance
A database can be defined by assigning an array to a "mysql" assignable database container proxy instance. The array should have 3 string values:

1. The MySQL server connection string.
2. The MySQL server user name.
3. The MySQL server password.

```javascript
const willCoreProxyFactory = require("willCore.Data");
//Creates an instance of the database proxy via the factory method
let dbContainerProxy = willCoreProxyFactory.new();
//Defining a database named testDB on localhost
dbContainerProxy.testDB.mysql = ["127.0.0.1", "userName", "password"];

module.exports = dbContainerProxy;
```


### 2.2 Defining tables and columns
Tables can be defined on a database proxy via the "table" assignable. The table assignable does not take any values and by simply accessing the assignable the table will be defined.

 #### The syntax for creating a table:
> dbProxy.newTableName.table;

```javascript
//Defining a table on the testDB called "users"
dbContainerProxy.testDB.users.table;
```

Columns are defined on a table proxy.

 #### The syntax for creating a column on a table:
> dbProxy.tableProxy.columnName.column.dataType;

```javascript
//Defining a table on the testDB called "users"
dbContainerProxy.testDB.users.id.column.int;
```

#### Available data types (data type mappings)

| Column Assignable Data Type | MySQL Data Type | Default Size |
| --------------------------- | --------------- | ------------ |
| int                         | int             | -            |
| string                      | varchar         | 256          |
| nstring                     | nvarchar        | 256          |
| decimal                     | decimal         | 20, 7        |
| float                       | float           | 20, 7        |
| date                        | datetime        | 6            |
| bool                        | boolean         | -            |
| text                        | text            | -            |

#### Specifying custom sizes for column types

Custom sizes can be set to column proxies with data types that support custom sizes via the "size" property. Data types with a single size parameter, for example varchar, can be assigned by assigning an integer value and multiple sizes can be assigned via an array of integer values.

```javascript
//Define a name column
proxy.testDB.users.name.column.string;
//Sets the size of the column's data type. Will be varchar(100)
proxy.testDB.users.name.size = 100; 
//Define a name column
proxy.testDB.users.price.column.decimal;
//Sets the size of the column's data type. Will be decimal(4,2)
proxy.testDB.users.price.size = [4,2]; 
```

#### Defining a primary key on a column

A column proxy can be set as a primary key by calling the primary property on the proxy. Primary key columns are auto incremented by default.

```javascript
//Define an ID column
proxy.testDB.users.id.column.int;
//Mark the column as a primary key.
proxy.testDB.users.id.primary;
```

_Example: creating a database with two tables:_
```javascript
let proxy = willCoreProxy.new();
proxy.cars.mysql = ["127.0.0.1", "root", "password"];
//defines person table
proxy.cars.person.table;
proxy.cars.person.id.column.int;
proxy.cars.person.id.primary;
proxy.cars.person.firstName.column.string;
proxy.cars.person.lastName.column.string;
proxy.cars.person.email.column.string;
proxy.cars.person.gender.column.string;
proxy.cars.person.dateCreated.column.date;
//defines car make table
proxy.cars.carMake.table;
proxy.cars.carMake.id.column.int;
proxy.cars.carMake.id.primary;
proxy.cars.carMake.name.column.string;
```

### 2.3 Defining foreign keys between columns

Foreign keys are defined by assigning a new column to a primary key on another table.

```javascript
 let proxy = willCoreProxy.new();
//Creates a cars database
proxy.cars.mysql = ["127.0.0.1", "root", "Bandit1250s"];
//defines person table
proxy.cars.person.table;
proxy.cars.person.id.column.int;
proxy.cars.person.id.primary;
proxy.cars.person.firstName.column.string;
proxy.cars.person.lastName.column.string;
proxy.cars.person.email.column.string;
proxy.cars.person.gender.column.string;
proxy.cars.person.dateCreated.column.date;
//defines cars table
proxy.cars.car.table;
proxy.cars.car.id.column.int;
proxy.cars.car.id.primary;
proxy.cars.car.model.column.string;
proxy.cars.car.year.column.int;
proxy.cars.car.color.column.string;
proxy.cars.car.price.column.decimal;
proxy.cars.car.additionalDetails.column.text;
//owner relation
//Defines a foreign key between a new column "owner" and the id primary key on the person table
proxy.cars.car.owner = proxy.cars.person.id;
//Defines a navigation property on the referenced table navigating back to the table with the primary key.
proxy.cars.person.cars = proxy.cars.car.owner;
```

## 3. Create database from database definition

In order to create a database from a database definition, the init method on the database proxy can be called. This method returns a promise that will resolve once the database is created. The method takes one boolean parameter to indicate if the database should dropped before created. If the value is false or undefined, the database will use the migration engine to update the database accordingly.

```javascript
//Creates a database from a database definition.
await proxy.testDB.init();
//Always recreates the database.
await proxy.testDB.init(true);
```

## 4. The queryDB

Since the database definition should be defined as a singleton, it is not a thread-safe module. It can't be used to add data to the database or query the database since different threads might change the state of the database context and interfere with each other. To add, update or query data in the database, the queryDB proxy should be used. This proxy can be generated from the queryDB property on the database proxy. 

> Every time the queryDB property on the database definition proxy is accessed, the get trap on the proxy will generate a new instance of a queryable database and return it. This instance of a queryable database can then be used within the scope of a thread or request to add, update or query the data of a database.

Accessing the queryDB:
```javascript
//Gets a new instance of a queryable database.
let queryableDB = proxy.testDB.queryDB;
```

## 5. Adding data to a table.

Data rows can be added to table via a queryDB instance. The add method on a table proxy or the table's "+" property. The add method can only take a single row at a time, while the "+" property can take an array of data rows. After the data is added to the internal state of the queryDB instance, the "save" method can be called to persist the data to the database. The save method returns a promise that will resolve once the data is persisted to the database.

To add a row to table, the data passed to the table proxy should be an object with values on properties named the same as the columns on the table. For example: (please note that primary key columns are auto incrementing, so values are not passed for primary keys)

``` javascript
//To add data to a table with columns id, name, price and description, the following object can be used to populate the table:

let newDataRow = {name:"John Doe", price: 2000.21, description:"Our first client."};
```

### 5.1 Adding data using the __add__ method.

#### A single row at a time using the _add_ method
```javascript
//Adds a single row to the context
queryDB.person.add(
    {
        firstName:"John",
        lastName:"Doe",
        email:"johndoe@common.com", 
        gender:"male", 
        dateCreated:"2020/01/01"
    });
//Saves the changes of the context to the database
await queryDB.save();
```

#### A single row at a time using the "+" property
```javascript
//Adds a single row to the context
queryDB.person["+"] = 
    {
        firstName:"John",
        lastName:"Doe",
        email:"johndoe@common.com", 
        gender:"male", 
        dateCreated:"2020/01/01"
    };
//Saves the changes of the context to the database
await queryDB.save();
```

#### A multiple rows at a time using the "+" property
```javascript
//Adds an array of data rows to the context
queryDB.person["+"] = 
    [
        {
            firstName:"John",
            lastName:"Doe",
            email:"johndoe@common.com", 
            gender:"male", 
            dateCreated:"2020/01/01"
        },
        {
            firstName:"Johanna",
            lastName:"Doe",
            email:"johanna@common.com", 
            gender:"female", 
            dateCreated:"2020/01/01"
        }
    ];
//Saves the changes of the context to the database
await queryDB.save();
```

## 6. Deleting rows

Rows can be deleted from a table by calling the delete method on a table or assigning an entry to undefined.

#### Deleting a record by calling the delete method

```javascript
//Deleting a user record with primary key 10
queryDB.user.delete(10);
//Saves the changes of the context to the database
await queryDB.save();
```

#### Deleting a record by assigning to undefined

```javascript
//Deleting a user record with primary key 10
queryDB.user[10] = undefined;
//Saves the changes of the context to the database
await queryDB.save();
```

## 7. Querying data

>___
> All query examples will be demonstrated on a database with the following structure:
>___
```javascript
let proxy = willCoreProxy.new();
proxy.cars.mysql = ["127.0.0.1", "root", "Bandit1250s"];
//defines person table
proxy.cars.person.table;
proxy.cars.person.id.column.int;
proxy.cars.person.id.primary;
proxy.cars.person.firstName.column.string;
proxy.cars.person.lastName.column.string;
proxy.cars.person.email.column.string;
proxy.cars.person.gender.column.string;
proxy.cars.person.ipAddress.column.string;
proxy.cars.person.dateCreated.column.date;
//defines car make table
proxy.cars.carMake.table;
proxy.cars.carMake.id.column.int;
proxy.cars.carMake.id.primary;
proxy.cars.carMake.name.column.string;
//defines cars table
proxy.cars.car.table;
proxy.cars.car.id.column.int;
proxy.cars.car.id.primary;
proxy.cars.car.model.column.string;
proxy.cars.car.year.column.int;
proxy.cars.car.color.column.string;
proxy.cars.car.price.column.decimal;
//make relation
proxy.cars.car.make = proxy.cars.carMake.id;
proxy.cars.carMake.cars = proxy.cars.car.make;
//owner relation
proxy.cars.car.owner = proxy.cars.person.id;
proxy.cars.person.cars = proxy.cars.car.owner;

let queryDB = proxy.cars.queryDB;
```
___

WillCore queries data using queryables. A queryable is a query that can be built up using JavaScript. A queryable always has one main table but can be linked to many tables. To get an instance of a queryable, simply call any of the query functions of a queryable on a queryDB table proxy.

#### Queryable functions

Function Name | Parameters | Description
------------- | ---------- | -----------
filter | filterExpression (function), queryScope (object) | The filter function adds a __where__ clause to a query.
include | tableLinkExpression (function) | Adds data from tables linked by foreign keys to the result of the query.
select  | selectFunction (function) | Selects aggregate values.
sort | sortFunction (function), isDescending (bool) | Sorts the results of a query.
skip | skipCount (int) | Skips a number of records in a query.
take | takeCount (int) | Takes a number of records of a query.
save | queryName (string) | Saves a query for reuse

#### Getting an instance of a queryable

```javascript
//Via the filter function
let query = queryDB.cars.filter((car) => car.year === 1990);
//Via the include function
let query = queryDB.cars.include((car) => car.owner);
//Via the sort function
let query = queryDB.cars.sort((car) => car.price);
//Via the skip function
let query = queryDB.cars.skip(10);
//Via the take function
let query = queryDB.cars.take(20);
```

### 7.1 Query data with the filter function

Querying a database using nothing else than JavaScript is now possible deu to WillCore's JavaScript to MySQL SQL transpiler. All transpiling happens at run-time and no pre-compilers are needed. Because of this, not all JavaScript methods and objects are supported.

The filter function's first parameter is an arrow function with a single parameter indicating the table the filter is on. The filter can be used similar to a normal JavaScript array filter function, but only using an arrow function filter.

#### Basic usage of a filter

```javascript
//Finding all cars with a price greater than 10 000
let expensiveCarQuery = queryDB.car.filter((car) => car.price > 10000);
//Finding all cars with a price greater than 10 000 and has a year model of either 2000 or 2002
let expensiveOrMillennialCarQuery = queryDB.car.filter((car) => car.price > 10000 && (car.year === 2000 || car.year === 2002));
```

### Using MySQL specific statements

Some statements like "like" is not supported by default by JavaScript. To use MySQL specific statements, they are invoked as methods on columns inside a query function.

#### Using like within a query function

```javascript
//Generates a query to return all users with first names starting with A
let usersAQuery = queryDB.users.filter((user) => user.firstName.like("A%"));
//Generates a query to return all users cars
let usersWithCarsQuery = queryDB.users.filter((user) => user.cars.id.count() > 0);
```

#### Available MySQL specific functions

Function Name | Parameters | Description
------------- | ---------- | -----------
like | comparisonValue (string) | Generates a __like__ statement in the where clause. Checks if a string is contained within another string.
notLike | comparisonValue (string) | Generates a __not like__ statement in the where clause. Checks if a string is not contained within another string.
isNull | - | Checks if a value is null.
isNotNull | - | Checks if a value is not null.
dateDiff | comparisonValue (date) | Generates a __datediff__ statement in the where clause. Returns the number of days between two dates.
count | - | Generates a __count__ aggregation statement in the where clause. Returns the count of items.
avg | - | Generates a __avg__ aggregation statement in the where clause. Returns the average of number values in a query.
max | - | Generates a __max__ aggregation statement in the where clause. Returns the maximum number value in a query.
min | - | Generates a __min__ aggregation statement in the where clause. Returns the minimum number value in a query.
sum | - | Generates a __sum__ aggregation statement in the where clause. Returns the sum of items.

## Query scope

The filter of a query works by breaking down the filter function down to an expression tree and then it builds up SQL from the expression tree. The filter arrow function is never executed and WillCore does not have access to the parent scope and closure. Because of this, passing variables directly into the filter function won't work.

<h4 style="color:red">The following won't work</h4>

```javascript
//Finding all cars with a price greater than 10 000
//Since WillCore doesn't have access to the parent scope, it will think that minPrice is a column
let minPrice = 10000;
let expensiveCarQuery = queryDB.car.filter((car) => car.price > minPrice);
```

To give WillCore access to the values of the variables and tell it what statements are variables, the variables has to be passed in as properties on an object to the filter function as a second parameter.

<h4 style="color:green">The following will work</h4>

```javascript
//Finding all cars with a price greater than 10 000
//The second parameter tells WillCore that minPrice is a variable and provides the value to the engine.
let minPrice = 10000;
let expensiveCarQuery = queryDB.car.filter((car) => car.price > minPrice, { minPrice: minPrice });
```

## 8. Selecting aggregated values

When a custom select query is needed, the select function on a queryable can be used. The select function can return aggregated values. By default WillCore will select all the columns on the primary table and included tables. By calling the select function, the default select columns are changed to a custom one.

For instance, a query that should return the first name of a person, surname, the amount of cars a person own and the sum of the values of the cars would be:

```javascript
let customSelectQuery = queryDB.person.select((person) => ({
        name: person.firstName,
        ownerName: person.lastName,
        carCount: person.cars.id.count(),
        sumOfCarValue: product.cars.price.sum()
      }));
```

## 9. Skipping and taking rows

When a subset of the data should be returned, for example, a single page of data, the skip and take methods on a queryable. The skip and take methods generate a __limit__ statement in the SQL query.

#### Skipping the first 50 results

```javascript
let subsetQuery = queryDB.person.skip(50);
```

#### Taking only the first 50 results

```javascript
let subsetQuery = queryDB.person.take(50);
```

#### Taking results from number 20 to 50

```javascript
let subsetQuery = queryDB.person.skip(20).take(30);
```

## 10. Building up a query

All queryable methods return the queryable, so a query can be built up by chaining the methods. However, every method can only be called once.

#### Complex query

```javascript
let customSelectQuery = queryDB.person
    .filter((person) => person.firstName === "John")
    .select((person) => ({
        name: person.firstName,
        ownerName: person.lastName,
        carCount: person.cars.id.count(),
        sumOfCarValue: product.cars.price.sum()
      }))
      .skip(2)
      .take(5);
```

## 11. Executing a query

A queryable is a function itself. To the execute a query, the queryable has to be executed. It will return a promise that will resolve with the data returned from the database as entities.

#### Executing a query

```javascript
//define the query
let customSelectQuery = queryDB.person.filter((person) => person.firstName === "John");
//executes the query
let dbResult = await customSelectQuery();
```

#### Executing a query inline

```javascript
let dbResult = await queryDB.person.filter((person) => person.firstName === "John")();
```

## 13 Updating data

A row record can be updated by simply changing values on a database result and then saving the database.

#### Changing the last name of a person with ID 10

```javascript
let personId = 10;
let dbResult = await queryDB.person.filter((person) => person.id === personId,{ personId: personId })();
dbResult[0].lastName = "Doe";
//Persist the changes to the database
await queryDB.save();
```

#### Changing the year of a person's, with ID 10, first car

```javascript
let personId = 10;
let dbResult = await queryDB.person.filter((person) => person.id === personId,{ personId: personId })();
dbResult[0].cars[0].year = "2001";
//Persist the changes to the database
await queryDB.save();
```

## 14. Saving queries

The transpiling process WillCore uses to generate queries can be resource intensive. To get around this issue, WillCore allows you to save queries to a table. By saving the queries, the generated SQL will be persisted, and only the parameter values be injected when the queries are used again.

To save a query, call the __save__ method on a queryable to save it after building it up. You can provide the query scope with null values when calling the filter function, and then provide values when the saved query is called.

> Please note: All query names must start with an underscore.

>Saved queries are saved to the main database proxy, but can be accessed by all queryDB's generated from the main database.

```javascript
//Saves a query to get all cars with a certain manufacturer as "_getCarsByCarMakeName"
queryDB.
car.
include((car) => car.make).
filter((car) => car.make.name === carMakeName, { carMakeName: null }).
sort((car) => car.model).
save("_getCarsByCarMakeName");

//Calling a saved query:
let toyotaCars = await queryDB.car._getCarsByCarMakeName({ carMakeName: "Toyota" });
```

## 15. Sorting data

The sort method on a queryable provides a quick way to sort data. The sort function takes an arrow function that returns the column that the data should be sorted by. The second parameter is a boolean that indicates if the values should be returned in descending order. If it is not provided or false, the results will be in ascending order.

```javascript
let ascendingCars = await queryDB.car.sort((car) => car.model)();
let descendingCars = await queryDB.car.sort((car) => car.model, true)();
```
