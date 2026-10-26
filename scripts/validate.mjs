#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const catalog = JSON.parse(readFileSync(resolve(root, 'catalog.json'), 'utf8'))
const fail = message => { console.error(`ERROR: ${message}`); process.exitCode = 1 }
const ids = new Set()
const color = /^(#[0-9a-fA-F]{3,8}|rgba?\([0-9.,\s%]+\)|hsla?\([0-9.,\s%deg]+\))$/

if (catalog.format !== 1 || !Array.isArray(catalog.themes)) fail('catalog.json 必须是 format=1 且包含 themes 数组')
for (const theme of catalog.themes ?? []) {
  if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(theme.id ?? '')) fail(`无效主题 id: ${theme.id}`)
  if (ids.has(theme.id)) fail(`重复主题 id: ${theme.id}`)
  ids.add(theme.id)
  if (typeof theme.name?.zh !== 'string' || typeof theme.name?.en !== 'string') fail(`${theme.id}: name 必须包含 zh/en`)
  if (!Array.isArray(theme.preview) || theme.preview.length < 2 || theme.preview.some(value => !color.test(value))) fail(`${theme.id}: preview 至少包含两个合法颜色`)
  for (const scheme of ['light', 'dark']) {
    if (theme.tokens?.[scheme] === undefined) fail(`${theme.id}: 缺少 ${scheme} tokens`)
    for (const [key, value] of Object.entries(theme.tokens?.[scheme] ?? {})) {
      if (!/^--dsw-alias-[a-z0-9-]{1,64}$/.test(key)) fail(`${theme.id}: 不允许的 token ${key}`)
      if (typeof value !== 'string' || !color.test(value.trim())) fail(`${theme.id}: ${key} 不是安全颜色值`)
    }
  }
}
if (!ids.has('default')) fail('必须保留 default 主题')
if (process.exitCode === undefined) console.log(`OK: ${catalog.themes.length} 个主题`)
