import { scheduleCallback } from 'scheduler'
import { createWorkInProgress } from './ReactFiber'
import { beginWork } from './ReactFiberBeginWork'

// 代表后缓冲区中的fiber树，即工作中的fiber树，指向RootFiber
let workInProgress = null

/**
 * 
 * @param {*} root FiberRoot
 */
export function scheduleUpdateOnFiber(root) {
    ensureRootIsScheduled(root)
}

function ensureRootIsScheduled(root) {
    scheduleCallback(performConcurrentWorkOnRoot.bind(null, root))
}

function performConcurrentWorkOnRoot(root) {
    // 根据FiberNode构建fiber树
    renderRootSync(root)
    // 后缓冲区中的fiber树替换前缓冲区fiber树。 finishedWork：前缓冲区中的fiber树；alternate：后缓冲区中的fiber树
    root.finishedWork = root.current.alternate
    // 真正挂载
    // commitRoot(root)
}

function renderRootSync(root) {
    prepareFreshStack(root)
    workLoopSync()
}

function prepareFreshStack(root) {
    // 构建后缓冲区fiber树
    workInProgress = createWorkInProgress(root.current, null)
}

function workLoopSync() {
    while(workInProgress !== null) {
        performUnitOfWork(workInProgress)
    }
}

function performUnitOfWork(unitOfWork) {
    const current = unitOfWork.alternate
    const next = beginWork(current, unitOfWork)
    unitOfWork.memoizedProps = unitOfWork.pendingProps
    if(next === null) {
        completeUnitOfWork(unitOfWork)
    } else {
        workInProgress = next
    }
}