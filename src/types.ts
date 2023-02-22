// utils

export type HandleError = (error: Error | string) => void

export type IsWindows = () => boolean

export type GetVersion = (pkg: string) => string

export type RemoveArrayItem = (array: any[], item: any) => any[]

// logger

export interface Flag {
    active: boolean
    short: string
    long: string
}

export interface Flags {
    help: Flag
    compileOnly: Flag
    directory: Flag & { index: number }
}

export interface Config {
    directory: string
    file: string
    name: string
    extension: string
    exe: string
    watch: string
    watchShort: string
    compile: string
    open: string
    openShort: string
}

export type Extensions = Map<string, string>

export declare class CCpace {
    public readonly args: string[]
    public readonly flags: Flags
    public readonly config: Config
    public readonly extensions: Extensions
    public readonly logger: CLogger

    constructor(argv?: string)
    public run(): void

    public checkArgs(): void
    public parseFlags(): void
    public parseConfig(): void
    public compile(): void
    public open(): void
    public watch(): void

    public getCommand(extension: string): string
}

// cpace
export declare class CLogger {
    public readonly package: string
    public readonly prefix: string

    constructor(argv?: string[])

    public watchPath(path: string): void
    public watchExtensions(extensions: string[]): void
    public start(path: string): void
    public restart(): void
    public compile(path: string): void
    public cleanExit(): void
    public crash(): void

    public moreInfo(): void
    public noFile(): void
    public noDirectory(): void
    public compileOnly(): void
    public help(extensions: string[]): void

    public log(message: string): void
    public error(message: Error | string): void
}
