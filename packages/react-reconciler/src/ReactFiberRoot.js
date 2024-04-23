import { createHostRootFiber } from './ReactFiber'
import { initialUpdateQueue } from './ReactFiberClassUpdateQueue'

/**
 * FiberRoot生成器
 * @param {*} containerInfo 
 */
function FiberRootNode(containerInfo) {
    this.containerInfo = containerInfo
}

/**
 * 创建FiberRoot以及RootFiber，并将二者关联
 * FiberRoot是整个应用程序的根节点
 * RootFiber是fiber树的根节点
 * FiberRoot.current -> RootFiber
 * RootFiber.stateNode -> FiberRoot
 * @param {*} containerInfo <div id="#root"></div>
 * @returns FiberRoot
 */
export function createFiberRoot(containerInfo) {
    const root = new FiberRootNode(containerInfo) // FiberRoot
    const uninitiallizedFiber = createHostRootFiber() // RootFiber
    // 二者相互指向
    root.current = uninitiallizedFiber
    uninitiallizedFiber.stateNode = root
    // 给RootFiber添加更新队列
    initialUpdateQueue(uninitiallizedFiber)
    return root
}