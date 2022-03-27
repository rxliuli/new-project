export function shellArgs(commands: (string | Record<string, boolean>)[]): string[] {
  return commands.reduce((res, item) => {
    if (typeof item === 'string') {
      res.push(item)
    } else {
      Object.entries(item).forEach(([key, value]) => {
        if (value) {
          res.push(key)
        }
      })
    }
    return res
  }, [] as string[])
}
