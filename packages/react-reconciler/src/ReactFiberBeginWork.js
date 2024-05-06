import { HostComponent, HostRoot, HostText } from './ReactWordTags'
import { mountChildFibers, reconcileChildFibers } from './ReactChildFiber'
import { processUpdateQueue } from './ReactFiberClassUpdateQueue'
import { shouldSetTextContent } from 'react-dom-bindings/src/client/ReactDOMHostConfig'

/**
 * 构建workInProgress的子fiber
 * @param {FiberNode} oldFiber 旧fiber
 * @param {FiberNode} workInProgress 新fiber
 * @returns 第一个子fiber
 */
export function beginWork(oldFiber, workInProgress) {
  switch (workInProgress.tag) {
    case HostRoot:
      return updateHostRoot(oldFiber, workInProgress)
    case HostComponent:
      return updateHostComponent(oldFiber, workInProgress)
    case HostText:
      return null
    default:
      return null
  }
}

/**
 * 构建workInProgress的子fiber--处理workInProgress为RootFiber的情况
 * @param {FiberNode} oldFiber
 * @param {FiberNode} workInProgress
 * @returns {FiberNode} 第一个子fiber
 */
function updateHostRoot(oldFiber, workInProgress) {
  // 递归遍历workInProgress更新队列，将更新合并为一个
  processUpdateQueue(workInProgress)
  // 拿到合并后的状态
  const memoizedState = workInProgress.memoizedState
  // workInProgress对应的子VNodes
  const childrenVNode = memoizedState.VNodeRoot
  // 根据子VNodes构建子fiber，并把第一个子fiber挂到workInProgress.child
  reconcileChildren(oldFiber, workInProgress, childrenVNode)
  return workInProgress.child
}

function updateHostComponent(oldFiber, workInProgress) {
  const { type } = workInProgress
  // 拿到workInProgress对应的VNode的props
  const props = workInProgress.pendingProps
  let childrenVNode = props.children
  // const isDirectTextChild = shouldSetTextContent(type, nextProps)
  // if(isDirectTextChild) {
  //     childrenVNode = null
  // }
  reconcileChildren(oldFiber, workInProgress, childrenVNode)
  return workInProgress.child
}

/**
 *
 * @param {FiberNode} oldFiber 旧fiber
 * @param {FiberNode} workInProgress 新fiber
 * @param {VNodes} childrenVNode workInProgress对应的子VNodes
 */
function reconcileChildren(oldFiber, workInProgress, childrenVNode) {
  if (oldFiber === null) {
    // 旧fiber不存在
    // 根据子虚拟dom，给workInProgress创建子fiber
    workInProgress.child = mountChildFibers(workInProgress, null, childrenVNode)
  } else {
    // 旧fiber存在
    workInProgress.child = reconcileChildFibers(workInProgress, oldFiber.child, childrenVNode)
  }
}
