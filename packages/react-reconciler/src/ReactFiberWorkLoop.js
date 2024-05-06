import { scheduleCallback } from 'scheduler'
import { createWorkInProgress } from './ReactFiber'
import { beginWork } from './ReactFiberBeginWork'
import { completeWork } from './ReactFiberCompleteWork'
import { MutationMask, NoFlags } from './ReactFiberFlags'
import { commitMutationEffectsOnFiber } from './ReactFiberCommitWork'

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
  console.log('performConcurrentWorkOnRoot')
  // 构建后缓冲区fiber树
  renderRootSync(FiberRoot)
  // 后缓冲区中的fiber树构建完毕，将其记录在FiberRoot.finishedWork
  FiberRoot.finishedWork = FiberRoot.current.alternate
  console.log(FiberRoot)
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
  while (workInProgress !== null) {
    const oldFiber = workInProgress.alternate
    // 构建子fiber，构建完返回第一个子fiber
    const firstChild = beginWork(oldFiber, workInProgress)
    // ？？？
    workInProgress.memoizedProps = workInProgress.pendingProps
    if (firstChild === null) {
      // 此时workInProgress指向子fiber树最深层的第一个节点，开始completeWork阶段：即构建fiber对应的真实dom
      do {
        completeWork(null, workInProgress)
        let sibling = workInProgress.sibling
        if (sibling !== null) {
          // 兄弟节点存在，继续构建其子fiber
          workInProgress = sibling
          return
        } else {
          // 兄弟节点不存在，说明当前层级已经处理结束，开始处理父fiber层级
          workInProgress = workInProgress.return
          console.log(workInProgress)
        }
      } while (workInProgress !== null)
    } else {
      workInProgress = firstChild
    }
  }
}

function commitRoot(FiberRoot) {
  const { finishedWork, current: RootFiber } = FiberRoot
  // 子树是否有更新
  const subtreeHasEffects = (finishedWork.subtreeFlags & MutationMask) != NoFlags
  const rootHasEffect = (finishedWork.flags & MutationMask) != NoFlags
  if (subtreeHasEffects || rootHasEffect) {
    commitMutationEffectsOnFiber(finishedWork, RootFiber)
  }
  FiberRoot.current = finishedWork
}
