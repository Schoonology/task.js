var test = require('ava')
var Task = require('../task')

test('Task is a function', t => {
  t.truthy(typeof Task === 'function')
})

test('Task throws TypeError without a run function', t => {
  t.throws(function () {
    new Task()
  }, TypeError)
})

test('Task throws TypeError without new', t => {
  t.throws(function () {
    Task(function () {})
  }, TypeError)
})

test('Task is callable with a non-generator run function', t => {
  t.truthy(new Task(function () {}))
})

test('Task is callable with a generator run function', t => {
  t.truthy(new Task(function *() {}))
})

test('task.result is a Promise', t => {
  var task = new Task(function () {})

  t.truthy(typeof task.result.then === 'function')
})

test('task.result resolves with non-generator return value', t => {
  var task = new Task(function () {
    return 42
  })

  return task.result
    .then(value => {
      t.truthy(value === 42)
    })
})

test('task.result resolves with generator return value', t => {
  var task = new Task(function *() {
    return 42
  })

  return task.result
    .then(value => {
      t.truthy(value === 42)
    })
})

test('task.result resolves with yielded generator return value', t => {
  var task = new Task(function *() {
    yield
    return 42
  })

  return task.result
    .then(value => {
      t.truthy(value === 42)
    })
})

test('task.result rejects with thrown error in non-generator', t => {
  var task = new Task(function () {
    throw new Error('OOPS')
  })

  return task.result
    .then(() => {
      t.fail('Should have been rejected')
    }, err => {
      t.truthy(err.message === 'OOPS')
    })
})

test('task.result rejects with thrown error in generator', t => {
  var task = new Task(function *() {
    throw new Error('OOPS')
  })

  return task.result
    .then(() => {
      t.fail('Should have been rejected')
    }, err => {
      t.truthy(err.message === 'OOPS')
    })
})

test('task.result rejects with thrown error in yielded generator', t => {
  var task = new Task(function *() {
    yield
    throw new Error('OOPS')
  })

  return task.result
    .then(() => {
      t.fail('Should have been rejected')
    }, err => {
      t.truthy(err.message === 'OOPS')
    })
})

test('task.result rejects with cancellation when cancelled', t => {
  var task = new Task(function *() {
    yield
  })

  task.cancel()

  return task.result
    .then(() => {
      t.fail('Should have been rejected')
    }, err => {
      t.truthy(err.message === 'CANCEL')
    })
})

test('task.result resolves without cancellation without yield', t => {
  var task = new Task(function *() {})

  task.cancel()

  return task.result
})

test('task.cancel allows cleanup', t => {
  var clean = false
  var task = new Task(function *() {
    try {
      yield
    } catch (e) {
      clean = true
      throw e
    }
  })

  task.cancel()

  return task.result
    .then(() => {
      t.fail('Should have been rejected')
    }, err => {
      t.truthy(err.message === 'CANCEL')
      t.truthy(clean)
    })
})

test('task.result is resolved with a returned Promise from non-generator', t => {
  var task = new Task(function () {
    return Promise.resolve(42)
  })

  return task.result
    .then(value => {
      t.truthy(value === 42)
    })
})

test('task.result is resolved with a returned Promise from generator', t => {
  var task = new Task(function *() {
    return Promise.resolve(42)
  })

  return task.result
    .then(value => {
      t.truthy(value === 42)
    })
})

test('task.result is rejected with a returned, rejected Promise from non-generator', t => {
  var task = new Task(function () {
    return Promise.reject(new Error('OOPS'))
  })

  return task.result
    .then(() => {
      t.fail('Should have been rejected')
    }, err => {
      t.truthy(err.message === 'OOPS')
    })
})

test('task.result is rejected with a returned, rejected Promise from generator', t => {
  var task = new Task(function *() {
    return Promise.reject(new Error('OOPS'))
  })

  return task.result
    .then(() => {
      t.fail('Should have been rejected')
    }, err => {
      t.truthy(err.message === 'OOPS')
    })
})
