#! /usr/bin/env node

import { program } from 'commander';
import { readFile } from "fs/promises";
import createFun from '../lib/create.js';
import chalk from 'chalk';
import figlet from 'figlet';

const pkg = JSON.parse(
  await readFile(new URL("../package.json", import.meta.url))
);
program
  // 定义命令和参数
  .command('create <app-name>')
  .description('创建一个工程')
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option('-f, --force', '覆盖目标目录')
  .action((name, options) => {
    createFun(name,options)
  })
  
program
   // 配置版本号信息
  .version(`v${pkg.version}`)
  .usage('<command> [option]')

  program
    // 监听 --help 执行
    .on('--help', () => {
    // 使用 figlet 绘制 Logo
    console.log('\r\n' + figlet.textSync('suiCli', {
      font: 'Ghost',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    }));
    // 新增说明信息
    console.log(`\r\n运行命令 ${chalk.cyan(`sg --help`)} 获取命令的详细用法\r\n`)
  })
  
// 解析用户执行命令传入参数
program.parse(process.argv);