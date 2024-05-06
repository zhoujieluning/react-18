import { createUpdate, enqueueUpdate } from './ReactFiberClassUpdateQueue'
import { scheduleUpdateOnFiber } from './ReactFiberWorkLoop'

/**
 * 页面初始化
 * @param {VNode} VNodeRoot 根虚拟dom节点
 * @param {FiberRoot} FiberRoot
 */
export function initialRender(VNodeRoot, FiberRoot) {
  const RootFiber = FiberRoot.current
  const update = createUpdate()
  // 保存根虚拟dom
  update.payload = { VNodeRoot }
  // 将update插入RootFiber的更新队列
  enqueueUpdate(RootFiber, update)
  // 执行更新
  scheduleUpdateOnFiber(FiberRoot)
}

// 疑问： 初始化渲染时候，为什么要给前缓冲区RootFiber添加更新队列？
// 其实就是给RootFiber记录虚拟dom
