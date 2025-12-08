# Definition of Ready (DoR) & Definition of Done (DoD)

**Projekt:** ParkVision Frontend MVP
**Sprint:** 2
**Verzió:** 1.0
**Dátum:** 2025-12-08

---

## Definition of Ready (DoR)

A **Definition of Ready** biztosítja, hogy egy User Story készen áll a fejlesztésre (sprint planningben bevehető).

### DoR Checklist

Egy story akkor **Ready**, ha az alábbi kritériumok **mind** teljesülnek:

- [ ] **Story megfogalmazva** a következő formában: "Mint [szerepkör], azt szeretném [funkció], hogy [üzleti érték]"
- [ ] **Acceptance Criteria (AC) definiálva** Given-When-Then formátumban (min. 1 AC)
- [ ] **Business Value** (üzleti érték) egyértelmű és mérható
- [ ] **Függőségek** azonosítva (más story-k, API-k, komponensek)
- [ ] **Wireframe/mockup** elérhető (ha UI változás van)
- [ ] **Technikai spike** elvégezve (ha ismeretlen technológia van)
- [ ] **Becslés** megtörtént (story points vagy időbecslés)
- [ ] **Prioritás** meghatározva (P0-P3)
- [ ] **Test stratégia** meghatározva (unit/integration/E2E)

### DoR Példa: US-02 (Dashboard foglaltsági áttekintés)

 **Story:** "Mint facility manager, azt szeretném, hogy a dashboard-on összesített statisztikákat lássak..."
 **AC:** AC2-01, AC2-02, AC2-03 (Given-When-Then formátumban)
 **Business Value:** Gyors döntéshozatal, operatív hatékonyság
 **Függőségek:** useParkingSpaces hook, StatCard komponens
 **Wireframe:** W1 (Dashboard normál állapot)
 **Becslés:** 2 story point
 **Prioritás:** P0 (Must have)
 **Test:** Unit teszt (StatCard), Integration teszt (DashboardPage)

**Státusz:**  Ready for Development

---

## Definition of Done (DoD)

A **Definition of Done** biztosítja, hogy egy User Story **kész** és **shippable** (bevezethető production-be).

### DoD Checklist - Code Level

- [ ] **Kód implementálva** a story AC-k alapján
- [ ] **Unit tesztek írva** és pass (ahol releváns)
- [ ] **Integration tesztek írva** és pass (ahol releváns)
- [ ] **Code coverage ≥ 60%** (komponens szinten)
- [ ] **Lint hibák: 0** (`npm run lint` pass)
- [ ] **TypeScript hibák: 0** (`tsc --noEmit` pass)
- [ ] **Build sikeres** (`npm run build` pass)
- [ ] **Kód review** legalább 1 csapattag által jóváhagyva
- [ ] **Merge to main** conflict nélkül

### DoD Checklist - Testing Level

- [ ] **AC-k teljesülnek** (manuális vagy automatikus tesztek)
- [ ] **Smoke teszt pass** (fő flow működik)
- [ ] **Hiba állapot tesztelve** (API error, network timeout, stb.)
- [ ] **Üres állapot tesztelve** (nincs adat scenario)
- [ ] **Reszponzivitás ellenőrizve** (mobil + desktop)
- [ ] **Accessibility ellenőrizve** (ARIA labels, keyboard nav)

### DoD Checklist - Documentation Level

- [ ] **README.md frissítve** (ha szükséges)
- [ ] **ADR dokumentálva** (ha architekturális döntés van)
- [ ] **API dokumentáció** frissítve (ha API változás van)
- [ ] **Traceability matrix** frissítve (Story → AC → Test → Code)
- [ ] **Known issues** dokumentálva (ha van)

### DoD Checklist - CI/CD Level

- [ ] **CI pipeline zöld** (minden workflow pass)
  - Lint 
  - Test 
  - Build 
  - Coverage ≥ 60% 
  - Smoke 
- [ ] **Terraform validate + plan** sikeres (IaC)
- [ ] **Deploy preview** elérhető (Vercel preview URL)
- [ ] **Performance audit** pass (Lighthouse score ≥ 85, ha releváns)

---

## DoD Példa: US-01 (Üres állapot megjelenítése)

### Code Level

 **Implementálva:** `EmptyState.tsx` komponens
 **Unit teszt:** `EmptyState.test.tsx` (4 test case, pass)
 **Coverage:** 85% (EmptyState komponens)
 **Lint:** 0 hiba
 **TypeScript:** 0 hiba
 **Build:** Sikeres
 **Code review:** Jóváhagyva (mock PR review)
 **Merge:** main ágra

### Testing Level

 **AC1-01 teljesül:** Üres parkolóhely lista renderel
 **AC1-02 teljesül:** Üres területek lista renderel
 **AC1-03 teljesül:** Üres állapotból kilépés működik
 **Smoke:** `smoke.yaml` pass (üres állapot látható)
 **Hiba állapot:** Nem releváns (üres állapot nem hiba)
 **Reszponzivitás:** Mobil + desktop rendben
 **Accessibility:** `role="status"`, `aria-label` rendben

### Documentation Level

 **README.md:** Nem szükséges frissítés
 **ADR:** Nem szükséges (nincs új architekturális döntés)
 **Traceability:** Frissítve (US-01 → AC1-01/02/03 → Test → Code)
 **Known issues:** Nincs

### CI/CD Level

 **CI pipeline:** Minden workflow zöld
 **Terraform:** Nem releváns (frontend komponens)
 **Deploy preview:** Elérhető Vercel-en
 **Performance:** Nem releváns (statikus komponens)

**Státusz:**  Done - Shippable

---

## Sprint 2 Specific DoD (Kiegészítések)

A Sprint 2 MVP-hez **extra követelmények**:

### Deliverable-specific DoD

1. **Spec v0.2**
   - [ ] Cél, Scope (In/Out), User Story térkép, NFR-ek (3-5), fő AC-k dokumentálva
   - [ ] Markdown lint pass

2. **User Story + AC**
   - [ ] Min. 5 story, INVEST ellenőrzés
   - [ ] Min. 2 AC automatizálva
   - [ ] Gherkin feature fájlok (min. 2 kritikus AC-hoz)

3. **ADR**
   - [ ] Min. 2 ADR (platform + IaC)
   - [ ] Alternatívák, következmények dokumentálva

4. **Wireframe**
   - [ ] Min. 3 kép (normál, üres, hiba)
   - [ ] README.md wireframe leírással

5. **Tesztek + Coverage**
   - [ ] ≥5 teszt, 0 fail/error
   - [ ] Coverage ≥60% (line coverage)
   - [ ] `reports/junit.xml` és `coverage.xml` generálva

6. **Smoke + Preview**
   - [ ] `deploy/target.yaml` konfigurálva
   - [ ] `scripts/smoke.yaml` vagy `.http` elérhető
   - [ ] Legalább 1 élő ellenőrzés (/ → 200 OK)

7. **IaC/Terraform**
   - [ ] `terraform validate` pass
   - [ ] `terraform plan` pass
   - [ ] `plan.out` artifact elérhető

8. **Traceability + DoR/DoD**
   - [ ] `docs/traceability.md` kitöltve (Story → AC → Test → Code → CI lánc)
   - [ ] `docs/process/dor_dod.md` létrehozva

9. **AI-napló**
   - [ ] `ai/ai_log.jsonl` min. 3 bejegyzés (eszköz, döntés, tanulság)

10. **PR + CI**
    - [ ] PR leírás kitöltve (összefoglaló, linkek, screenshot)
    - [ ] Minden CI workflow zöld
    - [ ] Known issues dokumentálva

---

## Példa: Sprint 2 PR DoD Checklist

Amikor a PR-t nyitod a Sprint 2 beadásához:

### PR Description Template

```markdown
## Sprint 2 - MVP Vertikális Szelet

### Összefoglaló
- Implementált 5 user story (US-01 - US-05)
- Dashboard, Parking Spaces, Areas nézetek
- Üres + hiba állapot kezelés
- Mock adatok MSW-vel

### Deliverables Checklist
- [x] Spec v0.2
- [x] User Stories (5 db) + AC
- [x] ADR (2 db)
- [x] Wireframes (5 leírás)
- [x] Tesztek (6 test file, 68% coverage)
- [x] Smoke teszt
- [x] Terraform (validate + plan)
- [x] Traceability + DoR/DoD
- [x] AI-napló (3 bejegyzés)

### Linkek
- Spec v0.2: `sprints/02/docs/spec/product_spec_v0.2.md`
- User Stories: `sprints/02/docs/stories/user_stories.md`
- Coverage report: `sprints/02/reports/coverage/index.html`
- Terraform plan: `sprints/02/infra/terraform/plan.out`

### Screenshot
![Dashboard](./screenshot-dashboard.png)

### Known Issues
- Pagination nem implementálva (manual fallback: csak első 20 sor)
- Rendezés oszlopok szerint: csak Frissítve oszlop

### Next Steps (Sprint 3)
- E2E tesztek Playwright-tal
- Backend integráció (mock → real API)
- Pagination + rendezés teljes implementáció
```

**Checklist a PR jóváhagyásához:**

- [ ] PR description kitöltve
- [ ] Screenshot vagy GIF csatolva
- [ ] Minden CI workflow zöld
- [ ] Coverage ≥ 60%
- [ ] Terraform validate + plan pass
- [ ] Known issues listázva
- [ ] Code review jóváhagyás (ha csapat van)

---

## DoD vs. Részleges Done ("Done-ish")

[!] **Részleges Done NEM elfogadható beadásra!**

| Elem | Done  | Done-ish  (nem elfogadható) |
|------|--------|-------------------------------|
| Tesztek | ≥5 teszt, pass, coverage ≥60% | "Van pár teszt, de nem fut mindegyik" |
| CI | Minden workflow zöld | "Csak a lint fut, többi pending" |
| Dokumentáció | Spec, Stories, ADR, Trace teljes | "A Spec van, de a Stories hiányos" |
| Terraform | Validate + plan sikeres | "Plan.out nincs generálva" |
| Smoke | Legalább 1 élő teszt pass | "Smoke yaml van, de nem futtatható" |

**Összefoglalás:** Ha 1 DoD elem is hiányzik, a story **nem Done** → vissza backlog-ba vagy Sprint 3-ba.

---

## Changelog

- 2025-12-08: v1.0 - DoR/DoD létrehozva Sprint 2-höz

---

**Státusz:**  DoR/DoD dokumentáció teljes

**Következő akció:** Alkalmazzuk a DoD-t a Sprint 2 beadásra!
