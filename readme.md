<p align="center">
    <img src="./assets/logo.png" alt="cpace logo" width="300px">
</p>

<br>

# cpace

`cpace` is a tool that helps develop [.c] and [.cpp] based applications by automatically restarting them when file changes are detected. The package was built to automate the compilation and running of [.exe] files when writing C/C++ applications.

<br>

# Requirements

-   `Node.js` (to use `cpace`) (**[how to install](https://nodejs.dev/learn/how-to-install-nodejs) / [download](https://nodejs.dev/download)**)
-   `gcc`/`g++` (to compile the project) (**[how to install](https://www.youtube.com/watch?v=sXW2VLrQ3Bs) / [download](https://sourceforge.net/projects/mingw)**)

<br>

# Installation

The best way to install cpace is using [npm](https://www.npmjs.com/package/cpace) _(pnpm or yarn are also suitable)_:

```bash
npm install cpace --global
# or
npm i cpace -g
```

<br>

cpace will be installed globally to your system path.
With a global installation cpace will be available anywhere.

<br>

You can also install cpace as a development dependency:

```bash
npm install cpace --save-dev
# of
npm i cpace -D
```

When installed locally, cpace will not be available in your system path, and you will not be able to use it directly from the command line.

<br>

# Usage

cpace wraps your application, so you just have to pass your file name (and directory, if needed):

```bash
# for C files
cpace ./file.c

# for C++ files
cpace ./file.cpp
```

<br>

CLI help: `-h` (or `--help`)

```bash
cpace -h
# or
cpace --help
```

<br>

Compilation without starting the program: `-c` (or `--compileOnly`)

```bash
cpace ./file.cpp -c
# or
cpace ./file.cpp -compileOnly
```

<br>

Browsing a directory and compiling a specific file: `-d` (or `--directory`)

```bash
# file name must be after the -d argument
cpace ./file.cpp -d ./src
```

<br>

# Update

To update the **local** installation:

```bash
npm update cpace
```

<br>

To update the **global** installation:

```bash
npm update -g cpace
```

<br>

# Notice

cpace was written to restart C and C++ applications. If your script exits cleanly, cpace will continue to monitor the file and restart it if there are any changes. If there is an error, cpace will notify you in the console.

_Tested on MacOS Monterey, MacOS Ventura, Windows 10, Windows 11._
