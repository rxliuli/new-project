# new-project

这是一个 vscode 可视化创建项目的插件，尝试在 vscode 中提供类似于 jetbrains ide 的创建项目的面板。目前仅支持使用 vite/create-react-app 创建项目，但预期将会支持更多，同时支持自定义创建项目的类型。

下面是 webstorm 与 vscode 插件的对比

![webstorm](./docs/webstorm-cover.png)
![vscode](./docs/vscode-cover.png)

## 使用

创建一个新项目

1. `ctrl+shift+p` 打开命令管理器
2. 输入 `New Project` 找到命令并运行

在 monorepo 中创建一个子模块

1. 在文件管理器选中目录
2. 选择 **Create Project**
3. 选择创建的项目类型

![create-module](./docs/create-module.png)
