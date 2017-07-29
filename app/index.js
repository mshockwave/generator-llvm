var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  prompting(){
    this.prompt({
      name: 'subGenerator',
      message: 'Choose the project type you want to generate',
      type: 'list',
      choices: [
        'Pass',
        'Executable'
      ],
      default: 'Pass'
    }).then((answer) => {
      switch(answer.subGenerator){
        case 'Pass':
          this.composeWith(require.resolve('../pass'));
          break;
        case 'Executable':
          this.composeWith(require.resolve('../executable'));
          break;
      }
    });
  }
}
