'use strict'

const template = require('art-template')
const path = require('path')
const through = require('through2')
const gutil = require('gulp-util')
const PluginError = gutil.PluginError

const PLUGIN_NAME = 'gulp-art-tpl'

function gulpArtTpl(data = {}, options, settings = {}) {
  const assign = Object.assign

  // 让模板引擎支持 ES6 ${name} 模板字符串的解析
  template.defaults.rules.push({
    test: /\${([\w\W]*?)}/,
    use: function (match, code) {
      return {
        code: code,
        output: 'escape'
      }
    }
  })

  // 默认配置选项
  options = assign({
    minimize: false,
    root: path.resolve('src/'),
    extname: '.html',
    include(filename, incData, incBlock, incOptions) {
      incData = assign({}, data, incData)
      return template.defaults.include(filename, incData, incBlock, incOptions)
    }
  }, options)

  return through.obj(function (file, encoding, callbak) {
    if (file.isNull()) {
      this.push(file)
      return callbak()
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'))
      return cb()
    }

    data = assign({}, data, file.data)
    options.filename = file.path
    if (file.isBuffer()) {
      const content = template.render(file.contents.toString(), data, options)
      file.contents = new Buffer(content)

      if (typeof settings.ext !== 'undefined') {
        file.path = gutil.replaceExtension(file.path, settings.ext)
      }
    }
    this.push(file)
    callbak()
  })
}

module.exports = gulpArtTpl
