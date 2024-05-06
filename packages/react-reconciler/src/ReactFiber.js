import { HostComponent, HostRoot, HostText, IndeterminatedComponent } from './ReactWordTags'
import { NoFlags } from './ReactFiberFlags'

/**
 * fiber节点生成器
 */
export function FiberNode(tag, pendingProps, key) {
  this.tag = tag // 代表fiber节点的类型, 0-函数组件 1-类组件 3-根节点 4-标签节点 5-文本节点
  this.key = key
  this.type = null // 代表fiber节点对应的VNode类型（原始标签、函数组件、类组件）
  this.stateNode = null // 真实dom节点
  this.return = null // 父FiberNode
  this.sibling = null // 兄弟FiberNode
  this.pendingProps = pendingProps // 待生效的props
  this.memoizedProps = null // 已生效的props
  this.memoizedState = null // 已生效的状态
  this.updateQueue = null
  this.flags = NoFlags // 节点操作标记
  this.subtreeFlags = NoFlags // 子节点操作标记
  this.alternate = null // 指向前或者后缓冲区中对应的节点
  this.index = 0
}

/**
 * 创建普通fiber
 * @param {number} tag 代表fiber节点的类型, 0-函数组件 1-类组件 3-根节点 4-标签节点 5-文本节点
 * @param {*} pendingProps
 * @param {*} key
 * @returns
 */
export function createFiber(tag, pendingProps, key) {
  return new FiberNode(tag, pendingProps, key)
}

/**
 * 创建RootFiber
 * @returns
 */
export function createHostRootFiber() {
  return createFiber(HostRoot, null, null)
}

/**
 * 获取或者创建后缓冲区fiber
 * @param {FiberNode} oldFiber
 * @param {*} pendingProps
 */
export function createWorkInProgress(oldFiber, pendingProps) {
  // 获取后缓冲区fiber树，如果没有，则创建
  let workInProgress = oldFiber.alternate
  if (workInProgress === null) {
    workInProgress = createFiber(oldFiber.tag, pendingProps, oldFiber.key)
    workInProgress.stateNode = oldFiber.stateNode
    workInProgress.alternate = oldFiber
    oldFiber.alternate = workInProgress
  } else {
    workInProgress.pendingProps = pendingProps
    workInProgress.flags = NoFlags
    workInProgress.subtreeFlags = NoFlags
  }
  workInProgress.type = oldFiber.type
  workInProgress.child = oldFiber.child
  workInProgress.memoizedProps = oldFiber.memoizedProps
  workInProgress.memoizedState = oldFiber.memoizedState
  workInProgress.updateQueue = oldFiber.updateQueue
  workInProgress.sibling = oldFiber.sibling
  workInProgress.index = oldFiber.index

  return workInProgress
}

export function createFiberFromElement(element) {
  const { type, key, props: pendingProps } = element
  return createFiberFromTypeAndProps(type, key, pendingProps)
}

export function createFiberFromText(content) {
  return createFiber(HostText, content, null)
}

export function createFiberFromTypeAndProps(type, key, pendingProps) {
  // 默认设为位置类型的fiber
  let tag = IndeterminatedComponent
  if (typeof type === 'string') {
    // 标签
    tag = HostComponent
  }
  const fiber = createFiber(tag, pendingProps, key)
  fiber.type = type
  return fiber
}
