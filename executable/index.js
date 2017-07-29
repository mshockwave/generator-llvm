var Generator = require('yeoman-generator');
const path = require('path');

module.exports = class extends Generator {
  constructor(args, opts){
    super(args, opts);
  
    try{
      this.argument('command', {
        type: String,
        description: `
          init - Init an empty executable project
          append - Append an executable to existing (executable)project
        `
      });
    } catch(e) {
      this.log(this.argumentsHelp());
      process.exit(1);
    }
  }

  initializing() {
    this._props = {};
  }

  prompting(){
    const currentDirName = path.basename(this.destinationRoot());

    const newProjectPrompts = [{
      name: 'projectName',
      type: 'input',
      message: 'Project name',
      default: currentDirName
    },
    {
      name: 'minCMakeVersion',
      type: 'input',
      message: 'Minimum required CMake version',
      default: '3.4.3'
    },
    {
      name: 'llvmInstallDir',
      type: 'input',
      message: 'LLVM install path. NOT the LLVM cmake module path',
      default: '/usr/local/opt/llvm'
    }];
    const newModulePrompts = [{
      name: 'subDirName',
      type: 'input',
      message: 'New subdirectory name',
      default: ans => {
        if(ans.hasOwnProperty('projectName'))
          return 'llvm-' + ans.projectName.toLowerCase();
        else
          return 'llvm-' + currentDirName;
      }
    },
    {
      name: 'progName',
      type: 'input',
      message: 'Program name',
      default: (ans) => ans.subDirName
    },
    {
      name: 'depLibs',
      type: 'input',
      message: 'LLVM components that depends on(separated by commas)'
    }];

    const setUpTop = (answers) => {
      var top = this._props.top;
      top.name = answers.projectName;
      top.minCmakeVer = answers.minCMakeVersion;
      top.llvmInstallDir = answers.llvmInstallDir;
      return answers;
    };
    const processDepLibs = (answers) => {
      var libsArray = [];
      if(answers.depLibs.length > 0)
        answers.depLibs.split(',').forEach(
          s => libsArray.push(s.trim())
        );
      
      this._props.sub.depLibs = libsArray;
      return answers;
    };
    const setUpSub = (answers) => {
      var sub = this._props.sub;
      sub.name = answers.subDirName;
      sub.progName = answers.progName;
      return answers;
    }

    switch(this.options.command){
      case 'init':
        return this.prompt(
          newProjectPrompts.concat(newModulePrompts)
        ).then(ans => {
            this._props.top = {};
            this._props.sub = {};
            return ans;
          })
         .then(setUpTop)
         .then(processDepLibs)
         .then(setUpSub);
      
      case 'append':
        return this.prompt(newModulePrompts)
          .then(ans => {  
            this._props.sub = {};
            return ans;
          })
          .then(processDepLibs)
          .then(setUpSub);

      default:
        this.log('Unknown command ' + this.options.command);
        this.log('Usage: ');
        this.log(this.argumentsHelp());
        process.exit(1);
    }
  }

  default(){
    this.log(this._props);
  }
}
