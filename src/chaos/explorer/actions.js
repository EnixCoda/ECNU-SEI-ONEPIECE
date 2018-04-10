import { promisifyTypes, promisifyActionCreator } from '../promisifySaga'

export const asyncTypes = promisifyTypes({
  loadTree: `LOAD_TREE`,
})

export const syncTypes = {
  actNode: `ACT_NODE`,
}

export const types = {
  ...asyncTypes,
  ...syncTypes,
}

export const loadTree = promisifyActionCreator(types.loadTree, {
  success: root => ({ root }),
})

export const actNode = node => ({
  type: types.actNode,
  payload: { node },
})
