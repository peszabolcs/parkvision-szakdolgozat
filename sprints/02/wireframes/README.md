# Wireframes - ParkVision Frontend MVP

**Sprint:** 2
**Verzió:** 1.0
**Dátum:** 2025-12-08
**Tool:** Figma / Excalidraw / Hand-drawn

---

## Összefoglaló

Ez a csomag 5 fő képernyő wireframe-jét tartalmazza, lefedve az MVP vertikális szelet fő flow-ját:
1. Dashboard (normál állapot)
2. Dashboard (üres állapot)
3. Parking Spaces Lista (normál + szűrés)
4. Parking Spaces (hiba állapot)
5. Areas Lista

**Állapot lefedettség:**
-  Normál (adatokkal)
-  Üres (nincs adat)
-  Hiba (API error)

---

## Wireframe 1: Dashboard - Normál Állapot

**Fájl:** `01-dashboard-normal.png`

### Cél

Facility manager megnyitja az appot és azonnal látja a parkolóhelyek összesített statisztikáit.

### Story/AC Referencia

- **US-02/AC2-01:** Statisztikai kártyák megjelenítése
- **Spec v0.2 Section 3.1:** Dashboard foglaltsági áttekintés

### Layout Leírás

```
┌─────────────────────────────────────────────────────────┐
│  [Logo] ParkVision          [User] [Notifications] [⚙]  │
├─────────────────────────────────────────────────────────┤
│  ┌─ Dashboard                                            │
│  │                                                        │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────┐│
│  │  │  ÖSSZES    │ │  FOGLALT   │ │   SZABAD   │ │FOGL.││
│  │  │            │ │            │ │            │ │     ││
│  │  │    100     │ │     60     │ │     40     │ │ 60% ││
│  │  │            │ │            │ │            │ │     ││
│  │  │ 🅿️ parking │ │  🔴 spaces │ │  🟢 free   │ │   ││
│  │  └────────────┘ └────────────┘ └────────────┘ └─────┘│
│  │                                                        │
│  │  📈 Foglaltsági trend (utolsó 7 nap)                  │
│  │  ┌──────────────────────────────────────────────────┐ │
│  │  │         [Chart: line graph placeholder]        │ │
│  │  └──────────────────────────────────────────────────┘ │
│  │                                                        │
│  │  🗺️ Gyors áttekintés területenként                    │
│  │  ┌────────────────────────────────────────────────┐   │
│  │  │ Zone A - Ground Floor     [████████░░] 80%    │   │
│  │  │ Zone B - Level 1          [██████░░░░] 60%    │   │
│  │  │ Zone C - Level 2          [████░░░░░░] 40%    │   │
│  │  └────────────────────────────────────────────────┘   │
│  │                                                        │
│  │  [Részletek megtekintése →]                           │
│  └────────────────────────────────────────────────────────│
│                                                           │
│  Sidebar:                                                 │
│   Dashboard (active)                                    │
│  🅿️ Parking Spaces                                        │
│  🗺️ Areas                                                 │
│  📄 Reports                                               │
└───────────────────────────────────────────────────────────┘
```

### Interakciók

- **Stat kártyák:** Csak olvasható (MVP-ben nincs kattintható akció)
- **Chart:** Placeholder (későbbi sprintben valódi chart)
- **Területlista:** Kattintható → Areas nézethez navigál
- **Sidebar:** Navigáció a fő nézetek között

### Állapotok

- **Normál:** Ahogy fent látható (60 foglalt, 40 szabad)
- **Üres:** Lásd Wireframe 2
- **Hiba:** Error banner az oldal tetején (lásd Wireframe 4 mintájára)

### Megjegyzések

- Material-UI Card komponensek
- Responsive: mobil nézetben a kártyák egymás alatt (1 oszlop)
- Színkódok: Foglalt = piros (#f44336), Szabad = zöld (#4caf50)

---

## Wireframe 2: Dashboard - Üres Állapot

**Fájl:** `02-dashboard-empty.png`

### Cél

Első megnyitáskor, amikor még nincs parkolóhely adat a rendszerben, az app informatív üres állapotot mutat.

### Story/AC Referencia

- **US-01/AC1-01:** Üres parkolóhely lista
- **US-02/AC2-03:** Nulla parkolóhely edge case

### Layout Leírás

```
┌─────────────────────────────────────────────────────────┐
│  [Logo] ParkVision          [User] [Notifications] [⚙]  │
├─────────────────────────────────────────────────────────┤
│  ┌─ Dashboard                                            │
│  │                                                        │
│  │  ℹ️  Info Banner:                                     │
│  │  ┌────────────────────────────────────────────────┐   │
│  │  │ Még nincs parkolóhely a rendszerben.           │   │
│  │  │ Kezdj hozzá az első hely létrehozásával!       │   │
│  │  └────────────────────────────────────────────────┘   │
│  │                                                        │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────┐│
│  │  │  ÖSSZES    │ │  FOGLALT   │ │   SZABAD   │ │FOGL.││
│  │  │     0      │ │      0     │ │      0     │ │  0% ││
│  │  └────────────┘ └────────────┘ └────────────┘ └─────┘│
│  │                                                        │
│  │           ┌─────────────────────────────┐             │
│  │           │                             │             │
│  │           │      🅿️  [Empty icon]      │             │
│  │           │                             │             │
│  │           │   Nincs még parkolóhely     │             │
│  │           │   a rendszerben             │             │
│  │           │                             │             │
│  │           │  [+ Parkolóhely hozzáadása] │  (disabled) │
│  │           │                             │             │
│  │           └─────────────────────────────┘             │
│  │                                                        │
│  └────────────────────────────────────────────────────────│
└───────────────────────────────────────────────────────────┘
```

### Interakciók

- **Info Banner:** Csak informatív, nincs dismiss gomb (MVP-ben)
- **Stat kártyák:** Mindegyik 0 értéket mutat
- **CTA gomb:** "Parkolóhely hozzáadása" - jelenleg disabled (placeholder, későbbi feature)

### Állapotok

- **Üres:** Ez a default állapot, ha backend `[]` ad vissza
- **Átmenet normálba:** Ha adatok betöltődnek, az üres ikon eltűnik, kártyák frissülnek

### Megjegyzések

- Empty state icon: Material-UI vagy custom SVG
- CTA gomb disabled state (outline style, szürke)

---

## Wireframe 3: Parking Spaces Lista - Normál + Szűrés

**Fájl:** `03-parking-spaces-list.png`

### Cél

Facility manager látja az összes parkolóhelyet táblázatban, szűrheti státusz szerint, rendezheti időrendben.

### Story/AC Referencia

- **US-03/AC3-01:** Táblázat alapvető megjelenítése
- **US-03/AC3-02:** Státusz szerinti szűrés
- **US-03/AC3-03:** Rendezés oszlopok szerint

### Layout Leírás

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] ParkVision              [User] [Notifications] [⚙]      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─ Parking Spaces                                               │
│  │                                                                │
│  │  🔍 Keresés: [_____________]  Szűrő: [Összes ▼] [Csak foglalt]│
│  │                                      [Csak szabad]             │
│  │                                                                │
│  │   20 találat (Összes: 20, Foglalt: 12, Szabad: 8)           │
│  │                                                                │
│  │  ┌────────────────────────────────────────────────────────┐   │
│  │  │ ID ↕     │ Státusz     │ Terület       │ Frissítve ↓ │   │
│  │  ├──────────┼─────────────┼───────────────┼─────────────┤   │
│  │  │ PS-001   │ 🔴 Occupied │ Zone A - G    │ 2 min ago   │   │
│  │  │ PS-002   │ 🟢 Free     │ Zone A - G    │ 5 min ago   │   │
│  │  │ PS-003   │ 🔴 Occupied │ Zone B - L1   │ 10 min ago  │   │
│  │  │ PS-004   │ 🟢 Free     │ Zone B - L1   │ 15 min ago  │   │
│  │  │ PS-005   │ 🔴 Occupied │ Zone C - L2   │ 20 min ago  │   │
│  │  │ ...      │ ...         │ ...           │ ...         │   │
│  │  │ PS-010   │ 🟢 Free     │ Zone C - L2   │ 1 hr ago    │   │
│  │  └────────────────────────────────────────────────────────┘   │
│  │                                                                │
│  │  [<Előző]  1 [2] 3 4 5  [Következő>]                          │
│  │                                                                │
│  └────────────────────────────────────────────────────────────────│
└─────────────────────────────────────────────────────────────────┘
```

### Interakciók

- **Keresés input:** Szöveg alapú szűrés (ID vagy Terület név)
- **Szűrő dropdown:** Összes / Csak foglalt / Csak szabad
- **Táblázat oszlop fejlécek:** Kattintható → rendezés (↑↓ ikon jelzi)
- **Pagination:** Oldalanként 10 sor, kattintható lapozás

### Állapotok

- **Normál:** 20 parkolóhely, 10/oldal
- **Szűrve:** Pl. "Csak foglalt" → 12 találat, 2 oldal
- **Üres szűrés:** Ha nincs találat → "Nincs megfelelő parkolóhely" üzenet
- **Hiba:** Lásd Wireframe 4

### Megjegyzések

- TanStack Table (React Table v8) integráció
- Responsive: mobil nézetben kártya layout (táblázat helyett)
- Badge komponens: Occupied (piros), Free (zöld)

---

## Wireframe 4: Parking Spaces - Hiba Állapot

**Fájl:** `04-parking-spaces-error.png`

### Cél

API hiba esetén (500, timeout, network error) a felhasználó látja a hibaüzenetet és újra tudja próbálni.

### Story/AC Referencia

- **US-05/AC5-01:** API hiba esetén error banner
- **US-05/AC5-02:** Retry működése

### Layout Leírás

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] ParkVision              [User] [Notifications] [⚙]      │
├─────────────────────────────────────────────────────────────────┤
│  [!]  Error Banner (piros háttér, fehér szöveg):                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Hiba történt az adatok lekérésekor.                   │   │
│  │    Kérjük, próbálja újra.                                │   │
│  │                                    [[~] Újrapróbálás]     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─ Parking Spaces                                               │
│  │                                                                │
│  │  🔍 Keresés: [_____________]  Szűrő: [Összes ▼]              │
│  │                                                                │
│  │           ┌─────────────────────────────┐                     │
│  │           │                             │                     │
│  │           │      [!]  [Error icon]       │                     │
│  │           │                             │                     │
│  │           │   Nem sikerült betölteni    │                     │
│  │           │   a parkolóhely adatokat    │                     │
│  │           │                             │                     │
│  │           │   [[~] Újrapróbálás]         │                     │
│  │           │                             │                     │
│  │           └─────────────────────────────┘                     │
│  │                                                                │
│  └────────────────────────────────────────────────────────────────│
└─────────────────────────────────────────────────────────────────┘
```

### Interakciók

- **Error Banner "Újrapróbálás" gomb:** Újra lekéri az API-t
- **Központi "Újrapróbálás" gomb:** Ugyanaz a funkció (kétszeres UX opció)
- **Banner dismiss:** MVP-ben nincs X gomb (auto-hide ha sikeres az újrapróbálás)

### Állapotok

- **Hiba (500):** "Hiba történt az adatok lekérésekor"
- **Timeout:** "Az adatok lekérése túl sokáig tartott"
- **Network offline:** "Nincs internetkapcsolat"

### Megjegyzések

- Material-UI Alert komponens (severity="error")
- ARIA: `role="alert"`, `aria-live="assertive"` (screen reader azonnal felolvassa)
- Retry gomb loading state (spinner ikon amíg újrapróbál)

---

## Wireframe 5: Areas Lista

**Fájl:** `05-areas-list.png`

### Cél

Facility manager látja a parkolási területeket (zones), mindegyik kapacitással és foglaltsági százalékkal.

### Story/AC Referencia

- **US-04/AC4-01:** Területek lista megjelenítése
- **US-04/AC4-02:** Foglaltsági progressbar

### Layout Leírás

```
┌─────────────────────────────────────────────────────────────────┐
│  [Logo] ParkVision              [User] [Notifications] [⚙]      │
├─────────────────────────────────────────────────────────────────┤
│  ┌─ Areas (Parkolási Területek)                                  │
│  │                                                                │
│  │   5 terület összesen                                        │
│  │                                                                │
│  │  ┌────────────────────────────────────────────────────────┐   │
│  │  │ 🗺️ Zone A - Ground Floor                   [Active]  │   │
│  │  │                                                        │   │
│  │  │ Kapacitás: 20 hely                                    │   │
│  │  │ Foglaltság: 16 / 20 (80%)                             │   │
│  │  │ [████████████████████░░░░░] 80%           🔴 (magas)  │   │
│  │  │                                                        │   │
│  │  │                                   [Részletek →]       │   │
│  │  └────────────────────────────────────────────────────────┘   │
│  │                                                                │
│  │  ┌────────────────────────────────────────────────────────┐   │
│  │  │ 🗺️ Zone B - Level 1                        [Active]  │   │
│  │  │                                                        │   │
│  │  │ Kapacitás: 25 hely                                    │   │
│  │  │ Foglaltság: 15 / 25 (60%)                             │   │
│  │  │ [██████████████░░░░░░░░░░] 60%            🟡 (közepes)│   │
│  │  │                                                        │   │
│  │  │                                   [Részletek →]       │   │
│  │  └────────────────────────────────────────────────────────┘   │
│  │                                                                │
│  │  ┌────────────────────────────────────────────────────────┐   │
│  │  │ 🗺️ Zone C - Level 2                        [Active]  │   │
│  │  │                                                        │   │
│  │  │ Kapacitás: 30 hely                                    │   │
│  │  │ Foglaltság: 10 / 30 (33%)                             │   │
│  │  │ [████████░░░░░░░░░░░░░░░░] 33%            🟢 (alacsony)│  │
│  │  │                                                        │   │
│  │  │                                   [Részletek →]       │   │
│  │  └────────────────────────────────────────────────────────┘   │
│  │                                                                │
│  │  [+ Új terület létrehozása]  (disabled MVP-ben)               │
│  │                                                                │
│  └────────────────────────────────────────────────────────────────│
└─────────────────────────────────────────────────────────────────┘
```

### Interakciók

- **Area kártya:** Kattintható → modal részletekkel (US-04/AC4-03)
- **Progressbar:** Csak vizuális, nem interaktív
- **"Részletek" gomb:** Modal megnyitása (csak olvasható MVP-ben)

### Állapotok

- **Normál:** 5 terület megjelenik
- **Üres:** Ha nincs terület → üres állapot: "Még nincs parkolási terület definiálva"
- **Hiba:** Error banner (mint Wireframe 4)

### Megjegyzések

- Progressbar szín:
  - 0-50% = zöld (#4caf50)
  - 51-80% = sárga (#ff9800)
  - 81-100% = piros (#f44336)
- Material-UI LinearProgress komponens
- Badge: "Active" zöld, "Inactive" szürke (MVP-ben minden Active)

---

## Állapotok Összefoglalása

| Képernyő | Normál | Üres | Hiba |
|----------|--------|------|------|
| Dashboard |  W1 |  W2 | Banner (W4 mintájára) |
| Parking Spaces |  W3 | W2-hez hasonló |  W4 |
| Areas |  W5 | Üres üzenet | Banner (W4 mintájára) |

**Teljesített:** ≥3 képernyő, lefedve normál, üres és hiba állapotokat.

---

## Story-Wireframe Mapping

| Story | Wireframe(k) | AC Referencia |
|-------|--------------|---------------|
| US-01 Üres állapot | W2, W4 (error is üres táblázat) | AC1-01, AC1-02 |
| US-02 Dashboard | W1 (normál), W2 (üres) | AC2-01, AC2-03 |
| US-03 Parking Spaces | W3 (lista), W4 (hiba) | AC3-01, AC3-02 |
| US-04 Areas | W5 | AC4-01, AC4-02 |
| US-05 Hiba kezelés | W4 (minden nézeten hasonló) | AC5-01, AC5-02 |

---

## Technikai Specifikáció (Implementációhoz)

### Komponens Hierarchia

```
App
├── Layout
│   ├── Sidebar
│   ├── Header (logo, user, notifications)
│   └── Main Content
│       ├── Dashboard
│       │   ├── StatCard (x4)
│       │   ├── TrendChart
│       │   └── AreaQuickView
│       ├── ParkingSpacesList
│       │   ├── SearchBar
│       │   ├── FilterDropdown
│       │   └── ParkingSpaceTable
│       └── AreasList
│           └── AreaCard (x5)
├── EmptyState (shared component)
└── ErrorBanner (shared component)
```

### Responsive Breakpoints

- **Desktop:** ≥1024px (sidebar fix, táblázat teljes szélesség)
- **Tablet:** 768-1023px (sidebar collapse, táblázat scrollable)
- **Mobile:** <768px (sidebar hamburger, táblázat → kártya layout)

---

## Következő Lépések

1. **Wireframe képek feltöltése:**
   - Figma/Excalidraw/Hand-drawn képek exportálása PNG/JPG formában
   - Fájlnevek: `01-dashboard-normal.png`, `02-dashboard-empty.png`, stb.

2. **Komponens implementáció:**
   - Dashboard statisztikai kártyák (StatCard)
   - Parkolóhely táblázat (ParkingSpaceTable + TanStack Table)
   - Területek lista (AreaCard + progressbar)

3. **Mock adatok:**
   - MSW handlers: `/api/parking-spaces`, `/api/areas`
   - Error scenariók: 500, 404, timeout

4. **Tesztek:**
   - EmptyState.test.tsx
   - ErrorBanner.test.tsx
   - Dashboard.test.tsx

---

**Státusz:**  Wireframe dokumentáció elkészült

**Következő akció:** Képek feltöltése vagy implementáció indítása a leírások alapján.
