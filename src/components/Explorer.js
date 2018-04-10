import React from 'react'
import { connect } from 'react-redux'

import { bindActionCreators } from '../chaos/promisifySaga'
import { loadTree, actNode } from '../chaos/explorer/actions'

import Item from './Item'

class Explorer extends React.PureComponent {
  render() {
    const { node, loadTree } = this.props
    if (!node) {
      return (
        <div onClick={loadTree}>
          load tree!
        </div>
      )
    }
    return node.content.map(item => <Item key={item.id || item.name} node={item} onFocus={() => actNode(item)} />)
  }
}

function mapStateToProps({ explorer }) {
  return {
    node: explorer.peak,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    loadTree,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Explorer)
