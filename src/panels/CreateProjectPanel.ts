import * as vscode from 'vscode'
import { getUri } from '../utilities/getUri'
import * as path from 'path'
import { shellArgs } from '../utilities/shellArgs'
import { emptyDir, pathExists, readdir, remove } from 'fs-extra'
import which = require('which')

/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class CreateProjectPanel {
  public static currentPanel: CreateProjectPanel | undefined
  private readonly _panel: vscode.WebviewPanel
  private _disposables: vscode.Disposable[] = []
  private cwd?: string
  private globalState!: vscode.Memento

  /**
   * The HelloWorldPanel class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   */
  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(this.dispose, null, this._disposables)

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri)

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview)
  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   */
  public static render(extensionUri: vscode.Uri, globalState: vscode.Memento, cwd?: string) {
    if (CreateProjectPanel.currentPanel) {
      // If the webview panel already exists reveal it
      CreateProjectPanel.currentPanel._panel.reveal(vscode.ViewColumn.One)
      CreateProjectPanel.currentPanel.cwd = cwd
      CreateProjectPanel.currentPanel.globalState = globalState
    } else {
      // If a webview panel does not already exist create and show a new one
      const panel = vscode.window.createWebviewPanel(
        // Panel view type
        'newProject',
        // Panel title
        'New Project',
        // The editor column the panel should be displayed in
        vscode.ViewColumn.One,
        // Extra panel configurations
        {
          // Enable JavaScript in the webview
          enableScripts: true,
        },
      )

      CreateProjectPanel.currentPanel = new CreateProjectPanel(panel, extensionUri)
      CreateProjectPanel.currentPanel.cwd = cwd
      CreateProjectPanel.currentPanel.globalState = globalState
    }
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    CreateProjectPanel.currentPanel = undefined

    // Dispose of the current webview panel
    this._panel.dispose()

    // Dispose of all disposables (i.e. commands) for the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop()
      if (disposable) {
        disposable.dispose()
      }
    }
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the React webview build files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(webview: vscode.Webview, extensionUri: vscode.Uri) {
    // The CSS file from the React build output
    const stylesUri = getUri(webview, extensionUri, ['webview-ui', 'build', 'assets', 'index.css'])
    // The JS file from the React build output
    const scriptUri = getUri(webview, extensionUri, ['webview-ui', 'build', 'assets', 'index.js'])

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Hello World</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="${scriptUri}"></script>
        </body>
      </html>
    `
  }

  /**
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   * @param context A reference to the extension context
   */
  private _setWebviewMessageListener(webview: vscode.Webview) {
    const map = new Map<string, (...args: any[]) => any>()
    map.set('hello', (text: string) => {
      vscode.window.showInformationMessage(text)
    })
    map.set('selectPath', async () => {
      const res = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        title: 'Location',
        defaultUri: this.cwd ? vscode.Uri.file(this.cwd) : undefined,
      })
      if (!res) {
        return null
      }
      return vscode.Uri.parse(res[0].path).fsPath
    })
    interface CreateProjectData {
      package: string
      command: string
      location: string
      flags: string[]
    }
    map.set('createProject', async (data: CreateProjectData) => {
      const location = path.resolve(data.location)
      if ((await pathExists(location)) && (await readdir(location)).length > 0) {
        const answer = await vscode.window.showInformationMessage('Project already exists', 'Yes', 'No')
        if (!answer) {
          return
        }
        await emptyDir(location)
      }
      const shellPath = await which('npx')
      const terminal = vscode.window.createTerminal({
        name: 'Create Project',
        cwd: path.dirname(location),
        shellPath,
        shellArgs: shellArgs([
          '--yes',
          '--package',
          data.package,
          data.command,
          path.basename(location),
          ...data.flags,
        ]),
      })
      terminal.show()
      await new Promise<void>((resolve) => {
        vscode.window.onDidCloseTerminal((e) => {
          if (e.name === 'Create Project') {
            resolve()
          }
        })
      })
      // console.log('执行完了')
      const workspaceCwd = vscode.workspace.workspaceFolders?.[0].uri.fsPath
      if (workspaceCwd && location.startsWith(path.resolve(workspaceCwd))) {
        // console.log('不单独打开项目')
        const packageJsonPath = path.resolve(location, 'package.json')
        if (await pathExists(packageJsonPath)) {
          await vscode.commands.executeCommand('vscode.open', vscode.Uri.file(packageJsonPath))
        }
      } else {
        await vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(location), true)
      }
      this._panel.dispose()
    })
    map.set('getCurrentPath', () => this.cwd)
    map.set('getState', (key: string) => this.globalState.get(key))
    map.set('setState', (key: string, value: any) => this.globalState.update(key, value))

    webview.onDidReceiveMessage(
      async (message: any) => {
        const { command, data = [], callback } = message
        if (!map.has(command)) {
          throw new Error(`找不到命令 ${command}`)
        }
        const res = await map.get(command)!(...data)
        if (callback) {
          console.log('callback: ', callback)
          this._panel.webview.postMessage({
            command: callback,
            data: [res],
          })
        }
      },
      undefined,
      this._disposables,
    )
  }
}
