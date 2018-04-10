import { takeEvery, put } from 'redux-saga/effects'
import { loadTree, types } from './explorer/actions'
import { promisifySaga } from './promisifySaga'

function* test() {
  const sampleTreeData = {
    name: '/',
    content: [{ name: 'A', id: 'a', content: [] }, { name: 'B', id: 'b', content: [] }],
  }
  console.log('before test!')
  yield put(loadTree(sampleTreeData))
  console.log('after test!')
}

// with promisifySaga, we only need to care about the actual async logic here
const getIndex = () =>
  fetch('/api/index')
    .then(response => response.json())
    .then(({ data }) => data.index)
    .catch(err => {
      throw new Error('I caught it! Now transferring to action error handler!', err)
    })

export default function* Saga() {
  console.log('Saga running')
  yield takeEvery('@@TEST', test)
  yield promisifySaga(takeEvery, types.loadTree, loadTree, getIndex)
}
