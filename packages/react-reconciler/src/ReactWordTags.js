export const FunctionComponent = 0 // fiber节点类型为函数组件
export const ClassComponent = 1
export const IndeterminatedComponent = 2 // 未知类型的组件
export const HostRoot = 3 // fiber根节点，对应RootFiber
export const HostComponent = 5 // 原生节点类型（div、span)
export const HostText = 6 // 文本节点
