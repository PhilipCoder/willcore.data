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

Column Assignable Data Type | MySQL Data Type | Default Size
--------------------------- | --------------- | ------------
int | int | -
string | varchar | 256
nstring | nvarchar | 256
decimal | decimal | 20, 7
float | float | 20, 7
date | datetime | 6
bool | boolean | -
text | text | -

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

__Documentation is still under construction...__