var Generator = require('yeoman-generator');
const path = require('path');
const mkdirp = require('mkdirp-promise');

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

  writing(){
    //this.log(this._props);

    // Top level project
    if(this._props.hasOwnProperty('top')){
      var top = this._props.top;
      this.fs.copyTpl(
        this.templatePath('CMakeLists.txt'),
        this.destinationPath('CMakeLists.txt'),
        {
          minCmakeVer: top.minCmakeVer,
          topProjectName: top.name,
          llvmInstallDir: top.llvmInstallDir
        }
      );
    }

    // Sub-module
    // Check property exist - just for safe
    if(this._props.hasOwnProperty('sub')){
      // Check top level project exist
      const topCmakePath = this.destinationPath('CMakeLists.txt');
      if(!this.fs.exists(topCmakePath)){
        this.log('Error: CMakeLists.txt not found');
        this.log('You need to be in the top-level project folder');
        process.exit(1);
      }

      var sub = this._props.sub;
      const cmakeImportStr = 
        '\nadd_subdirectory(' + sub.name + ')';

      // Write import statement into top-level cmake script
      // FIXME: The conflict checker would complain
      // if we add new sub-module to exist project
      // since it touch exist(the top-level) cmake script
      this.fs.append(topCmakePath, cmakeImportStr);

      // Create sub directory
      mkdirp(sub.name);

      // Switch context
      this.destinationRoot(
        this.destinationPath(sub.name)
      );
      this.sourceRoot(
        this.templatePath('subModuleTpl')
      );

      // Copy files
      this.fs.copyTpl(
        this.templatePath('CMakeLists.txt'),
        this.destinationPath('CMakeLists.txt'),
        {
          progName: sub.progName,
          llvmDepLibs: sub.depLibs.join(' ')
        }
      );
      this.fs.copy(
        this.templatePath('main.cpp'),
        this.destinationPath('main.cpp')
      );
    }
  }
}
