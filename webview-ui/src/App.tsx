import { VSCodePanels, VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { BootstrapConfig, BootstrapForm } from './components/BootstrapForm'

const list: BootstrapConfig[] = [
  {
    id: 'vite',
    title: 'Vite',
    package: 'create-vite',
    command: 'create-vite',
    configs: [
      {
        type: 'select',
        name: 'template',
        label: 'Template',
        options: [
          { label: 'vanilla', value: 'vanilla' },
          { label: 'vanilla-ts', value: 'vanilla-ts' },
          { label: 'vue', value: 'vue' },
          { label: 'vue-ts', value: 'vue-ts' },
          { label: 'react', value: 'react' },
          { label: 'react-ts', value: 'react-ts' },
          { label: 'preact', value: 'preact' },
          { label: 'preact-ts', value: 'preact-ts' },
          { label: 'lit', value: 'lit' },
          { label: 'lit-ts', value: 'lit-ts' },
          { label: 'svelte', value: 'svelte' },
          { label: 'svelte-ts', value: 'svelte-ts' },
        ],
      },
    ],
  },
  {
    id: 'create-react-app',
    title: 'React',
    package: 'create-react-app',
    command: 'create-react-app',
    configs: [
      {
        type: 'select',
        name: 'template',
        label: 'Template',
        options: [
          { label: 'javascript', value: '' },
          { label: 'typescript', value: 'typescript' },
        ],
      },
    ],
  },
  {
    id: 'angular',
    title: 'Angular',
    package: '@angular/cli',
    command: 'ng new',
    configs: [
      {
        type: 'input',
        name: 'collection',
        label: 'collection',
      },
      {
        type: 'checkbox',
        name: 'commit',
        label: 'commit',
        default: true,
      },
      {
        type: 'checkbox',
        name: 'create-application',
        label: 'create-application',
        default: true,
      },
      {
        type: 'checkbox',
        name: 'defaults',
        label: 'defaults',
        default: true,
      },
      {
        type: 'input',
        name: 'directory',
        label: 'directory',
      },
      {
        type: 'checkbox',
        name: 'dry-run',
        label: 'dry-run',
        default: false,
      },
      {
        type: 'checkbox',
        name: 'force',
        label: 'force',
        default: false,
      },
      {
        type: 'checkbox',
        name: 'help',
        label: 'help',
        default: false,
      },
      {
        type: 'checkbox',
        name: 'inline-style',
        label: 'inline-style',
      },
      {
        type: 'checkbox',
        name: 'inline-template',
        label: 'inline-template',
      },
      {
        type: 'checkbox',
        name: 'interactive',
        label: 'interactive',
      },
      {
        type: 'checkbox',
        name: 'minimal',
        label: 'minimal',
        default: false,
      },
      {
        type: 'input',
        name: 'new-project-root',
        label: 'new-project-root',
        default: 'projects',
      },
      {
        type: 'input',
        name: 'prefix',
        label: 'prefix',
        default: 'app',
      },
      {
        type: 'select',
        name: 'package-manager',
        label: 'package-manager',
        options: [
          { label: 'npm', value: 'npm' },
          { label: 'yarn', value: 'yarn' },
          { label: 'pnpm', value: 'pnpm' },
          { label: 'cnpm', value: 'cnpm' },
        ],
      },
      {
        type: 'checkbox',
        name: 'routing',
        label: 'routing',
      },
      {
        type: 'checkbox',
        name: 'skip-git',
        label: 'skip-git',
        default: false,
      },
      {
        type: 'checkbox',
        name: 'skip-install',
        label: 'skip-install',
        default: true,
      },
      {
        type: 'checkbox',
        name: 'skip-tests',
        label: 'skip-tests',
        default: false,
      },
      {
        type: 'checkbox',
        name: 'strict',
        label: 'strict',
        default: true,
      },
      {
        type: 'select',
        name: 'style',
        label: 'style',
        options: [
          { label: 'css', value: 'css' },
          { label: 'scss', value: 'scss' },
          { label: 'sass', value: 'sass' },
          { label: 'less', value: 'less' },
        ],
      },
      {
        type: 'checkbox',
        name: 'verbose',
        label: 'verbose',
        default: false,
      },
      {
        type: 'select',
        name: 'view-encapsulation',
        label: 'view-encapsulation',
        options: [
          { label: 'Emulated', value: 'Emulated' },
          { label: 'None', value: 'None' },
          { label: 'ShadowDom', value: 'ShadowDom' },
        ],
      },
    ],
  },
]

function App() {
  return (
    <>
      <VSCodePanels>
        {list.map((item) => (
          <VSCodePanelTab key={item.id} title={item.title}>
            {item.title}
          </VSCodePanelTab>
        ))}
        {list.map((item) => (
          <VSCodePanelView key={item.id} title={item.title}>
            <BootstrapForm {...item} />
          </VSCodePanelView>
        ))}
      </VSCodePanels>
    </>
  )
}

export default App
