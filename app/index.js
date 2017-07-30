var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  default(){
    this.log(`
    Please use the sub-module instead:
      
      yo llvm:executable <arguments>

      yo llvm:pass <arguments>
    `);
  }
}
