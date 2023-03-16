/// <reference types="." />
// logger
interface Flag {
    active: boolean;
    short: string;
    long: string;
}
interface Flags {
    help: Flag;
    compileOnly: Flag;
    directory: Flag & {
        index: number;
    };
}
interface Config {
    directory: string;
    file: string;
    name: string;
    extension: string;
    exe: string;
    watch: string;
    watchShort: string;
    compile: string;
    open: string;
    openShort: string;
}
type Extensions = Map<string, string>;
declare class CCpace {
    readonly args: string[];
    readonly flags: Flags;
    readonly config: Config;
    readonly extensions: Extensions;
    readonly logger: CLogger;
    constructor(argv?: string);
    run(): void;
    checkArgs(): void;
    parseFlags(): void;
    parseConfig(): void;
    compile(): void;
    open(): void;
    watch(): void;
    getCommand(extension: string): string;
}
// cpace
declare class CLogger {
    readonly package: string;
    readonly prefix: string;
    constructor(argv?: string[]);
    watchPath(path: string): void;
    watchExtensions(extensions: string[]): void;
    start(path: string): void;
    restart(): void;
    compile(path: string): void;
    cleanExit(): void;
    crash(): void;
    moreInfo(): void;
    noFile(): void;
    noDirectory(): void;
    compileOnly(): void;
    help(extensions: string[]): void;
    log(message: string): void;
    error(message: Error | string): void;
}
declare class Logger implements CLogger {
    readonly package: string;
    readonly prefix: string;
    //
    constructor();
    //
    watchPath(path: string): void;
    watchExtensions(extensions: string[]): void;
    start(path: string): void;
    restart(): void;
    compile(path: string): void;
    cleanExit(): void;
    crash(): void;
    //
    moreInfo(): void;
    noFile(): void;
    noDirectory(): void;
    compileOnly(): void;
    help(extensions: string[]): void;
    //
    log(message: string): void;
    error(message: Error | string): void;
}
declare class Cpace implements CCpace {
    readonly args: string[];
    readonly flags: Flags;
    readonly config: Config;
    readonly extensions: Extensions;
    readonly logger: Logger;
    //
    constructor(argv: string[]);
    run(): void;
    //
    checkArgs(): void;
    parseFlags(): void;
    parseConfig(): void;
    compile(): void;
    open(): void;
    watch(): void;
    //
    getCommand(extension: string): string;
}
export { Cpace as default, Cpace };
