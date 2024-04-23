import { createFiberRoot } from "./ReactFiberRoot";

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
 * @param {*} children 虚拟dom
 * @param {*} root 
 */
export function updateContainer(children, root) {
    console.log(children, root);
}