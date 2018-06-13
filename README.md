# gulp-art-tpl

> a gulp plugin for art-template v4

`gulp-art-tpl`是一款让你在html中使用art-template模板引擎语法的gulp插件。



## 安装

```
npm install --save-dev gulp-art-tpl
```



## Example

*gulpfile.js* 文件：

```js
const gulp = require('gulp')
const template = require('gulp-art-tpl')

gulp.task('build:html', function() {
  gulp.src('./src/*.html')
    .pipe(template({
      NODE_ENV: 'production',
      author: 'Mervin'
    }))
    .pipe(gulp.dest('dist/'))
})
```



`demo.html` 文件：

```html
<body>
{{if NODE_ENV === 'production'}}
来自 {{author}} 的微笑！
{{/if}}

<!-- 公共头部 -->
{{include './comm/header.html'}}

<!-- 新闻模块 -->
<section class="news">
<% include('./news.html', {
  text: '新闻列表'
}) %>
</section>

<!-- 公共底部 -->
{{include './comm/footer.html'}}
</body>
```



`news.html` 文件：

```html
<% var news = [{
  title: '第 一 条新闻'
}, {
  title: '第 二 条新闻'
}, {
  title: '第 三 条新闻'
}] %>
<h3>{{text}}</h3>
<ul>
  {{each news}}
  <li>{{$index}}. {{$value.title}}</li>
  {{/each}}
</ul>
```



## 语法

art-template 支持标准语法与原始语法。标准语法可以让模板易读写，而原始语法拥有强大的逻辑表达能力。

标准语法支持基本模板语法以及基本 JavaScript 表达式；原始语法支持任意 JavaScript 语句，这和 EJS 一样。

### 输出

**标准语法**

```html
{{value}}
{{data.key}}
{{data['key']}}
{{a ? b : c}}
{{a || b}}
{{a + b}}

```

**原始语法**

```html
<%= value %>
<%= data.key %>
<%= data['key'] %>
<%= a ? b : c %>
<%= a || b %>
<%= a + b %>

```

模板一级特殊变量可以使用 `$data` 加下标的方式访问：

```html
{{$data['user list']}}
```

### 原文输出

**标准语法**

```html
{{@ value }}
```

**原始语法**

```html
<%- value %>
```

> 原文输出语句不会对 `HTML` 内容进行转义处理，可能存在安全风险，请谨慎使用。

### 条件

**标准语法**

```html
{{if value}} ... {{/if}}
{{if v1}} ... {{else if v2}} ... {{/if}}
```

**原始语法**

```html
<% if (value) { %> ... <% } %>
<% if (v1) { %> ... <% } else if (v2) { %> ... <% } %>
```

### 循环

**标准语法**

```html
{{each target}}
    {{$index}} {{$value}}
{{/each}}
```

**原始语法**

```html
<% for(var i = 0; i < target.length; i++){ %>
    <%= i %> <%= target[i] %>
<% } %>
```

1. `target` 支持 `array` 与 `object` 的迭代，其默认值为 `$data`。
2. `$value` 与 `$index` 可以自定义：`{{each target val key}}`。

### 变量

**标准语法**

```
{{set temp = data.sub.content}}
```

**原始语法**

```
<% var temp = data.sub.content; %>
```

### 模板继承

**标准语法**

```html
{{extend './layout.art'}}
{{block 'head'}} ... {{/block}}
```

**原始语法**

```
<% extend('./layout.art') %>
<% block('head', function(){ %> ... <% }) %>
```

模板继承允许你构建一个包含你站点共同元素的基本模板“骨架”。范例：

```html
<!--layout.art-->
<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{block 'title'}}My Site{{/block}}</title>

    {{block 'head'}}
    <link rel="stylesheet" href="main.css">
    {{/block}}
</head>
<body>
    {{block 'content'}}{{/block}}
</body>
</html>

```

```html
<!--index.art-->
{{extend './layout.art'}}

{{block 'title'}}{{title}}{{/block}}

{{block 'head'}}
    <link rel="stylesheet" href="custom.css">
{{/block}}

{{block 'content'}}
<p>This is just an awesome page.</p>
{{/block}}

```

渲染 index.art 后，将自动应用布局骨架。

### 子模板

**标准语法**

```html
{{include './header.art'}}
{{include './header.art' data}}

```

**原始语法**

```html
<% include('./header.art') %>
<% include('./header.art', data) %>
```

1. `data` 数默认值为 `$data`；标准语法不支持声明 `object` 与 `array`，只支持引用变量，而原始语法不受限制。
2. art-template 内建 HTML 压缩器，请避免书写 HTML 非正常闭合的子模板，否则开启压缩后标签可能会被意外“优化。



## 选项

```js
const template = require('gulp-art-tpl')

/**
 * @param data 全局数据
 * @param options 配置
 * @param settings 扩展
 */
template(data, options, settings)
```



**data**

Type: `Object`



**options**

Type: `Object`

```js
// 模板名
filename: null,

// 模板语法规则列表
rules: [nativeRule, artRule],

// 是否开启对模板输出语句自动编码功能。为 false 则关闭编码输出功能
// escape 可以防范 XSS 攻击
escape: true,

// 启动模板引擎调试模式。如果为 true: {cache:false, minimize:false, compileDebug:true}
debug: detectNode ? process.env.NODE_ENV !== 'production' : false,

// bail 如果为 true，编译错误与运行时错误都会抛出异常
bail: true,

// 是否开启缓存
cache: true,

// 是否开启压缩。它会运行 htmlMinifier，将页面 HTML、CSS、CSS 进行压缩输出
// 如果模板包含没有闭合的 HTML 标签，请不要打开 minimize，否则可能被 htmlMinifier 修复或过滤
minimize: true,

// 是否编译调试版
compileDebug: false,

// 模板路径转换器
resolveFilename: resolveFilename,

// 子模板编译适配器
include: include,

// HTML 压缩器。仅在 NodeJS 环境下有效
htmlMinifier: htmlMinifier,

// HTML 压缩器配置。参见 https://github.com/kangax/html-minifier
htmlMinifierOptions: {
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    // 运行时自动合并：rules.map(rule => rule.test)
    ignoreCustomFragments: []
},

// 错误事件。仅在 bail 为 false 时生效
onerror: onerror,

// 模板文件加载器
loader: loader,

// 缓存中心适配器（依赖 filename 字段）
caches: caches,

// 模板根目录。如果 filename 字段不是本地路径，则在 root 查找模板
root: '/',

// 默认后缀名。如果没有后缀名，则会自动添加 extname
extname: '.html',

// 忽略的变量。被模板编译器忽略的模板变量列表
ignore: [],

// 导入的模板变量
imports: runtime
```



**settings**

>  生成的文件后缀名 (建议不设置)

Type: `Object`

```javascript
{
  ext: '.html'
}
```



## More

更多查看： https://github.com/aui/art-template