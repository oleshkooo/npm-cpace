import { spawn } from 'child_process'
import { basename, extname, resolve } from 'path'

import { watch as chokidarWatch } from 'chokidar'

import { isWindows, removeArrayItem } from '../utils'

import { Logger } from './Logger'

import type { CCpace, Config, Extensions, Flag, Flags } from '../types'

export class Cpace implements CCpace {
    public readonly args: string[] = []

    public readonly flags: Flags = {
        help: {
            active: false,
            short: '-h',
            long: '--help',
        },
        compileOnly: {
            active: false,
            short: '-c',
            long: '--compileOnly',
        },
        directory: {
            active: false,
            short: '-d',
            long: '--directory',
            index: -1,
        },
    }

    public readonly config: Config = {
        directory: '',
        file: '',
        name: '',
        extension: '',
        exe: isWindows() ? '.exe' : '',
        watch: '',
        watchShort: '',
        compile: '',
        open: '',
        openShort: '',
    }

    public readonly extensions: Extensions = new Map([
        ['.c', 'gcc'],
        ['.cpp', 'g++'],
    ])

    public readonly logger: Logger = new Logger()

    //

    constructor(argv: string[]) {
        this.args = argv
    }

    public run(): void {
        this.parseFlags()
        this.checkArgs()
        this.parseConfig()

        this.logger.watchPath(this.config.watchShort)
        this.logger.watchExtensions([...this.extensions.keys()])
        if (this.flags.compileOnly.active) {
            this.logger.compileOnly()
        }

        this.compile()
        this.watch()
    }

    //

    public checkArgs(): void {
        if (this.args.length === 0) {
            this.logger.noFile()
            process.exit()
        }
        if (this.flags.directory.active && this.args.length - 1 < this.flags.directory.index + 1) {
            this.logger.noDirectory()
            process.exit()
        }
        if (this.flags.help.active) {
            this.logger.help([...this.extensions.keys()])
            process.exit()
        }
    }

    public parseFlags(): void {
        this.args.forEach((item: string, index: number) => {
            if (item === '--help' || item === '-h') {
                this.flags.help.active = true
            }
            if (item === '--compile' || item === '-c') {
                this.flags.compileOnly.active = true
            }
            if (item === '--directory' || item === '-d') {
                this.flags.directory.active = true
                this.flags.directory.index = index
            }
        })
    }

    public parseConfig(): void {
        if (this.flags.directory.active) {
            this.config.directory = this.args[this.flags.directory.index + 1]

            if (extname(this.config.directory) !== '') {
                this.logger.error('Directory cannot have an extension')
                process.exit()
            }

            this.config.watch = resolve(this.config.directory)
        }

        const flags = Object.values(this.flags)
            .map((item: Flag) => [item.short, item.long])
            .flat()
        const tempArgs = this.args.filter(item => !flags.includes(item))
        const file = removeArrayItem(tempArgs, this.config.directory).at(0)

        this.config.extension = extname(file)

        if (this.config.extension === '') {
            this.logger.error('No extension specified')
            process.exit()
        }

        this.config.name = basename(file, this.config.extension)
        this.config.file = basename(file)
        this.config.compile = resolve(file)
        this.config.open = resolve(this.config.name)

        if (!this.flags.directory.active) {
            this.config.watch = resolve(file)
        }

        this.config.watchShort = basename(this.config.watch)
        this.config.openShort = basename(this.config.open)
    }

    public compile(): void {
        this.logger.compile(this.config.file)

        const command = this.getCommand(this.config.extension)
        const args = [this.config.compile, '-o', `${this.config.name}${this.config.exe}`]
        const compileProcess = spawn(command, args)

        compileProcess.stdout.on('data', data => {
            console.log(data.toString())
        })
        compileProcess.stderr.on('data', error => {
            console.error(error.toString())
        })
        compileProcess.on('error', error => {
            console.error(error.toString())
        })
        compileProcess.on('exit', code => {
            if (code !== 0) {
                this.logger.crash()
                return
            }
            if (this.flags.compileOnly.active) {
                this.logger.cleanExit()
                return
            }
            this.open()
        })
    }

    public open(): void {
        this.logger.start(this.config.openShort)

        const openFile = spawn(`${this.config.open}${this.config.exe}`, [], { stdio: 'inherit' })

        openFile.stdout?.on('data', data => {
            console.log(data.toString())
        })
        openFile.stderr?.on('data', error => {
            console.error(error.toString())
        })
        openFile.on('error', error => {
            console.error(error.toString())
        })
        openFile.on('exit', (code, signal) => {
            if (code !== 0) {
                this.logger.crash()
                return
            }
            this.logger.cleanExit()
        })
    }

    public watch(): void {
        const watcher = chokidarWatch(this.config.watch)
        watcher.on('change', () => {
            this.logger.restart()
            this.compile()
        })
    }

    //

    public getCommand(extension: string): string {
        return this.extensions.get(extension) ?? ''
    }
}
