# HEIMDALL SMART PARKING RENDSZER - TELJES DOKUMENTÁCIÓ

**Verzió:** 1.0
**Dátum:** 2025-11-24
**Készítette:** pszabolcs

---

## TARTALOMJEGYZÉK

1. [Rendszer Áttekintés](#1-rendszer-áttekintés)
2. [Verziók és Technológiák](#2-verziók-és-technológiák)
3. [Komponensek Áttekintése](#3-komponensek-áttekintése)
4. [Rendszer Architektúra](#4-rendszer-architektúra)
5. [Komponensek Részletes Leírása](#5-komponensek-részletes-leírása)
6. [Állapot: Mi Van Meg vs Mi Hiányzik](#6-állapot-mi-van-meg-vs-mi-hiányzik)
7. [Frontend → Mobil App Migráció](#7-frontend-→-mobil-app-migráció)
8. [Deployment és Üzemeltetés](#8-deployment-és-üzemeltetés)

---

## 1. RENDSZER ÁTTEKINTÉS

### 1.1 Cél
A Heimdall Smart Parking egy intelligens parkolóhely-kezelő rendszer, amely IP kamerák segítségével valós időben detektálja a járműveket, felismeri a rendszámokat, és nyomon követi a parkolóhelyek foglaltságát.

### 1.2 Fő Funkciók
- **Valós idejű járműdetektálás** - YOLOv8 GPU-gyorsított AI modell
- **Rendszámfelismerés** - EasyOCR többskálás felismerés
- **Parkolóhely foglaltság monitorozás** - Anti-flicker algoritmussal
- **Dashboard** - Valós idejű statisztikák és foglaltsági áttekintés
- **Cég/járműkezelés** - Regisztrált autók és cégek adminisztrációja
- **Élő kamera stream** - MJPEG streaming távoli eléréshez

### 1.3 Projektek
A rendszer 3 fő komponensből áll:

| Projekt | Nyelv/Framework | Leírás |
|---------|----------------|---------|
| **barcelona-project** | Python 3.10 + PyTorch | ML detection engine (YOLO + OCR) |
| **happy-backend** | Python 3.10 + Django 4.2 | REST API backend |
| **happy-frontend** | TypeScript + React 18 | Web dashboard UI |

---

## 2. VERZIÓK ÉS TECHNOLÓGIÁK

### 2.1 Backend Stack (happy-backend)

**Core Framework:**
- Python: `3.10.12`
- Django: `4.2.4`
- Django REST Framework: `3.14.0`
- PostgreSQL: `14.19`

**Key Dependencies:**
```
django-cors-headers==4.2.0
django-rest-knox==4.2.0          # Token auth (60-min TTL)
psycopg2-binary==2.9.7
djangorestframework-simplejwt==5.3.0
boto3==1.28.63                   # AWS S3 integration
python-ffmpeg==2.0.4             # RTSP to HLS conversion
schedule==1.2.0
pyOpenSSL==24.0.0
```

**Git Repository:**
- URL: `https://github.com/Revival27/happy-backend.git`
- Branch: `main`

---

### 2.2 Frontend Stack (happy-frontend)

**Core Framework:**
- Node.js: `18.16.0`
- React: `18.2.0`
- TypeScript: `5.0.2`
- Vite: `4.3.9`

**Key Dependencies:**
```
@mui/base: 5.0.0-alpha.90        # Material UI components
@tanstack/react-query: 4.29.5    # Data fetching
@tanstack/react-table: 8.9.1     # Table management
axios: 1.4.0                      # HTTP client
react-router-dom: 6.14.0          # Routing
zustand: 3.7.2                    # State management
apexcharts: 4.7.0                 # Charts/graphs
formik: 2.4.2                     # Form handling
```

**Git Repository:**
- URL: `https://github.com/Revival27/happy-frontend.git`
- Branch: `master`

---

### 2.3 Detection Engine Stack (barcelona-project)

**Core Framework:**
- Python: `3.10.12`
- PyTorch: `2.5.1+cu121` (CUDA 12.1)
- OpenCV: `4.10.0.84` (headless)

**AI/ML Models:**
```
ultralytics==8.3.204              # YOLOv8 framework
torch>=2.5.1+cu121                # PyTorch with CUDA
torchvision>=0.20.1+cu121
easyocr==1.7.1                    # License plate OCR
```

**Model Files (auto-downloaded):**
- YOLOv8x.pt (extra large, best accuracy) - 136MB
- YOLOv8l.pt (large) - fallback
- YOLOv8m.pt (medium) - fallback
- YOLOv8s.pt (small, fastest) - fallback

**Database & API:**
```
SQLAlchemy==2.0.35
psycopg2-binary==2.9.9
flask==3.0.0                      # MJPEG streaming server
requests==2.32.5
```

**Git Repository:**
- URL: `https://github.com/Revival27/barcelona-project.git`
- Branch: `external`

---

### 2.4 Database

**PostgreSQL Configuration:**
- Version: `14.19`
- Host: `127.0.0.1`
- Port: `5432`
- Database: `postgres`
- User/Pass: `postgres/postgres`

**Key Tables:**
- `SITE` - Telephelyek
- `CLIENT` - Cégek/ügyfelek
- `CAR` - Regisztrált járművek
- `AREA` - Parkolóhelyek/zónák
- `PARKING_SPACE` - Parkolási jogosultságok
- `CAMERA` - Kamera konfigurációk
- `DETECTED_CARS` - Valós idejű detekciók
- `AREA_ALLOCATION_LOG` - Parkolóhely foglaltsági napló
- `CAMERA_AREA_LINK` - Kamera-terület kapcsolatok HIÁNYZIK

---

## 3. KOMPONENSEK ÁTTEKINTÉSE

### 3.1 Szoftver Komponensek

```
┌─────────────────────────────────────────────────────────────┐
│                    HEIMDALL RENDSZER                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────┐   ┌──────────────┐   ┌─────────────────┐  │
│  │  Frontend   │   │   Backend    │   │  ML Detection   │  │
│  │  (React)    │◄──┤   (Django)   │◄──┤  (Barcelona)    │  │
│  │  Port 5173  │   │  Port 8000   │   │  Port 5000      │  │
│  └─────────────┘   └──────────────┘   └─────────────────┘  │
│         │                  │                     │           │
│         └──────────────────┴─────────────────────┘           │
│                            │                                 │
│                   ┌────────▼────────┐                        │
│                   │   PostgreSQL    │                        │
│                   │   Port 5432     │                        │
│                   └─────────────────┘                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │             Hikvision IP Camera                     │    │
│  │        RTSP: 192.168.1.82:554                       │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Hardware Komponensek

**Szerver (gpuvm):**
- OS: Linux (Ubuntu 22.04)
- Kernel: 5.15.0-161-generic
- CPU: 4 fizikai magok, 4 logikai mag
- GPU: NVIDIA Tesla T4 (15GB VRAM, driver 535.274.02)
- CUDA: 12.1

**Kamerák:**
- Hikvision IP kamera
  - IP: 192.168.1.82
  - Felhasználó: admin
  - RTSP port: 554
  - Felbontás: 1920x1080 @ 25 FPS
  - Stream URL: `rtsp://admin:bsug8276BSUG8276@192.168.1.82:554/Streaming/Channels/1`

---

## 4. RENDSZER ARCHITEKTÚRA

### 4.1 Adatfolyam Diagram

```
                    ┌──────────────────────┐
                    │  Hikvision Kamera    │
                    │  192.168.1.82        │
                    │  RTSP Stream         │
                    └──────────┬───────────┘
                               │ 1920x1080@25fps
                               │
                    ┌──────────▼───────────┐
                    │ barcelona-project    │
                    │ Python + PyTorch     │
                    ├──────────────────────┤
                    │ 1. Frame Capture     │
                    │ 2. YOLOv8 Detection  │
                    │ 3. EasyOCR (LP)      │
                    │ 4. Centroid Tracking │
                    │ 5. Parking Overlap   │
                    └──────────┬───────────┘
                               │
            ┌──────────────────┼──────────────────┐
            │                  │                  │
    ┌───────▼────────┐  ┌──────▼──────┐  ┌──────▼──────┐
    │ Flask Server   │  │  Database   │  │   Backend   │
    │ MJPEG Stream   │  │  Updates    │  │   API Call  │
    │ Port 5000      │  │  (SQLAlchemy│  │   /parking- │
    └───────┬────────┘  └──────┬──────┘  │   stats/    │
            │                  │          └──────┬──────┘
            │                  │                 │
    ┌───────▼──────────────────▼─────────────────▼──────┐
    │              PostgreSQL Database                  │
    │              Port 5432                             │
    │  - DETECTED_CARS                                   │
    │  - AREA_ALLOCATION_LOG                             │
    │  - PARKING_SPACE                                   │
    └───────────────────────────┬────────────────────────┘
                                │
                    ┌───────────▼────────────┐
                    │   Django Backend       │
                    │   REST API             │
                    │   Port 8000            │
                    ├────────────────────────┤
                    │ - Knox Auth            │
                    │ - /parking-stats/      │
                    │ - /companies/          │
                    │ - /cars/               │
                    │ - /areas/              │
                    └───────────┬────────────┘
                                │ HTTP/JSON
                    ┌───────────▼────────────┐
                    │   React Frontend       │
                    │   Dashboard            │
                    │   Port 5173            │
                    ├────────────────────────┤
                    │ - Dashboard (stats)    │
                    │ - Vehicle Management   │
                    │ - Company Management   │
                    │ - Camera Streaming     │
                    │ - Reports              │
                    └────────────────────────┘
                               │
                    ┌──────────▼───────────┐
                    │   End User Browser   │
                    │   Web Interface      │
                    └──────────────────────┘
```

### 4.2 Hálózati Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                      Internet / WAN                           │
└────────────────────────────┬─────────────────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   VPN Server    │  HIÁNYZIK
                    │   (OpenVPN /    │
                    │   WireGuard)    │
                    └────────┬────────┘
                             │
┌────────────────────────────┼─────────────────────────────────┐
│                      Local Network                            │
│                    192.168.1.0/24                             │
├───────────────────────────────────────────────────────────────┤
│                             │                                 │
│    ┌────────────────────────┼──────────────────────┐          │
│    │                        │                      │          │
│ ┌──▼──────────┐  ┌──────────▼────────┐  ┌─────────▼───────┐ │
│ │  Hikvision  │  │   GPU Server       │  │  Development    │ │
│ │  Camera     │  │   gpuvm            │  │  Machine        │ │
│ │  .82        │  │   (Backend+ML)     │  │  (SSH Client)   │ │
│ └─────────────┘  └────────────────────┘  └─────────────────┘ │
│                           │                                   │
│                    ┌──────┴──────┐                            │
│                    │   Services  │                            │
│                    ├─────────────┤                            │
│                    │ :8000 Django│                            │
│                    │ :5173 Vite  │                            │
│                    │ :5000 Flask │                            │
│                    │ :5432 PgSQL │                            │
│                    └─────────────┘                            │
└───────────────────────────────────────────────────────────────┘
```

---

## 5. KOMPONENSEK RÉSZLETES LEÍRÁSA

### 5.1 barcelona-project (ML Detection Engine)

**Fő Fájlok:**
- `app_test.py` - Fő alkalmazás (1400+ sor)
- `HikvisionCamera.py` - RTSP kapcsolat kezelés
- `CentroidTracker.py` - Objektum követés
- `ParkingLot.py` - Parkolóhely logika
- `LicensePlateTracker.py` - Rendszám stabilizáció
- `Database.py` - SQLAlchemy ORM
- `BackendClient.py` - Django API kliens

**ML Pipeline:**
1. **Frame Capture** - RTSP stream (~25 FPS)
2. **Vehicle Detection** - YOLOv8x GPU inference (~15-25ms/frame)
   - Classes: car, truck, motorcycle, bus
   - Confidence threshold: 0.45
3. **Centroid Tracking** - Unique ID assignment per vehicle
4. **License Plate ROI** - Multi-scale extraction (1.0x, 1.5x, 2.0x)
5. **EasyOCR Recognition** - GPU-accelerated OCR
   - Languages: 'en' (English)
   - Confidence threshold: 0.25
6. **Temporal Filtering** - Stabilization across frames
7. **Parking Overlap** - IoU computation with parking zones
8. **Anti-Flicker** - 3-frame consistency (60% confidence)
9. **Database Logging** - DETECTED_CARS, AREA_ALLOCATION_LOG
10. **Backend Notification** - Real-time state change API call

**Performance:**
- Target FPS: 15-25 (Tesla T4)
- Processing latency: ~40-60ms per frame
- Detection accuracy: ~95% (well-lit conditions)
- LP recognition rate: ~85% (Hungarian plates)

**Flask Streaming:**
- Port: 5000
- Format: MJPEG (motion JPEG)
- Route: `/video_feed`
- Quality: JPEG 85%
- Frame rate: ~30 FPS (streamed)

**Headless Mode:**
- `HEADLESS_MODE = True` (default)
- No cv2.imshow() calls
- No X11 display required
- Suitable for SSH/remote operation

---

### 5.2 happy-backend (Django REST API)

**Django Apps:**
- **AuthApp** - Core API (authentication, models, views)
- **EventWatcher** - Event monitoring (minimal)
- **RawDataFilter** - Data filtering (minimal)
- **VisonWriter** - Video writing (minimal)

**Kulcs API Endpointok:**

**Authentication:**
- `POST /login/` - Knox token login
- `POST /logout/` - Logout
- `POST /logoutall/` - Logout all sessions

**Resources (auth required):**
- `GET|POST /companies/` - Cégek listázása/létrehozása
- `GET|PUT|DELETE /companies/<id>/` - Cég műveletek
- `GET|POST /cars/` - Járművek
- `GET|POST /parking-space/` - Parkolási jogok
- `GET|POST /areas/?site=<id>` - Parkolóhelyek (site szerint szűrve)
- `GET /cameras/` - Kamerák
- `GET /sites/` - Telephelyek

**Real-time Endpoints:**
- `GET /parking-stats/` - Valós idejű foglaltság (NO AUTH)
  - Lekérdezi AREA_ALLOCATION_LOG táblát
  - Csoportosít site szerint
  - Visszaad: `{site_id, site_name, total_spaces, occupied, available, areas: [...]}`
- `GET /office-camera/live/` - Irodai kamera élő detekciók
- `GET /office-camera/history/` - Történeti adatok

**Streaming:**
- `GET /camera-streaming/<camera_id>/<filename>` - HLS streaming
  - RTSP → HLS konverzió (ffmpeg)
  - Jelszó injektálás .env-ből

**Admin Interface:**
- URL: `http://127.0.0.1:8000/admin/`
- Testreszabott: "Heimdall Administration"
- django-admin-interface enhanced UI

**Authentication Flow:**
1. POST credentials → `/login/`
2. Response: `Authorization: Token <token>` header
3. Token TTL: 60 perc
4. Subsequent requests: `Authorization: Token <token>`

---

### 5.3 happy-frontend (React Dashboard)

**Oldalak és Routing:**

| Route | Component | Leírás |
|-------|-----------|--------|
| `/` | Login | Bejelentkezés |
| `/vezerlopult` | Dashboard | Főoldal - valós idejű statisztikák |
| `/jarmuvek-listazasa` | VehicleList | Járművek listája |
| `/jarmu-hozzaadasa` | VehicleAdd | Új jármű |
| `/jarmu-szerkesztese/:id` | VehicleEdit | Jármű szerkesztés |
| `/cegek-listazasa` | CompanyList | Cégek listája |
| `/ceg-hozzaadasa` | CompanyAdd | Új cég |
| `/ceg-szerkesztese/:id` | CompanyEdit | Cég szerkesztés |
| `/kamerak` | Cameras | Kamera stream viewer |
| `/irodai-kamera` | OfficeCamera | Irodai kamera live feed |
| `/parkolohelyek-kezelese` | ParkingSpaceManage | Parkolóhelyek kezelése |
| `/parkolohelyek-listazasa` | ParkingSpaceList | Parkolóhelyek listája |
| `/parkolohely-szerkesztese/:id` | ParkingSpaceEdit | Parkolóhely szerkesztés |
| `/jelentesek/statisztikak` | Statistics | Statisztikák és riportok |

**State Management:**
- Zustand (global state)
- React Query (server state, caching)
- React Cookie (auth tokens)

**Key Features:**
- **Dashboard** - ApexCharts grafikonok, valós idejű polling (10s interval)
- **Table Management** - TanStack Table (sorting, filtering, pagination)
- **Form Handling** - Formik + Yup validation
- **Auth Context** - Knox token management, auto-renewal
- **Private Routes** - Permission-based access control

**API Integration:**
- Base URL: `/api` (proxied to `http://localhost:8000`)
- Vite proxy configuration:
  ```typescript
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    }
  }
  ```
- Trailing slashes on all endpoints (Django redirect fix)

**Deployment Config:**
- Dev server: `0.0.0.0:5173` (remote access)
- Build: `npm run build` → `dist/`
- Preview: `npm run preview`

---

### 5.4 PostgreSQL Database

**Shared Database Architecture:**
Mindhárom komponens ugyanazt a PostgreSQL példányt használja.

**Connection String:**
```
postgresql://postgres:postgres@127.0.0.1:5432/postgres
```

**Kulcs Táblák:**

**SITE** - Telephelyek
- `id`, `name`

**CLIENT** - Cégek/Ügyfelek
- `id`, `name`, `tax_number`, `address`, `email`, `phone`
- `valid_from`, `valid_to`

**CAR** - Járművek
- `id`, `license_plate`, `client_id`
- `valid_from`, `valid_to`

**AREA** - Parkolóhelyek
- `id`, `name`, `area_type_m_id`, `site_id`

**PARKING_SPACE** - Parkolási jogok
- `id`, `car_id`, `client_id`, `area_id`
- `valid_from`, `valid_to`

**CAMERA** - Kamerák
- `id`, `name`, `site_id`, `source` (RTSP URL)

**DETECTED_CARS** - Valós idejű detekciók
- `id`, `source_id`, `camera_id`, `license_plate`
- `p1_x`, `p1_y`, `p2_x`, `p2_y` (bounding box)
- `start_ts`, `end_ts`
- `color_m_id`, `car_type_m_id`

**AREA_ALLOCATION_LOG** - Foglaltsági napló
- `id`, `area_id`, `detected_car_id`
- `start_ts`, `end_ts`
- Sentinel érték: `2100-12-31 23:59:59` = "jelenleg foglalt"

**CAMERA_AREA_LINK** - Kamera-terület kapcsolat
- Hiányzik! Exception: `'NoneType' object has no attribute 'AREA_ID'`

---

## 6. ÁLLAPOT: MI VAN MEG VS MI HIÁNYZIK

### 6.1 MI VAN MEG (Működő Komponensek)

**Infrastruktúra:**
- GPU szerver (Tesla T4, 15GB VRAM, driver 535)
- CUDA 12.1 telepítve és működik
- PostgreSQL 14.19 telepítve (port 5432)
- Hikvision IP kamera (192.168.1.82, 1080p@25fps)
- SSH hozzáférés a szerverhez

**Backend (Django):**
- REST API teljes mértékben működik
- Knox token authentication (60-min TTL)
- CORS konfiguráció
- Admin interface (django-admin-interface)
- Database models (Site, Client, Car, Area, Camera, stb.)
- Real-time parking stats endpoint
- RTSP → HLS streaming (ffmpeg)

**Frontend (React):**
- Login page és authentication
- Dashboard real-time statisztikákkal
- Vehicle management (list, add, edit)
- Company management (list, add, edit)
- Parking space management
- Camera viewer
- Statistics/reports page
- Vite proxy configuration (távoli elérés)

**ML Detection (barcelona-project):**
- YOLOv8 GPU-accelerated detection
- EasyOCR license plate recognition
- Centroid tracking
- ParkingLot overlap detection
- Anti-flickering (3-frame consistency)
- Database integration (SQLAlchemy)
- Backend API client
- Flask MJPEG streaming (port 5000)
- Headless mode (no X11 required)
- RTSP connection to Hikvision camera

**Git Repositories:**
- barcelona-project (branch: external)
- happy-backend (branch: main)
- happy-frontend (branch: master)
- Git user configured (peszabolcs)

---

### 6.2 MI HIÁNYZIK (Fejlesztendő/Hiányzó Komponensek)

**Kritikus Hiányosságok:**

**Database:**
- **CAMERA_AREA_LINK tábla hiányzik**
  - Hiba: `'NoneType' object has no attribute 'AREA_ID'`
  - Impact: barcelona-project nem tudja meghatározni, hogy melyik kamera melyik területet figyeli
  - Prioritás: MAGAS
  - Megoldás: Migration létrehozása + adatok feltöltése

**Hálózat & Biztonság:**
- **VPN szerver nincs telepítve**
  - Távoli hozzáférés jelenleg SSH-n keresztül
  - Nincs titkosított alagút külső klienseknek
  - Prioritás: KÖZEPES
  - Opciók: OpenVPN, WireGuard, Tailscale

- **HTTPS/SSL tanúsítvány hiányzik**
  - Backend és Frontend HTTP-n fut (nem biztonságos)
  - Prioritás: MAGAS (production előtt)
  - Megoldás: Let's Encrypt (certbot), reverse proxy (nginx/caddy)

- **Firewall konfiguráció nincs dokumentálva**
  - Nem tudni, hogy mely portok vannak nyitva
  - Prioritás: MAGAS
  - Megoldás: UFW/iptables rules

**Deployment & DevOps:**
- **Production deployment hiányzik**
  - Django: DEBUG=True, runserver (nem production-ready)
  - Frontend: Vite dev server (nem optimalizált build)
  - Prioritás: MAGAS
  - Megoldás: Gunicorn/uWSGI + Nginx, Docker, systemd services

- **CI/CD pipeline nincs**
  - Manuális deployment
  - Nincs automatikus tesztelés
  - Prioritás: KÖZEPES
  - Megoldás: GitHub Actions, GitLab CI

- **Backup stratégia nincs**
  - Database backup hiányzik
  - Model weights nem mentve
  - Prioritás: MAGAS
  - Megoldás: pg_dump cron job, S3/NAS storage

**Monitoring & Logging:**
- **Centralized logging hiányzik**
  - Logok csak console outputban
  - Nehéz troubleshooting
  - Prioritás: KÖZEPES
  - Megoldás: ELK stack (Elasticsearch, Logstash, Kibana), Loki

- **System monitoring nincs**
  - GPU utilization tracking hiányzik
  - FPS/performance metrikák nem logolódnak
  - Prioritás: KÖZEPES
  - Megoldás: Prometheus + Grafana, Netdata

- **Error tracking nincs**
  - Exception-ök nem gyűlnek központilag
  - Prioritás: KÖZEPES
  - Megoldás: Sentry, Rollbar

**Funkcionális Hiányosságok:**
- **Mobil alkalmazás nincs**
  - Csak web interface
  - Prioritás: KÖZEPES (lásd [7. fejezet](#7-frontend-→-mobil-app-migráció))

- **Értesítési rendszer hiányzik**
  - Nincs email/SMS/push notification
  - Példa: "Parkolóhely megtelt", "Ismeretlen rendszám"
  - Prioritás: ALACSONY
  - Megoldás: Twilio (SMS), SendGrid (email), FCM (push)

- **Historikus adatok vizualizációja korlátozott**
  - Csak jelenlegi állapot látható
  - Nincs időszakos riport
  - Prioritás: ALACSONY

- **Multi-kamera support limitált**
  - Jelenleg 1 Hikvision kamera
  - Nincs load balancing
  - Prioritás: KÖZEPES

**Kód Minőség:**
- **Unit tesztek hiányoznak**
  - barcelona-project: 0% coverage
  - happy-backend: minimális
  - happy-frontend: jest konfig van, de tesztek hiányoznak
  - Prioritás: KÖZEPES

- **API dokumentáció hiányos**
  - Nincs Swagger/OpenAPI spec
  - Csak CLAUDE.md file-ok
  - Prioritás: ALACSONY
  - Megoldás: drf-spectacular (Django), Swagger UI

- **Type hints hiányoznak** (barcelona-project)
  - Python kód nem type-annotated
  - Prioritás: ALACSONY

**Performance:**
- **Redis cache nincs**
  - API response-ok nem cache-elve
  - Parking stats minden kérésre DB query
  - Prioritás: KÖZEPES

- **WebSocket real-time push nincs**
  - Frontend polling-ol (10s interval)
  - Inefficient, nem instant
  - Prioritás: ALACSONY
  - Megoldás: Django Channels + Redis

---

## 7. FRONTEND → MOBIL APP MIGRÁCIÓ

### 7.1 Jelenlegi Frontend Architektúra

**Technológiai Stack:**
- React 18.2.0 (web-only)
- Material UI (@mui/base)
- React Router Dom (web routing)
- Vite bundler

**Deployment:**
- Vite dev server: `0.0.0.0:5173`
- Production build: `npm run build` → `dist/` (statikus fájlok)

### 7.2 Mobil App Opciók

#### Opció 1: Progressive Web App (PWA) AJÁNLOTT

**Előnyök:**
- Minimális kód változtatás
- Egyetlen kódbázis (web + mobil)
- Gyors fejlesztés
- Automatikus update (nincs app store jóváhagyás)
- Működik offline (service worker)
- Push notification support
- Home screen icon

**Szükséges módosítások:**
1. **Vite PWA Plugin telepítése:**
   ```bash
   npm install -D vite-plugin-pwa
   ```

2. **vite.config.ts módosítás:**
   ```typescript
   import { VitePWA } from 'vite-plugin-pwa'

   plugins: [
     react(),
     VitePWA({
       registerType: 'autoUpdate',
       manifest: {
         name: 'Heimdall Parking',
         short_name: 'Heimdall',
         description: 'Smart Parking Management',
         theme_color: '#1976d2',
         icons: [
           {
             src: 'icon-192.png',
             sizes: '192x192',
             type: 'image/png'
           },
           {
             src: 'icon-512.png',
             sizes: '512x512',
             type: 'image/png'
           }
         ]
       }
     })
   ]
   ```

3. **Service Worker:**
   - Automatikusan generálódik
   - Cache-eli az API válaszokat
   - Offline support

4. **Responsive Design:**
   - Jelenleg desktop-first
   - Kell: mobile breakpoints (@media queries)
   - Touch-friendly UI elemek

**Timeline:** 1-2 hét

---

#### Opció 2: React Native (Natív App)

**Előnyök:**
- Teljes natív élmény
- Jobb performance
- App Store/Google Play presence
- Natív API hozzáférés (kamera, GPS, stb.)

**Hátrányok:**
- Teljes újraírás szükséges
- 2 külön kódbázis (iOS + Android)
- App store jóváhagyás kell
- Lassabb deployment
- Több karbantartás

**Szükséges módosítások:**
1. Új projekt: `npx react-native init HeimdallApp`
2. UI komponensek átírása React Native-re
3. Navigation: React Navigation
4. State management: Redux/Zustand (megtartható)
5. API layer: axios (megtartható)

**Timeline:** 2-3 hónap

---

#### Opció 3: Capacitor (Hybrid App)

**Előnyök:**
- Meglévő React kód használható
- App Store/Google Play
- Natív plugin support
- Web + iOS + Android egyetlen kódbázisból

**Hátrányok:**
- Nagyobb bundle size
- Lassabb mint natív
- App store deployment

**Szükséges módosítások:**
1. **Capacitor telepítése:**
   ```bash
   npm install @capacitor/core @capacitor/cli
   npx cap init
   ```

2. **Platform hozzáadása:**
   ```bash
   npm install @capacitor/android @capacitor/ios
   npx cap add android
   npx cap add ios
   ```

3. **Build és sync:**
   ```bash
   npm run build
   npx cap sync
   npx cap open android  # Android Studio
   npx cap open ios      # Xcode
   ```

**Timeline:** 3-4 hét

---

### 7.3 Ajánlott Megközelítés

**Fázis 1: PWA (1-2 hét)**
- Minimális befektetés
- Azonnal használható mobil eszközökön
- Tesztelhető production-ready funkcionalitás

**Fázis 2: Responsive optimalizálás (1 hét)**
- Mobile-first CSS
- Touch gestures
- Optimalizált layout kis képernyőkre

**Fázis 3: Capacitor (opcionális, 3-4 hét)**
- Ha szükség van App Store presence-re
- Ha natív funkciók kellenek (pl. background GPS tracking)

**Fázis 4: React Native (opcionális, 2-3 hónap)**
- Csak ha PWA/Capacitor nem elégséges
- Ha maximális performance kell

---

### 7.4 PWA Implementation Checklist

**Backend változtatások:**
- CORS már be van állítva
- HTTPS szükséges (Let's Encrypt)
- Service Worker friendly API response headers

**Frontend változtatások:**
- manifest.json generálása
- Service Worker regisztráció
- App icons (192x192, 512x512)
- Splash screen
- Offline fallback page
- Cache strategy (API responses, images)
- Push notification permission request
- "Add to Home Screen" prompt

**Tesztelés:**
- Chrome DevTools → Lighthouse → PWA audit
- iOS Safari "Add to Home Screen"
- Android Chrome "Install app"

---

## 8. DEPLOYMENT ÉS ÜZEMELTETÉS

### 8.1 Jelenlegi Setup (Development)

**Indítási sorrend:**
```bash
# 1. PostgreSQL (automatikusan indul systemd-vel)
sudo systemctl status postgresql

# 2. Django Backend
cd /opt/pszabolcs/projects/happy-backend
source venv/bin/activate  # ha van venv
python3 manage.py runserver 0.0.0.0:8000

# 3. React Frontend
cd /opt/pszabolcs/projects/happy-frontend
npm run dev  # 0.0.0.0:5173

# 4. barcelona-project
cd /opt/pszabolcs/projects/barcelona-project
source venv/bin/activate
python3 app_test.py  # Flask server indul port 5000-on
```

**Elérés:**
- Frontend: `http://[server-ip]:5173`
- Backend API: `http://[server-ip]:8000`
- ML Stream: `http://[server-ip]:5000`
- Admin: `http://[server-ip]:8000/admin/`

---

### 8.2 Production Setup (Javasolt)

#### 8.2.1 Systemd Services

**django.service:**
```ini
[Unit]
Description=Heimdall Django Backend
After=network.target postgresql.service

[Service]
User=pszabolcs
Group=pszabolcs
WorkingDirectory=/opt/pszabolcs/projects/happy-backend
Environment="PATH=/opt/pszabolcs/projects/happy-backend/venv/bin"
ExecStart=/opt/pszabolcs/projects/happy-backend/venv/bin/gunicorn \
    --workers 4 \
    --bind 127.0.0.1:8000 \
    happy_backend.wsgi:application
Restart=always

[Install]
WantedBy=multi-user.target
```

**barcelona-detection.service:**
```ini
[Unit]
Description=Barcelona ML Detection Engine
After=network.target postgresql.service django.service

[Service]
User=pszabolcs
Group=pszabolcs
WorkingDirectory=/opt/pszabolcs/projects/barcelona-project
Environment="PATH=/opt/pszabolcs/projects/barcelona-project/venv/bin"
ExecStart=/opt/pszabolcs/projects/barcelona-project/venv/bin/python3 app_test.py
Restart=always

[Install]
WantedBy=multi-user.target
```

#### 8.2.2 Nginx Reverse Proxy

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name heimdall.example.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name heimdall.example.com;

    ssl_certificate /etc/letsencrypt/live/heimdall.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/heimdall.example.com/privkey.pem;

    # Frontend (React build)
    location / {
        root /opt/pszabolcs/projects/happy-frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ML Stream
    location /stream/ {
        proxy_pass http://127.0.0.1:5000/;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Connection "";
    }

    # Django Admin
    location /admin/ {
        proxy_pass http://127.0.0.1:8000/admin/;
        proxy_set_header Host $host;
    }
}
```

#### 8.2.3 Docker Setup (Alternatíva)

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./happy-backend
    command: gunicorn happy_backend.wsgi:application --bind 0.0.0.0:8000
    volumes:
      - ./happy-backend:/app
    ports:
      - "8000:8000"
    depends_on:
      - postgres
    environment:
      - DB_HOST=postgres
      - DB_PORT=5432

  frontend:
    build: ./happy-frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend

  detection:
    build: ./barcelona-project
    runtime: nvidia  # GPU support
    command: python3 app_test.py
    volumes:
      - ./barcelona-project:/app
    ports:
      - "5000:5000"
    depends_on:
      - postgres
      - backend
    environment:
      - NVIDIA_VISIBLE_DEVICES=all

volumes:
  postgres_data:
```

---

### 8.3 Backup Stratégia

**Database Backup (cron job):**
```bash
# /etc/cron.daily/postgres-backup
#!/bin/bash
BACKUP_DIR="/var/backups/heimdall"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -U postgres postgres | gzip > "$BACKUP_DIR/postgres_$DATE.sql.gz"
find "$BACKUP_DIR" -mtime +7 -delete  # Keep 7 days
```

**Model Weights Backup:**
```bash
# barcelona-project/.yolo/ directory
rsync -avz ~/.cache/torch/hub/ultralytics/ /backup/yolo-models/
```

---

### 8.4 Monitoring

**GPU Monitoring (prometheus exporter):**
```bash
# nvidia-dcgm-exporter for Grafana
docker run -d --gpus all --rm -p 9400:9400 nvcr.io/nvidia/k8s/dcgm-exporter:latest
```

**Application Health Checks:**
- Backend: `GET /admin/` (200 OK)
- Detection: `GET http://localhost:5000/` (200 OK)
- Database: `pg_isready -h localhost`

---

## ÖSSZEFOGLALÁS

### Működő Komponensek (KÉK)
- 3 GitHub repo (backend, frontend, ML detection)
- Django REST API (Knox auth, parking stats, CRUD)
- React dashboard (vehicle/company management, real-time stats)
- YOLOv8 GPU detection + EasyOCR (Tesla T4)
- PostgreSQL 14 shared database
- Flask MJPEG streaming
- Headless mode (SSH-friendly)

### Hiányzó Komponensek (PIROS)
- **KRITIKUS:** CAMERA_AREA_LINK tábla
- **MAGAS:** HTTPS/SSL, production deployment, backup
- **KÖZEPES:** VPN, monitoring, CI/CD
- **ALACSONY:** Mobil app, notifications, tests

### Ajánlott Következő Lépések
1. **CAMERA_AREA_LINK tábla** létrehozása (sürgős)
2. **Production deployment** (Gunicorn + Nginx + systemd)
3. **HTTPS** (Let's Encrypt certbot)
4. **PWA** (mobil support 1-2 hét alatt)
5. **Monitoring** (Grafana + Prometheus)
6. **Backup** (pg_dump cron + S3)

---

**Verzió:** 1.0
**Utolsó frissítés:** 2025-11-24
**Szerző:** pszabolcs
**Projekt:** Heimdall Smart Parking System
