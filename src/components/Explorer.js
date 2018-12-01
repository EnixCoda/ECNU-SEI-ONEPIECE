import React from 'react'
import { connect } from 'react-redux'
import List, { ListItem } from 'material-ui/List'

import { bindActionCreators } from '../chaos/promisifySaga'
import { loadTree, focusNode } from '../chaos/explorer/actions'

import Item from './Item'

class Explorer extends React.PureComponent {
  render() {
    const { node, loadTree, focusNode } = this.props
    if (!node) {
      return (
        <div onClick={loadTree}>
          load tree!
        </div>
      )
    }
    return (
      <List>
        {node.content.map(item => <Item key={item.id || item.name} node={item} onFocus={() => focusNode(item)} />)}
      </List>
    )
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
    focusNode,
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Explorer)
