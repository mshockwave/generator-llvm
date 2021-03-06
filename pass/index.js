var Generator = require('yeoman-generator');
const path = require('path');
const nodefs = require('fs');

module.exports = class extends Generator {
  // Don't use static since we're anonymous class
  // and the access statement would be too long
  get scopeShorts(){
    return {
      'Function': 'F',
      'Module': 'M',
      'BasicBlock': 'BB'
    };
  }

  _printUsage() {
    this.log("Usage: <command> [options]");
    this.log(this.argumentsHelp());
    this.log("Available options:");
    this.log(this.optionsHelp());
  }

  constructor(args, opts){
    super(args, opts);

    try{
      // New PassManager
      this.option('new-pm', {
        type: Boolean,
        description: 'Generate pass that uses new PassManager',
        default: false
      });

      this.argument('command', {
        type: String,
        description: `
          init - Init an empty pass project
          append - Append an pass to existing (pass)project
        `
      });
    } catch(e){
      this._printUsage();
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
      default: '/usr/local/opt/llvm',
      store: true
    }];
    var newPassPrompts = [{
      name: 'passName',
      type: 'input',
      message: 'Pass name',
      default: ans => {
        if(ans.hasOwnProperty('projectName'))
          return ans.projectName;
        else
          return currentDirName;
      }
    },
    {
      name: 'passSubDirName',
      type: 'input',
      message: 'New pass subdirectory name',
      default: (ans) => ans.passName
    },
    {
      name: 'passScope',
      type: 'list',
      message: 'Pass Kind',
      choices: [
        'FunctionPass',
        'ModulePass',
        'BasicBlockPass'
      ],
      default: 'FunctionPass'
    },
    {
      name: 'passShortHand',
      type: 'input',
      message: 'Short name for the pass',
      default: (ans) => ans.passName.toLowerCase()
    }
    ];
    if(this.options["new-pm"] === true)
      newPassPrompts = newPassPrompts.concat({
        name: 'passVersion',
        type: 'input',
        message: 'Version of this pass',
        default: "v0.1"
      });
    else
      newPassPrompts = newPassPrompts.concat({
        name: 'passDescription',
        type: 'input',
        message: 'Description of the pass'
      });

    const setUpTop = (answers) => {
      var top = this._props.top;
      top.name = answers.projectName;
      top.minCmakeVer = answers.minCMakeVersion;
      top.llvmInstallDir = answers.llvmInstallDir;
      return answers;
    };
    const setUpPass = (answers) => {
      var sub = this._props.sub;
      sub.name = answers.passName;
      sub.dirName = answers.passSubDirName;
      sub.scope = answers.passScope.replace(/Pass$/, '');
      if(this.options["new-pm"] === true)
        sub.version = answers.passVersion;
      else
        sub.description = (answers.passDescription.length > 0)?
                            answers.passDescription :
                            'Description for ' + sub.name;
      sub.shortHand = answers.passShortHand;
      return answers;
    }

    switch(this.options.command){
      case 'init':
        return this.prompt(
          newProjectPrompts.concat(newPassPrompts)
        ).then(ans => {
            this._props.top = {};
            this._props.sub = {};
            return ans;
          })
         .then(setUpTop)
         .then(setUpPass);
      
      case 'append':
        return this.prompt(newPassPrompts)
          .then(ans => {  
            this._props.sub = {};
            return ans;
          })
          .then(setUpPass);

      default:
        this.log('Unknown command ' + this.options.command);
        this._printUsage();
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

    /// Pass
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
        '\nadd_subdirectory(' + sub.dirName + ')';

      /// Write import statement into top-level cmake script
      // FIXME: The conflict checker would complain
      // if we add new sub-module to exist project
      // since it touch exist(the top-level) cmake script
      this.fs.append(topCmakePath, cmakeImportStr);

      // Create sub directory
      nodefs.mkdirSync(sub.dirName);

      /// Switch context
      this.destinationRoot(
        this.destinationPath(sub.dirName)
      );
      this.sourceRoot(
        this.templatePath('passTpl')
      );

      /// Copy files
      this.fs.copyTpl(
        this.templatePath('CMakeLists.txt'),
        this.destinationPath('CMakeLists.txt'),
        {
          passName: sub.name
        }
      );
      if(this.options["new-pm"] === true)
        this.fs.copyTpl(
          this.templatePath('newPMtemplatePass.cpp'),
          this.destinationPath(sub.name + 'Pass.cpp'),
          {
            passName: sub.name,
            passScope: sub.scope,
            scopeShortHand: this.scopeShorts[sub.scope],
            passShortHand: sub.shortHand,
            passVersion: sub.version
          }
        );
      else
        this.fs.copyTpl(
          this.templatePath('templatePass.cpp'),
          this.destinationPath(sub.name + 'Pass.cpp'),
          {
            passName: sub.name,
            passScope: sub.scope,
            scopeShortHand: this.scopeShorts[sub.scope],
            passShortHand: sub.shortHand,
            passDescription: sub.description
          }
        );
    }
  }
}
