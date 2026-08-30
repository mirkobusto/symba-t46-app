// Verbatim citations behind the 'more info' panel — English only, by
// design: a citation in translation is not a citation. The paraphrase
// next to it is what gets translated (i18n `narrative.*`).
//
// Mirrors backend/app/data/narrative.json, which the .docx report reads
// from; a vitest fails if the two drift, and
// backend/scripts/verify_citations.py checks each quote verbatim against
// the deliverable it names.

export interface NarrativeSource {
  quote: string
  source: string
}

export const NARRATIVE_SOURCES: Record<string, Record<string, NarrativeSource>> = {
  ilcd: {
    'ILCD Situation A': {
      quote: 'The decision (e.g., a synergy between two factories) has limited consequences. It does not cause large-scale, structural changes to the background system (e.g., it is too small to trigger the construction of new power plants or shift global market prices). Modeling Rule: Apply Attributional Modeling with Substitution.',
      source: 'D4.1 Part 1 §8.2.1 (p. 36)',
    },
    'ILCD Situation A multi-actor': {
      quote: 'The decision (e.g., a synergy between two factories) has limited consequences. It does not cause large-scale, structural changes to the background system (e.g., it is too small to trigger the construction of new power plants or shift global market prices). Modeling Rule: Apply Attributional Modeling with Substitution.',
      source: 'D4.1 Part 1 §8.2.1 (p. 36) for the rule; the multi-actor split is a T4.6 engine state',
    },
    'ILCD Situation B': {
      quote: 'Only apply full consequential modeling if you can prove the IS network will cause structural changes in the global or national economy (e.g., creates a demand so large it triggers new capacity installation outside the network).',
      source: 'D4.1 Part 1 §5.3.4 (p. 24)',
    },
    'ILCD Situation C1': {
      quote: 'Situation C1 (Monitoring with Interactions): If the goal is to document the benefits of an existing IS network to the wider economy, use Substitution with the Average Market Mix (identical to Situation A).',
      source: 'D4.1 Part 1 §8.2.3 (p. 37)',
    },
    'ILCD Situation C2': {
      quote: 'Situation C2 (Strict Accounting): If the goal is strict corporate reporting for a specific partner in isolation, use Allocation (Step 3). Do not apply substitution credits.',
      source: 'D4.1 Part 1 §8.2.3 (p. 37)',
    },
  },
  lcc: {
    'C+E': {
      quote: 'Conventional LCC (C-LCC) — The Firm Perspective: Evaluates strict financial feasibility from the perspective of an individual actor, equivalent to a Total Cost of Ownership analysis. […] Environmental LCC (E-LCC) — The Value Chain Perspective: Provides an economic assessment directly consistent with a parallel LCA, expanding the boundary to cover all actors within the defined life cycle system.',
      source: 'D4.2 §2.2 — Selecting the LCC Type (p. 20)',
    },
    'C+E+S': {
      quote: 'Societal LCC (S-LCC) — The Welfare Perspective: Quantifies broader societal welfare implications. Taxes and subsidies are excluded or adjusted using a Net Tax Factor (NTF) to convert budget costs into shadow prices, since they represent transfers within society rather than net costs to it.',
      source: 'D4.2 §2.2 — Selecting the LCC Type (p. 20)',
    },
    'C-LCC': {
      quote: 'Conventional LCC (C-LCC) — The Firm Perspective: Evaluates strict financial feasibility from the perspective of an individual actor, equivalent to a Total Cost of Ownership analysis. All policy instruments are modeled as real cash flows: taxes and fees are costs; subsidies are CAPEX or OPEX reductions.',
      source: 'D4.2 §2.2 — Selecting the LCC Type (p. 20)',
    },
  },
  slca: {
    'active': {
      quote: 'The classification of stakeholders follows the UNEP/SETAC framework and is adapted to the characteristics of Industrial Symbiosis systems. The main stakeholder categories typically include workers, consumers, local communities and value chain actors, each associated with specific social aspects.',
      source: 'D4.3 §5.1 (p. 15)',
    },
  },
}
