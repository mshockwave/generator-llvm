# LLVM Executable/Pass Templates Generator

Generate project templates for executables that use LLVM 
and LLVM passes.

## Generator Kinds & Guides
#### Standalone Executable(`executable`)
A normal executable program that uses LLVM.

#### Pass(`pass`)
A LLVM pass that can be easily integrated into LLVM project in the future. See [this](https://llvm.org/docs/CMake.html#id15) for more information

#### Executable(`tool`)(Status: _TBD_)
A executable program that can be easily integrated into LLVM project as one of the tools in the future.

## Install
Requirements:
 - [Node.js](https://nodejs.org/en/download/)
 - [npm](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/en/docs/install)

Install yeoman:
```
npm install -g yo
```
Install this generator from npm repository
```
npm install -g generator-llvm
```

## Usage
### Generating Standalone Executable
Boostraping a new project:
```
yo llvm:executable init
```
Adding new program to existing (executable)project
```
yo llvm:executable append
```

### Generating New Pass
Boostraping a new project
```
yo llvm:pass init
```
Adding new program to existing (pass)project
```
yo llvm:pass append
```
If you like to stay on bleeding edge and want to try the new PassManager pass, add the `--new-pm` at the tail:
```
yo llvm:pass init --new-pm
# Same option applies to the "append" command as well
```
The generated pass is also loaded as an external plugin. Please refer to [this article](https://medium.com/@mshockwave/writing-llvm-pass-in-2018-part-i-531c700e85eb) I wrote about how to run a new PassManager pass.

#### Note
If you append new executable/pass to existing project, it would show the following message:
```
 conflict ../CMakeLists.txt
? Overwrite ../CMakeLists.txt? (ynaxdH)
```
It is because that we're trying to modify an exist file(the top-level CMakeLists.txt), which is not what yeoman glad to see. However, in this case, press `y` to overrite is totally fine.

## Development
(In this repo folder)Install dependencies:
```
npm install
```
Temporary link to yeoman's generator repository
```
npm link
```
