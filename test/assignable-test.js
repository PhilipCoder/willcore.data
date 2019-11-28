const assert = require('chai').assert;
const assignable = require("../assignables/assignable.js");

describe('assignable-base', function() {
    it('constructor - direct', function() {
        assert.throws(() => new assignable(),"An assignable class can't be created directly.");
    });
    it('constructor - inherit', function() {
        class tmpAssignable extends assignable{
            constructor(){
                super();
            }
        }
        assert.throws(() => new tmpAssignable(),"Binding constraints not provided.");
    });
    //Assignable to test with
    class testAssignable extends assignable{
        constructor(){
            super({object:2, function:1});
            this.completedCalled = false;
        }
        completed(){
            this.completedCalled = true;
        }
    }
    it('constructor - new', function() {
        let newAssignable = new testAssignable();
    });
    it('constructor - assignment process', function() {
        let newAssignable = new testAssignable();
        assert.isFalse( newAssignable.isCompleted);
        newAssignable.setValue({test:1});
        newAssignable.setValue({test:3});
        assert.isFalse( newAssignable.isCompleted);
        assert.throws(() => newAssignable.setValue({test:4}));
        assert.throws(() => newAssignable.setValue(""));
        assert.isFalse( newAssignable.completedCalled);
        newAssignable.setValue(()=>true);
        assert.isTrue( newAssignable.isCompleted);
        assert.isTrue( newAssignable.completedCalled);
    });
  })