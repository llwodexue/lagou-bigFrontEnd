import { createDOMElement } from '../../DOM'
import { createReactInstance } from '../CreateReactInstance'

const createStateNode = fiber => {
  if (fiber.tag === 'host_component') {
    return createDOMElement(fiber)
  } else {
    return createReactInstance(fiber)
  }
}

export default createStateNode
