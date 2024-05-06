import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
const RESERVED_PROPS = {
  ref: true,
  __self: true,
  __source: true,
}
function ReactElement(type, key, ref, props) {
  return {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
  }
}

export function jsxDEV(type, config, key) {
  const ref = config.ref
  const props = {}
  for (let propName in config) {
    if (config.hasOwnProperty(propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
      props[propName] = config[propName]
    }
  }

  return ReactElement(type, key, ref, props)
}
