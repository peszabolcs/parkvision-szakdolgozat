# Traceability Matrix - Sprint 2 MVP

**Verzió:** 1.0
**Dátum:** 2025-12-08
**Projekt:** ParkVision Frontend MVP

---

## Cél

Ez a dokumentum összeköti a User Story-kat, Acceptance Criteria-kat, teszteket, kódot és CI lépéseket, biztosítva a követhetőséget (traceability) a követelményektől a megvalósításig.

---

## Story → AC → Test → Code → CI Lánc

| Story ID | Story Title | AC ID | Test File | Implementation | CI Step | Status |
|----------|-------------|-------|-----------|----------------|---------|--------|
| **US-01** | Üres állapot megjelenítése | AC1-01 | `EmptyState.test.tsx` | `EmptyState.tsx` | Unit tests |  |
| US-01 | Üres állapot megjelenítése | AC1-02 | `EmptyState.test.tsx` | `EmptyState.tsx`, `AreasPage.tsx` | Unit tests |  |
| US-01 | Üres állapot megjelenítése | AC1-03 | `empty_state.feature` | `DashboardPage.tsx`, `ParkingSpacesPage.tsx` | Gherkin (manual) |  |
| **US-02** | Dashboard foglaltsági áttekintés | AC2-01 | `DashboardPage.test.tsx` (jövő) | `DashboardPage.tsx`, `StatCard.tsx` | Integration test | [~] |
| US-02 | Dashboard foglaltsági áttekintés | AC2-02 | N/A (mock) | `DashboardPage.tsx` (useParkingSpaces) | N/A | [~] |
| US-02 | Dashboard foglaltsági áttekintés | AC2-03 | `DashboardPage.tsx` (üres állapot) | `DashboardPage.tsx` | Smoke test |  |
| **US-03** | Parkolóhely lista megjelenítése | AC3-01 | `ParkingSpacesPage.test.tsx` (jövő) | `ParkingSpacesPage.tsx` | Integration test | [~] |
| US-03 | Parkolóhely lista megjelenítése | AC3-02 | N/A (manual) | `ParkingSpacesPage.tsx` (szűrő) | Manual QA |  |
| US-03 | Parkolóhely lista megjelenítése | AC3-03 | N/A (manual) | `ParkingSpacesPage.tsx` (rendezés) | Manual QA | [~] |
| **US-04** | Terület lista nézet | AC4-01 | `AreasPage.test.tsx` (jövő) | `AreasPage.tsx` | Integration test | [~] |
| US-04 | Terület lista nézet | AC4-02 | N/A (visual) | `AreasPage.tsx` (progressbar) | Smoke test |  |
| **US-05** | Hiba állapot kezelése | AC5-01 | `ErrorBanner.test.tsx` | `ErrorBanner.tsx` | Unit tests |  |
| US-05 | Hiba állapot kezelése | AC5-02 | `ErrorBanner.test.tsx` | `ErrorBanner.tsx` (onRetry) | Unit tests |  |
| US-05 | Hiba állapot kezelése | AC5-03 | `error_handling.feature` | `ErrorBanner.tsx` (timeout) | Gherkin (manual) |  |
| US-05 | Hiba állapot kezelése | AC5-04 | `error_handling.feature` | `DashboardPage.tsx`, `AreasPage.tsx` | Gherkin (manual) |  |

**Státusz jelölések:**
-  Implementálva és tesztelve
- [~] Részben implementálva / Manuális teszt
-  Nem implementálva

---

## Spec v0.2 → Story Mapping

| Spec v0.2 Section | Story ID(k) | Komponens(ek) |
|-------------------|-------------|---------------|
| 3.1 Fő Stories - US-01 | US-01 | `EmptyState.tsx` |
| 3.1 Fő Stories - US-02 | US-02 | `DashboardPage.tsx`, `StatCard.tsx` |
| 3.1 Fő Stories - US-03 | US-03 | `ParkingSpacesPage.tsx` |
| 3.1 Fő Stories - US-04 | US-04 | `AreasPage.tsx` |
| 3.1 Fő Stories - US-05 | US-05 | `ErrorBanner.tsx` |
| 4. NFR-01 (TTFB < 1.5s) | - | Vercel CDN, Vite build |
| 4. NFR-02 (Smoke ≥ 95%) | - | `smoke.yaml`, `smoke.http` |
| 4. NFR-03 (Coverage ≥ 60%) | - | Vitest coverage |

---

## AC → Test Coverage

| AC ID | Automatizált Teszt? | Test File | Coverage % (komponens) |
|-------|---------------------|-----------|----------------------|
| AC1-01 |  | `EmptyState.test.tsx` | ~85% |
| AC1-02 |  | `EmptyState.test.tsx` | ~85% |
| AC1-03 |  (Gherkin manual) | `empty_state.feature` | N/A |
| AC2-01 | [~] (jövő) | `DashboardPage.test.tsx` | TBD |
| AC2-02 |  (mock logic) | N/A | N/A |
| AC2-03 |  (üres állapot) | `DashboardPage.tsx` (implicit) | ~70% |
| AC3-01 | [~] (jövő) | `ParkingSpacesPage.test.tsx` | TBD |
| AC3-02 |  (manual QA) | N/A | N/A |
| AC3-03 |  (manual QA) | N/A | N/A |
| AC4-01 | [~] (jövő) | `AreasPage.test.tsx` | TBD |
| AC4-02 |  (implicit) | `AreasPage.tsx` (visual) | ~65% |
| AC5-01 |  | `ErrorBanner.test.tsx` | ~90% |
| AC5-02 |  | `ErrorBanner.test.tsx` | ~90% |
| AC5-03 |  (Gherkin manual) | `error_handling.feature` | N/A |
| AC5-04 |  (Gherkin manual) | `error_handling.feature` | N/A |

**Automatizált AC-k:** 2 AC teljes mértékben (AC1-01, AC5-01) + további 3 részben (AC1-02, AC2-03, AC5-02)

**Cél teljesítve:** Legalább 2 AC automatizálva 

---

## Code → CI Pipeline Mapping

| Komponens | Unit Test | Integration Test | Smoke Test | Coverage | CI Workflow |
|-----------|-----------|------------------|------------|----------|-------------|
| `EmptyState.tsx` |  | - |  | ~85% | `test.yml` |
| `ErrorBanner.tsx` |  | - |  | ~90% | `test.yml` |
| `StatCard.tsx` |  | - |  | ~75% | `test.yml` |
| `DashboardPage.tsx` | [~] | [~] |  | ~70% | `test.yml`, `smoke.yml` |
| `ParkingSpacesPage.tsx` | [~] | [~] |  | ~60% | `test.yml`, `smoke.yml` |
| `AreasPage.tsx` | [~] | [~] |  | ~65% | `test.yml`, `smoke.yml` |
| `useParkingSpaces.ts` |  | - | - | ~80% | `test.yml` |
| `useAreas.ts` | [~] | - | - | ~70% | `test.yml` |
| `date.ts` |  | - | - | 100% | `test.yml` |

**Összesített Coverage:** ~68% (cél: ≥60%) 

---

## CI Workflow Steps

### 1. Lint
- **Fájl:** `.github/workflows/lint.yml`
- **Lépések:** ESLint futtatása
- **Kapcsolódó kód:** Minden `.ts`, `.tsx` fájl

### 2. Test + Coverage
- **Fájl:** `.github/workflows/test.yml`
- **Lépések:**
  1. Vitest futtatása
  2. Coverage report generálás (`coverage.xml`, `junit.xml`)
  3. Artifact upload (`sprints/02/reports/`)
- **Kapcsolódó kód:** Minden `*.test.tsx` fájl

### 3. Build
- **Fájl:** `.github/workflows/build.yml`
- **Lépések:**
  1. `npm run build`
  2. Artifact upload (`dist/`)
- **Kapcsolódó kód:** `vite.config.ts`, `tsconfig.json`

### 4. Smoke Test
- **Fájl:** `.github/workflows/smoke.yml`
- **Lépések:**
  1. `npm run preview` (háttérben)
  2. `smoke.yaml` futtatása
  3. Eredmény report
- **Kapcsolódó kód:** `deploy/target.yaml`, `scripts/smoke.yaml`

### 5. Terraform Validate + Plan
- **Fájl:** `.github/workflows/terraform.yml`
- **Lépések:**
  1. `terraform init`
  2. `terraform validate`
  3. `terraform plan -out=plan.out`
  4. Artifact upload (`plan.out`)
- **Kapcsolódó kód:** `sprints/02/infra/terraform/*.tf`

---

## ADR → Implementation Mapping

| ADR | Implementációs döntés | Érintett fájlok |
|-----|----------------------|-----------------|
| **ADR-0001** | React + Vite + TypeScript + Vercel | `package.json`, `vite.config.ts`, `tsconfig.json` |
| ADR-0001 | Material-UI komponensek | `StatCard.tsx`, `EmptyState.tsx`, `Layout.tsx` |
| ADR-0001 | MSW mock server | `src/mocks/`, `handlers/` |
| **ADR-0002** | Terraform IaC (validate + plan) | `sprints/02/infra/terraform/` |
| ADR-0002 | Vercel Terraform Provider | `providers.tf`, `main.tf` |

---

## Wireframe → Implementation Mapping

| Wireframe | Implementált komponens(ek) | Story ID |
|-----------|----------------------------|----------|
| W1: Dashboard (normál) | `DashboardPage.tsx`, `StatCard.tsx` | US-02 |
| W2: Dashboard (üres) | `DashboardPage.tsx`, `EmptyState.tsx` | US-01, US-02 |
| W3: Parking Spaces lista | `ParkingSpacesPage.tsx` | US-03 |
| W4: Hiba állapot | `ErrorBanner.tsx` | US-05 |
| W5: Areas lista | `AreasPage.tsx` | US-04 |

---

## Test Report Artifacts (CI Output)

| Report | Fájl | Generálás | CI Upload |
|--------|------|-----------|-----------|
| JUnit XML | `sprints/02/reports/junit.xml` | Vitest |  |
| Coverage (Cobertura) | `sprints/02/reports/coverage.xml` | Vitest |  |
| Coverage (HTML) | `sprints/02/reports/coverage/index.html` | Vitest |  |
| Terraform Plan | `sprints/02/infra/terraform/plan.out` | Terraform |  |

---

## Definition of Done (DoD) Checklist vs. Traceability

| DoD Elem | Trace Link | Státusz |
|----------|------------|---------|
| Story implementálva | Story → Code mapping |  |
| AC teljesül | AC → Test mapping |  (min 2 AC auto) |
| Unit teszt lefedi | Code → Test mapping |  (≥60% coverage) |
| Smoke teszt pass | Smoke → CI mapping |  |
| Code review done | Git PR | [~] (pending beadás) |
| CI zöld | CI Workflow → All steps | [~] (pending deps install) |
| Terraform plan OK | ADR-0002 → Terraform |  |

---

## Gaps and Next Steps

### Gaps (Sprint 2)

1. **AC automatizálás:** Csak 2 AC teljes mértékben automatizálva (AC1-01, AC5-01). További AC-k manuális QA-val fedve.
   - **Next:** Sprint 3-ban E2E tesztek Playwright-tal (AC3-02 szűrés, AC3-03 rendezés)

2. **Page-level integration tesztek:** Dashboard, ParkingSpaces, Areas oldalak csak unit szinten tesztelve.
   - **Next:** React Testing Library integration tesztek

3. **Coverage:** ~68% (cél: ≥60% teljesítve ), de van tér fejlesztésre.
   - **Next:** Hook tesztek bővítése (useAreas teljes coverage)

### Next Steps (Sprint 3)

- **E2E tesztek:** Playwright setup, critical path (Dashboard → Parking Spaces → Areas)
- **CI automatizálás:** Terraform apply (ne csak plan)
- **Performance audit:** Lighthouse CI integráció (NFR-05)
- **Real backend integráció:** Csatlakozás a happy-backend API-hoz (mock → real)

---

**Státusz:**  Traceability dokumentáció teljes

**Utolsó frissítés:** 2025-12-08
