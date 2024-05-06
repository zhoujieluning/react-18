import { NoFlags } from './ReactFiberFlags'
import { HostComponent, HostRoot, HostText } from './ReactWordTags'
import {
  createElement,
  appendChild,
  setPropsForDom,
  createText,
} from 'react-dom-bindings/src/client/ReactDOMHostConfig'

/**
 * 构建fiber对应的真实dom
 * @param {FiberNode} oldFiber 旧fiber
 * @param {FiberNode} workInProgress 新fiber
 */
export function completeWork(oldFiber, workInProgress) {
  const props = workInProgress.pendingProps
  switch (workInProgress.tag) {
    case HostRoot:
      bubbleProperties(workInProgress)
      break
    case HostComponent:
      const { type } = workInProgress
      // 创建dom
      const domElement = createElement(type)
      // 挂载子dom
      appendChildren(domElement, workInProgress)
      workInProgress.stateNode = domElement
      // 给dom设置属性
      setPropsForDom(domElement, type, props)
      bubbleProperties(workInProgress)
      break
    case HostText:
      const content = props
      workInProgress.stateNode = createText(content)
      bubbleProperties(workInProgress)
      break
  }
}

/**
 * 收集子节点的变更信息
 * @param {FiberNode} workInProgress
 */
function bubbleProperties(workInProgress) {
  // let subtreeFlags = NoFlags
  // let child = workInProgress.child
  // while(child !== null) {
  //     subtreeFlags |= child.subtreeFlags
  //     subtreeFlags |= child.flags
  //     child = child.sibling
  // }
  // workInProgress.subtreeFlags = subtreeFlags
}

/**
 * 挂载所有子dom
 * @param {DOM} parent 父fiber对应的真实dom
 * @param {FiberNode} workInProgress 父fiber
 */
function appendChildren(parent, workInProgress) {
  let fiber = workInProgress.child
  while (fiber !== null) {
    if ([HostComponent, HostText].includes(fiber.tag)) {
      // 节点类型为标签或文本，直接挂载
      appendChild(parent, fiber.stateNode)
      fiber = fiber.sibling
    } else if (fiber.child !== null) {
      // 节点类型为函数组件、类组件等，没法直接挂载，那么拿它的子节点
      fiber = fiber.child
      continue
    }
    console.log(parent)
  }
}
