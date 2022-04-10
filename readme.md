# cpace

cpace is a tool that helps develop [.c] and [.cpp] based applications by automatically restarting them when file changes in the directory are detected.

cpace does **not** require *any* additional changes to your code or method of development.


# Installation

The best way to install cpace is using [npm](https://www.npmjs.com/package/cpace) or [yarn](https://yarnpkg.com):

```bash
# using npm:
npm install -g cpace

# or using yarn:
yarn global add cpace
```

And cpace will be installed globally to your system path.

You can also install cpace as a development dependency:

```bash
# using npm:
npm install --save-dev cpace

# or using yarn:
yarn add cpace -D
```

With a local installation, cpace will not be available in your system path or you can't use it directly from the command line.
With a global installation cpace will be available anywhere.

# Usage

cpace wraps your application, so you just have to pass your file name:

```bash
cpace [file.c]
# or
cpace [file.cpp]
```

For CLI options, use the `-h` (or `--help`) argument:

```bash
cpace -h
```

For compilation without starting the program, use the `-c` (or `--compile`) argument:

```bash
cpace -c [file.cpp]
```

For watching a directory and compiling specific file, use the `-d` (or `--directory`) argument:

```bash
# the file name must be after the -d argument
cpace {directory} -d [file.cpp]
```

Also, you can use several arguments:

```bash
cpace {directory} -d [file.cpp] -с
# or
cpace {directory} -c -d [file.cpp]
```

## Automatic re-running

cpace was written to restart C and C++ applications. If your script exits cleanly, cpace will continue to monitor the file and restart it if there are any changes.
