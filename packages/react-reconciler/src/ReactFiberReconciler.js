import { createFiberRoot } from "./ReactFiberRoot";
import { createUpdate, enqueueUpdate } from './ReactFiberClassUpdateQueue'
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop'

/**
 * 创建FiberRoot
 * @param {*} 真实root 
 * @returns 
 */
export function createContainer(containerInfo) {
    return createFiberRoot(containerInfo)
}

/**
 * 将虚拟dom更新到root上
 * @param {*} element 虚拟dom
 * @param {*} container FiberRoot 
 */
export function updateContainer(element, container) {
    // 拿到rootFiber
    const current = container.current
    const update = createUpdate()
    // 将虚拟dom保存
    update.payload = { element }
    // 将update插入更新队列，并返回FiberRoot
    const root = enqueueUpdate(current, update)
    scheduleUpdateOnFiber(root)
    console.log(element, root);
}