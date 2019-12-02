//index.server.js
module.exports = (view, willCore, assignables) => {
    //Create DB
    //Create DB
    willCore.myDB = [assignables.mysql,"connection string", "username","password"];
    //Create table
    willCore.myDB.owners = assignables.dbTable;
    willCore.myDB.owners.name = assignables.dbString;
    willCore.myDB.owners.auditDate = assignables.dbDate;
    //default value
    willCore.myDB.dogs.auditDate = () => new Date();
    //Create table
    willCore.myDB.dogs = assignables.dbTable;;
    willCore.myDB.dogs.name = assignables.dbString;
    willCore.myDB.dogs.age = assignables.dbInt;
    //Foreign key (one)
    willCore.myDB.dogs.owner = willCore.myDB.owners;
    //Foreign key (many)
    willCore.myDB.dogs["*owners"] = willCore.myDB.owners;
    //Updates the db
    await willCore.myDB();
    
    //Selects a single instance, returns a proxy.
    willCore.myDB.dogs = 20;
    let myDog = await willCore.myDB.dogs;
    //Updates the dog.
    myDog.name = "Beast";
    await myDog();
  
    //Selects a multiple instances
    willCore.myDB.dogs = [20,21,23];
    let myDogs = await willCore.myDB.dogs;
  
    //Selects a dog where owner is Philip, with name as name owner.name as owner
    willCore.myDB.dogs = (name = name, owner = owner.name) => dogs.age > 90 && owner.name === "Philip";
    let result = await willCore.myDB.dogs;
  
    //Selects a dog where owner is Philip and the owner count. Default is inner join
    willCore.myDB.dogs = (name = dogs.name, ownerCount = count(dogs.owner.name)) => dogs.age > 90 && dogs.owner.name === "Philip";
    let result = await willCore.myDB.dogs;
  
    //Using a right join: >. Left join is <
    willCore.myDB.dogs = (name = dogs.name, ownerCount = count(dogs[">"].owner.name)) => dogs.age > 90 && dogs[">"].owner.name === "Philip";
    let result = await willCore.myDB.dogs;

    //
    let result = willCore.myDB.dogs.filter(dogs => dogs.name == "vlekkie" && dogs.age > 2 || dogs.owner).select(dogs => ({name:dogs.name, age:dogs.age, owners:}));

  
  };
  