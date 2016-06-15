'use strict';

/**
 * Expose Serial
 */
module.exports = Serial;

/**
 * Serial constructor.
 */
function Serial() {
  if (!(this instanceof Serial)) {
    return new Serial();
  }

  this.tasks = [];
}

/**
 * Add a task in execution queue .
 *
 * @param  {function} task
 */
Serial.prototype.registerTask = function(task) {
  if (typeof task !== 'function') {
    throw new TypeError('Expect a function.');
  }

  this.tasks.push(task);
};

/**
 * Get current task of the list.
 *
 * @private
 * @return {function|null}
 */
Serial.prototype._getCurrent = function() {
  var tasks = this.tasks;

  if (tasks.length > 0) {
    return tasks.shift();
  }

  return null;
};

/**
 * Call next function in task list.
 *
 * @param  {Object}  error
 * @param  {Mixed}   result
 */
Serial.prototype.next = function next(error, result) {
  var current;

  if (error) {
    throw error;
  }

  current = this._getCurrent();

  if (current) {
    current(result, next.bind(this));
  }
};

/**
 * Start execution of the task list.
 *
 * @param  {Mixed} initialValue
 */
Serial.prototype.start = function(initialValue) {
  if (this.tasks.length > 0) {
    this.next(null, initialValue);
  }
};
