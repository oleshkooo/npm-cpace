#!/usr/bin/env node

import fs from 'fs'
import { spawn, execFile } from 'child_process'
import chalk from 'chalk'

const args = process.argv.slice(2)
const packageName = "cpace"
const prefix = `  [${packageName}]`
const blue = chalk.rgb(101, 155, 211)
const red = chalk.rgb(255, 0, 0).bold

let helpF = false
let compileOnlyF = false
let directoryF = false
let directoryFIndex
args.map((item, index) => {
    if (item === '--help' || item === '-h')
        helpF = true
    if (item === '--compile' || item === '-c')
        compileOnlyF = true
    if (item === '--directory' || item === '-d') {
        directoryF = true
        directoryFIndex = index
    }
})


const app = {
    init: function() {
        console.log(blue(`${prefix} Starting ${packageName}`))

        if (helpF) {
            let tab = '  '
            console.log(blue(`\n${tab}${packageName} is used to automatically compile and run\n\ta [.c] or [.cpp] file when it is modified`))

            console.log(blue(`\n\n${tab}Options:`))
            console.log(blue(`${tab}    -h, --help ............ open CLI options`))
            console.log(blue(`${tab}    -c, --compile ......... compilation without starting the program`))
            console.log(blue(`${tab}    -d, --directory ....... watch a directory and compile specific file`))
            console.log(blue(`${tab}\t\t\t      (the file name must be after the -d argument)`))

            console.log(blue(`\n\n${tab}Examples:`))
            console.log(blue(`${tab}    $ cpace -h`))
            console.log(blue(`${tab}    $ cpace [file.cpp]`))
            console.log(blue(`${tab}    $ cpace [file.cpp] -c`))
            console.log(blue(`${tab}    $ cpace {directory} -d [file.cpp]`))
            console.log(blue(`${tab}    $ cpace {directory} -d [file.cpp] -c`))
            return
        }

        if (args[0] === undefined || args[0] === '') {
            console.error(blue(prefix) + red(' Error: ') + blue('Not enough options'))
            console.error(blue(`${prefix} Use -h or --help for more information`))
            return
        }

        console.log(blue(`${prefix} Watching extensions: .c, .cpp`))

        let extension = ''
        let fileName = args[0]
        let directoryName = args[0]

        if (directoryF) {
            fileName = args[directoryFIndex + 1]

            if (args[directoryFIndex + 1].includes('.cpp')) {
                extension = '.cpp'
                fileName = args[directoryFIndex + 1].substring(0, args[directoryFIndex + 1].length - 4)
            }
            else if (args[directoryFIndex + 1].includes('.c')) {
                extension = '.c'
                fileName = args[directoryFIndex + 1].substring(0, args[directoryFIndex + 1].length - 2)
            }
            else
                extension = ''

            if (!extension) {
                console.error(blue(prefix) + red(' Error: ') + blue('Wrong file extension'))
                console.log(blue(`${prefix} Watching extensions: .c, .cpp`))
                return
            }

            this.compileDirectory(directoryName, fileName, extension)
            this.watchDirectory(directoryName, fileName, extension)
        }
        else {
            if (args[0].includes('.cpp')) {
                extension = '.cpp'
                fileName = args[0].substring(0, args[0].length - 4)
            }
            else if (args[0].includes('.c')) {
                extension = '.c'
                fileName = args[0].substring(0, args[0].length - 2)
            }
            else {
                extension = ''
            }
    
            if (!extension) {
                console.error(blue(prefix) + red(' Error: ') + blue('Wrong file extension'))
                console.log(blue(`${prefix} Watching extensions: .c, .cpp`))
                return
            }

            this.compileFile(fileName, extension)
            this.watchFile(fileName, extension)
        }

    },


    watchFile: function(fileName, extension) {
        let fsWait = false

        console.log(blue(`${prefix} Watching '${fileName+extension}'`))
        fs.watch(fileName+extension, (event, file) => {
            if (file) {
                if (fsWait) return
                fsWait = setTimeout(() => {
                    fsWait = false
                }, 100)

                console.log(blue(`${prefix} Restarting due to changes`))
                this.compileFile(fileName, extension)
            }
        })
    },
    compileFile: function(fileName, extension) {
        let done = false
        let error = false
        let exe = '.exe'
        let compileFile

        if (extension === '.cpp')
            compileFile = spawn('g++', ['-o', fileName+exe, fileName+extension])
        else
            compileFile = spawn('gcc', ['-o', fileName+exe, fileName+extension])

        compileFile.on('error', (error) => {
            if (!done) {
                console.error(blue(prefix) + red(' Error'))
                done = true
            }
            error = true
        })
        compileFile.stderr.on('data', (data) => {
            if (!done) {
                console.error(blue(prefix) + red(' Compiling error'))
                done = true
            }
            error = true
        })
        compileFile.stdout.on('data', (data) => {
            console.log(data)
        })
        compileFile.on('exit', (code, signal) => {
            if (!error) {
                console.log(blue(`${prefix} Compiled successfully`))

                if (!compileOnlyF)
                    this.openFile(fileName+exe)
            }
        })
    },
    openFile: function(exeFile) {
        execFile(exeFile, (error, stdout, stderr) => {
            if (error)
                return console.error(blue(prefix) + red(' Error'))
            if (stderr)
                return console.error(blue(prefix) + red(' StdError'))

            console.log(stdout)
        })
    },



    watchDirectory: function(directoryName, fileName, extension) {
        let fsWait = false

        console.log(blue(`${prefix} Watching '/${directoryName}'`))
        fs.watch(directoryName, (event, file) => {
            if (file) {
                if (fsWait) return
                fsWait = setTimeout(() => {
                    fsWait = false
                }, 100)

                console.log(blue(`${prefix} Restarting due to changes`))
                this.compileDirectory(directoryName, fileName, extension)
            }
        })
    },
    compileDirectory: function(directoryName, fileName, extension) {
        let done = false
        let error = false
        let exe = '.exe'
        let compileFile

        if (extension === '.cpp')
            compileFile = spawn('g++', ['-o', fileName+exe, directoryName+'/'+fileName+extension])
        else
            compileFile = spawn('gcc', ['-o', fileName+exe, directoryName+'/'+fileName+extension])

        compileFile.on('error', (error) => {
            if (!done) {
                console.error(blue(prefix) + red(' Error'))
                done = true
            }
            error = true
        })
        compileFile.stderr.on('data', (data) => {
            if (!done) {
                console.error(blue(prefix) + red(' Compiling error'))
                done = true
            }
            error = true
        })
        compileFile.stdout.on('data', (data) => {
            console.log(data)
        })
        compileFile.on('exit', (code, signal) => {
            if (!error) {
                console.log(blue(`${prefix} Compiled successfully`))

                if (!compileOnlyF)
                    this.openFile(fileName+exe)
            }
        })
    },
}


app.init()


export { app }