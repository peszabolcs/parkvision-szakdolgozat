# ADR 0001: Frontend Platform és Deployment Stratégia

**Dátum:** 2025-12-08
**Státusz:** Elfogadva
**Döntéshozók:** Tech Lead, Frontend Team
**Kontextus:** Sprint 2 - MVP Frontend

---

## Kontextus és Probléma

A ParkVision frontend MVP-jének fejlesztéséhez ki kell választani egy modern, gyors fejlesztést támogató technológiai stacket és egy deployment platformot. A fő követelmények:

1. **Gyors fejlesztési ciklus:** HMR (Hot Module Replacement), gyors build idő
2. **Típusbiztonság:** TypeScript támogatás out-of-the-box
3. **Modern UI:** Component library integráció (Material-UI)
4. **Mock API támogatás:** Service Worker alapú mock (MSW) fejlesztéshez és teszteléshez
5. **Deployment egyszerűsége:** Zero-config vagy minimális konfiguráció
6. **Preview környezetek:** Pull request preview URL-ek automatikusan
7. **Költséghatékonyság:** Ingyenes tier hobbihoz, olcsó scaling későbbihez

---

## Döntés

**Frontend Framework:** React 18.2 + Vite 4.3 + TypeScript 5.0

**Deployment Platform:** Vercel (elsődleges) / Netlify (alternatíva)

**Reasoning:**

### 1. Miért React 18.2?

- **Széles ökoszisztéma:** Material-UI, TanStack Query, Zustand mind React-optimalizált
- **Concurrent rendering:** React 18 performancia előnyök (Suspense, automatic batching)
- **Modern hooks API:** Egyszerűbb state management, kevesebb boilerplate
- **Referencia projekt:** A happy-frontend is React-et használ, könnyebb adaptálás

### 2. Miért Vite 4.3 (nem CRA vagy Next.js)?

- **Gyorsaság:** Vite ESBuild alapú, 10-20x gyorsabb build mint Webpack (CRA)
- **HMR:** Instant (<100ms) hot reload fejlesztés közben
- **Zero-config TypeScript:** Nincs szükség komplex webpack.config.js-re
- **Kisebb bundle:** Tree-shaking és ES modules natív támogatás
- **Next.js túlzott:** SSR/SSG nem kell MVP-hez (csak SPA), Vite egyszerűbb

### 3. Miért TypeScript 5.0?

- **Type safety:** Korai hibafeltárás, kevesebb runtime error
- **Fejlesztői élmény:** IntelliSense, autocomplete, refactoring támogatás
- **Dokumentáció:** Típusok önmagukban dokumentálják az interfészeket
- **Industry standard:** Modern projekteknél alapelvárás

### 4. Miért Vercel (deployment)?

- **Zero-config:** `npm run build` automatikusan detektálja a Vite buildet
- **Preview URLs:** Minden PR automatikusan kap preview linket
- **Edge network:** Gyors TTFB globálisan
- **Ingyenes tier:** Hobbihoz bőséges (100 GB bandwidth/hó)
- **Vite optimalizálás:** First-class support, hivatalos template

**Netlify backup terv:** Ha Vercel limitbe ütközne, Netlify ugyanilyen feature set

---

## Alternatívák és Trade-off-ok

### Alternatíva 1: Create React App (CRA)

**Előnyök:**
- Facebook által támogatott, stabil
- Egyszerű kezdés (`npx create-react-app`)

**Hátrányok:**
- Lassú build (Webpack alapú, ~30-60s production build)
- Elavult: 2023 óta nincs aktív fejlesztés
- Nehézkes testreszabás (eject szükséges)

**Miért NEM választottuk:** Vite lényegesen gyorsabb és modernebb.

---

### Alternatíva 2: Next.js 14 (App Router)

**Előnyök:**
- SSR/SSG beépített (SEO előny)
- File-based routing, API routes
- Vercel natív támogatás

**Hátrányok:**
- Overkill MVP-hez (SSR nem kell dashboard app-hoz)
- Komplexebb learning curve
- Nagyobb runtime bundle (server components overhead)

**Miért NEM választottuk:** A ParkVision dashboard egy single-page app, nem kell SEO vagy SSR. A Vite egyszerűbb és gyorsabb erre a use case-re.

---

### Alternatíva 3: Vue 3 + Vite

**Előnyök:**
- Kisebb bundle size
- Egyszerűbb szintaxis (template-based)

**Hátrányok:**
- Kisebb ökoszisztéma (kevesebb Material-UI szerű library)
- Csapat React tapasztalat > Vue
- Referencia projekt (happy-frontend) React

**Miért NEM választottuk:** React job market és ökoszisztéma erősebb, csapat tapasztalat React-ban.

---

### Alternatíva 4: Netlify (deployment)

**Előnyök:**
- Azonos feature set mint Vercel (preview URLs, CDN)
- Build plugins (bár Vite-nál ez nem kell)

**Hátrányok:**
- Kis mértékben lassabb build (~10-15% vs Vercel)
- Kevesebb Vite-specifikus optimalizáció

**Miért Vercel először?** Vite hivatalos template és gyorsabb edge network. Netlify backup terv.

---

### Alternatíva 5: Self-hosted (VM + Nginx)

**Előnyök:**
- Teljes kontroll
- Nincs vendor lock-in

**Hátrányok:**
- Manuális setup (CI/CD pipeline, SSL, domain)
- Üzemeltetési terhelés (security patches, scaling)
- Nincs preview URL automatikusan

**Miért NEM választottuk:** MVP-nél a gyorsaság elsődleges, nem az infrastruktúra kontroll. Később migrálható.

---

## Következmények

### Pozitív

 **Gyors fejlesztés:** Vite HMR ←→ instant feedback loop
 **Modern stack:** TypeScript + React 18 industry standard
 **Zero deployment friction:** `git push` → auto deploy
 **Preview környezetek:** Stakeholderek tesztelhetik a PR-eket közvetlenül
 **Költséghatékonyság:** Ingyenes tier bőven elég MVP-hez (~10-20 user)

### Negatív / Kockázatok

[!] **Vendor lock-in (Vercel):** Későbbi migrálás (pl. self-hosted) extra munka. **Mitigáció:** Vite build output static HTML/JS/CSS → bárhol hostolható.

[!] **SPA SEO korlát:** Mivel nem SSR, a SEO gyengébb. **Mitigáció:** B2B dashboard app, nem kell organikus Google keresés.

[!] **Vercel free tier limit (100GB/hó bandwidth):** Ha virális lesz az MVP, limitbe ütközhet. **Mitigáció:** Netlify vagy Cloudflare Pages backup, vagy fizetős tier (~$20/hó).

[!] **React bundle size:** Nagyobb mint Vue (~40KB gzipped). **Mitigáció:** Code splitting, lazy loading későbbi optimalizációban.

---

## Implementációs Lépések

1. **Projekt inicializálás:**
   ```bash
   npm create vite@latest parkvision-frontend -- --template react-ts
   cd parkvision-frontend
   npm install
   ```

2. **Dependencies telepítés:**
   ```bash
   npm install @mui/material @emotion/react @emotion/styled
   npm install @tanstack/react-query zustand
   npm install axios react-router-dom
   npm install -D msw
   ```

3. **Vercel setup:**
   - Vercel account létrehozása
   - GitHub repo összekapcsolása
   - Auto-deployment engedélyezése (main branch)
   - Preview deployment engedélyezése (PR-ekhez)

4. **Build script verifikáció:**
   ```bash
   npm run build
   npm run preview  # Local preview on http://localhost:4173
   ```

5. **Environment variables setup:**
   - `.env.local` fejlesztéshez (gitignore-ban!)
   - Vercel dashboard-on production env vars

---

## Kapcsolódó Döntések

- **ADR 0002:** IaC stratégia (Terraform plan a Vercel infra leírásához)
- **US-02:** Dashboard implementáció (React komponensekkel)
- **NFR-01:** TTFB < 1.5s (Vercel edge network segít)

---

## Referenciák

- [Vite Official Guide](https://vitejs.dev/guide/)
- [React 18 Release Notes](https://react.dev/blog/2022/03/29/react-v18)
- [Vercel Deployment Docs](https://vercel.com/docs/deployments/overview)
- [MSW (Mock Service Worker)](https://mswjs.io/)

---

## Ellenőrzési Checklist

- [x] Build sikeres: `npm run build` 
- [x] Preview működik: `npm run preview` 
- [x] Vercel deployment sikeres 
- [x] Preview URL generálódik PR-ekhez 
- [x] TypeScript hibák: 0 

---

**Státusz:**  Implementálva

**Utolsó frissítés:** 2025-12-08
