import { VSCodeButton, VSCodeCheckbox, VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react'
import { useEffect, useState } from 'react'
import { vscode } from '../utilities/vscode'
import css from './BootstrapForm.module.css'

export interface SelectConfig {
  type: 'select'
  name: string
  label: string
  options: {
    label: string
    value: string
  }[]
}

export interface CheckboxConfig {
  type: 'checkbox'
  name: string
  label: string
}

export type Conifg = SelectConfig | CheckboxConfig

export interface BootstrapFormProps {
  configs: Conifg[]
}

function TextField(props: { label: string; name: string; children: React.ReactNode }) {
  return (
    <div key={props.name} className={css.TextField}>
      <label htmlFor={props.name}>{props.label}：</label>
      {props.children}
    </div>
  )
}

function FilePathSelect() {
  const [path, setPath] = useState<string>()
  async function onSelectPath() {
    const res = await new Promise<string>((resolve) => {
      const id = Date.now() + '_' + Math.random()
      vscode.postMessage({
        command: 'selectPath',
        callback: id,
      })
      const listener = (message: MessageEvent) => {
        const data = message.data
        if (data.command === id) {
          resolve(data.data[0])
        }
        window.removeEventListener('message', listener)
      }
      window.addEventListener('message', listener)
    })
    setPath(res)
  }
  return (
    <div className={css.FilePathSelect}>
      <VSCodeButton onClick={onSelectPath}>选择路径</VSCodeButton>
      <span title={path}>{path}</span>
    </div>
  )
}

export function BootstrapForm(props: BootstrapFormProps) {
  useEffect(() => {
    window.addEventListener('message', (message) => {
      console.log('message: ', message)
    })
  }, [])
  return (
    <div className={css.BootstrapForm}>
      <TextField label={'选择目录'} name={'dest'}>
        <FilePathSelect />
      </TextField>
      <TextField label={'选择包管理器'} name={'packageManager'}>
        <VSCodeDropdown>
          {['npm', 'yarn', 'pnpm'].map((item) => (
            <VSCodeOption key={item}>{item}</VSCodeOption>
          ))}
        </VSCodeDropdown>
      </TextField>
      {props.configs.map((item) => (
        <TextField key={item.name} label={item.label} name={item.name}>
          {item.type === 'select' ? (
            <VSCodeDropdown key={item.name}>
              {item.options.map((item) => (
                <VSCodeOption key={item.value}>{item.label}</VSCodeOption>
              ))}
            </VSCodeDropdown>
          ) : item.type === 'checkbox' ? (
            <VSCodeCheckbox id={item.name}>{item.label}</VSCodeCheckbox>
          ) : null}
        </TextField>
      ))}
      <div>
        <VSCodeButton>创建</VSCodeButton>
      </div>
    </div>
  )
}
