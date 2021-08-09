# vuepress-auto-sidebar

vuepress-auto-sidebar is a simple sidebar automating tool for Vuepress.

It looks for folders with README's in the folder vuepress was run in.
If a base-option was supplied in config.js, it will instead look in the specified directory.

Only supports .md files named README.

## Install

```bash
npm install vuepress-auto-sidebar
```

## Usage

config.js

```javascript
const sidebar = require('vuepress-auto-sidebar')

module.exports = {
    ...
    themeConfig: {
        sidebar: sidebar.getSidebar()
    ...
```

## or CLI:

config.js

```javascript
module.exports = {
    ...
    themeConfig: {
        sidebar: []
    ...
```

Then run:

```bash
cd vp
vuepress-auto-sidebar
```

![img](https://github.com/nikalsh/vuepress-auto-sidebar/blob/master/images/dir.png?raw=true)

Would result in

![demo](https://raw.githubusercontent.com/nikalsh/vuepress-auto-sidebar/master/images/demo.png)

### 2021-08-09 新增

使用命令行时，可追加参数，用于遍历指定文件夹，如在`package.json`中配置如下命令：

```json
  "scripts": {
    "dev": "cd docs && vuepress-auto-sidebar zh && vuepress dev",
    "docs:dev": "vuepress dev docs",
    "docs:build": "cd docs && vuepress-auto-sidebar zh && vuepress build",
    }
```

其中

```js
// dev 的作用为：将workspace 切换至 docs ,运行 vuepress-auto-sidebar [...paths] ,之后运行`vuepress dev`
// docs:dev 作用为： 基于当前的config.js 生成相应html文件，并在本地启用一个server ，用于调试
// docs:build 的作用为： 将workspace 切换至 docs ,运行 vuepress-auto-sidebar [...paths] ,之后运行`vuepress build`
```

命令参数解释：

```shell
vuepress-auto-sidebar [...paths]  # paths 为指定的遍历起始路径，不指定则从当前目录开始遍历
```

## Changelog

## v1.1.0 - 2021-08-09

- 将路径搜索逻辑修改为遍历文件夹

## v1.1.0 - 2020-06-20

#### Bug fix

- Correctly identify base-option (key can be base or "base") when using sidebar.getSidebar()
- Ignore all non-directories when scanning root docs folder with both sidebar.getSidebar() and CLI.

## v1.0.8 - 2020-06-07

#### Added

- CLI Support
- Rewrites config.js

You can now generate the sidebar with a CLI command, which will rewrite the config.js with the actual sidebar.

This lets you see exactly what is generated as well as letting you further customize it.

The following examples assumes you've installed it globally.

config.js:

```javascript
module.exports = {
  themeConfig: {
    sidebar: [],
  },
}
```

Run vuepress-auto-sidebar:

```bash
cd vp/path
vuepress-auto-sidebar
```

config.js result:

```javascript
module.exports = {
  themeConfig: {
    sidebar: [
      {
        title: 'Home',
        path: '/',
        collapsable: true,
        children: [],
      },
      {
        title: 'ProjectA',
        path: '/',
        collapsable: true,
        children: [],
      },
      {
        title: 'ProjectB',
        path: '/',
        collapsable: true,
        children: [],
      },
    ],
  },
}
```

CLI also supports base-option.

```javascript
module.exports = {
  themeConfig: {
    base: '/base/path/',
    sidebar: [],
  },
}
```

Run vuepress-auto-sidebar:

```bash
vuepress-auto-sidebar
```

config.js result:

```javascript
module.exports = {
  themeConfig: {
    base: '/base/path/',
    sidebar: [
      {
        title: 'Home',
        path: '/base/path/',
        collapsable: true,
        children: [],
      },
      {
        title: 'ProjectA',
        path: '/base/path/ProjectA/',
        collapsable: true,
        children: [],
      },
      {
        title: 'ProjectB',
        path: '/base/path/ProjectB/',
        collapsable: true,
        children: [],
      },
    ],
  },
}
```

Example scripts if you don't install it globally:

```javascript
"scripts": {
    "sidebar": "cd vp/path && vuepress-auto-sidebar",
    "dev": "cd vp/path && vuepress-auto-sidebar && vuepress dev"
}
```

## v1.0.5 - 2020-06-07

#### Added

- Support for "base"-option in config.js, it will now prepend the base to all paths when generating the sidebar with sidebar.getSidebar().

## Contact

If you want to contact me you can reach me at contact@nikals.se

## License

<!--- If you're not sure which open license to use see https://choosealicense.com/--->

This project uses the following license: [MIT](LICENSE).
