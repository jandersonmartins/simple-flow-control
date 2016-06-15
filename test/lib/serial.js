'use strict';

var chai = require('chai');
var spies = require('chai-spies');

// Conecting Chai plugin
chai.use(spies);
// Expect reference
var expect = chai.expect;

var Serial = require('../../lib/serial');

var serial;
var expected;

describe('Serial', function () {
  describe('#start', function() {
    beforeEach(function() {
      serial = new Serial();
    });

    it('should not execute next method when tasks queue is empty', function() {
      var spy = chai.spy(serial.next);

      serial.start();
      expect(serial.tasks).to.empty;
      expect(spy).to.not.have.been.called();
    });

    it('should execute next method when tasks queue is not empty', function() {
      var spy = chai.spy(serial.next);
      var fn = function(err, next) {};

      serial.registerTask(fn);

      expect(serial.tasks.length).to.equal(1);

      serial.start();

      expect(spy).to.not.have.been.called();
    });
  });

  describe('#_getCurrent', function() {
    before(function() {
      serial = new Serial();
    });

    it('should return the current task', function() {
      var taskFoo = function() {};
      serial.registerTask(taskFoo);
      expect(serial._getCurrent()).to.equal(taskFoo);
    });

    it('sould return null when task list is empty', function() {
      expect(serial._getCurrent()).to.be.a('null');
    });
  });

  describe('#next', function() {
    describe('error', function() {
      before(function() {
        serial = new Serial();
      });

      it('should return error when param error exist', function() {
        var next = serial.next.bind(serial, new Error('Error f1'));
        expect(next).to.throw(Error, 'Error f1');
      });
    });

    describe('success', function() {
      it('should execute task in queue', function() {
        var taskFake = function(err, next) {
          next(null, 'Foo');
        };
        var spy = chai.spy(taskFake);

        serial.registerTask(spy);

        expect(serial.tasks.length).to.equal(1);

        serial.next(null, 'foo');

        expect(spy).to.have.been.called.once;
        expect(serial.tasks.length).to.equal(0);
      });
    });
  });

  describe('#registerTask', function() {
    describe('success', function() {
      beforeEach(function() {
        serial = new Serial();
      });

      it('should init tasks array empty', function() {
        expect(serial.tasks).to.empty;
      });

      it('should add task in array', function() {
        var fakeTask = function() {};
        serial.registerTask(fakeTask);
        expect(serial.tasks.length).to.equal(1);
      });
    });

    describe('error', function() {
      var errorMsg = 'Expect a function.';

      before(function() {
        serial = new Serial();
      });

      it('should return error when param is a string', function() {
        expected = serial.registerTask.bind(serial, 'str');
        expect(expected).to.throw(TypeError, errorMsg);
      });

      it('should return error when param is a number', function() {
        expected = serial.registerTask.bind(serial, 123);
        expect(expected).to.throw(TypeError, errorMsg);
      });

      it('should return error when param is a null', function() {
        expected = serial.registerTask.bind(serial, null);
        expect(expected).to.throw(TypeError, errorMsg);
      });

      it('should return error when param is a undefined', function() {
        expected = serial.registerTask.bind(serial, undefined);
        expect(expected).to.throw(TypeError, errorMsg);
      });

      it('should return error when param is a object', function() {
        expected = serial.registerTask.bind(serial, {});
        expect(expected).to.throw(TypeError, errorMsg);
      });
    });
  });
});
