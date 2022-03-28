import * as vscode from 'vscode'
import { CreateProjectPanel } from './panels/CreateProjectPanel'

export function activate(context: vscode.ExtensionContext) {
  // Create the show hello world command
  const showHelloWorldCommand = vscode.commands.registerCommand('new-project.newProject', (url?: vscode.Uri) => {
    CreateProjectPanel.render(context.extensionUri, url?.fsPath ?? vscode.workspace.workspaceFolders?.[0].uri.fsPath)
  })

  // Add command to the extension context
  context.subscriptions.push(showHelloWorldCommand)
}
