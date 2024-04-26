import { createRoot } from "react-dom/client";
const elem = <div key="key" ref="ref" other="other">asdf</div>
const root = createRoot(document.getElementById('root'))
root.render(elem)


/**
 * 老版本：虚拟dom -> 真实dom
 * react18：虚拟dom -> fiber树 -> 真实dom
 */

// const root = <div id="root"></div>

// const VNodeRoot = root下的虚拟doms

// const FiberRoot = {
//     containerInfo: root,
//     current: RootFiber
// }

// const RootFiber = {
//     tag: tag,
//     key: key,
//     type: null, 
//     stateNode: FiberRoot, 
//     return: null, 
//     sibling: null, 
//     pendingProps: pendingProps, 
//     memoizedProps: null,
//     memoizedState: null,
//     updateQueue: null,
//     flags: NoFlags,
//     subtreeFlags: NoFlags,
//     alternate: null,
//     index: 0
// }

// const ReactDOMRoot = {
//     _internalRoot: FiberRoot,
//     render: () => {}
// }

// ReactDOMRoot._internalRoot -> FiberRoot
// FiberRoot.containerInfo -> root
