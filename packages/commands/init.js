const inquirer = require('inquirer');
const figlet = require('figlet');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
// const download = require('download-git-repo');

const CURR_DIR = process.cwd();
const QUESTIONS = [
  {
    name: 'tool-name',
    type: 'input',
    message: 'Tool name:',
    validate(input) {
      if (/^([A-Za-z\-\_\d])+$/.test(input)) {
        return true;
      }
      return 'Tool name may only include letters, numbers, underscores and hashes.';
    },
  },
  {
    name: 'tool-type',
    type: 'list',
    message: 'Please select the difficulty level of the tool',
    choices: [
      'normal tool',
      'complex tool',
    ],
  },
];

/**
 * 根据模板类型获取模板路径
 * @param {String} type 模板类型
 */
function getTemplateDir(type) {
  let lastPath = '';
  switch (type) {
    case 'normal tool':
      lastPath = 'normal';
      break;
    case 'complex tool':
      lastPath = 'complex';
      break;
    default:
      lastPath = 'normal';
      break;
  }
  return lastPath;
}

/**
 * 创建本仓模板
 * @param {String} oPath 路径
 * @param {String} targetPath 目标路径
 */
function createTemplate(oPath, targetPath) {
  const createFiles = fs.readdirSync(oPath);
  createFiles.forEach((file) => {
    const originPath = `${oPath}/${file}`;
    const stats = fs.statSync(originPath);

    if (stats.isFile()) {
      const contents = fs.readFileSync(originPath, 'utf8');
      // if (file === '.npmignore') {
      //   file = '.gitignore';
      // }
      const writePath = `${CURR_DIR}/${targetPath}/${file}`;
      fs.writeFileSync(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      fs.mkdirSync(`${CURR_DIR}/${targetPath}/${file}`);
      createTemplate(`${oPath}/${file}`, `${targetPath}/${file}`);
    }
  });
}

/**
 * 下载github模板
 */
// function createGitTemplate(target) {
//   download('direct:https://github.com/Mondschein-SX/naza-cli.git#main', target, { clone: true }, (err) => {
//     console.log(`下载模板失败：${err}`);
//   });
// }

/**
 * 获取模板完毕
 * @param {String} name 模板名称
 */
function complete(name) {
  figlet('NAZA CLI', (err, data) => {
    if (err) {
      console.log(chalk.red('Some thing about figlet is wrong!'));
    }

    console.log(chalk.blueBright.bold(data));
    console.log(`   [Success] Tool ${name} init finished, be pleasure to use 😊!`);
    console.log();
    console.log('   运行步骤:');
    console.log('   -----------------------------------------------');
    console.log('   [Step1] Install dependencies:');
    console.log(chalk.blueBright(`     ->  cd ${name} && npm install`));
    console.log('   [Step2] Run the app:');
    console.log(chalk.blueBright('     ->  cezhou start'));
    console.log('   -----------------------------------------------');
    console.log();
  });
}

module.exports = () => {
  inquirer.prompt(QUESTIONS)
    .then((answers) => {
      const name = answers['tool-name'];

      fs.mkdirSync(`${CURR_DIR}/${name}`);

      // 1、下载本仓模板
      const templateDir = getTemplateDir(answers['tool-type']);
      const templatePath = path.join(__dirname, '../../template/', templateDir);
      createTemplate(templatePath, name);

      // 2、下载github模板
      // createGitTemplate(`${CURR_DIR}/${name}`);

      setTimeout(() => complete(name), 500);
    });
};
