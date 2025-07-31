import { describe, it, expect } from 'vitest'
import { alias } from '.'

describe('alias', () => {
  describe('entries is object', () => {
    it('should replace when match successful', () => {
      const aliasObj: any = alias({
        entries: {
          '@utils': './utils'
        }
      })
      expect(aliasObj.resolveId('@utils/add')).toBe('./utils/add.js')
    })
    it('should replace when match fail', () => {
      const aliasObj: any = alias({
        entries: {
          '@utils': './utils'
        }
      })
      expect(aliasObj.resolveId('!/add')).toBe('!/add')
    })
  })
  describe('entries is array', () => {
    it('should replace when match successful', () => {
      const aliasObj: any = alias({
        entries: [
          {
            find: '@utils',
            replacement: './utils'
          }
        ]
      })
      expect(aliasObj.resolveId('@utils/add')).toBe('./utils/add.js')
    })
    it('should replace when find is regular', () => {
      const aliasObj: any = alias({
        entries: [
          {
            find: '@utils',
            replacement: './utils'
          }
        ]
      })
      expect(aliasObj.resolveId('@utils/add')).toBe('./utils/add.js')
    })
    it('should replace when match fail', () => {
      const aliasObj: any = alias({
        entries: [
          {
            find: '@utils',
            replacement: './utils'
          }
        ]
      })
      expect(aliasObj.resolveId('!/add')).toBe('!/add')
    })
  })
})
