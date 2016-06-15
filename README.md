## Usage

### Install

```
$ npm install simple-flow-control
```

### Creating an instance

``` js
var Serial = require('simple-flow-control').serial;
var serial = new Serial();
// or
var serial = Serial();
```

### Register task

``` js
var f1 = function() {};
serial.registerTask(f1);
```

### Executing tasks

``` js
serial.start('Initial value');
```


### Example

``` js
var Serial = require('simple-flow-control').serial;

var serial = new Serial();
// or
var serial = Serial();

var f1 = function(result, next) {
  setTimeout(function() {
    console.log('Function 1 executed!', result);
    next(null, 'Value send by function 1');
  }, 2000);
};

var f2 = function(result, next) {
  setTimeout(function() {
    console.log('Function 2 executed!', result);
    // next(new Error('Bugou tudo'), 'Value send by function 2');
    next(null, 'Value send by function 2');
  }, 3000);
};

var f3 = function(result, next) {
  setTimeout(function() {
    console.log('Function 3 executed!', result);
    next(null, 'Value send by function 3');
  }, 3000);
};

serial.registerTask(f1);
serial.registerTask(f2);
serial.registerTask(f3);

serial.start('Initial value');
```
