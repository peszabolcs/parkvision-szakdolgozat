# 0001: React 18 mobilalkalmazás stack kiválasztása

- Dátum: 2025-10-18
- Státusz: Elfogadva

## Kontextus
A ParkVision mobilalkalmazásnak egy modern, B2B környezetben használható, reszponzív és gyors megoldásnak kell lennie. Az alkalmazás valós idejű parkolóhely-adatokat jelenít meg térképen, navigációt és admin dashboardot biztosít facility managerek számára. A backend API (REST/MQTT) már létezik Python alapon, így a frontend feladata az adatok megjelenítése és a felhasználói interakció kezelése. Fontos a típusbiztonság, tesztelhetőség és a skálázhatóság.

## Döntés
A mobilalkalmazás **React 18** keretrendszerre épül, TypeScript támogatással és **Material-UI (MUI)** komponenskönyvtárat használva. State managementhez **Zustand** állapotkezelőt választjuk, amely egyszerűbb és könnyebb, mint a Redux, de robusztusabb, mint a Context API. Az API kommunikációhoz **React Query (TanStack Query)** könyvtárt használunk szerver-state kezeléséhez, ami automatikus cache-elést, refetch-et és optimistic update-eket tesz lehetővé. A térképes megjelenítéshez **Leaflet** vagy **Google Maps API** integrációt tervezünk.

## Megfontolt alternatívák
- **Angular 18 + TypeScript + Angular Material**: erős típusbiztonság és beépített dependency injection, de meredekebb tanulási görbe és kevésbé rugalmas, mint a React. Megjegyzés: Az INT-004 interjúalany (Katalin, IT vezető) kifejezetten az Angular használatát preferálta ("Ha van egy modern Angular alapú megoldás, amit könnyen integrálhatunk, az nagy segítség lenne"). Azonban a csapat React kompetenciája, a gyorsabb piacra lépés (Time-to-Market) és a rugalmasabb fejlesztési modell miatt végül a React mellett döntöttünk, vállalva az esetleges integrációs kihívásokat és a stakeholder preferencia felülbírálását.
- **Vue 3 + TypeScript + Pinia**: egyszerűbb és könnyebb tanulási görbe, de kisebb ökoszisztéma és kevesebb B2B referencia.
- **Flutter**: cross-platform natív app iOS/Android-ra, de a webes verzió teljesítménye gyengébb, és a csapat nem rendelkezik Dart tapasztalattal.
- **Next.js (React framework)**: SSR/SSG képesség, de a mobilapp nem igényel szerver-oldali renderelést, így felesleges komplexitás lenne.

## Következmények
- A **React 18** hooks-alapú megközelítése modern és jól ismert a fejlesztői közösségben, ami megkönnyíti az onboarding-ot.
- A **Zustand** egyszerű API-ja csökkenti a boilerplate kódot a Redux-hoz képest, miközben skálázható state management-et biztosít.
- A **React Query** automatizálja a szerver-state kezelését, csökkentve a manuális fetch logikát és javítva a user experience-t cache-eléssel.
- A **Material-UI (MUI)** komponensek gyors prototípuskészítést tesznek lehetővé, de szükség lehet custom styling-ra a B2B brand követelményekhez.
- A TypeScript szigorú típusellenőrzése csökkenti a runtime hibákat és javítja a kód karbantarthatóságát.
- A React ökoszisztéma hatalmas és dinamikus, de a dependency frissítések breaking changes-t hozhatnak, ezért figyelni kell a kompatibilitásra.
- A **Leaflet** ingyenes és nyílt forráskódú térképes megoldás, míg a Google Maps API fizetős, de jobb UX-et kínál - ezt a döntést a Sprint 2-ben finalizáljuk.
- Az alkalmazás könnyen telepíthető lesz **Vercel**, **Netlify** vagy **Firebase Hosting** platformokra statikus build formában.
