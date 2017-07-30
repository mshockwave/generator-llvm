# LLVM Project Templates Generator
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
TBD
```

## Generator Kinds & Guides
#### Standalone Executable(`executable`)
A normal executable program that uses LLVM.

#### Pass(`pass`)
A LLVM pass that can be easily integrated into LLVM project in the future. See [this](https://llvm.org/docs/CMake.html#id15) for more information

#### Executable(`tool`)(Status: _TBD_)
A executable program that can be easily integrated into LLVM project as one of the tools in the future.

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
