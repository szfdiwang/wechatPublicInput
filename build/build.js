'use strict'
require('./check-versions')()

// process.env.NODE_ENV = 'production'

const ora = require('ora')
const rm = require('rimraf')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

// const spinner = ora('building for production...')
// spinner.start()

if (process.env.NODE_ENV == undefined) {
  console.log(chalk.yellow('打包命令错误:未有正确的后缀,\n测试环境请使用: build:sit,\nUat环境请使用: build:uat,\n生产环境请使用: build:prod'))
} else {
  var spinner = ora(chalk.green('打包环境: ' + process.env.NODE_ENV + ' ,通过环境脚本: ' + process.env.env_config + ' mode,打包中......'))
  spinner.start()
  rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err
    webpack(webpackConfig, (err, stats) => {
      spinner.stop()
      if (err) throw err
      process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
        chunks: false,
        chunkModules: false
      }) + '\n\n')

      if (stats.hasErrors()) {
        console.log(chalk.red(' 打包出错啦,请仔细检查代码.\n'))
        process.exit(1)
      }
      console.log(chalk.blue('  打包已经顺利完成\n'))
    })
  })
}
