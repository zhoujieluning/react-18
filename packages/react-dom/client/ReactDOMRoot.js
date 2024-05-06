import { initialRender } from 'react-reconciler/src/ReactFiberReconciler'
import { createFiberRoot } from 'react-reconciler/src/ReactFiberRoot'

/**
 * ReactDOMRoot生成器，包含一个FiberRoot的指向，以及一个render函数
 */
class ReactDOMRoot {
  constructor(FiberRoot) {
    this._internalRoot = FiberRoot
  }
  /**
   * @param {VNode} VNodeRoot 根虚拟dom节点
   */
  render(VNodeRoot) {
    const FiberRoot = this._internalRoot
    initialRender(VNodeRoot, FiberRoot)
  }
}

/**
 * 创建ReactDOMRoot
 * 在此阶段创建FiberRoot以及RootFiber
 * @param {*} root dom
 * @returns ReactDOMRoot
 */
export function createRoot(root) {
  const FiberRoot = createFiberRoot(root)
  return new ReactDOMRoot(FiberRoot)
}
