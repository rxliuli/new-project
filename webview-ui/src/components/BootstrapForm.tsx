import { VSCodeButton, VSCodeCheckbox, VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react'
import React, { useEffect, useState } from 'react'
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

export interface BootstrapConfig {
  id: string
  title: string
  command: string
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

async function invoke(command: string, ...args: any[]): Promise<any> {
  return await new Promise<string>((resolve) => {
    const id = Date.now() + '_' + Math.random()
    vscode.postMessage({
      command: command,
      data: args,
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
}

function FilePathSelect(props: { value: string; onChange(value: string): void }) {
  async function onSelectPath() {
    const res = await invoke('selectPath')
    props.onChange(res)
  }
  return (
    <div className={css.FilePathSelect}>
      <VSCodeButton onClick={onSelectPath}>选择路径</VSCodeButton>
      <span title={props.value}>{props.value}</span>
    </div>
  )
}

export function BootstrapForm(props: BootstrapConfig) {
  const [form, setForm] = useState<{ location: string; packageManager: string } & Record<string, any>>({} as any)
  useEffect(() => {
    const store = vscode.getState() as Record<string, any>
    if (store && store[props.id]) {
      const init = store[props.id]
      console.log('init: ', init)
      setForm(init)
    }
  }, [])
  function onChange(name: string, value: any) {
    const val = { ...form, [name]: value }
    setForm(val)
    vscode.setState({
      ...(vscode.getState() as any),
      [props.id]: val,
    })
  }

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const data = {
      packageManager: form.packageManager,
      command: props.command,
      location: form.location,
      flags: props.configs
        .filter((item) => form[item.name])
        .map((item) => {
          let res: string
          if (item.type === 'checkbox') {
            res = item.name
          } else {
            res = item.name + '=' + form[item.name]
          }
          return `--${res}`
        }),
    }
    console.log('onCreate: ', form, data)
    await invoke('createProject', data)
  }
  return (
    <form className={css.BootstrapForm} onSubmit={onCreate}>
      <TextField label={'选择目录'} name={'location'}>
        <FilePathSelect value={form.location} onChange={(value) => onChange('location', value)} />
      </TextField>
      <TextField label={'选择包管理器'} name={'packageManager'}>
        <VSCodeDropdown
          value={form.packageManager}
          onChange={(e) => onChange('packageManager', (e as React.ChangeEvent<HTMLSelectElement>).target.value)}
        >
          {['npm', 'yarn', 'pnpm'].map((item) => (
            <VSCodeOption key={item}>{item}</VSCodeOption>
          ))}
        </VSCodeDropdown>
      </TextField>
      {props.configs.map((item) => (
        <TextField key={item.name} label={item.label} name={item.name}>
          {item.type === 'select' ? (
            <VSCodeDropdown
              key={item.name}
              value={form[item.name]}
              onChange={(e) => onChange(item.name, (e as React.ChangeEvent<HTMLSelectElement>).target.value)}
            >
              {item.options.map((item) => (
                <VSCodeOption key={item.value}>{item.label}</VSCodeOption>
              ))}
            </VSCodeDropdown>
          ) : item.type === 'checkbox' ? (
            <VSCodeCheckbox
              id={item.name}
              value={form[item.name]}
              onChange={(e) => onChange(item.name, (e as React.ChangeEvent<HTMLInputElement>).target.checked)}
            >
              {item.label}
            </VSCodeCheckbox>
          ) : null}
        </TextField>
      ))}
      <div>
        <VSCodeButton type={'submit'}>创建</VSCodeButton>
      </div>
    </form>
  )
}
