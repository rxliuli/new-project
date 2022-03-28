import {
  VSCodeButton,
  VSCodeCheckbox,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react'
import React, { useState } from 'react'
import { useEffectOnce, useMount } from 'react-use'
import { vscode } from '../utilities/vscode'
import css from './BootstrapForm.module.css'

export interface SelectConfig {
  type: 'select'
  name: string
  label: string
  default?: any
  options: {
    label: string
    value: string
  }[]
}

export interface CheckboxConfig {
  type: 'checkbox'
  name: string
  label: string
  default?: any
}

export interface InputConfig {
  type: 'input'
  name: string
  label: string
  default?: any
}

export type Conifg = SelectConfig | CheckboxConfig | InputConfig

export interface BootstrapConfig {
  id: string
  title: string
  package: string
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

async function invoke(options: { command: string; default?: any; args?: any[] }): Promise<any> {
  return await new Promise<string>((resolve) => {
    if (typeof acquireVsCodeApi !== 'function') {
      resolve(options.default)
      return
    }
    const id = Date.now() + '_' + Math.random()
    const listener = (message: MessageEvent) => {
      const data = message.data
      if (data.command === id) {
        resolve(data.data[0])
        window.removeEventListener('message', listener)
      }
    }
    window.addEventListener('message', listener)
    vscode.postMessage({
      command: options.command,
      data: options.args,
      callback: id,
    })
  })
}

function FilePathSelect(props: { value: string; onChange(value: string): void }) {
  async function onSelectPath() {
    const res = await invoke({ command: 'selectPath' })
    if (res) {
      props.onChange(res)
    }
  }
  return (
    <div className={css.FilePathSelect}>
      <VSCodeButton onClick={onSelectPath}>Select Path</VSCodeButton>
      <span title={props.value}>{props.value}</span>
    </div>
  )
}

export function BootstrapForm(props: BootstrapConfig) {
  const [form, setForm] = useState<{ location: string; packageManager: string } & Record<string, any>>({} as any)
  useMount(async () => {
    const store = vscode.getState() as Record<string, any>
    const currentPath = await invoke({ command: 'getCurrentPath' })
    const init = {
      ...props.configs.reduce((res, item) => {
        if (item.default) {
          res[item.name] = item.default
        }
        return res
      }, {} as any),
      location: currentPath,
    } as any
    if (store && store[props.id]) {
      Object.assign(init, store[props.id])
    }
    console.log('init: ', init)
    setForm(init)
  })
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
      package: props.package,
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
    await invoke({
      command: 'createProject',
      args: [data],
    })
  }
  return (
    <form className={css.BootstrapForm} onSubmit={onCreate}>
      <TextField label={'Location'} name={'location'}>
        <FilePathSelect value={form.location} onChange={(value) => onChange('location', value)} />
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
              checked={form[item.name]}
              onChange={(e) => onChange(item.name, (e as React.ChangeEvent<HTMLInputElement>).target.checked)}
            >
              {item.label}
            </VSCodeCheckbox>
          ) : item.type === 'input' ? (
            <VSCodeTextField
              value={form[item.name] ?? ''}
              onChange={(e) => onChange(item.name, (e as React.ChangeEvent<HTMLInputElement>).target.value)}
            />
          ) : null}
        </TextField>
      ))}
      <div>
        <VSCodeButton type={'submit'}>Create</VSCodeButton>
      </div>
    </form>
  )
}
