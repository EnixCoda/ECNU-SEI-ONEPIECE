import React from 'react'
import Avatar from 'material-ui/Avatar'
import IconButton from 'material-ui/IconButton'
import List, { ListItemAvatar, ListItem, ListItemText, ListItemSecondaryAction } from 'material-ui/List'
import FolderIcon from '@material-ui/icons/Folder'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import { withStyles } from 'material-ui/styles'

export default withStyles()(function ExplorerItem({ node, onFocus }) {
  return (
    <ListItem button onClick={onFocus}>
      <ListItemAvatar>
        <Avatar>
          <FolderIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText>{node.name}</ListItemText>
      <ListItemSecondaryAction>
        <IconButton>
          <CloudDownloadIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  )
})
