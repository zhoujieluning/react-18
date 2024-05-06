import { markUpdateLaneFromFiberToRoot } from './ReactFiberConcurrentUpdates.js'

/**
 * 给fiber初始化更新队列
 * @param {*} fiber
 */
export function initialUpdateQueue(fiber) {
  const queue = {
    shared: {
      pending: null,
    },
  }
  fiber.updateQueue = queue
}

export function createUpdate() {
  return {}
}

/**
 * 将update插入fiber的更新队列，更新队列是一个单项循环链表
 * @param {*} fiber
 * @param {*} update
 * @returns
 */
export function enqueueUpdate(fiber, update) {
  let pending = fiber.updateQueue.shared.pending
  if (pending === null) {
    update.next = update
  } else {
    update.next = pending.next
    pending.next = update
  }
  fiber.updateQueue.shared.pending = update
  return markUpdateLaneFromFiberToRoot(fiber)
}

/**
 * 遍历当前fiber的更新队列，合并状态
 * @param {*} workInProgress
 */
export function processUpdateQueue(workInProgress) {
  const queue = workInProgress.updateQueue
  const pendingQueue = queue.shared.pending
  if (pendingQueue !== null) {
    queue.shared.pending = null
    const lastPendingUpdate = pendingQueue
    const firstPendingUpdate = pendingQueue.next
    lastPendingUpdate.next = null
    let newState = workInProgress.memoizedState
    let update = firstPendingUpdate
    while (update) {
      newState = getStateFromUpdate(update, newState)
      update = update.next
    }
    workInProgress.memoizedState = newState
  }
}

function getStateFromUpdate(update, prevState) {
  const { payload } = update
  return payload
}
