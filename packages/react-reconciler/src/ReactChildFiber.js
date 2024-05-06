import { REACT_ELEMENT_TYPE, REACT_TEXT } from 'shared/ReactSymbols'
import { primitiveTypes } from 'shared/primitiveTypes'
import { createFiberFromElement, createFiberFromText } from './ReactFiber'

function createChildReconciler(shouldTrackSideEffects) {
  /**
   * 构建workInProgress的子fiber
   * @param {FiberNode} workInProgress 新fiber
   * @param {FiberNode} oldFiberFirstChild 旧fiber的第一个子fiber
   * @param {VNodes} childrenVNode workInProgress的子VNodes
   */
  function reconcileChildFibers(workInProgress, oldFiberFirstChild, childrenVNode) {
    // 处理多个节点
    if (Array.isArray(childrenVNode)) {
      return reconcileChildrenArray(workInProgress, oldFiberFirstChild, childrenVNode)
    }
    // 子虚拟dom为单个节点
    if (childrenVNode && typeof childrenVNode === 'object') {
      switch (childrenVNode.$$typeof) {
        case REACT_ELEMENT_TYPE:
          const VNode = childrenVNode
          return reconcileSingleElement(workInProgress, oldFiberFirstChild, VNode)
        default:
          break
      }
    }
    // 子虚拟dom为单个文本节点
    if (childrenVNode && primitiveTypes.includes(typeof childrenVNode)) {
      const content = childrenVNode
      return reconcileText(workInProgress, oldFiberFirstChild, content)
    }
  }

  /**
   * 根据单个VNode构建fiber
   * @param {FiberNode} workInProgress
   * @param {FiberNode} oldFiberFirstChild
   * @param {VNode} VNode
   * @returns
   */
  function reconcileSingleElement(workInProgress, oldFiberFirstChild, VNode) {
    // 根据虚拟dom创建fiber
    const created = createFiberFromElement(VNode)
    // 记录父fiber
    created.return = workInProgress
    return created
  }

  /**
   * 根据文本构建fiber
   * @param {FiberNode} workInProgress
   * @param {FiberNode} oldFiberFirstChild
   * @param {text} content
   * @returns
   */
  function reconcileText(workInProgress, oldFiberFirstChild, content) {
    // 根据虚拟dom创建fiber
    const created = createFiberFromText(content)
    // 记录父fiber
    created.return = workInProgress
    return created
  }

  /**
   * 处理虚拟dom为多个节点
   * @param {FiberNode} workInProgress
   * @param {FiberNode} oldFiberFirstChild
   * @param {VNode[]} childrenVNode
   * @returns {FiberNode} workInProgress的第一个子fiber
   */
  function reconcileChildrenArray(workInProgress, oldFiberFirstChild, childrenVNode) {
    const childFibers = []
    let prevFiber = null
    childrenVNode.forEach((child) => {
      let fiber = reconcileChildFibers(workInProgress, oldFiberFirstChild, child)
      prevFiber && (prevFiber.sibling = fiber)
      prevFiber = fiber
      childFibers.push(fiber)
    })
    return childFibers[0]
  }
  return reconcileChildFibers
}
export const mountChildFibers = createChildReconciler(false)
export const reconcileChildFibers = createChildReconciler(true)
