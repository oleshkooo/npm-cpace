import { readFileSync } from 'fs'
import { resolve, join } from 'path'

import updateNotifier from 'simple-update-notifier'

import { Cpace } from '..'

const cpace = new Cpace(process.argv.slice(2))

const absPath = resolve(__dirname)
const pkg = JSON.parse(readFileSync(join(absPath, '..', 'package.json')).toString())

if (pkg.version.indexOf('0.0.0') !== 0) {
    updateNotifier({
        pkg,
        updateCheckInterval: 0,
    }).catch(() => {})
}

cpace.run()
