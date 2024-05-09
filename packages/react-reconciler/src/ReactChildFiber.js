import { REACT_ELEMENT_TYPE, REACT_TEXT } from 'shared/ReactSymbols'
import { primitiveTypes } from 'shared/primitiveTypes'
import { createFiberFromElement, createFiberFromText, createWorkInProgress } from './ReactFiber'
import { ChildDeletion, Placement } from './ReactFiberFlags'

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
   * 复用旧fiber
   * @param {*} fiber
   * @param {*} pendingProps
   * @returns
   */
  function useFiber(fiber, pendingProps) {
    const clone = createWorkInProgress(fiber, pendingProps)
    clone.index = 0
    clone.sibling = null
    return clone
  }

  function deleteChild(parentFiber, childToDelete) {
    const { deletions } = parentFiber
    if (deletions === null) {
      parentFiber.flags |= ChildDeletion
      parentFiber.deletions = [childToDelete]
    } else {
      parentFiber.deletions.push(childToDelete)
    }
  }

  function deleteRemainingChildren(parentFiber, child) {
    let node = child
    while (node !== null) {
      deleteChild(parentFiber, child)
      node = child.sibling
    }
  }

  /**
   * 根据单个VNode构建fiber
   * @param {FiberNode} workInProgress 新的父fiber
   * @param {FiberNode} oldFiberFirstChild
   * @param {VNode} VNode
   * @returns
   */
  function reconcileSingleElement(workInProgress, oldFiberFirstChild, VNode) {
    const { key, type } = VNode
    let node = oldFiberFirstChild
    while (node !== null) {
      if (node.key === key) {
        // key和type都相同，复用，并删除其余兄弟节点
        if (node.type === type) {
          // 删除其余fiber
          deleteRemainingChildren(workInProgress, node.sibling)
          // 复用
          const existing = useFiber(node, VNode.props)
          existing.return = workInProgress
          return existing
        } else {
          // key相同，type不同，删除所有节点，并创建新fiber
          deleteRemainingChildren(workInProgress, node)
          const created = createFiberFromElement(VNode)
          created.return = workInProgress
          return created
        }
      } else {
        // key不同，删除当前节点，并继续遍历兄弟节点
        deleteChild(workInProgress, node)
        node = node.sibling
      }
    }
    const created = createFiberFromElement(VNode)
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
   * 根据key相同的虚拟dom和旧fiber生成新fiber，如果二者type相同则复用
   * @param {*} workInProgress
   * @param {*} oldChildFiber
   * @param {*} newChildVNode
   * @returns
   */
  function updateElement(workInProgress, oldChildFiber, newChildVNode) {
    const { type, props: pendingProps } = newChildVNode
    // 旧fiber和新虚拟dom的type相同，复用
    if (oldChildFiber.type === type) {
      const existing = useFiber(oldChildFiber, pendingProps)
      existing.return = workInProgress
      return existing
    } else {
      // 不同，新建fiber节点
      const created = createFiberFromElement(newChildVNode)
      created.return = workInProgress
      return created
    }
  }

  /**
   * 新虚拟dom与旧fiber做比较，如果二者key相同
   * @param {*} workInProgress
   * @param {*} oldChildFiber
   * @param {*} newChildVNode
   * @returns
   */
  function updateSlot(workInProgress, oldChildFiber, newChildVNode) {
    const key = oldChildFiber !== null ? oldChildFiber.key : null
    if (typeof newChildVNode === 'object') {
      switch (newChildVNode.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return updateElement(workInProgress, oldChildFiber, newChildVNode)
        default:
          return null
      }
    }
    return null
  }

  /**
   * 第三轮中，拿到剩下的旧fiber的key map
   * @param {*} workInProgress
   * @param {*} oldChildFiber
   * @returns
   */
  function mapRemainingChildren(workInProgress, oldChildFiber) {
    const existingChildrenMap = new Map()
    let existingChild = oldChildFiber
    while (existingChild !== null) {
      if (existingChild.key !== null) {
        existingChildrenMap.set(existingChild.key, existingChild)
      } else {
        existingChildrenMap.set(existingChild.index, existingChild)
      }
    }
    return existingChildrenMap
  }

  function updateFormMap(existingChildrenMap, workInProgress, newIdx, newChildVNode) {
    if (typeof newChildVNode === 'object') {
      switch (newChildVNode.$$typeof) {
        case REACT_ELEMENT_TYPE:
          const matchedFiber = existingChildrenMap.get(newChildVNode.key === null ? newIdx : newChildVNode.key) || null
          return updateElement(workInProgress, matchedFiber, newChildVNode)
      }
    }
  }

  function placeChild(newFiber, lastPlacedIndex, newIdx) {
    newFiber.index = newIdx
    if (!shouldTrackSideEffects) {
      return lastPlacedIndex
    }
    const oldFiber = newFiber.alternate
    // 说明newFiber是复用的
    if (oldFiber !== null) {
      const oldIdx = oldFiber.index
      // 说明在基准线左边，需要移动
      if (oldIdx < lastPlacedIndex) {
        newFiber.flags |= Placement
        return lastPlacedIndex
      }
      lastPlacedIndex = oldIdx
      return lastPlacedIndex
    } else {
      // 说明newFiber是新建的
      newFiber.flags |= Placement
      return lastPlacedIndex
    }
  }

  /**
   * 处理虚拟dom为多个节点
   * @param {FiberNode} workInProgress
   * @param {FiberNode} oldFiberFirstChild
   * @param {VNode[]} childrenVNode
   * @returns {FiberNode} workInProgress的第一个子fiber
   */
  function reconcileChildrenArray(workInProgress, oldFiberFirstChild, childrenVNode) {
    let prevNewFiber = null
    let resultingFirstChild = null
    let newIdx = 0
    let oldFiber = oldFiberFirstChild
    let lastPlacedIndex = -1
    // 第一轮：按序比较，key不同即停止，旧fiber遍历完或者新虚拟dom遍历完也停止；key相同，如果type也相同，复用旧fiber，如果type不同，新建fiber，删除旧fiber。
    for (; oldFiber !== null && newIdx < childrenVNode.length; newIdx++) {
      // key不同，跳出第一轮
      if (oldFiber.key !== childrenVNode[newIdx].key) break

      const newFiber = updateElement(workInProgress, oldFiber, childrenVNode[newIdx])
      // 说明key相同，type不同，删除旧fiber
      if (newFiber.alternate === null) {
        deleteChild(workInProgress, oldFiber)
      }
      // 设置基准线
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
      if (prevNewFiber === null) {
        resultingFirstChild = newFiber
      } else {
        prevNewFiber.sibling = newFiber
      }
      prevNewFiber = newFiber
      oldFiber = oldFiber.sibling
    }
    // 第二轮：此时旧fiber遍历完，新虚拟dom未遍历完，根据剩下的虚拟dom新建fiber
    if (oldFiber === null) {
      for (; newIdx < childrenVNode.length; newIdx++) {
        const newFiber = createChild(workInProgress, childrenVNode[newIdx])
        if (newFiber === null) continue
        placeChild(newFiber, newIdx)
        if (prevNewFiber === null) {
          resultingFirstChild = newFiber
        } else {
          prevNewFiber.sibling = newFiber
        }
        prevNewFiber = newFiber
      }
    }
    // 第三轮：旧fiber和新虚拟dom都没遍历完
    // 剩余的旧fiber节点
    const existingChildrenMap = mapRemainingChildren(workInProgress, oldFiber)
    for (; newIdx < childrenVNode.length; newIdx++) {
      let newFiber = null
      const matchedFiber = existingChildrenMap.get(newChildVNode.key === null ? newIdx : newChildVNode.key) || null
      // 不能匹配到key相同的旧fiber，则新建
      if (matchedFiber === null) {
        newFiber = createFiberFromElement(newChildVNode)
        newFiber.return = workInProgress
      } else {
        newFiber = updateElement(workInProgress, matchedFiber, newChildVNode)
      }
      // key和type都相同，能复用
      if (newFiber.alternate !== null) {
        existingChildrenMap.delete(newFiber.key === null ? newIdx : newFiber.key)
      }
      lastPlacedIndex = placeChild(newFiber, lastPlacedIndex, newIdx)
      if (prevNewFiber === null) {
        resultingFirstChild = newFiber
      } else {
        prevNewFiber.sibling = newFiber
      }
      prevNewFiber = newFiber
    }

    // TODO: 旧fiber未遍历完，新虚拟dom遍历完
  }
  return reconcileChildFibers
}
export const mountChildFibers = createChildReconciler(false)
export const reconcileChildFibers = createChildReconciler(true)
