import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import { load } from '../actions'

function Test({ loading, testAction }) {
  return (
    <div>
      <div onClick={testAction}>{loading ? '...' : 'Hello, world'}</div>
      <input type="text" />
    </div>
  )
}

export default connect(
  ({ loading }) => ({ loading }),
  dispatch => ({
    testAction: bindActionCreators(load, dispatch),
  })
)(Test)
