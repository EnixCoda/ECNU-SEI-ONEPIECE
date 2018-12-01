import { promisifyTypes, promisifyActionCreator } from '../promisifySaga'

export const asyncTypes = promisifyTypes({
  loadTree: `LOAD_TREE`,
})

export const syncTypes = {
  focusNode: `FOCUS_NODE`,
  blurNode: `BLUR_NODE`,
}

export const types = {
  ...asyncTypes,
  ...syncTypes,
}

export const loadTree = promisifyActionCreator(types.loadTree, {
  success: root => ({ root }),
})

export const focusNode = node => ({
  type: types.focusNode,
  payload: { node },
})

export const blurNode = node => ({
  type: types.blurNode,
  payload: { node },
})
