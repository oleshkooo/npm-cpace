import chalk from 'chalk'

const blue = chalk.rgb(101, 155, 211)
const red = chalk.rgb(255, 0, 0).bold

const { log } = console

class ConsoleLogs {
    constructor() {
        this.packageName = 'cpace'
        this.prefix = `  [${this.packageName}]`

        this.starting = () => log(blue(`${this.prefix} Starting ${this.packageName}`))
        this.watchingExtensions = () => log(blue(`${this.prefix} Watching extensions: .c, .cpp`))
        this.watching = file => log(blue(`${this.prefix} Watching '${file.watchPath}'`))
        this.restarting = () => log(blue(`${this.prefix} Restarting`))

        this.notEnoughOptions = () => {
            log(blue(this.prefix) + red(' Error: Not enough options'))
            log(blue(`${this.prefix} Use -h (or --help) for more information`))
        }
        this.wrongFlag = () => log(blue(this.prefix) + red(' Error: Wrong flag or file extension'))

        this.error = error => log(blue(this.prefix) + red(` Error\n${error}`))
        this.stdError = error => log(blue(this.prefix) + red(` StdError\n${error}`))
        this.compilingError = error => log(blue(this.prefix) + red(` Error compiling:\n${error}`))
        this.compilingSuccess = () => log(blue(`${this.prefix} Compiled successfully`))
        this.errorOpening = error => log(blue(this.prefix) + red(` Error opening:\n${error}`))
        this.stdErrorOpening = error => log(blue(this.prefix) + red(` StdError opening:\n${error}`))

        this.help = () => {
            const tab = '  '

            console.log(blue(`\n${tab}${this.packageName} is used to automatically compile and run\n\ta [.c] or [.cpp] file when it is modified`))

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
        }
    }
}
export default ConsoleLogs