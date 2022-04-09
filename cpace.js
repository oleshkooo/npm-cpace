#!/usr/bin/env node

import fs from 'fs'
import { spawn, execFile } from 'child_process'
import chalk from 'chalk'

const args = process.argv.slice(2)
const packageName = "cpace"
const blue = chalk.rgb(101, 155, 211)
const red = chalk.rgb(255, 0, 0).bold


const app = {
    init: function() {
        if (args[0] === '--help') {
            console.log(blue(`  [${packageName}]\n`))
            console.log(blue(`\t${packageName} is used to automatically compile and run\n\t      a [.c] or [.cpp] file when it is modified\n\n`))
            console.log(blue('\tUsage:\n'))
            console.log(blue('\t$ cpace someFile.c'))
            console.log(blue('\t$ cpace someFile.cpp'))
            return
        }

        if (args.length > 1)
            return console.error(blue(`  [${packageName}] `) + red('Error: ') + blue('Too much arguments'))

        if (args[0] === undefined || args[0] === '')
            return console.error(blue(`  [${packageName}] `) + red('Error: ') + blue('No file name passed'))

        let extension
        let fileName
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
            console.error(blue(`  [${packageName}] `) + red('Error: ') + blue('Wrong file extension'))
            console.log(blue(`  [${packageName}] Watching extensions: .c, .cpp`))
            return
        }

        console.log(blue(`  [${packageName}] v1.0.0`))
        console.log(blue(`  [${packageName}] Watching extensions: .c, .cpp`))

        this.watchFile(fileName, extension)
    },

    watchFile: function(fileName, extension) {
        let fsWait = false

        console.log(blue(`  [${packageName}] Watching '${fileName+extension}'`))
        fs.watch(fileName+extension, (event, file) => {
            if (file) {
                if (fsWait) return
                fsWait = setTimeout(() => {
                    fsWait = false
                }, 100)

                console.log(blue(`  [${packageName}] Restarting due to changes`))
                this.compileFile(fileName, extension)
            }
        })
    },

    compileFile: function(fileName, extension) {
        let error = false
        let exe = '.exe'
        let compileFile

        if (extension === '.cpp')
            compileFile = spawn('g++', ["-o", fileName+exe, fileName+extension])
        else
            compileFile = spawn('gcc', ["-o", fileName+exe, fileName+extension])

        compileFile.on('error', (error) => {
            console.error(blue(`  [${packageName}] `) + red('Error'))
            error = true
        })
        compileFile.stderr.on('data', (data) => {
            console.error(blue(`  [${packageName}] `) + red('Compiling error'))
            error = true
        })
        compileFile.stdout.on('data', (data) => {
            console.log(data)
        })
        compileFile.on('exit', (code, signal) => {
            if (!error) {
                console.log(blue(`  [${packageName}] Compiled successfully`))
                this.openFile(fileName+exe)
            }
        })
    },

    openFile: function(exeFile) {
        console.log(blue(`  [${packageName}] Starting '${exeFile}'`))
        execFile(exeFile, (error, stdout, stderr) => {
            if (error)
                return console.error(blue(`  [${packageName}] `) + red('Error'))
            if (stderr)
                return console.error(blue(`  [${packageName}] `) + red('StdError'))

            console.log(stdout)
        })
    }
}


app.init()


export { app }