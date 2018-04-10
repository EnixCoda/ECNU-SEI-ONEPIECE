import { call, put } from 'redux-saga/effects'
import { bindActionCreators as reduxBindActionCreators } from 'redux'

export function promisifyType(base) {
  return {
    base,
    pending: base + '_PENDING',
    success: base + '_SUCCESS',
    fail: base + '_FAIL',
  }
}

export function promisifyTypes(types) {
  const promisified = {}
  for (const key in types) {
    promisified[key] = promisifyType(types[key])
  }
  return promisified
}

function noop() {}
export function promisifyActionCreator(type, payloads = {}) {
  const { init = noop, run = noop, success = noop, fail = noop } = payloads
  return {
    init: (...args) => ({
      type: type.base,
      payload: init(...args),
    }),
    run: (...args) => ({
      type: type.pending,
      payload: run(...args),
    }),
    success: (...args) => ({
      type: type.success,
      payload: success(...args),
    }),
    fail: (...args) => ({
      type: type.fail,
      payload: fail(...args),
    }),
  }
}

/**
 * task should be an async function or either returns a Promise
 */
export function* promisifySaga(effect, actionTypes, actionCreator, task) {
  yield effect(actionTypes.base, function*() {
    yield put(actionCreator.run())
    try {
      const result = yield call(task)
      yield put(actionCreator.success(result))
    } catch (err) {
      yield put(actionCreator.fail(err))
    }
  })
}

export function bindActionCreators(target, dispatch) {
  if (target.init) return reduxBindActionCreators(target.init, dispatch)
  if (typeof target === 'function') return reduxBindActionCreators(target, dispatch)
  const dispatches = {}
  for (const key in target) {
    dispatches[key] = bindActionCreators(target[key], dispatch)
  }
  return dispatches
}
