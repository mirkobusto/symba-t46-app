import { fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import '../i18n'
import FlowsEditor from '../components/FlowsEditor'
import type { Flow } from '../types/api'

function Harness({ initial }: { initial: Flow[] }) {
  const [flows, setFlows] = useState<Flow[]>(initial)
  return <FlowsEditor flows={flows} onChange={setFlows} />
}

// The configuration (D4.1 Part 2 §4.1-§8.1) depends on the chapter of the flow.
describe('FlowsEditor — Part 2 configuration', () => {
  const configSelect = () => screen.getByLabelText('Configuration (Part 2)') as HTMLSelectElement
  const sectorSelect = () => screen.getByLabelText('Sector (Part 2)') as HTMLSelectElement

  it('is disabled until a Part 2 sector is chosen, then offers that chapter only', () => {
    render(<Harness initial={[{ id: 'f1', name: 'Digestate', q5: 'b' }]} />)
    expect(configSelect().disabled).toBe(true)
    fireEvent.change(sectorSelect(), { target: { value: 'food_production' } })
    expect(configSelect().disabled).toBe(false)
    const values = Array.from(configSelect().options).map((o) => o.value)
    expect(values[0]).toBe('')
    expect(values).toContain('agrifood_ad_bioenergy_fertiliser')
    expect(values).not.toContain('wv_srf_coprocessing')
  })

  it('drops the configuration when the sector moves to another chapter', () => {
    render(<Harness initial={[{
      id: 'f1', name: 'Digestate', q5: 'b', sector: 'food_production',
      configuration: 'agrifood_ad_bioenergy_fertiliser',
    }]} />)
    expect(configSelect().value).toBe('agrifood_ad_bioenergy_fertiliser')
    fireEvent.change(sectorSelect(), { target: { value: 'waste_valorization' } })
    expect(configSelect().value).toBe('')
  })
})
