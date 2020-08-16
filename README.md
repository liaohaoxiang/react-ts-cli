# react-ts-cli

快速生成一个 React + Typescript 项目，并配置好代码规范

## .gitignore

使用 vs code 中 gitigonre 插件生成，默认配置 macos，个人增加 node_modules

## .editorconfig

[*] 所有文件

- indent_style ：缩进风格 = `space`

- indent_size ：缩进大小 = `2`

- charset ：编码格式 = `utf-8`

- trim_trailing_whitespace ：去除多余的空格 = `true`

- insert_final_newline ： 在尾部插入一行 = `true`

- end_of_line ：换行符 = `lf`

[*.md] md 文件

- trim_trailing_whitespace ：换行需要打两个空格，这里关掉去除多余空格 = false

## Prettier

统一代码风格

> npm install prettier -D

> 新建文件 .prettierrc

- trailingComma ：对象的最后一个属性末尾也会添加 `,` = all

- tabWidth ：缩进大小 = `2`

- semi ：分号是否添加 = `false`

- singleQuote ：是否单引号 = `true`

- jsxSingleQuote ：jsx 语法下是否单引号 = `true`

- endOfLine ：与 .editorconfig 保持一致设置 = `lf`

- printWidth ：单行代码最长字符长度，超过之后会自动格式化换行 = `true`

- bracketSpacing ：在对象中的括号之间打印空格， `{a: 5}` 格式化为 `{ a: 5 }` = `true`

- arrowParens ：箭头函数的参数无论有几个，都要括号包裹。比如 (a) => {} ，如果设为 avoid ，会自动格式化为 a => {} = `always`

> 增加一个文件夹 `.vscode`。然后配置`settings.json`

- "editor.formatOnSave" 的作用是在我们保存时，会自动执行一次代码格式化 = `true`

这样我们代码每次保存时都会用到`.prettierrc`的配置，因为`.vscode`里的`setting.json`会优先与 vs 本地的配置

## ESLint

`ESLint` 是主要为了解决代码质量问题，它能在我们编写代码时就检测出程序可能出现的隐性 BUG，通过 `eslint --fix` 还能自动修复一些代码写法问题

安装 eslint

> npm install eslint -D

初始化配置文件

> npx eslint --init

选择配置：

Q: How would you like to use ESLint?

- A: To check syntax, find problems, and enforce code style

Q: What type of modules does your project use?

- A: JavaScript modules (import/export)

Q: Which framework does your project use?

- A: React

Q: Does your project use TypeScript?

- A: Yes

Q: Where does your code run?

- A: Browser & Node

Q: How would you like to define a style for your project?

- A: Use a popular style guide

Q: Which style guide do you want to follow?

- A: airbnb

Q: What format do you want your config file to be in

- A: JavaScript

Q: Would you like to install them now with npm?

- A: Yes

Done !

然后我们就会发现生成一个`.eslintrc.js`文件

```js
module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  rules: {},
}
```

修改该文件：

- 开启 React Hooks 检查，在`extends`中增加`'airbnb/hooks'`

- 在 `extends` 中添加 `'plugin:@typescript-eslint/recommended'` 可开启针对 ts 语法推荐的规则定义

- 为了兼容`.ts`和`.tsx`文件中引入另一个文件模块报错的问题，需要加入以下规则到`rules` ：

```js
rules: {
  'import/extensions': [
    ERROR,
    'ignorePackages',
    {
      ts: 'never',
      tsx: 'never',
      json: 'never',
      js: 'never',
    },
  ],
}
```

安装`exlint`插件

- `eslint-plugin-promise` ：Promise 语法最佳实践

- `eslint-plugin-unicorn` : 提供了更多有用的配置项

> npm install eslint-plugin-promise eslint-plugin-unicorn -D

配置文件修改可以在`.eslintrc.js`查看

## 解决 ESLint 和 Prettier 冲突

安装这个插件 `eslint-config-prettier`

> npm install eslint-config-prettier -D

添加以下配置到 `.eslintrc.js` 的 `extends` 中

```js
{
  extends: [
    // other configs ...
    'prettier',
    'prettier/@typescript-eslint',
    'prettier/react',
    'prettier/unicorn',
  ]
}
```

`'prettier'` 及之后的配置要放到原来添加的配置的后面，这样才能让 `prettier` 禁用之后与其冲突的规则。

## Webpack

首先当然要安装

> npm install webpack webpack-cli -D

然后在根目录新建文件夹`scripts`，然后再新建一个文件夹`config`，然后在里面建一个`公用`的`webpack.common.js`

### entry & output

入口文件路径 和 出口文件及路径

在`webpack.common.js`中

```js
const path = require('path')
const { isDev, PATH } = require('../constant')

module.exports = {
  entry: {
    app: path.resolve(PATH, './src/app.js'),
  },
  output: {
    filename: `js/[name]${isDev ? '' : '[hash:8]'}.js`,
    path: path.resolve(PATH, './dist'),
  },
}
```

这段代码中有一些`未建立`的变量，我们先不管。
主要看`filename`中的变量设置：

```js
;`js/[name]${isDev ? '' : '.[hash:8]'}.js`
```

这里需要用到`isDev`去判断是否生产环境来决定：是否有 8 位 hash 注入到文件名中，因为浏览器的缓存策略，在第一次访问这个页面时候，浏览器会缓存文件。我们每次开发完后打包都会把文件改变，如果用户再次访问时，会出现拿到以前的缓存文件问题，因此，在生产环境中，我们需要使用 hash 来确保用户获取的文件是最新的

接来下就是新的``constant.js`文件

```js
const path = require('path')

const PATH = path.resolve(__dirname, '../')
const PROJECT_NAME = path.parse(PATH).name

const isDev = process.env.NODE_ENV !== 'production'
module.exports = {
  isDev,
  PATH,
  PROJECT_NAME,
}
```

里面定义了项目根目录`PATH`，项目名称`PROJECT_NAME` 和判读是否生成环境的变量`isDev`

### 如何区分开发和生产环境

需要用到一个库配置

> npm install webpack-merge -D

在`scripts/config`下新建`webpack.dev.js`作为`开发环境配置`

```js
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
})
```

同理，`webpack.prod.js`

```js
const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
})
```

分开配置有个好处，就是可以针对环境关键配置，这时候我们可以设置一个环境变量，根据变量来判断环境不同而做出不同的配置选择。

安装

> npm install cross-env -D

然后在`package.json`添加命令

```json
"scripts": {
    "build": "webpack --config ./scripts/config/webpack.common.js",
    "dev": "cross-env NODE_ENV=development webpack --config ./scripts/config/webpack.dev.js",
    "prod": "cross-env NODE_ENV=production webpack --config ./scripts/config/webpack.prod.js"
  },
```

之前在`contant.js`中设置的变量`isDev`,可以通过命令中的`NODE_ENV`去判断哪个环境

```js
const isDev = process.env.NODE_ENV !== 'production'
//true === dev开发环境 false === production生成环境
```

## 本地服务查看页面

借助`webpack-dev-server`和 `html-webpack-plugin`
我们可以启动一个本地的 server 来部署页面

> npm install webpack-dev-server html-webpack-plugin -D

- `html-webpack-plugin` ：需要一个`html`文件，这个插件会帮我们将打包好的 js 文件引入到`html`文件

- `webpack-dev-server` ：可以在本地启动一个`http`服务，配置指定端口和热更新的开启
