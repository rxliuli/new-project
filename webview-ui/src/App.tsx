import { VSCodePanels, VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { useState } from 'react'
import { BootstrapConfig, BootstrapForm } from './components/BootstrapForm'

const list: BootstrapConfig[] = [
  {
    id: 'vite',
    title: 'Vite',
    command: 'vite',
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
    command: 'react-app',
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
