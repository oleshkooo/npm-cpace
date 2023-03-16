'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var child_process = require('child_process');
var path = require('path');
var chokidar = require('chokidar');
var chalk = require('chalk');

const blue = chalk.rgb(101, 155, 211);
const red = chalk.rgb(255, 0, 0).bold;

const isWindows = () => {
    return !(process.platform === 'darwin' || process.platform === 'linux');
};

const removeArrayItem = (array, item) => {
    const index = array.indexOf(item);
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
};

const { log } = console;
class Logger {
    package;
    prefix;
    //
    constructor() {
        this.package = 'cpace';
        this.prefix = `[${this.package}]`;
    }
    //
    watchPath(path) {
        log(blue(`${this.prefix} watching path: \`${path}\``));
    }
    watchExtensions(extensions) {
        log(blue(`${this.prefix} watching extensions: ${extensions.join(', ')}`));
    }
    start(path) {
        log(blue(`${this.prefix} starting \`${path}\``));
    }
    restart() {
        log(blue(`${this.prefix} restarting due to changes...`));
    }
    compile(path) {
        log(blue(`${this.prefix} compiling \`${path}\``));
    }
    cleanExit() {
        log(blue(`${this.prefix} waiting for changes before restart`));
    }
    crash() {
        log(red(`${this.prefix} app crashed - waiting for changes before restart`));
    }
    //
    moreInfo() {
        log(blue(`${this.prefix} try running "cpace --help" for more information`));
    }
    noFile() {
        log(blue(`${this.prefix} no file specified`));
        this.moreInfo();
    }
    noDirectory() {
        log(blue(`${this.prefix} no directory specified`));
        this.moreInfo();
    }
    compileOnly() {
        log(blue(`${this.prefix} compiling only`));
    }
    help(extensions) {
        const tab = '  ';
        const bigTab = tab.repeat(3);
        console.log(blue(`\n${tab}${this.package} is used to automatically compile and run\n\t${extensions.join(', ')} file when it is modified`));
        console.log(blue(`\n\n${tab}Options:`));
        console.log(blue(`${bigTab}-h, --help ....................... open CLI options`));
        console.log(blue(`${bigTab}-c, --compileOnly ................ compilation without starting the program`));
        console.log(blue(`${bigTab}-d, --directory + [file.cpp] ..... watch a directory and compile specific file`));
        console.log(blue(`\n\n${tab}Examples:`));
        console.log(blue(`${bigTab}$ cpace -h`));
        console.log(blue(`${bigTab}$ cpace [file.cpp]`));
        console.log(blue(`${bigTab}$ cpace [file.cpp] -c`));
        console.log(blue(`${bigTab}$ cpace -d {directory} [file.cpp]`));
        console.log(blue(`${bigTab}$ cpace [file.cpp] -c -d {directory}`));
    }
    //
    log(message) {
        log(blue(`${this.prefix} ${message}`));
    }
    error(message) {
        log(red(`${this.prefix} ${message}`));
    }
}

class Cpace {
    args = [];
    flags = {
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
    };
    config = {
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
    };
    extensions = new Map([
        ['.c', 'gcc'],
        ['.cpp', 'g++'],
    ]);
    logger = new Logger();
    //
    constructor(argv) {
        this.args = argv;
    }
    run() {
        this.parseFlags();
        this.checkArgs();
        this.parseConfig();
        this.logger.watchPath(this.config.watchShort);
        this.logger.watchExtensions([...this.extensions.keys()]);
        if (this.flags.compileOnly.active) {
            this.logger.compileOnly();
        }
        this.compile();
        this.watch();
    }
    //
    checkArgs() {
        if (this.args.length === 0) {
            this.logger.noFile();
            process.exit();
        }
        if (this.flags.directory.active && this.args.length - 1 < this.flags.directory.index + 1) {
            this.logger.noDirectory();
            process.exit();
        }
        if (this.flags.help.active) {
            this.logger.help([...this.extensions.keys()]);
            process.exit();
        }
    }
    parseFlags() {
        this.args.forEach((item, index) => {
            if (item === '--help' || item === '-h') {
                this.flags.help.active = true;
            }
            if (item === '--compile' || item === '-c') {
                this.flags.compileOnly.active = true;
            }
            if (item === '--directory' || item === '-d') {
                this.flags.directory.active = true;
                this.flags.directory.index = index;
            }
        });
    }
    parseConfig() {
        if (this.flags.directory.active) {
            this.config.directory = this.args[this.flags.directory.index + 1];
            if (path.extname(this.config.directory) !== '') {
                this.logger.error('Directory cannot have an extension');
                process.exit();
            }
            this.config.watch = path.resolve(this.config.directory);
        }
        const flags = Object.values(this.flags)
            .map((item) => [item.short, item.long])
            .flat();
        const tempArgs = this.args.filter(item => !flags.includes(item));
        const file = removeArrayItem(tempArgs, this.config.directory).at(0);
        this.config.extension = path.extname(file);
        if (this.config.extension === '') {
            this.logger.error('No extension specified');
            process.exit();
        }
        this.config.name = path.basename(file, this.config.extension);
        this.config.file = path.basename(file);
        this.config.compile = path.resolve(file);
        this.config.open = path.resolve(this.config.name);
        if (!this.flags.directory.active) {
            this.config.watch = path.resolve(file);
        }
        this.config.watchShort = path.basename(this.config.watch);
        this.config.openShort = path.basename(this.config.open);
    }
    compile() {
        this.logger.compile(this.config.file);
        const command = this.getCommand(this.config.extension);
        const args = [this.config.compile, '-o', `${this.config.name}${this.config.exe}`];
        const compileProcess = child_process.spawn(command, args);
        compileProcess.stdout.on('data', data => {
            console.log(data.toString());
        });
        compileProcess.stderr.on('data', error => {
            console.error(error.toString());
        });
        compileProcess.on('error', error => {
            console.error(error.toString());
        });
        compileProcess.on('exit', code => {
            if (code !== 0) {
                this.logger.crash();
                return;
            }
            if (this.flags.compileOnly.active) {
                this.logger.cleanExit();
                return;
            }
            this.open();
        });
    }
    open() {
        this.logger.start(this.config.openShort);
        const openFile = child_process.spawn(`${this.config.open}${this.config.exe}`, [], { stdio: 'inherit' });
        openFile.stdout?.on('data', data => {
            console.log(data.toString());
        });
        openFile.stderr?.on('data', error => {
            console.error(error.toString());
        });
        openFile.on('error', error => {
            console.error(error.toString());
        });
        openFile.on('exit', (code, signal) => {
            if (code !== 0) {
                this.logger.crash();
                return;
            }
            this.logger.cleanExit();
        });
    }
    watch() {
        const watcher = chokidar.watch(this.config.watch);
        watcher.on('change', () => {
            this.logger.restart();
            this.compile();
        });
    }
    //
    getCommand(extension) {
        return this.extensions.get(extension) ?? '';
    }
}

exports.Cpace = Cpace;
exports.default = Cpace;
