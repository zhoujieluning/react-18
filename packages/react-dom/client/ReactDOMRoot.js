import { createContainer, updateContainer } from "react-reconciler/src/ReactFiberReconciler"

/**
 * @param {*} internalRoot FiberRoot
 */
function ReactDOMRoot(internalRoot) {
    this._internalRoot = internalRoot
}

ReactDOMRoot.prototype.render = function(children) {
    const root = this._internalRoot
    // 将虚拟dom更新到root上
    updateContainer(children, root)
}

/**
 * 根据真实root，创建FiberRoot，再将FiberRoot包裹成ReactDOMRoot
 * @param {*} container 真实root
 * @returns ReactDOMRoot
 */
export function createRoot(container) {
    const root = createContainer(container)
    return new ReactDOMRoot(root)
}