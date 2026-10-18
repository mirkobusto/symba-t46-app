// D4.1 Part 2 typical IS configurations (§4.1-§8.1), by chapter. Mirrors
// `configurations` in backend/app/schemas/sector_overlays.json; a backend test
// (test_sector_rules.py) keeps the two in step. Labels live in i18n
// (flows.configurations.<id>).

import type { Q6a } from '../types/api'

export const CHAPTER_OF_SECTOR: Partial<Record<Q6a, string>> = {
  agriculture_agrifood_biorefineries: 'agrifood',
  food_production: 'agrifood',
  plastics_packaging: 'plastics',
  biobased_polymers: 'plastics',
  wastewater_sludge_biofactories: 'wastewater',
  textile_leather: 'textiles',
  waste_valorization: 'waste_valorisation',
}

export const CONFIGURATIONS_BY_CHAPTER: Record<string, string[]> = {
  agrifood: [
    'agrifood_ad_bioenergy_fertiliser',
    'agrifood_feed_bioconversion',
    'agrifood_platform_chemicals',
    'agrifood_high_value_compounds',
    'agrifood_nutrient_recovery',
  ],
  plastics: [
    'plastics_mechanical_recycling',
    'plastics_chemical_recycling',
    'plastics_reusable_packaging',
    'plastics_biobased_packaging',
    'plastics_upcycling',
  ],
  wastewater: [
    'wastewater_nutrient_recovery',
    'wastewater_sludge_to_energy',
    'wastewater_sludge_pyrolysis',
    'wastewater_water_reuse',
    'wastewater_screening_srf',
    'wastewater_microalgae',
  ],
  textiles: [
    'textiles_fibre_to_fibre',
    'textiles_downcycling',
    'textiles_chemical_valorisation',
    'textiles_recycled_carbon_fibre',
    'textiles_pss_reuse',
  ],
  waste_valorisation: [
    'wv_srf_coprocessing',
    'wv_biowaste_nutrients_energy',
    'wv_tailings_construction',
    'wv_weee_urban_mining',
    'wv_plastic_upcycling',
  ],
}

/** Configurations offered for a flow, given its declared Part 2 sector. */
export function configurationsFor(sector: Q6a | null | undefined): string[] {
  const chapter = sector ? CHAPTER_OF_SECTOR[sector] : undefined
  return chapter ? CONFIGURATIONS_BY_CHAPTER[chapter] : []
}
