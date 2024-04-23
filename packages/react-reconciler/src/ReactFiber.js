import { HostRoot } from './ReactWordTags'
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
    this.alternate = null
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