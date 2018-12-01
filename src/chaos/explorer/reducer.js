import produce from 'immer'

import { types } from './actions'

const initialState = {
  root: {
    name: '',
    isLesson: false,
    content: null,
  },
  location: [],
  focus: {
    activated: false,
    item: null,
    comment: null || {
      content: '',
      name: '',
      anonymous: false,
    },
    data: {
      score: null || 0,
      comments: null || [{}],
    },
  },
}

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case types.loadTree.success: {
      const { root } = payload
      return produce(state, baseState => {
        baseState.root = root
        baseState.peak = baseState.root
        if (!baseState.location.length) {
          baseState.location.push(baseState.root)
        }
        return baseState
      })
    }

    case types.focusNode: {
      return produce(state, baseState => {
        const { node } = payload
        if (!node.content) {
          // it's a file
          Object.assign(baseState.focus, {
            item: node,
            score: null,
            comment: null,
            activated: true,
          })
        } else {
          // it's a folder
          baseState.location.push(node)
          baseState.peak = node
        }
        return baseState
      })
    }

    case types.blurNode: {
      return produce(state, baseState => {
        baseState.focus.activated = false
        return baseState
      })
    }
  }
  return state
}
