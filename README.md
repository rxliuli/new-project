# new-project

This is a plugin for vscode to visually create a project, trying to provide a panel similar to jetbrains ide's creation project in vscode. Currently only project creation with vite/create-react-app/angular is supported, but custom generators are supported.

![vscode](https://github.com/rxliuli/vscode-plugin-new-project/raw/master/docs/vscode-demo.gif)

## Use

Create a new project

1. `ctrl+shift+p` open command manager
2. type `New Project` to find the command and run it

To create a submodule in monorepo

1. Select the directory in the file manager
2. Select **Create Project**
3. Select the type of project to create

![create-module](https://github.com/rxliuli/vscode-plugin-new-project/raw/master/docs/create-module.png)

## Configure

### Select package manager

Currently supports `npm/pnpm`, the configuration item is `newProject.packageManager`, the default is `npm`

### Custom generator

You can add other generators in the settings by yourself, for example, the following is the generator configuration of [@liuli-util/cli](https://www.npmjs.com/package/@liuli-util/cli)

> [More generator configuration examples](https://github.com/rxliuli/vscode-plugin-new-project/blob/master/webview-ui/src/assets/generators.json)

```json
{
  "newProject.generators": [
    {
      "id": "create-liuli",
      "title": "liuli",
      "package": "create-liuli",
      "command": "create-liuli",
      "configs": [
        {
          "type": "select",
          "name": "template",
          "label": "Template",
          "default": "lib",
          "options": [
            { "label": "lib", "value": "lib" },
            { "label": "cli", "value": "cli" }
          ]
        },
        {
          "type": "checkbox",
          "name": "overwrite",
          "label": "Overwrite",
          "default": true
        }
      ]
    }
  ]
}
```

complete schemas

```json
{
  "type": "array",
  "description": "List of generators to use",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "The id of the generator"
      },
      "title": {
        "type": "string",
        "description": "The title of the generator"
      },
      "package": {
        "type": "string",
        "description": "npm package"
      },
      "command": {
        "type": "string",
        "description": "command to run"
      },
      "configs": {
        "type": "array",
        "description": "configs to pass to the command",
        "items": {
          "type": "object",
          "properties": {
            "type": {
              "type": "string",
              "enum": ["select", "checkbox", "input"],
              "description": ""
            },
            "name": {
              "type": "string",
              "description": ""
            },
            "label": {
              "type": "string",
              "description": ""
            },
            "default": {},
            "options": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "label": {
                    "type": "string",
                    "description": "option label"
                  },
                  "value": {
                    "type": "string",
                    "description": "option value"
                  }
                },
                "required": ["label", "value"]
              }
            }
          },
          "required": ["type", "name", "label"]
        }
      }
    },
    "required": ["id", "title", "package", "command", "configs"]
  }
}
```

