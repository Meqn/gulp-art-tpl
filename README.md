# gulp-art-tpl

> A gulp plugin for art-template.

用于解析 `art-template` 模板引擎语法的gulp插件。它能让你快速在 Gulp 工作流中处理 art-template 文件。 


## Install

```
npm install --save-dev gulp-art-tpl
```



## Usage

👉 [查看 art-template 语法>>](https://aui.github.io/art-template/)

```js
const gulp = require('gulp')
const template = require('gulp-art-tpl')
const rename = require('gulp-rename')

gulp.task('build:html', function() {
  gulp.src('./src/*.{art,html,ejs}')
    .pipe(template({
      title: 'art-template',
      author: 'Mervin'
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('dist/'))
})
```

```html
<!-- demo.html -->
<div>
  <h1>{{title}}</h1>
  <p>{{author}}</p>
</div>

<!-- or -->
<div>
  <h1><%= title %></h1>
  <p><%= author%></p>
</div>
```

Output:

```html
<div>
  <h1>art template</h1>
  <p>Mervin</p>
</div>
```


> 1. `art-template` 同时支持标准语法和原始语法;
> 2. 原始语法兼容 `EJS` , `LoDash` 模板。

## API

```
template(data, options)
```
### data
需要渲染的数据
- `type` - `object`

### options
编译选项，具体查看 [template.defaults](https://aui.github.io/art-template/zh-cn/docs/options.html)
- `type` - `object`

