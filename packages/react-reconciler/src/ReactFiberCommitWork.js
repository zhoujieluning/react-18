import { Placement } from './ReactFiberFlags'
import { FunctionComponent, HostComponent, HostRoot, HostText } from './ReactWordTags'
import { insertBefore, appendChild } from 'react-dom-bindings/src/client/ReactDOMHostConfig'

function recursivelyTraverseMutationEffects(RootFiber, parentFiber) {
  // if (parentFiber.subtreeFlags & MutationMask) {
  let { child } = parentFiber
  while (child !== null) {
    commitMutationEffectsOnFiber(child, RootFiber)
    child = child.sibling
  }
  // }
}

function commitReconciliationEffects(finishedWork) {
  commitPlacement(finishedWork)
}

function isHost(fiber) {
  return [HostRoot, HostComponent].includes(fiber.tag)
}

function getHostParentFiber(fiber) {
  const parent = fiber.return
  while (parent !== null) {
    if (isHost(parent)) {
      return parent
    }
    parent = parent.return
  }
}

function getHostSibling(fiber) {
  let node = fiber
  sibling: while (true) {
    while (node.sibling === null) {
      if (isHost(node.return)) {
        return null
      }
      node = node.return
    }
    node = node.sibling
    while (!isHost(node)) {
      if (node.flags & Placement) {
        continue sibling
      } else {
        node = node.child
      }
    }
    if (!(node.flags & Placement)) {
      return node.stateNode
    }
  }
}

function insertOrAppendPlacementNode(fiber, hostSiblingDom, parentDom) {
  if (isHost(fiber)) {
    const { stateNode } = fiber
    if (hostSiblingDom) {
      insertBefore(parentDom, stateNode, hostSiblingDom)
    } else {
      appendChild(parentDom, stateNode)
    }
  } else {
    const { child } = fiber
    if (child !== null) {
      insertOrAppendPlacementNode(child, hostSiblingDom, parentDom)
      let sibling = child.sibling
      while (sibling !== null) {
        insertOrAppendPlacementNode(sibling, hostSiblingDom, parentDom)
        sibling = sibling.sibling
      }
    }
  }
}

function commitPlacement(finishedWork) {
  // 拿到可挂载（标签）的父fiber
  const parentFiber = getHostParentFiber(finishedWork)
  const hostSiblingDom = getHostSibling(finishedWork)
  switch (parentFiber.tag) {
    case HostRoot: {
      const parentDom = parentFiber.stateNode.containerInfo
      insertOrAppendPlacementNode(finishedWork, hostSiblingDom, parentDom)
      break
    }
    case HostComponent: {
      const parentDom = parentFiber.stateNode.containerInfo
      insertOrAppendPlacementNode(finishedWork, hostSiblingDom, parentDom)
      break
    }
  }
}

export function commitMutationEffectsOnFiber(finishedWork, RootFiber) {
  switch (finishedWork.tag) {
    case FunctionComponent:
    case HostRoot:
    case HostComponent:
    case HostText: {
      recursivelyTraverseMutationEffects(RootFiber, finishedWork)
      commitReconciliationEffects(finishedWork)
    }
  }
}
