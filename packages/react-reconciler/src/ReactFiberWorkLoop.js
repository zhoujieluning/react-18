import { scheduleCallback } from 'scheduler'
import { createWorkInProgress } from './ReactFiber'
import { beginWork } from './ReactFiberBeginWork'

// 代表后缓冲区中的fiber，即工作中的fiber
let workInProgress = null

/**
 * @param {FiberRoot} FiberRoot 
 */
export function scheduleUpdateOnFiber(FiberRoot) {
    // 浏览器空闲时，即没有东西在渲染时，执行新fiber的构建工作
    scheduleCallback(() => performConcurrentWorkOnRoot(FiberRoot))
}

/**
 * 
 * @param {FiberRoot} FiberRoot 
 */
function performConcurrentWorkOnRoot(FiberRoot) {
    console.log('performConcurrentWorkOnRoot');
    // 构建后缓冲区fiber树
    renderRootSync(FiberRoot)
    // 后缓冲区中的fiber树构建完毕，将其记录在FiberRoot.finishedWork
    FiberRoot.finishedWork = FiberRoot.current.alternate
    // 真正挂载
    // commitRoot(FiberRoot)
}

/**
 * 构建后缓冲区fiber树
 * @param {FiberRoot} FiberRoot 
 */
function renderRootSync(FiberRoot) {
    const RootFiber = FiberRoot.current
    // workInProgress首次创建，即后缓冲区RootFiber
    workInProgress = createWorkInProgress(RootFiber, null)
    // 后缓冲区RootFiber创建好了，开始递归创建子fiber
    workLoopSync()
}

function workLoopSync() {
    while(workInProgress !== null) {
        const oldFiber = workInProgress.alternate
        // 构建子fiber，构建完返回第一个子fiber
        const firstChild = beginWork(oldFiber, workInProgress)
        // ？？？
        workInProgress.memoizedProps = workInProgress.pendingProps
        if(firstChild === null) {
            return
            completeUnitOfWork(workInProgress)
        } else {
            workInProgress = firstChild
        }
    }
}
