import { blue, red } from '../utils'

import type { CLogger } from '../types'

const { log } = console

export class Logger implements CLogger {
    public readonly package: string
    public readonly prefix: string

    //

    constructor() {
        this.package = 'cpace'
        this.prefix = `[${this.package}]`
    }

    //

    public watchPath(path: string) {
        log(blue(`${this.prefix} watching path: \`${path}\``))
    }

    public watchExtensions(extensions: string[]): void {
        log(blue(`${this.prefix} watching extensions: ${extensions.join(', ')}`))
    }

    public start(path: string): void {
        log(blue(`${this.prefix} starting \`${path}\``))
    }

    public restart(): void {
        log(blue(`${this.prefix} restarting due to changes...`))
    }

    public compile(path: string): void {
        log(blue(`${this.prefix} compiling \`${path}\``))
    }

    public cleanExit(): void {
        log(blue(`${this.prefix} waiting for changes before restart`))
    }

    public crash(): void {
        log(red(`${this.prefix} app crashed - waiting for changes before restart`))
    }

    //

    public moreInfo(): void {
        log(blue(`${this.prefix} try running "cpace --help" for more information`))
    }

    public noFile(): void {
        log(blue(`${this.prefix} no file specified`))
        this.moreInfo()
    }

    public noDirectory(): void {
        log(blue(`${this.prefix} no directory specified`))
        this.moreInfo()
    }

    public compileOnly(): void {
        log(blue(`${this.prefix} compiling only`))
    }

    public help(extensions: string[]): void {
        const tab = '  '
        const bigTab = tab.repeat(3)

        console.log(
            blue(
                `\n${tab}${
                    this.package
                } is used to automatically compile and run\n\t${extensions.join(
                    ', ',
                )} file when it is modified`,
            ),
        )

        console.log(blue(`\n\n${tab}Options:`))
        console.log(blue(`${bigTab}-h, --help ....................... open CLI options`))
        console.log(
            blue(
                `${bigTab}-c, --compileOnly ................ compilation without starting the program`,
            ),
        )
        console.log(
            blue(
                `${bigTab}-d, --directory + [file.cpp] ..... watch a directory and compile specific file`,
            ),
        )

        console.log(blue(`\n\n${tab}Examples:`))
        console.log(blue(`${bigTab}$ cpace -h`))
        console.log(blue(`${bigTab}$ cpace [file.cpp]`))
        console.log(blue(`${bigTab}$ cpace [file.cpp] -c`))
        console.log(blue(`${bigTab}$ cpace -d {directory} [file.cpp]`))
        console.log(blue(`${bigTab}$ cpace [file.cpp] -c -d {directory}`))
    }

    //

    public log(message: string): void {
        log(blue(`${this.prefix} ${message}`))
    }

    public error(message: Error | string): void {
        log(red(`${this.prefix} ${message as string}`))
    }
}
