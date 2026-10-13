import { describe, expect, it } from 'vitest'

// Imported straight from the engine's rule table so there is exactly one
// canonical copy of the English wording in the repo.
import rules from '../../../backend/app/schemas/cross_method_rules.json'
import { SCHEMA_TERMS, schemaTerm } from '../i18n/schemaTerms'

// Three things can go wrong with a translated copy of schema text, and
// all three are silent in the browser:
//   a. the schema changes and the English mirror does not, so a
//      translation quietly describes a rule that no longer says that;
//   b. a language is missing an id, and i18next's English fallback makes
//      the page half-English again — the very thing this table fixes;
//   c. a translated statement loses its own code, which is the only
//      string a reviewer can look up.

const RULE_ARRAYS = [
  'integration_rules',
  'conditional_integration_rules',
  'fu_rules',
  'boundary_rules',
] as const

interface RawRule {
  id: string
  name?: string
  violation_message?: string | null
}

interface RawCdp {
  id: string
  name?: string
  tension?: string | null
  resolution_at_l3?: string | null
}

interface RawBlock {
  id: string
  user_message?: string | null
}

const schema = rules as unknown as Record<string, RawRule[]> & {
  critical_decision_points: RawCdp[]
  blocks: RawBlock[]
}

const schemaRules: RawRule[] = RULE_ARRAYS.flatMap((k) => schema[k])
const TRANSLATIONS = ['it', 'fr', 'de', 'es'] as const

describe('the English mirror matches the engine rule table', () => {
  it('carries every rule, with the schema wording', () => {
    expect(Object.keys(SCHEMA_TERMS.en.rule).sort()).toEqual(
      schemaRules.map((r) => r.id).sort(),
    )
    for (const r of schemaRules) {
      const term = SCHEMA_TERMS.en.rule[r.id]
      expect(term.name, `${r.id} name`).toBe(r.name ?? '')
      expect(term.body, `${r.id} body`).toBe(r.violation_message ?? '')
    }
  })

  it('carries every decision point and every block', () => {
    expect(Object.keys(SCHEMA_TERMS.en.cdp).sort()).toEqual(
      schema.critical_decision_points.map((c) => c.id).sort(),
    )
    for (const c of schema.critical_decision_points) {
      const term = SCHEMA_TERMS.en.cdp[c.id]
      expect(term.name, `${c.id} name`).toBe(c.name ?? '')
      expect(term.body, `${c.id} tension`).toBe(c.tension ?? '')
      expect(term.resolution, `${c.id} resolution`).toBe(c.resolution_at_l3 ?? '')
    }
    expect(Object.keys(SCHEMA_TERMS.en.block).sort()).toEqual(
      schema.blocks.map((b) => b.id).sort(),
    )
    for (const b of schema.blocks) {
      expect(SCHEMA_TERMS.en.block[b.id].body, `${b.id}`).toBe(b.user_message ?? '')
    }
  })
})

describe('the four translations stay level with English', () => {
  it('cover exactly the same ids', () => {
    for (const lang of TRANSLATIONS) {
      for (const kind of ['rule', 'cdp', 'block'] as const) {
        expect(Object.keys(SCHEMA_TERMS[lang][kind]).sort(), `${lang}.${kind}`)
          .toEqual(Object.keys(SCHEMA_TERMS.en[kind]).sort())
      }
    }
  })

  it('translate a name wherever English has one', () => {
    for (const lang of TRANSLATIONS) {
      for (const kind of ['rule', 'cdp'] as const) {
        for (const [id, en] of Object.entries(SCHEMA_TERMS.en[kind])) {
          const term = SCHEMA_TERMS[lang][kind][id]
          if (en.name) expect(term.name, `${lang}.${kind}.${id}`).toBeTruthy()
          if (en.body) expect(term.body, `${lang}.${kind}.${id} body`).toBeTruthy()
          if (en.resolution) {
            expect(term.resolution, `${lang}.${kind}.${id} resolution`).toBeTruthy()
          }
        }
      }
    }
  })

  it('keep each rule statement carrying its own code', () => {
    for (const lang of ['en', ...TRANSLATIONS]) {
      for (const [id, term] of Object.entries(SCHEMA_TERMS[lang].rule)) {
        if (!term.body) continue
        expect(term.body, `${lang}.${id} lost its code`).toContain(id)
      }
    }
  })
})

describe('the lookup', () => {
  it('reads a regional tag and falls back to English', () => {
    expect(schemaTerm('it-IT', 'rule', 'IR-01')?.name).toBe(
      SCHEMA_TERMS.it.rule['IR-01'].name,
    )
    expect(schemaTerm('pt', 'rule', 'IR-01')?.name).toBe('Shared Functional Unit')
    expect(schemaTerm('it', 'rule', 'IR-999')).toBeNull()
  })
})
