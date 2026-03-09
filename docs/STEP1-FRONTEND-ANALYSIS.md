# STEP 1 — Frontend Analysis Report

## 1. Application Overview

**Name:** NextStep.xyz  
**Purpose:** A service-oriented website for career growth, higher education, digital services, and travel solutions. The application allows visitors to browse service categories and sub-services, view packages, apply for jobs and scholarships, and submit inquiries. An admin panel allows managing content (services, packages, jobs, scholarships), form submissions, and website settings.

**Tech Stack (Frontend):**
- React 18 with TypeScript
- Vite 6
- React Router DOM 7
- Tailwind CSS 4
- Lucide React (icons)
- Sonner (toasts)
- No Redux — state is managed via **React Context** (`AppContext`) and a custom **API layer** (`src/app/utils/api.ts`) that currently targets a **Supabase Edge Function** URL.

**Current Data Source:**  
The frontend is designed to work with a backend API. When the API is unavailable or returns empty data, it falls back to **local mock data** from `src/app/data/mockData.ts`. The API module in `src/app/utils/api.ts` already defines the expected endpoints and response shapes for a future backend.

---

## 2. Implemented Features

| Feature | Description | Where |
|--------|-------------|--------|
| **Public website** | Home, services by category, service detail, jobs list, scholarships list | `Home`, `ServiceCategory`, `ServiceDetail`, `Jobs`, `Scholarships` |
| **Inquiry form** | Submit request for a service/package, job, or scholarship (fullName, phone, email, message, optional files) | `InquiryForm` |
| **Admin auth** | Login, signup, session check, logout, protected routes | `AdminLogin`, `AdminSignup`, `AppContext`, `App.tsx` |
| **Admin dashboard** | Overview with counts and quick links to manage services, packages, jobs, scholarships, submissions, settings | `AdminDashboard` |
| **Manage services** | CRUD for sub-services (name, category, descriptions, features, benefits); search and filter by category | `ManageServices` |
| **Manage packages** | CRUD for packages (name, service, description, price, displayPrice, features); filter by service | `ManagePackages` |
| **Manage jobs** | CRUD for jobs; toggle active/inactive; search | `ManageJobs` |
| **Manage scholarships** | CRUD for scholarships; toggle active/inactive; search | `ManageScholarships` |
| **Manage submissions** | List form submissions; filter by status; update status; delete | `ManageSubmissions` |
| **Manage settings** | Site name, contact info, social links, about/footer text | `ManageSettings` |
| **Categories** | Used in dropdowns and navigation; loaded from API or mock; CRUD in context but no dedicated admin UI | `AppContext`, `Header`, `Footer`, `ServiceCategory`, `ManageServices` |
| **Data initialization** | When categories from API are empty, frontend calls `/init` with full mock payload to seed DB | `AppContext` |

---

## 3. Pages and UI Components

### Public routes (with Header + Footer)

| Route | Component | Purpose |
|-------|-----------|--------|
| `/` | `Home` | Hero, features, service categories, latest jobs, latest scholarships, CTA, stats |
| `/services/:categoryId` | `ServiceCategory` | List sub-services for a category |
| `/service/:serviceId` | `ServiceDetail` | Service details, features, benefits, packages, “Apply” / “Request Quote” |
| `/inquiry` | `InquiryForm` | Form with query params: `?package=`, `?service=`, `?job=`, `?scholarship=` |
| `/jobs` | `Jobs` | List active jobs with apply actions |
| `/scholarships` | `Scholarships` | List active scholarships with apply actions |
| `/signup` | `SignUpPage` | Placeholder sign up / log in (demo) |
| `/privacy` | `PrivacyPage` | Placeholder privacy policy |
| `/terms` | `TermsPage` | Placeholder terms |

### Admin routes

| Route | Component | Purpose |
|-------|-----------|--------|
| `/admin/login` | `AdminLogin` | Email/password login |
| `/admin/signup` | `AdminSignup` | Name, email, password, confirm password |
| `/admin/dashboard` | `AdminDashboard` | Stats + quick links |
| `/admin/services` | `ManageServices` | Sub-services table + modal CRUD |
| `/admin/packages` | `ManagePackages` | Packages table + modal CRUD |
| `/admin/jobs` | `ManageJobs` | Jobs list + modal CRUD + status toggle |
| `/admin/scholarships` | `ManageScholarships` | Scholarships list + modal CRUD + status toggle |
| `/admin/submissions` | `ManageSubmissions` | Submissions list + status + delete |
| `/admin/settings` | `ManageSettings` | Settings form (site, contact, social, about, footer) |

### Shared components

- **Header** — Logo, nav (Home, Job Apply, Scholarship Apply, Services mega menu, Sign Up, Admin Panel), mobile menu; uses `serviceCategories` and `subServices` from context.
- **Footer** — About, service category links, quick links, contact (currently hardcoded; settings could drive this later).

---

## 4. Fake / Mock Data Structures

Defined in `src/app/data/mockData.ts`:

### ServiceCategory
```ts
{
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
}
```

### SubService
```ts
{
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  benefits: string[];
  categoryId: string;
  icon?: string;
  image?: string;
}
```

### Package
```ts
{
  id: string;
  serviceId: string;
  name: string;
  description: string;
  features: string[];
  price: string;
  displayPrice?: boolean;
}
```

### Job
```ts
{
  id: string;
  title: string;
  organization: string;
  deadline: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  externalLink?: string;
  status: 'active' | 'inactive';
}
```

### Scholarship
```ts
{
  id: string;
  title: string;
  organization: string;
  deadline: string;
  country: string;
  level: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  externalLink?: string;
  status: 'active' | 'inactive';
}
```

### FormSubmission
```ts
{
  id: string;
  type: 'service' | 'job' | 'scholarship';
  servicePackageId?: string;
  jobId?: string;
  scholarshipId?: string;
  fullName: string;
  phone: string;
  email: string;
  message?: string;
  files?: string[];
  submittedAt: string;
  status: 'pending' | 'contacted' | 'completed';
}
```

**Note:** `InquiryForm` uses `servicePackageId: packageId || serviceId` (one field for either package or service context).

Mock arrays: `serviceCategories` (4), `subServices` (36), `packages` (9), `jobs` (3), `scholarships` (3).

---

## 5. State Management (Context, Not Redux)

**File:** `src/app/context/AppContext.tsx`

**State held in context:**
- `categories`, `subServices`, `packages`, `jobs`, `scholarships`, `formSubmissions`, `settings`
- `loading`, `isAdminLoggedIn`, `dataInitialized` (for init flow)

**Data flow:**
- On load: session check via `authAPI.getSession()`; then `refreshData()` fetches categories, subservices, packages, jobs, scholarships, settings (and submissions when admin).
- If `categoriesData.length === 0` and not yet initialized: `initAPI.initializeData({ categories, subservices, packages, jobs, scholarships })` then refetch.
- On API failure: fallback to mock arrays (categories always from mock when API categories empty).
- All CRUD and auth actions call the API layer then `refreshData()` (or logout) to keep state in sync.

There is **no Redux**; the instructions’ mention of “Redux state” and “RTK Query” will apply when we **add** RTK Query and optionally a store in Step 6.

---

## 6. Forms and Validations

| Form | Required fields | Validation | Notes |
|------|-----------------|------------|--------|
| **Admin login** | email, password | Required only | Error from API shown |
| **Admin signup** | name, email, password, confirmPassword | Password ≥ 6 chars, passwords match | Client-side |
| **Inquiry** | fullName, phone, email | Required only | message optional; file input present but not wired to upload/API |
| **ManageServices** | name, categoryId, shortDescription, fullDescription | Required; features/benefits arrays trimmed | Empty array items filtered out on submit |
| **ManagePackages** | name, serviceId, description, price | Required; displayPrice boolean | Same for features |
| **ManageJobs** | title, organization, deadline, location, type, description, status | Required | requirements array; externalLink optional |
| **ManageScholarships** | title, organization, deadline, country, level, description, status | Required | eligibility, benefits arrays; externalLink optional |
| **ManageSettings** | siteName, contactEmail, contactPhone, address | Required in UI | Rest optional (social, about, footer, whatsapp) |

No shared validation library (e.g. Zod/Yup) is used; validation is inline and minimal.

---

## 7. CRUD Operations Implemented

All go through `AppContext` and `src/app/utils/api.ts`:

| Resource | List | Create | Update | Delete |
|----------|------|--------|--------|--------|
| Categories | GET /categories → `data.categories` | POST /categories → `data.category` | PUT /categories/:id → `data.category` | DELETE /categories/:id |
| Sub-services | GET /subservices → `data.subservices` | POST /subservices → `data.subservice` | PUT /subservices/:id → `data.subservice` | DELETE /subservices/:id |
| Packages | GET /packages → `data.packages` | POST /packages → `data.package` | PUT /packages/:id → `data.package` | DELETE /packages/:id |
| Jobs | GET /jobs → `data.jobs` | POST /jobs → `data.job` | PUT /jobs/:id → `data.job` | DELETE /jobs/:id |
| Scholarships | GET /scholarships → `data.scholarships` | POST /scholarships → `data.scholarship` | PUT /scholarships/:id → `data.scholarship` | DELETE /scholarships/:id |
| Submissions | GET /submissions → `data.submissions` | POST /submissions → `data.submission` | PUT /submissions/:id → `data.submission` | DELETE /submissions/:id |
| Settings | GET /settings → `data.settings` | — | PUT /settings → `data.settings` | — |
| Auth | GET /auth/session | POST /auth/signup, POST /auth/login | — | POST /auth/logout |
| Init | — | POST /init (body: categories, subservices, packages, jobs, scholarships) | — | — |
| Upload | — | POST /upload (auth), POST /upload-public (anon) | — | — |
| Stats | GET /stats → `data.stats` | — | — | — |

---

## 8. Expected API Response Shapes

Inferred from `api.ts` and usage:

- **Categories:** `{ categories: ServiceCategory[] }`
- **Single category (create/update):** `{ category: ServiceCategory }`
- **Sub-services:** `{ subservices: SubService[] }`
- **Single sub-service:** `{ subservice: SubService }`
- **Packages:** `{ packages: Package[] }`
- **Single package:** `{ package: Package }`
- **Jobs:** `{ jobs: Job[] }`
- **Single job:** `{ job: Job }`
- **Scholarships:** `{ scholarships: Scholarship[] }`
- **Single scholarship:** `{ scholarship: Scholarship }`
- **Submissions:** `{ submissions: FormSubmission[] }`
- **Single submission:** `{ submission: FormSubmission }`
- **Settings:** `{ settings: SettingsObject }` (single object)
- **Auth login:** `{ access_token: string }` (frontend stores as `admin_token`)
- **Stats:** `{ stats: ... }` (used by dashboard for counts; can be derived from list lengths if not implemented)

**Auth:** All authenticated requests send `Authorization: Bearer <admin_token>`.

---

## 9. Data Models (Summary for Backend)

| Entity | Key fields | Relationships |
|--------|------------|----------------|
| **ServiceCategory** | id, name, color, icon, description | One-to-many SubService |
| **SubService** | id, categoryId, name, shortDescription, fullDescription, features[], benefits[], icon?, image? | Belongs to ServiceCategory; one-to-many Package |
| **Package** | id, serviceId, name, description, features[], price, displayPrice? | Belongs to SubService |
| **Job** | id, title, organization, deadline, location, type, description, requirements[], externalLink?, status | — |
| **Scholarship** | id, title, organization, deadline, country, level, description, eligibility[], benefits[], externalLink?, status | — |
| **FormSubmission** | id, type, servicePackageId?, jobId?, scholarshipId?, fullName, phone, email, message?, files?, submittedAt, status | Optional refs to Package/Job/Scholarship (by id) |
| **Settings** | Single row/object: siteName, contactEmail, contactPhone, address, facebook, twitter, linkedin, instagram, whatsapp, aboutText, footerText | — |
| **Admin/User** | For auth: email, password (hash), name | — |

---

## 10. Frontend Inconsistencies to Align With Backend

1. **Home.tsx** uses different field names for jobs/scholarships than the rest of the app:
   - Jobs: uses `job.company`, `job.postedDate`, `job.salary`, `job.experience` (mock has `organization` only; no `postedDate`, `salary`, `experience`).
   - Scholarships: uses `scholarship.provider`, `scholarship.amount`, `scholarship.field` (mock has `organization` only; no `provider`, `amount`, `field`).
   - **Recommendation:** Backend should follow the canonical mock/context types. When connecting the frontend, either:
   - Update Home to use `organization` and e.g. `createdAt` for “Posted” date and remove `salary`/`experience` and `provider`/`amount`/`field`, or
   - Add optional fields to the backend and extend types so Home can use them without breaking admin/other pages.

2. **InquiryForm** generates `id: \`sub-${Date.now()}\`` and does not upload files to the API (file input not connected). Backend should assign IDs; file upload can be added later and stored in `files` (e.g. URLs).

3. **Settings** in ManageSettings are a free-form object; backend can store as JSON or separate columns. Footer currently does not read from `settings`; it can be wired later to contact and social links.

---

## 11. Required Backend Modules (Summary)

- **Auth** — signup, login, logout, session; issue/store token (e.g. JWT).
- **Categories** — CRUD; list used by services and nav.
- **Sub-services** — CRUD; filter by categoryId.
- **Packages** — CRUD; filter by serviceId.
- **Jobs** — CRUD; status active/inactive.
- **Scholarships** — CRUD; status active/inactive.
- **Submissions** — Create (public), List/Update/Delete (admin).
- **Settings** — Get one, Update one (admin).
- **Init** — One-time or idempotent seed: categories, subservices, packages, jobs, scholarships.
- **Upload** (optional for Phase 1) — Public and authenticated file upload; return URLs for `FormSubmission.files`.
- **Stats** (optional) — Dashboard counts; can be computed from list endpoints.

---

## 12. Required Database Tables

- `service_category` (id, name, color, icon, description, createdAt, updatedAt)
- `sub_service` (id, categoryId FK, name, shortDescription, fullDescription, features JSON, benefits JSON, icon?, image?, createdAt, updatedAt)
- `package` (id, serviceId FK, name, description, features JSON, price, displayPrice, createdAt, updatedAt)
- `job` (id, title, organization, deadline, location, type, description, requirements JSON, externalLink?, status, createdAt, updatedAt)
- `scholarship` (id, title, organization, deadline, country, level, description, eligibility JSON, benefits JSON, externalLink?, status, createdAt, updatedAt)
- `form_submission` (id, type, servicePackageId?, jobId?, scholarshipId?, fullName, phone, email, message?, files JSON?, submittedAt, status, createdAt, updatedAt)
- `settings` (single row or key-value: siteName, contactEmail, etc.)
- `admin` / `user` (id, email, passwordHash, name, createdAt, updatedAt) for auth

---

## 13. Required API Endpoints (Checklist)

| Method | Path | Auth | Purpose |
|--------|------|------|--------|
| POST | /auth/signup | No | Register admin |
| POST | /auth/login | No | Login, return access_token |
| POST | /auth/logout | Yes | Invalidate session/token |
| GET | /auth/session | Yes | Validate token |
| GET | /categories | No | List categories |
| POST | /categories | Yes | Create category |
| PUT | /categories/:id | Yes | Update category |
| DELETE | /categories/:id | Yes | Delete category |
| GET | /subservices | No | List sub-services |
| POST | /subservices | Yes | Create sub-service |
| PUT | /subservices/:id | Yes | Update sub-service |
| DELETE | /subservices/:id | Yes | Delete sub-service |
| GET | /packages | No | List packages |
| POST | /packages | Yes | Create package |
| PUT | /packages/:id | Yes | Update package |
| DELETE | /packages/:id | Yes | Delete package |
| GET | /jobs | No | List jobs |
| POST | /jobs | Yes | Create job |
| PUT | /jobs/:id | Yes | Update job |
| DELETE | /jobs/:id | Yes | Delete job |
| GET | /scholarships | No | List scholarships |
| POST | /scholarships | Yes | Create scholarship |
| PUT | /scholarships/:id | Yes | Update scholarship |
| DELETE | /scholarships/:id | Yes | Delete scholarship |
| GET | /submissions | Yes | List submissions |
| POST | /submissions | No | Create submission (inquiry form) |
| PUT | /submissions/:id | Yes | Update submission |
| DELETE | /submissions/:id | Yes | Delete submission |
| GET | /settings | No | Get settings (public site) |
| PUT | /settings | Yes | Update settings |
| POST | /init | Yes | Seed data (categories, subservices, packages, jobs, scholarships) |
| POST | /upload | Yes | Upload file (optional) |
| POST | /upload-public | No | Public upload (optional) |
| GET | /stats | Yes | Dashboard stats (optional) |

---

## 14. Data Relationships (ER Summary)

- **ServiceCategory** 1 — * **SubService** (categoryId)
- **SubService** 1 — * **Package** (serviceId)
- **FormSubmission** * — 0..1 **Package** (servicePackageId), **Job** (jobId), **Scholarship** (scholarshipId) — optional references by id only.

Jobs and Scholarships are standalone. Settings is a singleton.

---

**End of STEP 1 — Frontend Analysis.**  
Do **not** start coding the backend until STEP 2 (Backend Architecture Design) is completed.
