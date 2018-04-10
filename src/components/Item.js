import React from 'react'

export default function ExplorerItem({ node, focusNode }) {
  return <div onClick={focusNode}>{node.name}</div>
}
