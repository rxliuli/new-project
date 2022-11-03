import * as which from 'which'
import * as path from 'path'
import { describe, it, expect } from 'vitest'

describe('测试 which', () => {
  it('基本示例', async () => {
    async function f(cmd: string) {
      const res = await which(cmd)
      expect(path.basename(res).split('.')[0]).toBe(cmd)
    }

    await Promise.all(['node', 'pnpm', 'npm', 'yarn'].map(f))
  })
})
