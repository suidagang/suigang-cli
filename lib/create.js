import path from 'path';
import fs from 'fs-extra';
import list from 'inquirer';
import { Generator } from './Generator.js'

const createFun = async (name, options) => {
  // 当前命令行选择的目录
  const cwd = process.cwd();
  // 需要创建的目录地址
  const targetAir = path.join(cwd, name);
  // 目录是否已经存在？
  if (fs.existsSync(targetAir)) {

    // 是否为强制创建？
    if (options.force) {
      await fs.remove(targetAir)
    } else {
      // 询问用户是否确定要覆盖
      let { action } = await list.prompt([
        {
          name: 'action',
          type: 'list',
          message: '目标目录已经存在,请选择如下操作:',
          choices: [
            {
              name: '覆盖',
              value: 'overwrite'
            }, {
              name: '取消',
              value: false
            }
          ]
        }
      ]);
      if (!action) {
        return;
      } else if (action === 'overwrite') {
        // 移除已存在的目录
        console.log(`\r\nRemoving...`)
        await fs.remove(targetAir)
      }
    }
  }

  // 创建项目
  const generator = new Generator(name, targetAir);
  // 开始创建项目
  generator.create()
}
export default createFun;