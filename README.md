# Task

A spec and reference implementation for Tasks: cancellable operations.

_This is still very much a work-in-progress, but feedback is very welcome!_

## Naïve example

```js
var task = new Task(function *() {
  doSomethingUrgent()

  yield // This is a cancellation point.

  getSomeMutualResource()

  try {
    yield
  } catch (e) {
    // Cancellation has been requested. Let's oblige.
    cleanUpMutualResource()
    return
  }

  // No cancellation at this point, but let's return the Promise.
  return doSomethingImportant()
    .then(function () {
      cleanUpMutualResource()
    })
})
```

## Goals

1. Operation authors opt-in to cancellation at specific locations.
1. Operation authors have the option to clean up resources during cancellation.
1. Operation consumers can request cancellation at any time.
1. Operation consumers can get a Promise for the outcome of the operation.
1. Tasks can be nested, with nested Tasks cancellable in the same fashion.
1. _(Optional)_ Tasks can be paused and resumed.

## Run the test suite

With Node installed (version 4+ recommended, 0.12+ required):

1. `git clone https://github.com/Schoonology/task.js.git`
1. `cd task.js`
1. `npm install`
1. `npm test`
