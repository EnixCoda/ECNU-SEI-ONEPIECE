import produce from 'immer'

import { types } from './actions'

const initialState = {
  root: {
    name: '',
    isLesson: false,
    content: null,
  },
  location: [],
  focus: null,
  /* {
    item: {},
    comment: {
      content: '',
      name: '',
      anonymous: false,
    },
    data: {
      score: 0 || null,
      comments: [{}],
    },
  } */
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

    case types.actNode: {
      return produce(state, baseState => {
        const { node } = payload
        if (!baseState.focus) {
          baseState.focus = {
            item: node,
            score: NaN,
            comment: null,
          }
        } else {
          baseState.location.push(node)
          baseState.peak = node
        }
        return baseState
      })
    }
  }
  return state
}
