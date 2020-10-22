#!/usr/bin/env node

const program = require('commander');
const init = require('../packages/commands/init');
const run = require('../packages/commands/run');

// 创建工程
program
  .version('0.0.4', '-v, --version')
  .usage('[command]')
  .command('init')
  .description('initialize your project')
  .action(init);

// 运行
program
  .command('run')
  .description('run the project in your local browser')
  .action(run);

program.parse(process.argv);
