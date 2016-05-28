var util = require('util')

function Task(fn) {
  if (!(this instanceof Task)) {
    throw new TypeError(this + ' is not a task')
  }

  if (typeof fn !== 'function') {
    throw new TypeError('Task runner ' + fn + ' is not a function')
  }

  this.result = new Promise((resolve, reject) => {
    var result = fn()

    // Non-generator functions
    if (!result || typeof result.next !== 'function') {
      return resolve(result)
    }

    var iterator = result

    this.cancel = function cancel() {
      try {
        iterator.throw(new Error('CANCEL'))
      } catch (e) {
        return reject(e)
      }
    }

    function run() {
      var yielded

      try {
        yielded = iterator.next()
      } catch (e) {
        return reject(e)
      }

      if (yielded.done) {
        return resolve(yielded.value)
      }

      setImmediate(run)
    }
    run()
  })
}

Task.prototype.cancel = function () {
  // By default, there is nothing to cancel. If the run function returns an
  // iterator, then `cancel` is wired up in the controller.
}

module.exports = Task
