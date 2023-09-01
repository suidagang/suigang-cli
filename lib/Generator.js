import { getRepoList } from './http.js';
import ora from 'ora';
import list from 'inquirer';
import download from 'download-git-repo';
import util from 'util';
import path from 'path';
import chalk from 'chalk';
import { GITHUP_CLONE_BASE_URL } from './constant.js';
import templateList from './config.js';

// 添加加载动画
async function wrapLoading(fn, message, ...args) { 
  // 使用ora初始化，传入提示信息message
  const spinner = ora(message);
  // 开始加载动画
  spinner.start();

  try {
    // 执行传入方法 fn
    const result = await fn(...args);
    // 状态修改为成功
    spinner.succeed();
    return result;
  } catch (e) {
    //状态修改为失败
    spinner.fail('Request failed, refetch ...')
  }
}

//通过选择筛选url
function getGithupCloneUrl(list, seletname) {
  const result = list.find((item) => {
    return item.name === seletname;
  });
  return result.url;
}

class Generator {
  constructor(name,targetDir) {
    // 目录名称
    this.name = name;
    // 创建位置
    this.targetDir = targetDir;
    // 对 download-git-repo 进行 promise 化改造
    this.downloadGitRepo = util.promisify(download);
    
  }
  /**
   * @name 下载远程模板
   * 1）拼接下载地址
   * 2）调用下载方法
   * */
  async downloadProject(repo) {
    // 1）拼接下载地址
    // const requestUrl = `direct:${GITHUP_CLONE_BASE_URL}${repo}`;
    const requestUrl = `direct:${repo}`;

    // 2）调用下载方法
    await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      '正在下载项目模板，请稍后', // 加载提示信息
      requestUrl, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir),// 参数2: 创建位置
      {clone:true},// 参数3: 用clone方式下载
    )
      
  }
  /**
   * @name 获取用户选择的模板
   *  1）从远程拉取模板数据
   *  2）用户选择自己新下载的模板名称
   *  3）return 用户选择的名称
   * */ 
  async getRepo() {
    // 1）从远程拉取模板数据
    const repoList = await wrapLoading(getRepoList, '正在获取可用模板列表');
    // console.log(repoList,'----repoList')
    if (!repoList) return;
    // 过滤我们需要的模板名称
    const repos = repoList.map(item => {
      item.realName = item.name;
      let obj = {
        realName: item.realName,
        description: item.description,
        name: `模板名称:${item.realName};描述:${item.description}`,
        url: item.html_url
      }
      return obj;
    });
    const reposTemplateList = [...repos,...templateList];
    if (!reposTemplateList || Array.isArray(reposTemplateList) && reposTemplateList.length <= 0) {
      return '';
    }
    // 2）用户选择自己新下载的模板名称
    const { repo } = await list.prompt({
      name: 'repo',
      type: 'list',
      choices: reposTemplateList,
      message: '请选择一个模板创建项目'
    })
    const result = getGithupCloneUrl(reposTemplateList, repo);
    // 3）return 用户选择的名称
    return result;
  }

  /**
   * @name 创建核心逻辑
   *  1）获取模板名称
   *  2）下载模板到模板目录
   * */ 
  async create() {
    // 1）获取模板名称
    const repo = await this.getRepo();
    if (!repo) {
      console.log(chalk.red(`\r\n(没有可用模板,已结束...)`));
      return;
    }
    // 2）下载模板到模板目录
    await this.downloadProject(repo)
     
    // 3）模板使用提示
    console.log(`\r\n成功创建项目工程，项目名：${chalk.cyan(this.name)}, 执行如下命令（启动项目）：`)
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    console.log('  npm run dev\r\n')
  }
}

export { Generator };