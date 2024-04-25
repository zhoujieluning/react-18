import { REACT_ELEMENT_TYPE, REACT_TEXT } from "shared/ReactSymbols"
import { primitiveTypes } from "shared/primitiveTypes"
import { createFiberFromElement, createFiberFromText } from './ReactFiber'

function createChildReconciler(shouldTrackSideEffects) {

    /**
     * 根据returnFiber的子虚拟dom生成子fiber，并跟returnFiber关联
     * @param {*} returnFiber 新fiber
     * @param {*} currentFirstFiber 旧fiber的子fiber
     * @param {*} newChild 新fiber的子虚拟dom
     */
    function reconcileChildFibers(returnFiber, currentFirstFiber, newChild) {
        // 子虚拟dom为单个节点
        if(newChild && typeof newChild === 'object') {
            switch(newChild.$$typeof) {
                case REACT_ELEMENT_TYPE:
                    return reconcileSingleElement(returnFiber, currentFirstFiber, newChild)
                default:
                    break
            }
        }
        // 子虚拟dom为单个文本节点
        if(newChild && primitiveTypes.includes(typeof newChild)) {
            const created = createFiberFromText(element)
            created.return = returnFiber
            return created
        }
        // 处理多个节点
        if(Array.isArray(newChild)) {
            return reconcileChildrenArray(returnFiber, currentFirstFiber, newChild)
        }
    }

    function reconcileSingleElement(returnFiber, currentFirstFiber, element) {
        // 根据虚拟dom创建fiber
        const created = createFiberFromElement(element)
        // 记录父fiber
        created.return = returnFiber
        return created
    }

    /**
     * 处理虚拟dom为多个节点
     * @param {*} returnFiber 
     * @param {*} currentFirstFiber 
     * @param {*} children 
     * @returns 第一个子fiber
     */
    function reconcileChildrenArray(returnFiber, currentFirstFiber, children) {
        const childFibers = []
        let prevFiber = null
        children.forEach(child => {
            let fiber = reconcileChildFibers(returnFiber, currentFirstFiber, child)
            prevFiber && (prevFiber.sibling = fiber)
            prevFiber = fiber
            childFibers.push(fiber)
        })
        return childFibers[0]
    }
    return reconcileChildFibers
}
export const mountChildFibers = createChildReconciler(false)
export const reconcileChildFibers = createChildReconciler(true)
