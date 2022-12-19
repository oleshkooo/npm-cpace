import { spawn, exec } from 'child_process'

import chokidar from 'chokidar'

import ConsoleLogs from './ConsoleLogs.js'


class Cpace {
    constructor(args) {
        if (this.helpF) this.help()

        this.args = args
        this.helpF = false
        this.compileOnlyF = false
        this.directoryF = false
        this.directoryFIndex
        this.args.map((item, index) => {
            if (item === '--help' || item === '-h') this.helpF = true
            if (item === '--compile' || item === '-c') this.compileOnlyF = true
            if (item === '--directory' || item === '-d') {
                this.directoryF = true
                this.directoryFIndex = index
            }
        })
        this.logs = new ConsoleLogs()

        this.logs.starting()

        if (args[0] === undefined || args[0] === '') {
            this.logs.notEnoughOptions()
            return
        }

        this.logs.watchingExtensions()

        this.file = {
            directory: '',
            name: '',
            extension: '',
            exe: this.isWindows() ? '.exe' : '',
            watchPath: '',
            compilePath: '',
        }

        if (this.directoryF) {
            this.file.directory = args[0]
            this.file.name = args[this.directoryFIndex + 1]
            this.getExtension()
            this.file.watchPath = this.file.directory
            this.file.compilePath = this.file.directory + '/' + this.file.name
        } else {
            this.file.name = args[0]
            this.getExtension()
            this.file.watchPath = this.file.name + this.file.extension
            this.file.compilePath = this.file.name
        }

        this.compileFile()
        this.watchFile()
    }


    getExtension() {
        if (this.file.name.includes('.cpp')) {
            this.file.extension = '.cpp'
            this.file.name = this.file.name.substring(0, this.file.name.length - 4)
        } else if (this.file.name.includes('.c')) {
            this.file.extension = '.c'
            this.file.name = this.file.name.substring(0, this.file.name.length - 2)
        } else {
            this.file.extension = ''
            this.logs.wrongFlag()
            process.exit()
        }
    }


    watchFile() {
        const watcher = chokidar.watch(this.file.watchPath)

        watcher.on('change', () => {
            this.logs.restarting()
            this.compileFile()
        })
    }


    compileFile() {
        let command

        if (this.file.extension === '.cpp') {
            command = 'g++'
        } else {
            command = 'gcc'
        }

        const compileFile = spawn(command, [
            '-o',
            this.file.name + this.file.exe,
            this.file.compilePath + this.file.extension,
        ])

        compileFile.on('error', error => {
            return this.logs.error(error)
        })
        compileFile.stderr.on('data', error => {
            return this.logs.stdError(error)
        })
        compileFile.stdout.on('data', data => {
            console.log(data)
        })
        compileFile.on('exit', (code, signal) => {
            if (!this.compileOnlyF) {
                return this.openFile(this.file)
            }
        })
    }


    openFile() {
        const openFile = exec(`./${this.file.name}${this.file.exe}`)

        openFile.on('error', error => {
            return this.logs.errorOpening(error)
        })
        openFile.stderr.on('data', error => {
            return this.logs.stdErrorOpening(error)
        })
        openFile.stdout.on('data', data => {
            console.log(data)
        })
    }


    help() {
        this.logs.help()
        process.exit()
    }


    isWindows() {
        return !(process.platform == 'darwin' || process.platform == 'linux')
    }
}
export default Cpace