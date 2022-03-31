import * as vscode from 'vscode'
import { CreateProjectPanel } from './panels/CreateProjectPanel'

export function activate(context: vscode.ExtensionContext) {
  context.globalState.setKeysForSync(['active', 'vite', 'create-react-app', 'angular'])
  // Create the show hello world command
  context.subscriptions.push(
    vscode.commands.registerCommand('new-project.newProject', async (url?: vscode.Uri) => {
      // console.log('config: ', vscode.workspace.getConfiguration('newProject').get('generators'))
      // console.log('state: ', context.globalState.get('init'))
      // console.log('before: ', context.globalState.get('test'))
      // await context.globalState.update('test', { name: 'test' })
      // console.log('after: ', context.globalState.get('test'))
      CreateProjectPanel.render(
        context.extensionUri,
        context.globalState,
        url?.fsPath ?? vscode.workspace.workspaceFolders?.[0].uri.fsPath,
      )
    }),
  )
}
