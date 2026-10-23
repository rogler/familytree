// Converts a GEDCOM file into public/tree.json, REDACTING living people.
// Source: data/family.ged (private, gitignored). Falls back to scripts/sample.ged.
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { parse } from 'parse-gedcom'

const src = existsSync('data/family.ged') ? 'data/family.ged' : 'scripts/sample.ged'
console.log(`Reading ${src}`)

// Normalize across parse-gedcom versions (array vs root node, tree vs children)
const norm = n => ({
  tag: n.tag ?? n.type,
  data: typeof n.data === 'string' ? n.data : (n.value ?? ''),
  pointer: n.pointer ?? n.data?.xref_id,
  children: (n.children ?? n.tree ?? []).map(norm)
})
const parsed = parse(readFileSync(src, 'utf8'))
const top = Array.isArray(parsed) ? parsed : (parsed.children ?? parsed.tree ?? [])
const nodes = top.map(norm)

const thisYear = new Date().getFullYear()
const MAX_AGE = 110 // no death record but born longer ago than this => assume deceased

const find = (n, tag) => n.children.find(c => c.tag === tag)
const val = (n, tag) => find(n, tag)?.data ?? ''
const sub = (n, a, b) => { const x = find(n, a); return x ? val(x, b) : '' }
const yearOf = s => (s.match(/\d{4}/) || [])[0]
const cleanId = s => (s || '').replace(/@/g, '') // "@I1@" -> "I1"

const people = {}
const indis = nodes.filter(n => n.tag === 'INDI')
if (!indis.length) {
  console.error('No INDI records found. Parsed top-level tags:', nodes.slice(0, 5).map(n => n.tag))
  process.exit(1)
}

for (const n of indis) {
  const id = cleanId(n.pointer)
  const [first = '', last = ''] = val(n, 'NAME').replace(/\//g, '|').split('|').map(s => s.trim())
  const birth = sub(n, 'BIRT', 'DATE')
  const y = yearOf(birth)
  const deceased = !!find(n, 'DEAT') || (y && thisYear - Number(y) > MAX_AGE)
  const living = !deceased

  people[id] = {
    id,
    data: {
      'first name': first,
      'last name': last,
      gender: val(n, 'SEX') === 'F' ? 'F' : 'M',
      living,
      // Redaction: living people get no birth/death info at all
      birthday: living ? '' : birth,
      birthplace: living ? '' : sub(n, 'BIRT', 'PLAC'),
      death: living ? '' : sub(n, 'DEAT', 'DATE')
    },
    rels: { parents: [], spouses: [], children: [] }
  }
}

const link = (arr, id) => { if (id && !arr.includes(id)) arr.push(id) }

for (const f of nodes.filter(n => n.tag === 'FAM')) {
  const h = cleanId(val(f, 'HUSB'))
  const w = cleanId(val(f, 'WIFE'))
  const kids = f.children.filter(c => c.tag === 'CHIL').map(c => cleanId(c.data))

  if (people[h] && people[w]) {
    link(people[h].rels.spouses, w)
    link(people[w].rels.spouses, h)
  }
  for (const k of kids) {
    if (!people[k]) continue
    if (people[h]) { link(people[k].rels.parents, h); link(people[h].rels.children, k) }
    if (people[w]) { link(people[k].rels.parents, w); link(people[w].rels.children, k) }
  }
}

// Warn about anyone with more than two parents (e.g. adoptions or duplicate FAM records)
for (const p of Object.values(people)) {
  if (p.rels.parents.length > 2) {
    console.warn(`WARNING: ${p.data['first name']} ${p.data['last name']} (${p.id}) has ${p.rels.parents.length} parents: ${p.rels.parents.join(', ')}`)
  }
}

mkdirSync('public', { recursive: true })
writeFileSync('public/tree.json', JSON.stringify(Object.values(people)))
console.log(`Wrote public/tree.json with ${Object.keys(people).length} people`)