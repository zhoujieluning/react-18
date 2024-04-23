import { createRoot } from "react-dom/client";

const elem = <div key="key" ref="ref" other="other">asdf</div>
debugger
const root = createRoot(document.getElementById('root'))
root.render(elem)


/**
 * 老版本：虚拟dom -> 真实dom
 * react18：虚拟dom -> fiber树 -> 真实dom
 */