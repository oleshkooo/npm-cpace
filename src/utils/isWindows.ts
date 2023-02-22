import type { IsWindows } from '../types'

export const isWindows: IsWindows = () => {
    return !(process.platform === 'darwin' || process.platform === 'linux')
}
