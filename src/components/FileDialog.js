import React from 'react'
import { connect } from 'react-redux'
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withMobileDialog,
} from 'material-ui/Dialog'
import Button from 'material-ui/Button'

import { bindActionCreators } from '../chaos/promisifySaga'
import { blurNode } from '../chaos/explorer/actions'

class FileDialog extends React.Component {
  render() {
    const { open, item, blurNode } = this.props
    if (!item) return null
    return (
      <Dialog open={open} onClose={blurNode}>
        <DialogTitle>{item.name}</DialogTitle>
        <DialogContent>
          <DialogContentText>{item.id}</DialogContentText>
          <DialogActions>
            <Button>btn1</Button>
            <Button>btn2</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    )
  }
}

function mapStateToProps({ explorer }) {
  const { focus } = explorer
  return {
    open: focus.activated,
    item: focus.item,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      blurNode,
    },
    dispatch
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(withMobileDialog()(FileDialog))
