/**
 * 给fiber添加更新队列
 * @param {*} fiber 
 */
export function initialUpdateQueue(fiber) {
    const queue = {
        shared: {
            pending: null
        }
    }
    fiber.updateQueue = queue
}