import { pathExists, readJson, writeJson } from 'fs-extra'
import { findParent } from './utilities/findParent'
import * as path from 'path'

async function main() {
  const rootPath = (await findParent(__dirname, (dir) => pathExists(path.resolve(dir, 'pnpm-workspace.yaml'))))!
  const json = await readJson(path.resolve(rootPath, 'package.json'))
  const schema = json.contributes.configuration.properties['newProject.generators']
  const schemaPath = path.resolve(rootPath, 'webview-ui/src/assets/generators-schema.json')
  await writeJson(
    schemaPath,
    {
      $schema: 'https://json-schema.org/draft/2020-12/schema',
      $id: 'https://raw.githubusercontent.com/rxliuli/vscode-plugin-new-project/master/webview-ui/src/assets/generators-schema.json',
      ...schema,
    },
    {
      spaces: 2,
    },
  )
}

main()
