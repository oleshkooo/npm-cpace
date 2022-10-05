#!/usr/bin/env node

import fs from 'fs'

import { spawn, execFile } from 'child_process'

import chalk from 'chalk'

const args = process.argv.slice(2)
const packageName = 'cpace'
const prefix = `  [${packageName}]`
const blue = chalk.rgb(101, 155, 211)
const red = chalk.rgb(255, 0, 0).bold

let helpF = false
let compileOnlyF = false
let directoryF = false
let directoryFIndex
args.map((item, index) => {
    if (item === '--help' || item === '-h') helpF = true
    if (item === '--compile' || item === '-c') compileOnlyF = true
    if (item === '--directory' || item === '-d') {
        directoryF = true
        directoryFIndex = index
    }
})

const app = {
    init: function () {
        if (helpF) this.help()

        console.log(blue(`${prefix} Starting ${packageName}`))

        if (args[0] === undefined || args[0] === '') {
            console.error(blue(prefix) + red(' Error: ') + blue('Not enough options'))
            console.error(blue(`${prefix} Use -h (or --help) for more information`))
            return
        }

        console.log(blue(`${prefix} Watching extensions: .c, .cpp`))

        const file = {
            directory: '',
            name: '',
            extension: '',
            exe: '.exe',
            watchPath: '',
            compilePath: '',
        }

        if (directoryF) {
            file.directory = args[0]
            file.name = args[directoryFIndex + 1]

            this.getExtension(file)

            file.watchPath = file.directory
            file.compilePath = file.directory + '/' + file.name
            console.log(file)
        } else {
            file.name = args[0]

            this.getExtension(file)

            file.watchPath = file.name + file.extension
            file.compilePath = file.name
        }

        this.compileFile(file)
        this.watchFile(file)
    },

    watchFile: function (file) {
        let fsWait = false

        console.log(blue(`${prefix} Watching '${file.watchPath}'`))

        fs.watch(file.watchPath, (event, fileName) => {
            if (fileName) {
                if (fsWait) return
                fsWait = setTimeout(() => {
                    fsWait = false
                }, 100)

                console.log(blue(`${prefix} Restarting due to changes`))
                this.compileFile(file)
            }
        })
    },
    compileFile: function (file) {
        let done = false
        let err = false
        let compileFile

        if (file.extension === '.cpp') {
            compileFile = spawn('g++', [
                '-o',
                file.name + file.exe,
                file.compilePath + file.extension,
            ])
        } else {
            compileFile = spawn('gcc', [
                '-o',
                file.name + file.exe,
                file.compilePath + file.extension,
            ])
        }

        compileFile.on('error', error => {
            if (!done) {
                console.error(blue(prefix) + red(' Error\n') + error)
                done = true
            }
            err = true
        })
        compileFile.stderr.on('data', data => {
            if (!done) {
                console.error(blue(prefix) + red(' Compiling error'))
                console.error(this.decode(data))
                done = true
            }
            err = true
        })
        compileFile.stdout.on('data', data => {
            console.log(data)
        })
        compileFile.on('exit', (code, signal) => {
            if (!err) {
                console.log(blue(`${prefix} Compiled successfully`))

                if (!compileOnlyF) this.openFile(file)
            }
        })
    },
    openFile: function (file) {
        execFile(file.name + file.exe, (error, stdout, stderr) => {
            if (error) return console.error(blue(prefix) + red(' .exe Error\n') + error)
            if (stderr) return console.error(blue(prefix) + red(' .exe StdError\n') + error)

            console.log(stdout)
        })
    },

    help: function () {
        const tab = '  '

        console.log(
            blue(
                `\n${tab}${packageName} is used to automatically compile and run\n\ta [.c] or [.cpp] file when it is modified`,
            ),
        )

        console.log(blue(`\n\n${tab}Options:`))
        console.log(blue(`${tab}    -h, --help ............ open CLI options`))
        console.log(
            blue(`${tab}    -c, --compile ......... compilation without starting the program`),
        )
        console.log(
            blue(`${tab}    -d, --directory ....... watch a directory and compile specific file`),
        )
        console.log(blue(`${tab}\t\t\t      (the file name must be after the -d argument)`))

        console.log(blue(`\n\n${tab}Examples:`))
        console.log(blue(`${tab}    $ cpace -h`))
        console.log(blue(`${tab}    $ cpace [file.cpp]`))
        console.log(blue(`${tab}    $ cpace [file.cpp] -c`))
        console.log(blue(`${tab}    $ cpace {directory} -d [file.cpp]`))
        console.log(blue(`${tab}    $ cpace {directory} -d [file.cpp] -c`))

        process.exit()
    },

    getExtension: function (file) {
        if (file.name.includes('.cpp')) {
            file.extension = '.cpp'
            file.name = file.name.substring(0, file.name.length - 4)
        } else if (file.name.includes('.c')) {
            file.extension = '.c'
            file.name = file.name.substring(0, file.name.length - 2)
        } else {
            file.extension = ''
            console.error(blue(prefix) + red(' Error: ') + blue('Wrong flag or file extension'))
            process.exit()
        }
    },

    decode: function (data) {
        const decoded = data.toString('utf8')
        return decoded
    },
}

app.init()
export { app }
