import { VSCodePanels, VSCodePanelTab, VSCodePanelView } from '@vscode/webview-ui-toolkit/react'
import { useState } from 'react'
import { useMount } from 'react-use'
import { BootstrapConfig as GeneratorConfig, BootstrapForm } from './components/BootstrapForm'
import { vscode } from './utilities/vscode'
import generators from './assets/generators.json'

function App() {
  const [list, setList] = useState<GeneratorConfig[]>(generators as GeneratorConfig[])
  const [active, setActive] = useState<string>(list[0].id)
  useMount(async () => {
    const [active, generators] = (await Promise.all([
      vscode.getState('active'),
      vscode.invoke({ command: 'getGenerators' }),
    ])) as [string, GeneratorConfig[]]
    // console.log('generators', generators)
    const initIdSet = new Set(list.map((item) => item.id))
    setList([...list, ...generators.filter((item) => !initIdSet.has(item.id))])
    if (active) {
      setActive(active ?? list[0].id)
    }
    // console.log('active: ', active)
  })
  async function changeActive(newActive: string) {
    setActive(newActive)
    await vscode.setState('active', newActive)
  }

  return (
    <VSCodePanels activeid={active}>
      {list.map((item) => (
        <VSCodePanelTab key={item.id} id={item.id} title={item.title} onClick={() => changeActive(item.id)}>
          {item.title}
        </VSCodePanelTab>
      ))}
      {list.map((item) => (
        <VSCodePanelView key={item.id} id={item.id} title={item.title}>
          <BootstrapForm {...item} />
        </VSCodePanelView>
      ))}
    </VSCodePanels>
  )
}

export default App
