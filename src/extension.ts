import { commands, ExtensionContext } from 'vscode'
import { CreateProjectPanel } from './panels/CreateProjectPanel'

export function activate(context: ExtensionContext) {
  // Create the show hello world command
  const showHelloWorldCommand = commands.registerCommand('new-project.newProject', () => {
    CreateProjectPanel.render(context.extensionUri)
  })

  // Add command to the extension context
  context.subscriptions.push(showHelloWorldCommand)
}
