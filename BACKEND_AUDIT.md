# Krishi Saathi: Backend Architecture Audit & Migration Plan

## 1. Current Architecture
- **Runtime & Framework**: Node.js + Express + TypeScript (run with `tsx` in dev, `esbuild` in build).
- **Frontend Integration**: Vite SPA (`src/App.tsx`) served via Vite middleware in dev or `express.static('dist')` in production.
- **Server Entrypoint**: `server.ts` handles all routing, business logic, fallback data generators, and static serving in a monolithic file (~1729 lines).
- **Communication Protocol**: REST APIs with JSON payloads (with Base64 image payloads for disease diagnosis and plant identification).

---

## 2. Existing APIs
The application exposes the following endpoints:

### Authentication & Profiles
- `POST /api/auth/register`: User registration with role details.
- `POST /api/auth/login`: User login returning mock token `mock-jwt-token-{userId}`.
- `GET /api/auth/profile`: Fetches authenticated user profile.
- `PUT /api/auth/profile/update`: Updates profile data.

### Marketplace (Crops & Products)
- `GET /api/marketplace/crops`: Filterable crop listings (country, state, district, cropName, onlyVerified).
- `POST /api/marketplace/crops`: Create crop listing (farmer role required).
- `PUT /api/marketplace/crops/:id`: Update crop listing.
- `DELETE /api/marketplace/crops/:id`: Delete crop listing.
- `PUT /api/marketplace/crops/:id/verify`: Admin approve/disapprove crop listing.
- `GET /api/marketplace/products`: Filterable agricultural products (category, onlyVerified).
- `POST /api/marketplace/products`: Create seller product (seller role required).
- `PUT /api/marketplace/products/:id`: Update seller product.
- `DELETE /api/marketplace/products/:id`: Delete seller product.
- `PUT /api/marketplace/products/:id/verify`: Admin approve/disapprove product.

### Marketplace Orders & Payments
- `GET /api/marketplace/orders`: Role-based order filtering (farmer, seller, buyer, admin).
- `POST /api/marketplace/orders`: Create order (calculates GST, delivery charge, discount; reduces product inventory).
- `PUT /api/marketplace/orders/:id`: Update order status & payment status.
- `POST /api/payments/initiate`: Initiate UPI transaction and generate UPI intent URL.
- `POST /api/payments/verify`: Verify UPI payment signature and update order status.
- `POST /api/payments/webhook`: Webhook receiver for payment gateways.
- `GET /api/payments/status/:id`: Fetch payment record status.
- `GET /api/payments/receipt/:id`: Renders HTML printable invoice/tax receipt.
- `GET /api/payments/history`: List payment records for user or admin.

### Direct Trade Chats
- `GET /api/marketplace/chats`: Get conversation logs between two users (`userA`, `userB`).
- `POST /api/marketplace/chats`: Send message between buyer, seller, and farmer.

### Admin Operations
- `GET /api/admin/users`: List all platform users (admin role check).
- `PUT /api/admin/users/:id/verify`: Toggle user verification status.
- `DELETE /api/admin/users/:id`: Delete user account.

### AI & Agronomy Features (Gemini)
- `GET /api/plant-species`: Pre-seeded reference plant species.
- `POST /api/plant-id/analyze`: Multimodal plant & soil vision identification.
- `GET /api/plant-id/logs`: User plant ID history.
- `POST /api/disease/analyze`: Crop disease diagnostic vision model.
- `GET /api/disease/reports`: User disease report history.
- `POST /api/weather/recommend`: AI crop recommendations based on weather, season, soil.
- `POST /api/gemini/yield-forecast`: Predictive yield forecasting engine.
- `POST /api/plans/fertilizer`: Customized fertilizer dosage plan.
- `POST /api/plans/irrigation`: Customized irrigation schedule and water conservation advice.
- `POST /api/schemes/query`: AI query assistant for Government schemes.
- `POST /api/chat`: AI Farming Assistant chatbot.
- `GET /api/chat/history`: User chatbot message history.

### Notifications & Utilities
- `GET /api/notifications`: Retrieve user notifications.
- `POST /api/notifications`: Create notification.
- `POST /api/notifications/:id/read`: Mark notification as read.
- `GET /api/weather/current`: Live weather simulation based on district/state.
- `GET /api/db/create-script`: Download reference SQL table script.

---

## 3. Existing Database
- **Current Persistence**: In-memory JavaScript object backed by a local JSON file (`data/db.json`) inside `src/server/db.ts`.
- **Secondary Sync**: Optional `supabase.ts` file attempting fire-and-forget sync to Supabase if environment variables are set.
- **Flaws**:
  - No atomicity / transaction support for inventory deduction.
  - Race conditions during concurrent writes.
  - File I/O overhead on every single mutation (`this.save()` synchronous write).
  - No relational constraints, indexes, or cascade deletes in storage.

---

## 4. Existing Authentication
- Current auth uses plain mock strings (`mock-jwt-token-{userId}`).
- Passwords stored in plain text or simple string comparison (`record.passwordHash !== password`).
- Authorization headers manually stripped: `authHeader.split(" ")[1].replace("mock-jwt-token-", "")`.
- Missing genuine JWT signing/verification, expiry handling, and bcrypt hashing.

---

## 5. Existing Roles
- `farmer`: Accesses crop selling, equipment buying, farm profile, AI agronomy tools.
- `seller`: Manages store products, stock inventory, dealer dashboard.
- `buyer`: Browses crop marketplace, places wholesale/retail orders.
- `admin`: Verifies users, crop listings, products; views system payments and user management.

---

## 6. Existing Entities
1. `Users`: User profiles, credentials, role, land metrics, soil type, language, location.
2. `PlantSpecies` & `PlantLocalNames`: Botanical reference species and regional names.
3. `PlantDiseasesReference`: Reusable plant disease database.
4. `PlantIdentificationLogs`: Log of photo identification sessions.
5. `DiseaseReports`: Log of disease diagnosis sessions.
6. `WeatherRecords`: Cached weather observations and alerts.
7. `FertilizerPlans`: Generated fertilizer schedules.
8. `IrrigationPlans`: Generated watering plans.
9. `ChatHistory` & `MarketplaceChats`: AI assistant history and P2P direct trade chats.
10. `Notifications`: System alerts, order updates, disease warnings.
11. `CropListings`: Farmer marketplace listings.
12. `AgriculturalProducts`: Seller store inventory.
13. `MarketplaceOrders`: Direct crop and product orders.
14. `Payments` & `Transactions`: Payment logs, UPI references, and transaction records.

---

## 7. Existing AI Integrations
- Integrated with `@google/genai` using model `gemini-3.5-flash` with agronomist fallback routines.
- Covers:
  - Plant ID ("Snap & Know")
  - Disease Detection
  - Crop Recommendations
  - Yield Forecasting
  - Fertilizer & Irrigation Planners
  - Government Schemes Querying
  - AI Farming Companion Chat

---

## 8. Existing Marketplace Functionality
- Direct peer-to-peer farmer-to-buyer crop trading.
- Agricultural seller-to-farmer equipment and input sales.
- Automated tax (5% GST), freight/delivery charge calculations, and order creation.
- Basic inventory adjustment on order placement (needs atomic transaction & rollback).
- UPI payment initiation, simulated signature verification, and invoice printing.

---

## 9. Security Issues & Vulnerabilities
1. **Mock Authentication**: Plaintext tokens permit trivial spoofing of any user or admin ID.
2. **Plaintext Passwords**: No bcrypt hashing applied to user passwords.
3. **No Centralized Authorization Middleware**: Route handlers parse tokens ad-hoc without cryptographic signature validation.
4. **No Ownership Validation on Mutations**: Listing updates and deletions rely on frontend-supplied IDs without checking `farmerId === req.user.id` or `sellerId === req.user.id`.
5. **Missing Security Headers**: No `helmet` protection against XSS, clickjacking, MIME-sniffing.
6. **Unrestricted CORS / Body Limits**: 50MB global JSON limit open to potential denial of service.
7. **No Rate Limiting**: AI endpoints and authentication endpoints lack brute-force or abuse protection.
8. **No SQL Injection Defense / Parameterization**: Current JSON DB is susceptible to memory poisoning; migration must use strictly parameterized queries.

---

## 10. Migration Plan
1. **Dependencies**: Install `mysql2`, `jsonwebtoken`, `bcryptjs`, `zod`, `helmet`, `cors`, `express-rate-limit`, and their TypeScript `@types`.
2. **Modular Architecture**:
   - `src/server/config/`: Environment config, database pool, JWT secrets.
   - `src/server/db/`: MySQL connection pool, migration scripts, seed runners, schema definitions.
   - `src/server/middleware/`: JWT authentication, role-based authorization, ownership checks, rate limiters, input validation, error handling.
   - `src/server/validators/`: Zod schemas for auth, marketplace, orders, academy, AI, location.
   - `src/server/services/`: Database query services with parameterized SQL, transactions, cascading logic.
   - `src/server/controllers/` & `src/server/routes/`: Route declarations maintaining existing endpoints and adding new ones.
3. **Schema & Migration**:
   - Create fully normalized MySQL schema supporting Users, Roles, Farm Profiles, Crop Listings, Agricultural Products, Orders, Order Items, Cart, Reviews, Notifications, Conversations & Messages, Plant Species, Disease Reports, AI History, Farming Academy Courses, Modules, Lessons, Translations, Animal & Fish Farming Categories, and GPS / Location profiles.
4. **Bilingual & Localization System**:
   - Store canonical geographic data and provide dynamic bilingual display mappings for English (`en`), Hindi (`hi`), Marathi (`mr`), Maithili (`mai`), and Bhojpuri (`bho`).
5. **Animal & Fish Farming Expansion**:
   - Backend support for Dairy, Sheep, Goat, Poultry, Pig, Beekeeping, Fisheries/Aquaculture, and Integrated Livestock Farming with courses, modules, lessons, quizzes, and multilingual translations.
6. **Gemini AI Extensions**:
   - Extend prompts and schemas for livestock, veterinary safety disclaimers, bilingual outputs, and persistent AI history.
7. **Frontend Compatibility Verification**:
   - Verify all React hooks, forms, API calls, and headers (`Authorization: Bearer <jwt>`) seamlessly work with zero regressions.
