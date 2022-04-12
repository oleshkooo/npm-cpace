<p align="center">
  <img src="./logo.png" alt="cpace Logo" width="300px">
</p>



# cpace
cpace is a tool that helps develop [.c] and [.cpp] based applications by automatically restarting them when file changes are detected. The package was built to automate the compilation and running of .exe files when writing C/C++ applications.



# Requirements
* `Node.js` must be installed on your PC (**[how to install](https://nodejs.dev/learn/how-to-install-nodejs) / [download](https://nodejs.dev/download)**)
* `gcc`/`g++` must be installed on your PC (**[how to install](https://www.youtube.com/watch?v=sXW2VLrQ3Bs) / [download](https://sourceforge.net/projects/mingw)**)


# Installation
The best way to install cpace is using [npm](https://www.npmjs.com/package/cpace):

```bash
npm install -g cpace
```
cpace will be installed globally to your system path.
With a global installation cpace will be available anywhere.

You can also install cpace as a development dependency:
```bash
npm install --save-dev cpace
```
With a local installation, cpace will not be available in your system path or you can't use it directly from the command line.



# Usage

cpace wraps your application, so you just have to pass your file name:

```bash
# for C files
cpace [file.c]

# for C++ files
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



# Update
If you installed cpace **locally**, use:
```bash
npm update cpace
```

If you installed cpace **globally**, use:
```bash
npm update -g cpace
```






## Notice
cpace was written to restart C and C++ applications. If your script exits cleanly, cpace will continue to monitor the file and restart it if there are any changes. If there is an error, cpace will notify you in the console.\
\
Tested on Windows 10, Windows 11.\
\
With cpace you can't use `cin >>`, `gets()`, `getchar()`, `getline()` and similar functions to get data from the console *(maybe this will be fixed in the future)*.