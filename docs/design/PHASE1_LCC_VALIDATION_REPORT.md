# Phase 1 LCC Validation Report — 100% per-node check

**Method**: every Kimi node (TRIG-01 + HC-01..HC-40 + MC-01..MC-20 = 61 nodes) checked against D4.2 body text by literal content match. Line numbers refer to the markdown extraction of `D4_2_LCC_Guidelines_V1.docx` (`/home/claude/work/D4_2.md`, 1806 lines, body starts L237).

**Headline**: **61/61 nodes VALID**. 0 mis-citations of section numbers. 1 substantive editorial flag (already on Mirko's `deliverable_authoring_issues.md` list — Kimi is faithful to D4.2 as-written).

---

## Verdict table

### Trigger + Hard Constraints (41 nodes)

| Node | Kimi citation | Body anchor | Verdict |
|---|---|---|---|
| TRIG-01 — LCC type (C/E/S-LCC) selection | §2.2, §2.3, §5.1 | L457 (heading), L465 (S-LCC), L485 (combination C+E+S) | VALID |
| HC-01 — 3-level structure (Network/Entity/Flow) | §2.3 | L473 (heading), L1385 ("uniformly at the network level, the entity level, and the flow level") | VALID |
| HC-02 — Neutral 3rd-party facilitator | §2.3, §7.3, §13 | L487, L865, L1395 | VALID |
| HC-03 — NDAs before data exchange | §2.3, §7.3 | L347 (acronym), L867 ("operating under strict Non-Disclosure Agreements") | VALID |
| HC-04 — Functional Equivalent = LCA FU | §3 | L501, L505, L1229 | VALID **— editorial flag, see §B** |
| HC-05 — Physical boundary E-LCC = LCA | §4.3, §11 | L549 (universal) + L597 (E-LCC-specific), L595 (heading), L1229 | VALID **— same editorial flag** |
| HC-06 — Break-even distance as sensitivity | §4.2, §4.3, §9.2 | L603 (heading), L1083 ("mandatory sensitivity parameter") | VALID |
| HC-07 — CAPEX 1–5% cut-off rule | §4.2 | L583 (heading), L587 ("1% to 5% of total life cycle cost"), L607 | VALID |
| HC-08 — Market price = upstream proxy, no double counting | §4.2, §11 | L589 (heading), L591, L966 | VALID |
| HC-09 — Entity before network consolidation | §5.2, §8.2 | L683 (heading), L685, L972 ("methodologically incorrect" reverse), L998 | VALID |
| HC-10 — Allocation linked to LCC type in Charter | §5.1, §5.3 | L619 (heading), L679, L681 | VALID |
| HC-11 — Reference scenario for avoided cost documented | §5.2, §5.3 | L687 (heading), L689 | VALID |
| HC-12 — Avoidable/Unavoidable Test precedes valuation | §6.2, §6.3 | L733 (heading), L735, L755 | VALID |
| HC-13 — C-LCC: zero-cost not default; price = negotiated | §6.3 | L763 explicit | VALID |
| HC-14 — Charter specifies ex-ante/ex-post at outset | §7.1, §7.3 | L835 explicit | VALID |
| HC-15 — TRL<7: Six-Tenths, Lang Factors, CEPCI | §7.3, §7.4 | L883 (formula), L885 (CEPCI), L887, L889 (Lang 5.03) | VALID |
| HC-16 — Mandatory harmonization protocol | §7.2, §7.4 | L914 (heading), L916 (currency, ref year, CBS, etc.) | VALID |
| HC-17 — Screening LCC before Detailed LCCI | §7.4, §13 | L877, L1393 | VALID |
| HC-18 — NPV principal output per ISO 15686-5 | §8.1, §8.2 | L922 explicit | VALID |
| HC-19 — Strict 4-step calc sequence | §8.3 | L990 (heading), L994 (Step 1), L996 (Step 2), L998 (Step 3), L1000 (Step 4) | VALID |
| HC-20 — Full KPI suite at 3 levels | §8.3, §13 | L988 ("NPV, IRR (or MIRR…), DPP, LCOE/LCOP… at all three analytical levels") | VALID |
| HC-21 — Real vs nominal absolute consistency | §9.2 | L1057 (heading), L1059 ("rule is absolute") | VALID |
| HC-22 — Partner-specific discount rates at entity | §9.2, §9.3 | L1067 (heading), L1093, L1415 ("Discounting is Destiny") | VALID |
| HC-23 — Asset >15 yrs → SSP/RCP scenarios | §9.2, §9.3 | L1105 explicit | VALID |
| HC-24 — Monte Carlo mandatory, ≥10,000 iterations | §10.1, §10.3 | L1177 explicit, L1419 ("single-point NPV is a mathematical fiction") | VALID |
| HC-25 — Correlations explicit in simulation | §10.3 | L1175 (Step 2 — Correlation Matrix Definition) | VALID |
| HC-26 — Counterparty risk via structural scenario | §10.2, §10.3 | L1153 (heading), L1155, L1189 | VALID |
| HC-27 — Perfect systemic LCA-LCC alignment | §11.1, §11.2, §13 | L1223 (heading), L1225 ("performed on the exact same system") | VALID **— same wording flag as HC-04** |
| HC-28 — Eco-efficiency uses annualized costs not NPV | §8.3, §11.2, §11.3 | L974 (heading), L982, L1002 (heading), L1247–1249 (temporal mismatch) | VALID |
| HC-29 — 3-layer reporting architecture | §12.2, §12.3, §13 | L1337 (heading), L1339–1345 (Layer 1/2/3 explicit), L1421 | VALID |
| HC-30 — Failure modes integral, not appendix | §12.2, §12.3, §13 | L1323, L1359, L1361 (biological variability), L1401, L1405 | VALID |
| HC-31 — Charter signed before any modeling | §13.1, §13.2 | L1373 (heading), L1375 explicit | VALID |
| HC-32 — Shared CBS includes IS-specific categories | §4.2, §4.3 | L571 (heading), L599 (heading), L601 (transaction/transport/CAPEX/non-LCI) | VALID |
| HC-33 — 90% CI + P(NPV>0) reported | §10.3, §12.3 | L1179, L1203, L1419 | VALID |
| HC-34 — Transfer price as central sensitivity, negotiation space | §5.3, §6.3 | L691 (heading), L693, L769, L771 | VALID |
| HC-35 — Zero-cost flows explicitly identified + sensitivity | §6.3 | L773 (heading), L775 explicit | VALID |
| HC-36 — Modified production → multifunctional remodel | §6.2, §6.3 | L743 (heading), L747, L777, L779 | VALID |
| HC-37 — Ex-ante: trigger conditions for update | §7.1, §7.3 | L829 (heading), L835 (commissioning, ramp-up, contract renewal) | VALID |
| HC-38 — MFCA when contested/no market | §5.2, §5.3, §6.3 | L673 (heading), L697 explicit | VALID |
| HC-39 — Pedigree Matrix 5 indicators | §7.1, §7.3, §7.4 | L827 (all 5 named) | VALID |
| HC-40 — Mandatory sensitivity params with ranges | §8.3, §10.3 | L1185 explicit (discount full range / transfer full negotiation / commodity ceiling-floor / CAPEX ±30% mature ±100% low-TRL) | VALID |

### Methodological Choices (20 nodes)

| Node | Kimi citation | Body anchor | Verdict |
|---|---|---|---|
| MC-01 — LCC type (a..e combinations) | §2.2, §2.3 | L457, L465, L485 (recommended C+E; +S for policy) | VALID |
| MC-02 — Analytical levels | §2.3 | L245, L473 (mandatory), L475 (UM3-LCE3-ISN) | VALID |
| MC-03 — FU: Single/Dual/Portfolio/PSS | §3.1, §3.3 | L503 (Portfolio heading), L507, L509 (PSS with trip rates and asset lifespan), L545 | VALID |
| MC-04 — Valuation: Transfer/Market/MFCA | §3.2, §3.3, §5.1 | L523 (Actual Transfer Price), L525 (Market Price Proxy), L675 (MFCA-derived) | VALID |
| MC-05 — Boundary 4 types | §4.1, §4.3 | L559 (Gate-to-Gate), L613 (Entry-to-Gate), L563 (Cradle-to-Gate), L567 (Cradle-to-Grave) | VALID |
| MC-06 — CBS: Standard / IS-Expanded | §4.2, §4.3 | L571, L599, L601 | VALID |
| MC-07 — Allocation rules (4 types) | §5.1, §5.3 | L465 (NTF for S-LCC), L633 (system expansion E-LCC), L659 (negotiated C-LCC, physical causality option) | VALID |
| MC-08 — Secondary flow valuation | §6.2, §6.3 | L723 (heading), L725 (Position A zero-cost), L729 (Position B opportunity), L775 (MFCA-derived) | VALID |
| MC-09 — Avoidable/Unavoidable | §6.2, §6.3 | L733, L737 (unavoidable def.), L739 (avoidable def.) | VALID |
| MC-10 — Ex-ante/Ex-post | §7.1, §7.3 | L795, L807 (ex-ante challenge), L799 (ex-post), L829 | VALID |
| MC-11 — KPI suite | §8.2, §8.3 | L988 (NPV, IRR/MIRR, DPP, LCOE/LCOP) | VALID |
| MC-12 — Discount rate convention | §9.3 | L1091 (entity-specific + network blended), L1663 (social ~4% for waste valorization) | VALID |
| MC-13 — Static / Dynamic SSP/RCP | §9.2, §9.3 | L1105 explicit | VALID |
| MC-14 — Single break-even / GIS-coupled | §4.3, §9.3 | L1109 (GIS coupling explicit) | VALID |
| MC-15 — Distributions (Tri/Uni/Norm/Log-norm) | §10.3 | L1169 (Triangular), L1171 (Uniform), L1173 (Normal/Log-normal) | VALID |
| MC-16 — Counterparty: None / Percolation | §10.3 | L1191 explicit (percolation theory) | VALID |
| MC-17 — LCA-LCC integration mode | §11.3 | L1255 (MFA backbone), L1257 (LCI-Based E-LCC matrix), L1261, L1772 (Kerdlap UM3-LCE3-ISN ref) | VALID |
| MC-18 — ECOF / IEE | §11.3 | L1273 (ECOF formula), L1275, L1279 (IEE formula), L1281 | VALID |
| MC-19 — CE Delft Environmental Prices | §11.2, §11.3 | L1243 explicit, L1742 (CE Delft 2023 EU28 ref) | VALID |
| MC-20 — Quality correction (physical/market) | §3.2, §3.3 | L529 (heading), L535, L537 ("physical property differentials or market price differentials") | VALID |

---

## Key findings

### A. Section numbering: clean

Every section number Kimi cites is anchored in D4.2 body. **0 mis-citations across 61 nodes.**

The TOC has one minor structural oddity: the chapter-level entry for §10 (Uncertainty/Risk) is missing from the listing — only §10.1, §10.2, §10.3 appear. The body §10 content exists but the TOC index is incomplete. Editorial-only.

### B. "Identical FU/boundary" wording — already on Mirko's editorial list

`deliverable_authoring_issues.md` flags D4.2 with: *"FU 'identical' universale vs E-LCC-only, 'typically Cradle-to-Gate' weakens 'must be identical'"*.

Looking at D4.2 directly:
- **L501** ("the Functional Equivalent — which is the direct conceptual parallel to the Functional Unit (FU) in LCA") — universal phrasing.
- **L505** says it more carefully: *"the LCC must adopt the same Functional Unit … defined in the parallel LCA as its Functional Equivalent. As established in the SETAC literature, E-LCC utilizes the 'same functional unit, system boundaries, and scope' as the LCA"* — the universal claim is then immediately reinforced with an E-LCC-specific citation, suggesting the rule is in fact E-LCC-anchored but stated universally.
- **L549** ("system boundary … must be identical to the one used in the parallel LCA") — universal.
- **L563** ("E-LCC boundary must be identical to that of the parallel LCA — typically a Cradle-to-Gate boundary") — E-LCC-specific but the "typically" softens what was just said as a hard rule.
- **L597** ("Mandate Strict Physical Boundary Consistency with the Parallel LCA" → "the methodological charter must stipulate that the physical system boundary used for the E-LCC is drawn to be identical") — explicitly E-LCC.
- **L1233** later acknowledges that *"the **Conventional LCC (C-LCC)**, with its gate-to-gate, firm-level perspective, is structurally misaligned with a cradle-to-gate LCA"* — i.e., C-LCC is NOT subject to the boundary-identity requirement.

So inside D4.2 itself the rule is genuinely E-LCC-specific in its operational meaning (only E-LCC results can support a clean eco-efficiency ratio with the LCA), but the framing paragraphs state it universally. **Kimi HC-04 / HC-05 / HC-27 read the universal framing**, which is faithful to the words but propagates D4.2's own ambiguity.

For the decision engine: this matters because if a user picks C-LCC alone (TRIG-01 / MC-01 option a), HC-04/HC-05 as-written would impose a boundary identity that L1233 explicitly says doesn't apply. **Recommendation**: when we rebuild the decision engine, gate HC-04 / HC-05 / HC-27 on `lcc_type ∈ {E-LCC, C+E-LCC, C+E+S-LCC}` rather than universal — the substance is correct, the conditional was just collapsed in the universal framing. This is also exactly what Mirko proposes to fix in D4.2.

### C. No invariant-style errors anywhere

Unlike INV-04 in the v2 JSON (which compared `lcc.boundary` to `lca.system_boundary` as if they were the same dimension), the LCC nodes themselves don't make that mistake. The "boundary identity" claim is between **physical system boundary in E-LCC** and **system boundary in LCA** — which IS comparable. The INV-04 error was operational (comparing the wrong two fields), not conceptual. The conceptual rule in D4.2 is sound for E-LCC.

### D. Strong cross-method touchpoints found

D4.2 has many strong harmonization hooks with D4.1 that the decision engine should preserve as integration constraints:
- **L1255 MFA backbone** (precedes both LCA and LCC) → maps cleanly to LCA MC-19 (`MC-19:MFA`).
- **L1417 MFCA bridge** (ISO 14051:2011) → maps to LCA MC-33 (`MC-33:MFCA`).
- **L1261 UM3-LCE3-ISN matrix** → maps to LCA MC-03 (`MC-03:Integrated`) / MC-34 (Network+Entity+Flow).
- **L1247–1249 capital goods temporal mismatch** explicitly cross-references LCA capital-goods amortization (LCA HC-18 / MC-10).
- **L1421 (LCA D4.1) ↔ L1373 (LCC D4.2)**: shared methodological charter requirement, identical wording. Strong invariant candidate.

These are the **real** invariants for the v3 decision engine, not the INV-04 type.

---

## What changes in the bootstrap picture (LCC layer)

Bootstrap §3.2 listed three concerns about the v2 JSON, all LCA-side. LCC-side, the validation reveals nothing equivalent:
- No PEF-CFF-style structural debate inside LCC.
- No section renumbering inconsistency (D4.2 is more stable than D4.1).
- The HC-04/05/27 wording flag is editorial-only and **already on Mirko's list**; the substance of the rules is correct conditional on `lcc_type` involving E-LCC.

**LCC layer of the decision engine v3 should be rebuilt from these 61 nodes with one structural change**: gate HC-04 / HC-05 / HC-27 (and any derived rules) on `lcc_type` involving E-LCC. The previous chat's v2 JSON likely propagated the universal framing without conditioning — that's the kind of error to avoid in v3.

---

## Cumulative status across LCA + LCC

| Method | Kimi nodes | Validated | Verdict |
|---|---|---|---|
| LCA (Phase 1) | 59 (1 trig + 22 HC + 36 MC) | 59/59 | ALL VALID |
| LCC (Phase 1) | 61 (1 trig + 40 HC + 20 MC) | 61/61 | ALL VALID |
| **Total so far** | **120** | **120/120** | **100%** |

Substantive editorial issues accumulating (already on Mirko's list — Kimi nodes faithful to deliverables as-written):
1. D4.1 §6.3.x ↔ §5.7.x renumbering half-merged
2. D4.1 step 4 "Section 5.7.5" cross-ref broken
3. D4.2 FU/boundary "identical" universal phrasing where rule is operationally E-LCC-only
4. D4.2 TOC missing chapter-level §10 entry

Structural-framing minor notes (not editorial):
1. LCA MC-32: D4.1 organizes GSA in 3 tiers with PAWN/delta-moment as siblings; Kimi flattens to 4 options
2. LCA MC-13/MC-14 PEF CFF placement: Kimi faithful to D4.1, but D4.1's structure conflates two distinct PEF CFF roles (Q-basis vs alt method); decision deferred to dominant-variables pass

---

## Next turn

Phase 1 S-LCA — 65 nodes (1 trig + 47 HC + 18 MC) against D4.3. Same protocol.

After that: cross-method clash review (Phase 2 file) using the now-validated atomic nodes as ground truth.
