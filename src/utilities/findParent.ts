import * as path from 'path'

/**
 * 递归向上查找父目录
 * @param cwd
 * @param predicate
 */
export async function findParent(cwd: string, predicate: (dir: string) => Promise<boolean>): Promise<string | null> {
  if (await predicate(cwd)) {
    return cwd
  }
  const parent = path.dirname(cwd)
  if (parent === cwd) {
    return null
  }
  return findParent(parent, predicate)
}
