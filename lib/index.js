'use strict'

const template = require('art-template')
const through = require('through2')
const PluginError = require('plugin-error')

const PLUGIN_NAME = 'gulp-art-tpl'

/**
 * 编译 art-template
 * @param {object} data 数据
 * @param {object} options 配置项 (template.defaults选项)
 * @returns 
 */
function gulpArtTpl(data = {}, options = {}) {
  const assign = Object.assign
  options = assign({
    // 是否开启压缩
    minimize: false
  }, options)
  
  return through.obj(function (file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file)
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams are not supported!'))
      return callback()
    }

    data = assign({}, data, file.data)
    options.filename = file.path

    try {
      if (file.isBuffer()) {
        const rendered = template.render(file.contents.toString(), data, options)
        file.contents = Buffer.from(rendered)
      }
    } catch (err) {
      this.emit('error', new PluginError(PLUGIN_NAME, err, { fileName: file.path }))
    }
    this.push(file)
    callback()
  })
}

module.exports = gulpArtTpl
