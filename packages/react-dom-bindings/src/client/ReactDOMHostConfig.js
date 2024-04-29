import { primitiveTypes } from "shared/primitiveTypes";

export function shouldSetTextContent(type, props) {
    return primitiveTypes.includes(typeof props.children)
}

export function createElement(type) {
    return document.createElement(type)
}

export function appendChild(parent, child) {
    parent.appendChild(child)
}

export function setPropsForDom(dom, type, props) {
    if(!dom) return 
    const { style, className } = props

    for(let key in props) {
        if(key === 'children') {
            if(primitiveTypes.includes(typeof key)) {
                dom.textContent = props[key]
            }
        } else if(/^on[A-Z].*/.test(key)) {
            // todo 事件
        } else if(key === 'style') {
            // style 要求是纯对象类型 - {}
            if(Object.prototype.toString.call(style) !== '[object Object]') {
                throw new Error('The `style` prop expects a mapping from style properties to values')
            } else {
                for(let key in style) {
                    dom.style[key] = style[key]
                }
            }
        } else if(key === 'className') {
            dom.className = className
        } else {
            dom.setAttribute(key, props[key])
        }
    }
}

export function createText(content) {
    return document.createTextNode(content)
}