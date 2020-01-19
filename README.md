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

__Documentation is still under construction...__