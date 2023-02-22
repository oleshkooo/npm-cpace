import type { RemoveArrayItem } from '../types'

export const removeArrayItem: RemoveArrayItem = (array, item) => {
    const index = array.indexOf(item)
    if (index > -1) {
        array.splice(index, 1)
    }
    return array
}
