# ParkVision Frontend MVP - Product Specification v0.2

**Verzió:** 0.2
**Dátum:** 2025-12-08
**Sprint:** 2
**Státusz:** Draft

---

## 1. Cél és Fókusz

Az MVP vertikális szelet célja egy működő frontend alkalmazás létrehozása, amely demonstrálja a ParkVision parkolóhely-kezelő rendszer alapvető funkcionalitását. A szelet lehetővé teszi a facility managerek számára, hogy valós időben (mock adatokkal) láthassák a parkolóhelyek foglaltságát, kezeljék a parkolási területeket, és áttekintést kapjanak a rendszer állapotáról.

**Miért kell ez a szelet?**
- Bizonyítja a koncepció életképességét befektetők és potenciális ügyfelek számára
- Validálja a felhasználói interfész használhatóságát
- Alapot teremt a későbbi backend integrációhoz
- Lehetővé teszi a korai felhasználói visszajelzéseket

---

## 2. Scope (In/Out)

### 2.1 IN Scope - Mit csinálunk most

- **Dashboard nézet:** Parkolóhelyek összesített foglaltsági statisztikái
- **Parkolóhely lista:** Összes parkolóhely megjelenítése szűrhető táblázatban
- **Terület (Area) kezelés:** Parkolási területek (zones) listázása és alapvető kezelése
- **Üres állapot kezelés:** Amikor nincs adat, informatív üzenet megjelenítése
- **Hiba állapot kezelés:** API hibák esetén hibaüzenet és újrapróbálkozási lehetőség
- **Mock adatok:** MSW (Mock Service Worker) használata szimulált backend-hez
- **Reszponzív UI:** Material-UI alapú, modern, mobilbarát felület
- **Automatizált tesztek:** Unit és komponens tesztek min. 60% lefedettséggel

### 2.2 OUT of Scope - Mit NEM csinálunk most

- Valódi backend integráció (csak mock)
- Autentikáció/autorizáció (később)
- Navigáció szabad helyekhez (későbbi sprint)
- Push értesítések
- Térképes vizualizáció
- Rendszámfelismerés adatok megjelenítése
- Export funkciók (CSV, PDF)
- Többnyelvűség

---

## 3. User Story Térkép

### 3.1 Fő Stories (Priority Order)

| ID | Story Title | Priority | Acceptance Criteria |
|----|-------------|----------|-------------------|
| **US-01** | Üres állapot megjelenítése | P0 | Amikor nincs adat, üres állapot ikon és CTA gomb jelenik meg |
| **US-02** | Dashboard foglaltsági áttekintés | P0 | Összesített statisztikák: összes hely, foglalt, szabad, % |
| **US-03** | Parkolóhely lista megjelenítése | P0 | Táblázat minden parkolóhellyel (ID, státusz, terület, időbélyeg) |
| **US-04** | Terület (Area) lista nézet | P1 | Területek listázása névvel, kapacitással, státusszal |
| **US-05** | Hiba állapot kezelése | P0 | API hiba esetén error banner és "Retry" gomb |

### 3.2 Vertikális Flow

**Főbb felhasználói útvonal:**
1. Alkalmazás betöltése → Dashboard nézet
2. Dashboard: foglaltsági statisztikák megjelennek (mock adatokból)
3. Navigáció parkolóhely listához
4. Parkolóhely lista táblázatban (szűrhető státusz szerint)
5. Navigáció területek nézethez
6. Területek listája (névvel, kapacitással)

**Mellékágak:**
- Üres állapot (nincs adat): informatív üzenet + CTA
- Hiba állapot (API fail): hibaüzenet + újrapróbálás

---

## 4. Non-Functional Requirements (NFR)

| NFR ID | Követelmény | Mérhető Cél | Ellenőrzés |
|--------|-------------|-------------|-----------|
| **NFR-01** | Oldalbetöltési idő | TTFB < 1.5s (preview környezetben) | Lighthouse audit |
| **NFR-02** | Smoke teszt sikeresség | ≥ 95% pass rate | `scripts/smoke.yaml` |
| **NFR-03** | Test coverage | ≥ 60% line coverage | `reports/coverage.xml` |
| **NFR-04** | Build időtartam | < 2 perc (CI) | GitHub Actions |
| **NFR-05** | Akadálymentesség | Lighthouse Accessibility score ≥ 85 | Lighthouse audit |

---

## 5. Fő Acceptance Criteria (Given-When-Then)

### AC-01: Üres állapot megjelenítése (US-01)

**Given** a backend mock nem ad vissza parkolóhely adatokat
**When** a felhasználó megnyitja a parkolóhely lista nézetet
**Then** egy üres állapot ikon és „Nincs még parkolóhely" üzenet jelenik meg
**And** egy „Parkolóhely hozzáadása" CTA gomb látható

### AC-02: Dashboard statisztikák (US-02)

**Given** a mock backend 50 parkolóhelyet ad vissza (30 foglalt, 20 szabad)
**When** a felhasználó megnyitja a dashboard nézetet
**Then** az összesített statisztikák helyesen jelennek meg:
- Összes hely: 50
- Foglalt: 30
- Szabad: 20
- Foglaltság: 60%

### AC-03: API hiba kezelése (US-05)

**Given** a mock backend 500 Internal Server Error választ ad
**When** a felhasználó megpróbál adatokat lekérni
**Then** egy piros error banner jelenik meg „Hiba történt az adatok lekérésekor" üzenettel
**And** egy „Újrapróbálás" gomb elérhető
**And** a gomb kattintáskor újra kéri az adatokat

### AC-04: Parkolóhely lista táblázat (US-03)

**Given** a mock backend 10 parkolóhelyet ad vissza
**When** a felhasználó megnyitja a parkolóhely lista nézetet
**Then** egy táblázat jelenik meg 10 sorral
**And** minden sor tartalmazza: ID, Státusz (Occupied/Free), Terület neve, Frissítve időpontot
**And** a táblázat szűrhető státusz szerint

---

## 6. Technológiai Stack (MVP)

| Komponens | Választott Technológia | Indoklás |
|-----------|------------------------|----------|
| **Frontend Framework** | React 18.2 | Modern, jól támogatott, gyors fejlesztés |
| **Build Tool** | Vite 4.3 | Gyors HMR, modern ES build |
| **Nyelv** | TypeScript 5.0 | Type safety, jobb fejlesztői élmény |
| **UI Library** | Material-UI v5 | Enterprise-grade komponensek |
| **State Management** | Zustand 3.7 | Egyszerű, minimális boilerplate |
| **Data Fetching** | TanStack Query 4.29 | Deklaratív data fetching, cache kezelés |
| **Mock Server** | MSW 1.2 | Service Worker alapú mock API |
| **Testing** | Vitest + React Testing Library | Gyors, modern, Vite kompatibilis |
| **Hosting (planned)** | Vercel / Netlify | Zero-config, preview URLs, gyors deploy |

---

## 7. Sikerkritériumok

### 7.1 Funkcionális Sikeresség

-  Minden US-hez tartozó AC teljesül
-  Üres és hiba állapotok helyesen jelennek meg
-  Mock adatok helyesen betöltődnek és renderelődnek

### 7.2 Minőségi Sikeresség

-  Test coverage ≥ 60%
-  Smoke teszt pass
-  0 ESLint error
-  0 TypeScript error

### 7.3 Deployment Sikeresség

-  `npm run build` sikeres
-  `npm run preview` elindul és elérhető
-  `terraform validate` + `terraform plan` sikeres

---

## 8. Ismert Korlátok és Kockázatok

### 8.1 Korlátok

- **Nincs valódi backend:** Csak mock adatok, valós adatforrás hiányzik
- **Nincs perzisztencia:** Adatok nem mentődnek, csak in-memory
- **Egyszerűsített UI:** Komplex vizualizációk (térképek) nincsenek

### 8.2 Kockázatok

| Kockázat | Valószínűség | Hatás | Mitigáció |
|----------|--------------|-------|-----------|
| Mock adatok nem fedik le az összes edge case-t | Közepes | Közepes | Változatos mock scenariók készítése |
| UI komponens library frissítés breaking change | Alacsony | Magas | Dependency lock, changelog követés |
| Coverage threshold nehéz elérni | Alacsony | Közepes | Egyszerű komponensekkel indulás |

---

## 9. Következő Lépések (Sprint 3 Preview)

- Backend integráció (valódi API csatlakoztatás)
- Autentikáció és jogosultság-kezelés
- Térképes vizualizáció parkolóhelyekhez
- Real-time frissítések (WebSocket/SSE)
- Export funkciók (CSV, PDF riportok)

---

## 10. Referenciák

- Sprint 1 PRD: `sprints/01/prd.yaml`
- ADR-ek: `sprints/02/docs/adr/`
- User Stories részletes: `sprints/02/docs/stories/user_stories.md`
- Traceability: `sprints/02/docs/traceability.md`

---

**Jóváhagyás:**
- [ ] Product Owner
- [ ] Tech Lead
- [ ] Stakeholders

**Changelog:**
- 2025-12-08: v0.2 létrehozva (Sprint 2 MVP spec)
