import { HostRoot } from './ReactWordTags'

/**
 * 根据sourceFiber向上一直找到FiberRoot
 * @param {*} sourceFiber
 */
export function markUpdateLaneFromFiberToRoot(sourceFiber) {
  let node = sourceFiber
  let parent = node.return
  while (parent !== null) {
    node = parent
    parent = node.return
  }

  if (node.tag === HostRoot) {
    return node.stateNode
  }

  return null
}
