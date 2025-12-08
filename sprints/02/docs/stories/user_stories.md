# User Stories - Sprint 2 MVP

**Projekt:** ParkVision Frontend MVP
**Sprint:** 2
**Verzió:** 1.0
**Dátum:** 2025-12-08

---

## INVEST Ellenőrzés

Minden story megfelel az INVEST kritériumoknak:
- **I**ndependent: Egymástól függetlenül implementálhatók
- **N**egotiable: Részletek implementáció során finomíthatók
- **V**aluable: Mindegyik önálló értéket ad a felhasználónak
- **E**stimable: Méretük becsülhető
- **S**mall: 1-3 nap alatt megvalósítható
- **T**estable: Automatizáltan tesztelhetők

---

## US-01: Üres állapot megjelenítése

### Story

**Mint** facility manager,
**azt szeretném**, hogy amikor még nincs adat a rendszerben, egy informatív üres állapot jelenjen meg,
**hogy** tudjam, nincs hiba, csak még nem történt adatbevitel.

### Business Value

- Csökkenti a felhasználói frusztrációt (nem tűnik hibának az üres lista)
- Iránymutatást ad a következő lépéshez (CTA gomb)
- Javítja az első felhasználói élményt (onboarding)

### Acceptance Criteria

#### AC1-01: Üres parkolóhely lista

**Given** a backend mock üres listát ad vissza (`[]`)
**When** a felhasználó megnyitja a „Parking Spaces" nézetet
**Then** egy üres állapot grafika (ikon vagy illusztráció) jelenik meg
**And** megjelenik a szöveg: „Nincs még parkolóhely a rendszerben"
**And** megjelenik egy „Parkolóhely hozzáadása" gomb (jelenleg disabled, placeholder)
**And** NEM jelenik meg error message

#### AC1-02: Üres területek lista

**Given** a backend mock üres területlistát ad vissza
**When** a felhasználó megnyitja az „Areas" nézetet
**Then** egy üres állapot üzenet jelenik meg: „Még nincs parkolási terület definiálva"
**And** egy „Terület létrehozása" CTA gomb megjelenik

#### AC1-03: Üres állapotból való kilépés

**Given** a felhasználó az üres állapot nézetben van
**When** mock adatok betöltődnek (pl. oldal frissítés után)
**Then** az üres állapot eltűnik
**And** a táblázat/lista megjelenik az adatokkal

### Technical Notes

- Komponens: `EmptyState.tsx`
- Mock scenario: `msw/handlers.ts` - empty array response
- Test: `EmptyState.test.tsx`

### DoD Checklist

- [x] Komponens implementálva
- [x] Unit teszt lefedi az AC-ket
- [x] Reszponzív (mobil + desktop)
- [x] Accessibility: ARIA labels, keyboard navigálható
- [x] Code review: passed
- [x] Merged to main

---

## US-02: Dashboard foglaltsági áttekintés

### Story

**Mint** facility manager,
**azt szeretném**, hogy a dashboard-on összesített statisztikákat lássak a parkolóhelyek foglaltságáról,
**hogy** gyorsan átlássam a jelenlegi helyzetet anélkül, hogy részletes listákat kellene böngésznem.

### Business Value

- Gyors döntéshozatal (egy pillantással látható a kapacitás)
- Operatív hatékonyság (nem kell végiggörgetni a listát)
- Adatalapú menedzsment (% kihasználtság)

### Acceptance Criteria

#### AC2-01: Statisztikai kártyák megjelenése

**Given** a mock backend 100 parkolóhelyet ad vissza (60 foglalt, 40 szabad)
**When** a felhasználó megnyitja a Dashboard nézetet
**Then** 4 statisztikai kártya jelenik meg:
1. „Összes hely": 100
2. „Foglalt": 60
3. „Szabad": 40
4. „Foglaltság": 60%

**And** minden kártya külön színkóddal jelenik meg (pl. szabad = zöld, foglalt = piros)

#### AC2-02: Valós idejű frissítés (mock)

**Given** a felhasználó a Dashboard nézetben van
**When** a mock adat megváltozik (pl. 70 foglalt lesz)
**Then** a statisztikák automatikusan frissülnek
**And** az animáció smooth (nem villog)

#### AC2-03: Nulla parkolóhely edge case

**Given** a backend 0 parkolóhelyet ad vissza
**When** a Dashboard betöltődik
**Then** az „Összes hely" kártya: 0
**And** megjelenik egy info banner: „Még nincs parkolóhely a rendszerben"
**And** a foglaltság: 0%

### Technical Notes

- Komponens: `Dashboard.tsx`, `StatCard.tsx`
- Mock data: `msw/handlers/parkingSpaces.ts`
- State: Zustand store vagy TanStack Query cache
- Test: `Dashboard.test.tsx`, snapshot + számítások

### DoD Checklist

- [x] Dashboard layout implementálva
- [x] StatCard komponens reszponzív
- [x] Unit tesztek minden AC-hez
- [x] Coverage ≥ 70% a Dashboard komponensre
- [x] Edge case (0 hely) tesztelve

---

## US-03: Parkolóhely lista megjelenítése

### Story

**Mint** facility manager,
**azt szeretném**, hogy egy táblázatban lássam az összes parkolóhelyet (ID, státusz, terület, frissítés ideje),
**hogy** részletesen nyomon kövessem az egyes helyek állapotát és szükség esetén szűrhessek.

### Business Value

- Operatív átláthatóság (minden hely látható egy helyen)
- Szűrési képesség (pl. csak foglalt helyek)
- Hibadetektálás (régóta foglalt helyek azonosítása)

### Acceptance Criteria

#### AC3-01: Táblázat alapvető megjelenítése

**Given** a mock backend 20 parkolóhelyet ad vissza
**When** a felhasználó megnyitja a „Parking Spaces" nézetet
**Then** egy táblázat jelenik meg 20 sorral
**And** minden sor tartalmazza:
- ID (pl. „PS-001")
- Státusz (badge: „Occupied" piros, „Free" zöld)
- Terület neve (pl. „Zone A")
- Frissítve (timestamp, pl. „2 perccel ezelőtt")

#### AC3-02: Státusz szerinti szűrés

**Given** a táblázat 10 foglalt és 10 szabad helyet tartalmaz
**When** a felhasználó kiválasztja a „Csak foglalt" szűrőt
**Then** csak a 10 foglalt hely jelenik meg
**And** a táblázat fejlécében látszik: „10 találat"

#### AC3-03: Rendezés oszlopok szerint

**Given** a táblázat betöltött
**When** a felhasználó a „Frissítve" oszlop fejlécére kattint
**Then** a táblázat időrendben rendeződik (legfrissebb először)
**And** a fejlécben megjelenik a rendezés iránya (↑ vagy ↓)

#### AC3-04: Pagination (lapozás)

**Given** a mock backend 50 parkolóhelyet ad vissza
**When** a táblázat betöltődik
**Then** csak az első 10 sor jelenik meg
**And** megjelenik a pagination kontroll (1, 2, 3, 4, 5 oldalak)
**And** a „Következő" gomb működik

### Technical Notes

- Komponens: `ParkingSpaceList.tsx`, `ParkingSpaceTable.tsx`
- Library: TanStack Table v8
- Mock: `msw/handlers/parkingSpaces.ts` - 50 darab mock space
- Test: szűrés, rendezés, pagination külön tesztek

### DoD Checklist

- [x] Táblázat komponens implementálva
- [x] TanStack Table integráció
- [x] Szűrő és rendezés működik
- [x] Pagination működik
- [x] Unit + integration tesztek
- [x] Responsive breakpoints (mobil táblázat egyszerűsített)

---

## US-04: Terület (Area) lista nézet

### Story

**Mint** facility manager,
**azt szeretném**, hogy egy külön nézetben lássam a parkolási területeket (zones),
**hogy** áttekintést kapjak az egyes zónák kapacitásáról és állapotáról.

### Business Value

- Strukturált parkolókezelés (zónák szerinti felosztás)
- Kapacitástervezés (melyik zóna megtelt)
- Operatív döntéshozatal (hova irányítsuk a járműveket)

### Acceptance Criteria

#### AC4-01: Területek lista megjelenítése

**Given** a mock backend 5 területet ad vissza (pl. „Zone A", „Zone B"...)
**When** a felhasználó megnyitja az „Areas" nézetet
**Then** 5 területkártya jelenik meg listában
**And** minden kártya tartalmazza:
- Terület neve (pl. „Zone A - Ground Floor")
- Kapacitás (pl. „20 hely")
- Foglaltság (pl. „15/20" és progressbar 75%)
- Státusz badge (pl. „Active" zöld)

#### AC4-02: Foglaltsági progressbar

**Given** egy terület 80%-ban foglalt (16/20)
**When** a kártya renderelődik
**Then** a progressbar 80%-on áll
**And** a szín jelzi a foglaltságot:
- 0-50%: zöld
- 51-80%: sárga
- 81-100%: piros

#### AC4-03: Terület részletek modal (egyszerűsített)

**Given** a felhasználó egy területkártyára kattint
**When** a kattintás megtörténik
**Then** megnyílik egy modal
**And** a modalban látható:
- Terület neve, leírása
- Kapacitás részletei
- „Bezárás" gomb

(Ebben a sprintben csak read-only, nincs szerkesztés)

### Technical Notes

- Komponens: `AreaList.tsx`, `AreaCard.tsx`, `AreaDetailModal.tsx`
- Mock: `msw/handlers/areas.ts` - 5 area
- Progressbar: Material-UI LinearProgress
- Modal: MUI Dialog

### DoD Checklist

- [x] AreaList komponens implementálva
- [x] AreaCard reszponzív
- [x] Progressbar színezés helyes
- [x] Modal megnyílik/bezárul
- [x] Unit tesztek minden AC-hez

---

## US-05: Hiba állapot kezelése

### Story

**Mint** facility manager,
**azt szeretném**, hogy amikor az API hiba történik, érthető hibaüzenetet lássak és újra tudjam próbálni a lekérést,
**hogy** ne maradjak tanácstalanul egy elakadt képernyővel.

### Business Value

- Jobb felhasználói élmény (nem tűnik „halottnak" az app)
- Átláthatóság (tudja a user, hogy mi a probléma)
- Önkiszolgáló hibaelhárítás (retry gomb)

### Acceptance Criteria

#### AC5-01: API hiba esetén error banner

**Given** a mock backend 500 Internal Server Error-t ad vissza
**When** a felhasználó megpróbál parkolóhely adatokat lekérni
**Then** egy piros error banner jelenik meg az oldal tetején
**And** a banner szövege: „Hiba történt az adatok lekérésekor. Kérjük, próbálja újra."
**And** megjelenik egy „Újrapróbálás" gomb

#### AC5-02: Retry (újrapróbálás) működése

**Given** a felhasználó látja az error bannert
**When** rákattint az „Újrapróbálás" gombra
**Then** újra lekérésre kerül az API
**And** a banner eltűnik, ha az újrapróbálás sikeres
**And** ha ismét hiba van, a banner megmarad

#### AC5-03: Network timeout kezelése

**Given** a mock backend 10 másodpercig nem válaszol
**When** a timeout lejár
**Then** error banner jelenik meg: „Az adatok lekérése túl sokáig tartott."
**And** „Újrapróbálás" gomb elérhető

#### AC5-04: Részleges hiba (pl. csak egy endpoint hibázik)

**Given** a parkolóhelyek API működik, de az areas API hibázik
**When** a Dashboard betöltődik
**Then** a parkolóhely statisztikák megjelennek
**And** az areas widget helyén error üzenet: „Nem sikerült betölteni a területeket"
**And** a többi funkció továbbra is használható

### Technical Notes

- Komponens: `ErrorBanner.tsx`, `ErrorBoundary.tsx` (React Error Boundary)
- Error handling: TanStack Query `onError`, `isError` state
- Mock: `msw/handlers` - error scenario (500, timeout)
- Test: error state snapshot, retry action

### DoD Checklist

- [x] ErrorBanner komponens implementálva
- [x] Retry gomb működik
- [x] Timeout kezelés
- [x] Részleges hiba (fallback UI)
- [x] Unit tesztek minden hibaesetre
- [x] Accessibility: error üzenet screen readerrel is hallható

---

## Story Priority és Implementációs Sorrend

| Priority | Story ID | Reason |
|----------|----------|--------|
| P0 (Must have) | US-05 | Hiba kezelés kritikus (blokkoló hibák kezelése) |
| P0 (Must have) | US-01 | Üres állapot első élmény része |
| P0 (Must have) | US-02 | Dashboard a fő landing page |
| P0 (Must have) | US-03 | Parkolóhely lista az MVP core funkció |
| P1 (Should have) | US-04 | Területek nézet hasznos, de nem kritikus MVP-hez |

---

## Automated Testing Coverage

| Story | Test típus | Min. coverage |
|-------|-----------|---------------|
| US-01 | Unit + Visual Regression | 80% |
| US-02 | Unit + Integration | 70% |
| US-03 | Integration + E2E (egyszerű) | 65% |
| US-04 | Unit | 60% |
| US-05 | Unit + Error Scenario | 75% |

**Összesített cél:** ≥ 60% line coverage az egész projektre.

---

## Gherkin Feature Fájlok

A kritikus AC-k (US-01/AC1-01, US-05/AC5-01) automatizált Gherkin tesztekkel is le vannak fedve:

- `tests/acceptance/empty_state.feature` (US-01)
- `tests/acceptance/error_handling.feature` (US-05)

---

## Traceability

| Story | Spec v0.2 Section | ADR | Test File |
|-------|-------------------|-----|-----------|
| US-01 | Section 3.1 | - | `EmptyState.test.tsx` |
| US-02 | Section 3.1 | ADR-0001 | `Dashboard.test.tsx` |
| US-03 | Section 3.1 | ADR-0001 | `ParkingSpaceList.test.tsx` |
| US-04 | Section 3.1 | - | `AreaList.test.tsx` |
| US-05 | Section 3.1 | ADR-0002 | `ErrorBanner.test.tsx` |

---

**Jóváhagyás:**
- [ ] Product Owner
- [ ] Scrum Master
- [ ] Dev Team

**Changelog:**
- 2025-12-08: v1.0 - Sprint 2 user stories létrehozva
