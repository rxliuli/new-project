import { VSCodePanels, VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { BootstrapForm, Conifg } from './components/BootstrapForm'

interface BootstrapConfig {
  id: string
  title: string
  package: string
  command: string
  configs: Conifg[]
}

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
        label: '模板',
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
        type: 'checkbox',
        name: 'template',
        label: 'TypeScript',
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
            <BootstrapForm configs={item.configs} />
          </VSCodePanelView>
        ))}
      </VSCodePanels>
    </>
  )
}

export default App
