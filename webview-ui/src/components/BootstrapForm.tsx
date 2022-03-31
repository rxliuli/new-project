import {
  VSCodeButton,
  VSCodeCheckbox,
  VSCodeDropdown,
  VSCodeOption,
  VSCodeTextField,
} from '@vscode/webview-ui-toolkit/react'
import React, { useState } from 'react'
import { useMount } from 'react-use'
import { vscode } from '../utilities/vscode'
import css from './BootstrapForm.module.css'
export interface BaseConfig {
  name: string
  label: string
  default?: any
}

export interface SelectConfig extends BaseConfig {
  type: 'select'
  options: {
    label: string
    value: string
  }[]
}

export interface CheckboxConfig extends BaseConfig {
  type: 'checkbox'
}

export interface InputConfig extends BaseConfig {
  type: 'input'
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

function FilePathSelect(props: { value: string; onChange(value: string): void }) {
  async function onSelectPath() {
    const res = await vscode.invoke({ command: 'selectPath' })
    if (res) {
      props.onChange(res)
    }
  }
  return (
    <VSCodeTextField
      value={props.value ?? ''}
      onChange={(e) => props.onChange((e as React.ChangeEvent<HTMLInputElement>).target.value)}
    >
      <i slot="end" className={'codicon codicon-folder'} onClick={onSelectPath} />
    </VSCodeTextField>
  )
}

export function BootstrapForm(props: BootstrapConfig) {
  const [form, setForm] = useState<{ location: string; packageManager: string } & Record<string, any>>({} as any)
  useMount(async () => {
    const store = (await vscode.getState(props.id)) as { location: string }
    const currentPath = await vscode.invoke({ command: 'getCurrentPath' })
    const init = {
      ...props.configs.reduce((res, item) => {
        if (item.default !== undefined) {
          res[item.name] = item.default
        }
        return res
      }, {} as any),
      location: currentPath,
    } as any
    if (store) {
      const { location, ...other } = store
      Object.assign(init, other)
    }
    console.log('init: ', init)
    setForm(init)
  })
  async function onChange(name: string, value: any) {
    const val = { ...form, [name]: value }
    setForm(val)
    await vscode.setState(props.id, val)
  }

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const data = {
      package: props.package,
      command: props.command,
      location: form.location,
      flags: props.configs
        .filter((item) => form[item.name] !== undefined)
        .map((item) => '--' + item.name + '=' + form[item.name])
        .filter((item) => item !== undefined),
    }
    console.log('onCreate: ', form, data)
    await vscode.invoke({
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
