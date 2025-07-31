import { Plugin } from 'rollup'

interface AliasOptions {
  entries:
    | {
        [key: string]: string
      }
    | { find: string; replacement: string }[]
}
export function alias(options: AliasOptions): Plugin {
  const entries = normalizeEntries(options.entries)
  return {
    name: 'alias',
    resolveId(source: string) {
      // 看看是不是有对应的 alias match
      const entry = entries.find(e => {
        return e.match(source)
      })
      if (!entry) return source
      return entry.replace(source)
    }
  }
}

function normalizeEntries(entries: AliasOptions['entries']) {
  if (Array.isArray(entries)) {
    return entries.map(({ find, replacement }) => {
      return new Entry(find, replacement)
    })
  } else {
    return Object.keys(entries).map(key => {
      return new Entry(key, entries[key])
    })
  }
}
class Entry {
  constructor(private find: string, private replacement: string) {}
  match(filePath: string) {
    return filePath.startsWith(this.find)
  }
  replace(filePath: string) {
    return filePath.replace(this.find, this.replacement) + '.js'
  }
}
