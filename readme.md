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

With a local installation, cpace will not be available in your system path or you can't use it directly from the command line. Instead, the local installation of cpace can be run by calling it from within an npm script (such as `npm start`) or using `npx cpace`.

# Usage

cpace wraps your application, so you just have to pass your file name:

```bash
cpace [your C/C++ app]
```

For CLI options, use the `-h` (or `--help`) argument:

```bash
cpace -h
```

Any output from this script is prefixed with `[cpace]`, otherwise all output from your application.

## Automatic re-running

cpace was originally written to restart hanging processes such as C and C++ applications. If your script exits cleanly, cpace will continue to monitor the file and restart it if there are any changes.
