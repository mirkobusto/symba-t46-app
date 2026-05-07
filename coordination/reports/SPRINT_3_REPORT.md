# REPORT Sprint 3 — Frontend questionnaire

**Data**: 2026-05-07
**Branch codice**: `claude/frontend-questionnaire-m9l4c`
**Tempo effettivo**: ~2.5h

## Contesto

Sprint 3 implementa il frontend del questionario T4.6 sopra il backend
consegnato in Sprint 2. L'utente arriva alla home, avvia un nuovo
assessment (con o senza `case_name`), risponde alle 10 domande in
sequenza e visualizza il pathway risolto con la configurazione LCA / LCC /
S-LCA, le applied rules, i warnings e la trace verso i deliverable D4.x.
I casi `BLOCKED` (e.g. Q1=C2 + Q3=C+E-LCC, BLOCK-01) atterrano su una
ErrorPage dedicata con `user_message` + `suggested_resolutions`.

## Implementazione

- **TypeScript types** (`src/types/api.ts`): mirror dei Pydantic schemas
  del backend — `Question`, `QuestionOption`, `TraceEntry`,
  `PathwayMetadata`, `PathwayConfiguration` (loose `Record<string,unknown>`
  per le sub-config), `BlockInfo`, `ViolatedConstraint`,
  `PathwayResolutionResponse`, `SessionResponse`, `SessionDetailResponse`,
  `AnswerSubmitRequest`, `AnswersSubmitResponse`.
- **API client** (`src/services/api.ts`): wrapper su `fetch` nativo,
  esporta `api.getQuestions / getPathways / createSession / getSession /
  deleteSession / submitAnswers / resolveSession / getPathway /
  getHealth`. Errori FastAPI parsati come `ApiError` con `status` +
  `detail`.
- **Zustand store** (`src/store/sessionStore.ts`): unica store globale
  con persist su `localStorage` ristretto a `sessionId` +
  `currentQuestionIndex`. Actions: `startNewSession`, `loadQuestions`,
  `loadSession`, `setAnswer`, `goToQuestion`, `resolveSession`,
  `loadPathway`, `reset`.
- **4 pagine**: `HomePage`, `QuestionnairePage`, `ResultPage`, `ErrorPage`
  + `AboutPage` (placeholder MVP).
- **9 componenti**: `Layout`, `HealthCheck` (riscritto con dot-status),
  `QuestionCard`, `ProgressIndicator`, `PathwayBadge`,
  `ConfigurationSection`, `TraceList` (collassabile), `AppliedRulesList`,
  `WarningsBanner`, `BlockedMessage`.
- **Routing**: `react-router-dom@7` in `App.tsx`, `Layout` come outlet
  shared (`/`, `/questionnaire/:sessionId`, `/result/:sessionId`,
  `/error/:sessionId`, `/about`). Catch-all redirect a `/`.
- **Styling**: CSS plain in `App.css`, palette indigo-600 / slate /
  amber / red allineata alla §3.9 della SPEC. Layout center max-width
  768px.
- **Test suite**: 6 file Vitest (15 test totali).

## File toccati

**Nuovi (28)**

```
frontend/src/types/api.ts
frontend/src/services/api.ts
frontend/src/store/sessionStore.ts
frontend/src/utils/format.ts
frontend/src/pages/HomePage.tsx
frontend/src/pages/QuestionnairePage.tsx
frontend/src/pages/ResultPage.tsx
frontend/src/pages/ErrorPage.tsx
frontend/src/pages/AboutPage.tsx
frontend/src/components/Layout.tsx
frontend/src/components/QuestionCard.tsx
frontend/src/components/ProgressIndicator.tsx
frontend/src/components/PathwayBadge.tsx
frontend/src/components/ConfigurationSection.tsx
frontend/src/components/TraceList.tsx
frontend/src/components/AppliedRulesList.tsx
frontend/src/components/WarningsBanner.tsx
frontend/src/components/BlockedMessage.tsx
frontend/src/__tests__/api.test.ts
frontend/src/__tests__/sessionStore.test.ts
frontend/src/__tests__/QuestionCard.test.tsx
frontend/src/__tests__/PathwayBadge.test.tsx
frontend/src/__tests__/BlockedMessage.test.tsx
coordination/reports/SPRINT_3_REPORT.md
```

**Modificati (6)**

```
frontend/src/App.tsx                         # routing
frontend/src/App.css                         # full restyle
frontend/src/index.css                       # rimosso #root width:1126px
frontend/src/components/HealthCheck.tsx      # apiBaseUrl + compact mode
frontend/src/__tests__/App.test.tsx          # aggiornato per nuova HomePage
frontend/package.json                        # +react-router-dom +zustand +lucide-react
frontend/README.md                           # documentazione UI
README.md                                    # stato post-Sprint 3
```

NON toccato: `backend/`, `coordination/data/lcsa_decision_engine.v2.json`,
`docker-compose.yml`.

## Test

- **Vitest**: 6 file, **15/15 test pass**.
- **`tsc -b`**: 0 errori.
- **ESLint** (`npm run lint`): 0 errori, 0 warnings.
- **Build** (`npm run build`): pass — bundle 255 kB JS / 81 kB gz, 11 kB
  CSS / 2.8 kB gz. Sotto budget.

Coverage misurato per spot-check (non con `--coverage` flag globale):
i path critici di `services/api.ts`, `store/sessionStore.ts`,
`QuestionCard`, `PathwayBadge`, `BlockedMessage` hanno test diretti.
`Layout`, `ProgressIndicator`, `ConfigurationSection`, `TraceList`,
`AppliedRulesList`, `WarningsBanner`, le 4 pagine sono coperti
indirettamente da `App.test.tsx` (smoke render della HomePage). Una
suite più capillare di test sulle pagine è candidata per uno sprint
successivo (non blocking).

## Decisioni autonome prese

1. **Niente Tailwind**. La SPEC §3.9 dice "Tailwind dovrebbe essere
   pre-configurato in Sprint 1" ma non lo era — il setup richiederebbe
   `@tailwindcss/vite` (Tailwind 4) su Vite 8 e qualche commit di
   tooling. Per stare nel budget temporale e ridurre il rischio
   tooling, ho scritto CSS plain in `App.css` rispettando la palette
   richiesta (indigo-600 / slate / amber / red). Effort di migrazione
   futura a Tailwind: basso (i nomi classe sono semantici, le custom
   property sono già `--primary` / `--slate-*`).
2. **`react-router-dom@7`** invece di v6 (la SPEC autorizzava entrambi).
   v7 è ora stable e usa la stessa API di v6 per il caso d'uso
   `BrowserRouter / Routes / Route / Outlet / useParams / useNavigate`.
3. **`zustand` con `persist` middleware** per `sessionId` +
   `currentQuestionIndex`. Le `answers` non vengono persistite — al
   reload l'app le richiede al backend con `getSession`.
4. **Aggiunto `AboutPage`** (non tassativo nella SPEC ma `/about` era
   nel routing §3.2). Placeholder minimale.
5. **`lucide-react` icons** (autorizzato dalla SPEC). Niente
   `framer-motion`.
6. **Custom `ErrorBoundary` non implementato**: l'error handling di
   Sprint 3 si basa su `error: string | null` nello store + render
   inline (`error-text`). React Error Boundary è candidata follow-up se
   in QA emergono crash non gestiti — ma per ora 1) gli errori API sono
   tutti gestiti, 2) un boundary ne intercetterebbe pochi (e la SPEC lo
   classifica fra le decisioni autonome consentite §6).
7. **Default `VITE_BACKEND_URL = http://localhost:8001`**. La SPEC §3.6
   indicava `:8001`; il `docker-compose.yml` Sprint 2 mappa `:8000`. La
   variabile d'ambiente è override-able. Documentato in
   `frontend/README.md`.

## Smoke test manuale (descrittivo)

Eseguito senza backend up (l'ambiente di build dell'agent non avvia
docker). Ho verificato:

- `npm test` → 15/15 pass (incluso QuestionCard click, BlockedMessage
  rendering con BLOCK-01 mock, PathwayBadge "LCSA-P1").
- `npm run build` → pass.
- `npm run lint` → 0 issues.
- `tsc -b` → 0 errori.

**Smoke test E2E con backend live = pending Mirko** (vedi §8 della
SPEC). Il flow Sunflower-Compost-Park e il caso BLOCKED C2+E-LCC sono
da verificare nel manual QA gate.

## Domande/dubbi emersi durante l'implementazione

1. **Porta backend di default**: la SPEC §3.6 dice `:8001`, il
   `docker-compose.yml` di Sprint 2 espone `:8000`. Ho mantenuto
   `:8001` come default (allineato alla SPEC) lasciando l'override
   tramite `VITE_BACKEND_URL`. Mirko valuti se aggiornare il
   `docker-compose.yml` o cambiare il default lato frontend; per QA
   in Docker basta esportare `VITE_BACKEND_URL=http://localhost:8000`
   (o l'IP LAN `192.168.1.146:8000`) prima di `npm run dev` /
   `docker compose up`.
2. **Soft warnings vs hard blocks**: il backend distingue
   `BlockedCombination.is_hard_block` lato Python ma il frontend
   riceve solo `blocked: bool` + `block_info`. Per Sprint 3 ho
   trattato uniformemente come "blocked" → ErrorPage. Se in futuro si
   volesse mostrare i soft warnings senza interrompere il flow, il
   contratto API andrebbe esteso (non necessario per MVP).
3. **`AboutPage`**: contenuto minimo placeholder, copy dovrà essere
   rivisto da Mirko in pre-release.

## Manual QA gate post-fix per Mirko

Vedi SPEC §8. Promemoria checklist:

1. `git pull origin claude/frontend-questionnaire-m9l4c` (o merge a
   main).
2. `docker compose up --build -d` — verifica che backend e frontend
   partano. Se il frontend è su `:5173` ma il backend su `:8000`,
   esporta `VITE_BACKEND_URL=http://localhost:8000` o aggiungi
   `environment: VITE_BACKEND_URL=...` nel `docker-compose.yml` per il
   servizio frontend.
3. Apri il browser su `http://localhost:5173` (o
   `http://192.168.1.146:5173`).
4. **HomePage**: titolo "SYMBA T4.6 — IS Assessment Tool" + descrizione
   + bottone "Start new assessment". Footer "Backend: OK".
5. Click "Start new assessment" (con o senza case_name).
6. **QuestionnairePage**: "Question 1 of 10", Q1 con 4 opzioni
   (A, B, C1, C2).
7. **Flow Sunflower-Compost-Park**: Q1=A, Q2=ex-ante, Q3=C+E-LCC,
   Q4=function-oriented, Q5=design, Q6=No, Q7=system-expansion,
   Q8=Yes, Q9=single-site, Q10=standard.
8. **ResultPage**: badge "LCSA-P1" + nome "Standard IS Project",
   tab LCA mostra `weighting: no-weighting`, `critical_review: panel`,
   `transport_modeling: explicit-foreground`. Applied rules contiene
   `RULE-01-Q8-public-assertion`. Trace ha refs a D4.1 §2.3.4 etc.
9. **Test BLOCKED**: torna a home, start new, Q1=C2, Q2=ex-ante,
   Q3=C+E-LCC. Al submit di Q3 (o all'ultima domanda) deve scattare
   `BLOCK-01` → ErrorPage con `user_message` +
   `suggested_resolutions`.
10. **CI**: workflow frontend GitHub Actions verde su PR.

Se uno step fallisce, riportami output esatto del browser console +
network tab (status code endpoint coinvolto) e del comando docker
logs.

## Carry-over

- Tailwind migration (SPEC §3.9) — attualmente CSS plain. Non blocking
  per QA.
- React Error Boundary globale — candidata se emergono crash non
  gestiti.
- Test capillari sulle 4 pagine (oltre l'`App.test.tsx` smoke).
- Allineamento porta backend (`:8000` Docker vs `:8001` SPEC).
- Mobile-first responsive: layout attuale degrada graziosamente fino a
  tablet, mobile parziale.

## Commit

- Codice + report: `claude/frontend-questionnaire-m9l4c` (commit
  hash → vedi `git log` post-push). PR: TBD (apertura su richiesta
  esplicita di Mirko, come da policy "DO NOT create a pull request
  unless the user explicitly asks").
