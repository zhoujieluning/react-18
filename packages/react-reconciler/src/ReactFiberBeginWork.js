import { HostComponent, HostRoot, HostText } from "./ReactWordTags";
import { mountChildFibers, reconcileChildFibers } from './ReactChildFiber'
import { processUpdateQueue } from './ReactFiberClassUpdateQueue'
import { shouldSetTextContent } from 'react-dom-bindings/src/client/ReactDOMHostConfig'

/**
 * 
 * @param {*} current 旧fiber
 * @param {*} workInProgress 新fiber
 * @returns 新的子fiber节点
 */
export function beginWork(current, workInProgress) {
    switch(workInProgress.tag) {
        case HostRoot:
            return updateHostRoot(current, workInProgress)
        case HostComponent:
            return updateHostComponent(current, workInProgress)
        case HostText:
            return null
        default:
            return null
    }
}

function updateHostRoot(current, workInProgress) {
    processUpdateQueue(workInProgress)
    const nextState = workInProgress.memoizedState
    // workInProgress对应的子虚拟dom
    const nextChildren = nextState.element
    reconcileChildren(current, workInProgress, nextChildren)
    return workInProgress.child
}

function updateHostComponent(current, workInProgress) {
    const { type } = workInProgress
    const nextProps = workInProgress.pendingProps
    let nextChildren = nextProps.children
    const isDirectTextChild = shouldSetTextContent(type, nextProps)
    if(isDirectTextChild) {
        nextChildren = null
    }
    reconcileChildren(current, workInProgress, nextChildren)
    return workInProgress.child
}

/**
 * 
 * @param {*} current 旧fiber
 * @param {*} workInProgress 新fiber
 * @param {*} nextChildren 新fiber对应的子虚拟dom
 */
function reconcileChildren(current, workInProgress, nextChildren) {
    if(current === null) {
        // 根据子虚拟dom，给workInProgress创建子fiber
        workInProgress.child = mountChildFibers(workInProgress, null, nextChildren)
    } else {
        workInProgress.child = reconcileChildFibers(workInProgress, current.child, nextChildren)

    }
}