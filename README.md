# Krishi Saathi (कृषि साथी) — AI-Powered Smart Agriculture & Livestock Farming Platform

A full-stack, intelligent agricultural assistant designed to empower farmers, agricultural students, and rural enterprises with data-driven decision support. Krishi Saathi delivers multilingual crop cultivation guides, livestock husbandry modules, crop disease identification, automated fertilizer and irrigation planning, simulated climate forecasting, and a direct farm-to-buyer marketplace.

---

## Table of Contents

- [1. Project Title](#1-project-title)
- [2. Project Overview](#2-project-overview)
- [3. Problem Statement](#3-problem-statement)
- [4. Our Solution](#4-our-solution)
- [5. Key Features](#5-key-features)
- [6. Technology Stack](#6-technology-stack)
- [7. System Architecture](#7-system-architecture)
- [8. Prerequisites](#8-prerequisites)
- [9. Installation and Setup](#9-installation-and-setup)
- [10. Environment Variables](#10-environment-variables)
- [11. API Integrations](#11-api-integrations)
- [12. Project Structure](#12-project-structure)
- [13. Database and Storage](#13-database-and-storage)
- [14. Educational Video System](#14-educational-video-system)
- [15. Security and Privacy](#15-security-and-privacy)
- [16. Development Commands](#16-development-commands)
- [17. Testing and Verification](#17-testing-and-verification)
- [18. Troubleshooting](#18-troubleshooting)
- [19. Future Enhancements](#19-future-enhancements)
- [20. Contributing](#20-contributing)
- [21. License](#21-license)
- [22. Acknowledgements](#22-acknowledgements)

---

## 1. Project Title

**Krishi Saathi (कृषि साथी)** — Smart Sustainable Farming & Livestock Management Platform.

---

## 2. Project Overview

Krishi Saathi is an integrated web platform bridging the digital divide for smallholder farmers, agronomists, and rural agribusinesses. The platform combines modern front-end user experience with modular server architecture, offering practical tools for day-to-day farming:

- **Bilingual and Multilingual Interface**: Supports English, Hindi (हिंदी), Marathi (मराठी), Maithili (मैथिली), and Bhojpuri (भोजपुरी).
- **Curated Educational Academies**: Divided into specialized sections for crop cultivation and animal husbandry, backed by real, verified educational video tutorials.
- **AI-Assisted Diagnostics**: Image-based plant species identification and disease diagnosis powered by Google Gemini AI with deterministic offline agronomist fallback routines.
- **Resource Planners**: Calculation utilities for balanced chemical and organic fertilizer dosing (NPK), irrigation cycles, and climate-adaptive sowing dates.
- **Rural Marketplace**: Dedicated portals for farmers to list harvests, purchase certified fertilizers and machinery, track orders, and direct-trade with verified buyers.
- **Resilient Data Architecture**: Hybrid data layer supporting production MySQL with transparent, zero-config local JSON persistence (`data/db.json`) for offline development.

---

## 3. Problem Statement

Smallholder and marginal farmers in developing agricultural economies face interconnected challenges that hinder productivity and income security:

1. **Information Asymmetry**: Access to scientific agronomic advice and pest management is often delayed, expensive, or presented in non-native languages.
2. **Resource Mismanagement**: Overuse or underuse of chemical fertilizers (Urea, DAP, MOP) degrades soil biology and inflates production costs.
3. **Pest and Disease Crop Loss**: Inability to identify fungal, bacterial, and viral crop diseases at an early stage leads to devastating harvest damage.
4. **Middlemen Exploitation**: Lack of transparent pricing and direct market access limits farmers' bargaining power when selling harvests.
5. **Fragmented Livestock Knowledge**: Smallholders lacking formal veterinary training struggle to access structured guidance on poultry brooding, dairy mastitis prevention, goat housing, and polyculture fisheries.

---

## 4. Our Solution

Krishi Saathi provides an all-in-one digital companion accessible from standard desktop, tablet, or smartphone web browsers:

- **Immediate Diagnostic Feedback**: Farmers can snap or upload a crop photo to receive disease detection, causative pathogen analysis, organic cures, and chemical treatments.
- **Stage-by-Stage Field Guides**: Step-by-step nursery, transplanting, weeding, fertigation, and harvesting instructions paired with curated HD video lessons.
- **Dedicated Animal Farming Hub**: Focused modules covering cattle housing, silage preservation, sheep vaccination, goat stall-feeding, broiler temperature curves, and zero-waste integrated circular farming.
- **Dynamic Input Planners**: Exact dosage tables for basal and top-dressing fertilization, saving input costs while protecting local soil health.
- **Direct Trade Marketplace**: Transparent digital trade channels connecting primary producers directly with buyers and equipment suppliers.
- **Offline-First Resilience**: If the internet or local database engine is unavailable, the application gracefully activates fallback routines without crashing.

---

## 5. Key Features

### 5.1 Crop Academy
- Comprehensive guides for staple seasonal crops (Rice / Paddy, Wheat).
- Modern high-profit protected cultivation (Polyhouse Off-Season Cucumber, Dutch Bucket Hydroponic Cherry Tomato).
- Sowing schedules, soil preparation, water depth requirements, and harvest criteria.
- Verified educational video tutorials with responsive 16:9 player and Theater Mode expansion.

### 5.2 Animal Farming & Aquaculture
- Eight specialized animal husbandry tracks:
  - **Dairy Farming**: Modern shed ventilation, cattle housing, high-yield silage pits, and mastitis prevention.
  - **Sheep Farming**: Elevated floor sheds, rotational grazing, and wool shearing schedules.
  - **Goat Farming**: Sirohi/Jamnapari/Barbari breed selection, stall-fed wooden slatted sheds, and creep feeding.
  - **Poultry Farming**: Broiler shed heating (95°F), rice-husk bedding, and Marek's/Lasota vaccination regimens.
  - **Pig Farming**: Commercial furrowed concrete flooring, sanitation protocols, and high-protein rations.
  - **Beekeeping (Apiculture)**: Langstroth wooden hives, queen management, and centrifugal honey extraction.
  - **Fisheries & Aquaculture**: Earthen pond liming (250 kg/ha), fingerling stocking, and Indian major carp polyculture.
  - **Integrated Farming Systems (IFS)**: Zero-waste circular integration of crops, poultry droppings, fish pond silt, and biogas slurry.

### 5.3 Plant Identification & Disease Diagnostics
- Photo-based plant identification and leaf disease inspection.
- Severity scoring, pathogen identification (fungal, bacterial, viral, physiological), organic treatment methods, and recommended chemical sprays.
- Historical diagnostic audit log for tracking field outbreaks over time.

### 5.4 Weather Advisor & Yield Forecaster
- District-level weather metric calculations (temperature, humidity, wind velocity, precipitation likelihood).
- Precautionary farming advisories for sudden heatwaves, excessive humidity, or heavy rainfall.
- Multi-factor AI yield estimation calculating expected quintals per acre based on acreage, soil type, and irrigation availability.

### 5.5 Fertilizer & Irrigation Planners
- Nitrogen (N), Phosphorus (P), and Potassium (K) dosing schedules.
- Split-application timetables (Basal dressing, vegetative tillering, panicle initiation / flowering).
- Stage-based irrigation intervals based on crop evapotranspiration and soil moisture retention.

### 5.6 Government Schemes & Subsidies
- Natural language discovery tool for central and state agricultural support initiatives (PM-KISAN, PMFBY, Soil Health Card Scheme, Sub-Mission on Agricultural Mechanization).
- Eligibility criteria, subsidy percentage breakdowns, required documents, and official application portals.

### 5.7 Agricultural Marketplace
- **Sell Crops**: Post farm produce with quantity, asking price per quintal/kg, harvesting date, and district location.
- **Buy Inputs & Tools**: Browse quality-inspected seeds, bio-fertilizers, micro-nutrients, sprayers, and implements.
- **Order Tracking**: Real-time status progression from order placement through dispatch and delivery.

### 5.8 AI Agricultural Companion
- Real-time conversational chatbot grounded in agronomy best practices.
- Multi-turn conversation history with context retention across sessions.
- Fully localized responses in user-selected regional languages.

---

## 6. Technology Stack

### Front-End
- **Framework**: React 19 (`react` 19.0.1, `react-dom` 19.0.1)
- **Build Tool**: Vite 6 (`vite` 6.2.3, `@vitejs/plugin-react` 5.0.4)
- **Styling**: Tailwind CSS 4 (`tailwindcss` 4.1.14, `@tailwindcss/vite` 4.1.14)
- **Icons**: Lucide React (`lucide-react` 0.546.0)
- **Data Visualization**: Recharts (`recharts` 3.9.2)
- **Motion & Animations**: Motion (`motion` 12.23.24)
- **HTTP Client**: Axios (`axios` 1.18.1)

### Back-End & Runtime
- **Runtime**: Node.js (v18.0.0 or higher recommended, ES Modules)
- **Server Framework**: Express 4 (`express` 4.21.2)
- **TypeScript Runtime**: TSX (`tsx` 4.21.0)
- **Bundler**: ESBuild (`esbuild` 0.25.0) for production Node server packaging
- **Security Middleware**: Helmet (`helmet` 8.3.0), CORS (`cors` 2.8.6), Express Rate Limit (`express-rate-limit` 8.7.0)
- **Authentication**: JSON Web Tokens (`jsonwebtoken` 9.0.3), BCrypt (`bcryptjs` 3.0.3)
- **Validation**: Zod (`zod` 4.6.5)

### Database & Storage
- **Primary Database**: MySQL 8.x via `mysql2/promise` (connection pooling, parameterized queries)
- **Resilient Fallback**: Local JSON persistence (`data/db.json`) enabling zero-configuration offline runs
- **Supabase Client**: `@supabase/supabase-js` (prepared adapter for cloud PostgreSQL storage)

### Artificial Intelligence
- **SDK**: `@google/genai` (version 2.4.0)
- **Models**: Gemini 2.5 Flash / Gemini 3.5 Flash for vision diagnosis, chat advice, and yield forecasting

---

## 7. System Architecture

Krishi Saathi follows a clean, decoupled client-server architecture:

```
[ Web Browser / Mobile Device ]
              │
              ▼
   [ Vite Frontend Layer ]
   React 19 Components, Tailwind CSS, Lucide Icons
              │
              ▼ HTTP / REST (JSON)
   [ Express 4 Backend Server (server.ts) ]
   ├── Middleware: Helmet, CORS, Rate Limiters, JWT Auth
   ├── Controllers: Auth, Academy, AI, Marketplace, User, Location
   ├── Services: Business logic, Gemini integration, Weather calculations
   └── Data Access Layer (src/server/db/connection.ts)
              ├── Primary: MySQL 8 Connection Pool (host:3306)
              └── Transparent Fallback: Persistent File Storage (data/db.json)
```

1. **Client Layer**: Single Page Application built with React 19, delivering fluid UI transitions, responsive modals, localized text, and interactive video embedding.
2. **Server Layer**: Modular Express application exposing structured `/api` endpoints, protecting sensitive business logic and API keys from client exposure.
3. **Service Layer**: Dedicated services isolating external integrations (Gemini AI SDK, Weather engine, Marketplace transactions).
4. **Resilient Persistence Layer**: The connection manager monitors MySQL availability. If MySQL is unreachable or unconfigured, transactions are automatically directed to `data/db.json` without process crashes.

---

## 8. Prerequisites

Before installing Krishi Saathi, ensure your local development machine meets the following requirements:

- **Node.js**: Version 18.18.0 or later (Node 20+ LTS recommended). Check using:
  ```bash
  node --version
  ```
- **Package Manager**: `npm` (version 9.0.0 or later, bundled with Node.js). Check using:
  ```bash
  npm --version
  ```
- **Git**: Version 2.30.0 or later. Check using:
  ```bash
  git --version
  ```
- **MySQL (Optional)**: MySQL Community Server 8.0+, MariaDB 10.4+, or XAMPP/WAMP if you wish to use a traditional relational database instead of the built-in JSON fallback storage.

---

## 9. Installation and Setup

Follow these steps to set up Krishi Saathi locally from scratch:

### Step 1: Clone the Repository
```bash
git clone https://github.com/namit27y-dotcom/KRISHI-SAATHI.git
cd KRISHI-SAATHI
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy the template configuration file to create your active `.env`:
```bash
# On Linux / macOS:
cp .env.example .env

# On Windows (Command Prompt):
copy .env.example .env

# On Windows (PowerShell):
Copy-Item .env.example .env
```

Open `.env` in your code editor and provide your local credentials (see [Section 10](#10-environment-variables) for details).

### Step 4: (Optional) Initialize MySQL Database
If you choose to run with MySQL:
1. Start your MySQL service (e.g., via XAMPP Control Panel or `systemctl start mysql`).
2. Log into MySQL and create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS krishi_saathi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Update `DB_USER` and `DB_PASSWORD` in your `.env` file.
4. The server automatically runs schema migrations and seeds initial educational data on first startup.

*Note: If you do not have MySQL installed, you can skip this step! Krishi Saathi will automatically initialize and store all data in `data/db.json`.*

### Step 5: Start the Development Server
```bash
npm run dev
```

The unified development server will launch at:
- **Local Application URL**: `http://localhost:3000`
- **Backend Health Check**: `http://localhost:3000/api/health`

---

## 10. Environment Variables

The table below outlines all supported environment variables. Place these in `.env` in the project root:

| Variable | Required | Default | Description |
| :--- | :---: | :---: | :--- |
| `NODE_ENV` | No | `development` | Runtime environment (`development` or `production`). |
| `PORT` | No | `3000` | HTTP port for the unified Express server. |
| `DB_HOST` | No | `localhost` | Hostname for the MySQL server. |
| `DB_PORT` | No | `3306` | Port for the MySQL server. |
| `DB_NAME` | No | `krishi_saathi` | Target database name. |
| `DB_USER` | No | `root` | Database username. |
| `DB_PASSWORD` | No | *empty* | Database password. |
| `JWT_SECRET` | Recommended | *default key* | Secret string used to sign user authentication tokens. |
| `JWT_EXPIRES_IN`| No | `7d` | Token expiry duration (e.g., `7d`, `24h`). |
| `GEMINI_API_KEY` | Optional | *empty* | Google Gemini API key for live AI diagnosis and chat. |
| `WEATHER_API_KEY` | Optional | *empty* | Third-party meteorological provider key. |
| `VITE_GOOGLE_MAPS_API_KEY` | Optional | *empty* | Client-side Google Maps API key for geolocation picker. |
| `VITE_WEATHER_API_KEY` | Optional | *empty* | Client-side weather API key. |
| `APP_URL` | No | `http://localhost:3000` | Base URL of the running application. |
| `FRONTEND_URL` | No | `http://localhost:3000` | Client origin allowed by CORS middleware. |
| `CORS_ORIGIN` | No | `*` | Allowed CORS header origin in API responses. |

> [!WARNING]
> **Client-Side Exposure Rule**: Any variable starting with the `VITE_` prefix (such as `VITE_GOOGLE_MAPS_API_KEY` or `VITE_WEATHER_API_KEY`) is bundled by Vite into client-side JavaScript and is visible to anyone inspecting web traffic in the browser. **Never** prefix private secrets, database credentials, or secret keys with `VITE_`.

---

## 11. API Integrations

### 11.1 Google Gemini AI (`@google/genai`)
- **Implemented In**: `src/server/gemini.ts`, `src/server/services/aiService.ts`
- **Capabilities**:
  - Multimodal analysis of plant leaf images to classify crop diseases and suggest treatments.
  - Conversational context handling for the agricultural assistant chat.
  - Crop yield forecasting based on soil, irrigation, and acreage metrics.
- **Graceful Fallback**: If `GEMINI_API_KEY` is not provided or API quota is exceeded, the server transparently serves comprehensive, rule-based agronomist diagnostics and domain heuristics.

### 11.2 Weather Service
- **Implemented In**: `src/server/services/weatherService.ts`
- **Current Behavior Disclosure**: Weather predictions returned by `/api/weather/current` are dynamically generated using meteorological simulation algorithms based on geographic districts. They provide realistic agricultural forecasts and stress-testing advisories without requiring an active third-party subscription.

### 11.3 YouTube IFrame Player
- **Implemented In**: `src/components/CropAcademy.tsx`
- **Capabilities**: Embeds verified, authentic agricultural training videos directly into responsive modals using standard `https://www.youtube.com/embed/...` with hardware-accelerated playback and full-screen controls.

---

## 12. Project Structure

A high-level map of the Krishi Saathi codebase:

```
KRISHI-SAATHI/
├── data/
│   └── db.json                    # Persistent fallback database for zero-config offline runs
├── public/
│   ├── favicon.svg                # Application favicon
│   └── images/                    # Local image assets
│       └── academy/               # Crop and animal category photography
├── src/
│   ├── components/                # Modular React UI components
│   │   ├── AICompanion.tsx        # Agronomy conversational chatbot
│   │   ├── AdminDashboard.tsx     # Administrator analytics and user management
│   │   ├── AuthScreen.tsx         # User authentication (Login / Registration)
│   │   ├── BuyerDashboard.tsx     # Marketplace buyer order history and bidding
│   │   ├── CheckoutFlow.tsx       # Equipment and input purchase checkout
│   │   ├── CropAcademy.tsx        # Crop cultivation and animal husbandry academies
│   │   ├── DiseaseDetector.tsx    # Leaf disease photo diagnosis
│   │   ├── FloatingHelper.tsx     # Persistent floating agricultural quick-help
│   │   ├── GovSchemes.tsx         # Central and state farmer schemes finder
│   │   ├── MarketplaceBuy.tsx     # Input and machinery catalog
│   │   ├── MarketplaceSell.tsx    # Harvest listing interface for farmers
│   │   ├── NotificationPanel.tsx  # System alerts and order notification toasts
│   │   ├── Planners.tsx           # Fertilizer NPK and irrigation planners
│   │   ├── SellerDashboard.tsx    # Farmer sales metrics and listing controls
│   │   └── WeatherAdvisor.tsx     # Weather forecasts and seasonal crop advisor
│   ├── server/                    # Modular Express backend architecture
│   │   ├── config/
│   │   │   └── env.ts             # Validated environment settings
│   │   ├── controllers/          # HTTP request handlers
│   │   │   ├── academyController.ts
│   │   │   ├── aiController.ts
│   │   │   ├── authController.ts
│   │   │   ├── marketplaceController.ts
│   │   │   └── userController.ts
│   │   ├── db/
│   │   │   ├── connection.ts      # Dual-mode MySQL / JSON fallback connection pool
│   │   │   ├── migrations.ts      # Automatic schema table migrations
│   │   │   ├── schema.sql         # Canonical DDL SQL schema
│   │   │   └── seed.ts            # Educational courses and video seed data
│   │   ├── middleware/
│   │   │   ├── auth.ts            # JWT token verification
│   │   │   ├── errorHandler.ts    # Centralized HTTP error handler
│   │   │   └── rateLimiter.ts     # IP-based API rate limiting
│   │   ├── routes/                # Express router definitions
│   │   │   ├── academyRoutes.ts
│   │   │   ├── aiRoutes.ts
│   │   │   ├── authRoutes.ts
│   │   │   ├── marketplaceRoutes.ts
│   │   │   └── index.ts
│   │   └── services/              # Domain business logic & external integrations
│   │       ├── academyService.ts
│   │       ├── aiService.ts
│   │       ├── authService.ts
│   │       ├── marketplaceService.ts
│   │       └── weatherService.ts
│   ├── App.tsx                    # Main application router and state coordinator
│   ├── index.css                  # Core design tokens and Tailwind 4 imports
│   ├── main.tsx                   # React client application root mount
│   └── types.ts                   # Core TypeScript data contracts and interfaces
├── .env.example                   # Clean template for environment variables
├── package.json                   # NPM dependencies and scripts
├── server.ts                      # Backend entry point and Vite middleware coordinator
├── tsconfig.json                  # TypeScript compiler configuration
└── vite.config.ts                 # Vite bundler configuration
```

---

## 13. Database and Storage

Krishi Saathi features a hybrid persistence architecture engineered for reliability across both cloud servers and offline local development environments:

### 13.1 Production Mode: MySQL 8.x
- **Connection**: Managed via connection pooling (`mysql2/promise`) with a 5,000ms safety connection timeout.
- **Schema**: Defined in `src/server/db/schema.sql` encompassing relational tables:
  - `users` (accounts, role-based access for farmers, buyers, admins)
  - `categories`, `courses`, `modules`, `lessons`, `lesson_videos` (curriculum and YouTube references)
  - `user_progress` (completed lessons, last watch timestamps)
  - `plant_species`, `plant_id_logs`, `disease_reports` (diagnostic records)
  - `crop_listings`, `marketplace_products`, `orders` (commerce)
  - `weather_records`, `fertilizer_plans`, `irrigation_plans` (calculations)

### 13.2 Development & Offline Mode: Persistent JSON Fallback
- **Location**: `data/db.json`
- **Behavior**: If MySQL is offline, credentials fail, or network connectivity is interrupted, the database client automatically switches to file-based JSON persistence without terminating the server.
- **Data Parity**: Data written during fallback mode is immediately flushed to disk, ensuring user registrations, progress updates, and market listings persist across server restarts.
- **Inspection**: The active storage engine can be verified anytime by querying `GET /api/health`.

---

## 14. Educational Video System

All educational tracks feature real, verified instructional videos from recognized agricultural institutions and agronomists:

### 14.1 Verified Video Inventory
The platform integrates 24 verified educational videos across 12 distinct tracks:
1. **Rice (Paddy)**: Nursery bed management (`-eBrAm64fpg`), SRI transplantation (`id5LgdTMCtE`), deep water management (`4-PW4NrLNRk`).
2. **Wheat**: High-yield seedbed line sowing (`JN0ICendQns`), Crown Root Irrigation CRI (`G1nL_mFLn-A`).
3. **Off-Season Cucumber**: Polyhouse trellis pruning (`wQ5Qr_PL8eU`), drip fertigation schedule (`etI-95vwdgo`).
4. **Hydroponic Cherry Tomato**: Dutch bucket setup (`wxMIq2E6X_Q`), vine pruning & cluster harvesting (`j4EFjxCUmN8`).
5. **Dairy Farming**: Modern cross-ventilated cattle housing (`vA0A1WzinbI`), high-protein anaerobic silage pits (`wDT0JmOGRw4`).
6. **Sheep Husbandry**: Elevated slatted shed construction (`DMQDRAffiUw`), lamb vaccination and wool shearing (`4VDlIFV3qIM`).
7. **Goat Farming**: Sirohi & Barbari stall-fed breed selection (`DdEjvOBEnwI`), wooden slotted shed layout (`3SxADJwDW9Y`).
8. **Poultry Farming**: Broiler chick brooding temperature control (`CHJMfkOvOGk`), balanced feed conversion rations (`_z8mg6NIJM4`).
9. **Pig Farming**: Concrete furrowed floor sanitation & protein feeding (`67x4_mLm0mo`).
10. **Beekeeping**: Langstroth brood box frames (`dzf2a0mcCvE`), centrifugal honey extraction (`tZ3DZ1Z3i0c`).
11. **Fisheries & Aquaculture**: Earthen pond lime application (`RNQxV7zdoyc`), composite carp polyculture feeding (`xOLdDsCekQY`).
12. **Integrated Farming Systems**: Zero-waste circular farm integration (`FCTNm27o5Ug`), cattle biogas slurry vermicomposting (`58Xj4PYSCSo`).

### 14.2 High-Definition Embed Configuration
- **Standard YouTube Embed**: Utilizes standard `https://www.youtube.com/embed/...` allowing YouTube's adaptive bitrate (ABR) algorithm to leverage user screen size and network speed.
- **Adaptive Sizing**: Player modal renders at `max-w-4xl` to `max-w-5xl` (896px–1024px) exceeding YouTube's 854px breakpoint, prompting the player to deliver 720p HD or 1080p FHD streams.
- **Theater Mode**: Interactive expansion button (`max-w-6xl` / 1152px) for high-clarity viewing of diagrams and agronomic procedures.
- **Full Fallback**: Every video modal retains a direct "Watch on YouTube" external link with full native player settings.

---

## 15. Security and Privacy

Krishi Saathi adheres to secure development best practices:

- **Secret Protection**: API keys, database passwords, and JWT signing keys are managed strictly via environment variables. Tracked repository files contain zero active credentials.
- **HTTP Security Headers**: Express incorporates `helmet` to apply secure HTTP headers (X-Frame-Options, Content-Security-Policy allowances for YouTube, Strict-Transport-Security).
- **Authentication**: User passwords are encrypted with `bcryptjs` using 10 salt rounds. Stateless authentication utilizes HMAC-SHA256 signed JSON Web Tokens (`jsonwebtoken`).
- **Rate Limiting**: AI and diagnostic endpoints are throttled using `express-rate-limit` to prevent automated scraping or denial-of-service abuse.
- **SQL Injection Prevention**: All SQL statements executed against MySQL employ prepared statements with parameterized inputs (`?`).

---

## 16. Development Commands

The following scripts are defined in `package.json`:

```bash
# Start development server with live TypeScript compilation
npm run dev

# Run static type checking across the entire TypeScript codebase
npm run lint

# Build production bundles (Vite client assets + ESBuild server bundle)
npm run build

# Start the compiled production server
npm run start

# Clean generated production build artifacts
npm run clean
```

---

## 17. Testing and Verification

Before committing changes or publishing updates, verify the application with these automated checks:

### 1. Static Type Checking
```bash
npm run lint
```
*Expected result: Exits with code 0 and zero TypeScript diagnostic errors.*

### 2. Production Bundle Verification
```bash
npm run build
```
*Expected result: Successfully emits optimized client bundles to `dist/` and standalone server bundle to `dist/server.cjs`.*

### 3. Server Startup & Health Audit
```bash
# In terminal 1:
npm run dev

# In terminal 2:
curl http://localhost:3000/api/health
```
*Expected result: HTTP 200 with JSON payload reporting `"status": "healthy"` and active storage mode.*

---

## 18. Troubleshooting

### 1. Port 3000 Already in Use (`EADDRINUSE`)
- **Cause**: A previous instance of the server is still running in the background.
- **Solution**: Terminate the existing process or run on a different port:
  ```bash
  # Windows PowerShell:
  Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

  # Linux / macOS:
  lsof -ti :3000 | xargs kill -9
  ```

### 2. MySQL Connection Access Denied
- **Cause**: MySQL service is not running, or password in `.env` does not match your MySQL root user.
- **Solution**: No action is strictly required! Krishi Saathi will automatically log a notification and switch to persistent JSON storage in `data/db.json`. If you wish to use MySQL, verify your credentials with `mysql -u root -p` and update `DB_PASSWORD` in `.env`.

### 3. Gemini AI Returning Simulated Results
- **Cause**: `GEMINI_API_KEY` is empty, invalid, or has reached Google quota limits.
- **Solution**: Obtain a free API key and set `GEMINI_API_KEY=your_key` in `.env`. Restart the server with `npm run dev`.

---

## 19. Future Enhancements

- [ ] **Native Mobile Application**: Build React Native / Expo clients for low-bandwidth mobile devices.
- [ ] **Offline Satellite Vegetation Indices (NDVI)**: Integrate Sentinel-2 imagery for farm-level chlorophyll and moisture monitoring.
- [ ] **Voice-First Regional Input**: Add native speech-to-text recognition in rural dialects for hands-free query submission.
- [ ] **Direct Payment Gateway Integration**: Connect Razorpay / UPI test modes for secure digital escrow settlements.
- [ ] **IoT Sensor Integration**: Enable telemetry ingestion from LoRaWAN soil moisture probes and automated drip valves.

---

## 20. Contributing

We welcome contributions from agronomists, software developers, and translators!

1. Fork the repository on GitHub.
2. Create a dedicated feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes following standard conventional commit messages (`feat: ...`, `fix: ...`, `docs: ...`).
4. Ensure `npm run lint` and `npm run build` pass with zero errors.
5. Push to your fork and submit a Pull Request to `main`.

---

## 21. License

No license has been specified for this project. All rights are reserved by the original repository authors. If you plan to distribute, modify, or use this code commercially, please contact the maintainers for permission.

---

## 22. Acknowledgements

- **Indian Council of Agricultural Research (ICAR)** and state agricultural universities for foundational agronomic guidelines.
- **Open Educational Resources**: Discover Agriculture, Green TV India, Shramajeevi, and National Dairy Research Institute (NDRI) for instructional farming video content.
- **Open-Source Community**: Maintainers of React, Vite, Tailwind CSS, Express, and Lucide Icons for powering the modern web ecosystem.
