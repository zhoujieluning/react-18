import { primitiveTypes } from "shared/primitiveTypes";

export function shouldSetTextContent(type, props) {
    return primitiveTypes.includes(typeof props.children)
}