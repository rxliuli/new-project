import * as vscode from 'vscode'
import { CreateProjectPanel } from './panels/CreateProjectPanel'

export function activate(context: vscode.ExtensionContext) {
  // Create the show hello world command
  const showHelloWorldCommand = vscode.commands.registerCommand('new-project.newProject', () => {
    CreateProjectPanel.render(context.extensionUri)
  })

  // Add command to the extension context
  context.subscriptions.push(showHelloWorldCommand)
}
