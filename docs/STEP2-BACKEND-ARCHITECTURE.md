# STEP 2 — Backend Architecture Design

Based on the frontend analysis (STEP 1), this document defines the **NestJS + Prisma + PostgreSQL** backend architecture for NextStep.xyz.

---

## 1. Technology Stack

| Layer | Choice |
|-------|--------|
| Framework | NestJS |
| ORM | Prisma |
| Database | PostgreSQL |
| Validation | class-validator + class-transformer |
| Auth | JWT (access token), bcrypt for password hashing |
| Config | @nestjs/config, .env |

---

## 2. Backend Folder Structure

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   │
│   ├── common/                    # Shared utilities and guards
│   │   ├── guards/
│   │   │   └── jwt-auth.guard.ts
│   │   ├── decorators/
│   │   │   └── public.decorator.ts
│   │   └── filters/
│   │       └── http-exception.filter.ts
│   │
│   ├── config/                    # Configuration
│   │   └── configuration.ts
│   │
│   ├── prisma/                    # Prisma service (injectable)
│   │   └── prisma.service.ts
│   │
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── signup.dto.ts
│   │   │
│   │   ├── categories/
│   │   │   ├── categories.module.ts
│   │   │   ├── categories.controller.ts
│   │   │   ├── categories.service.ts
│   │   │   └── dto/
│   │   │       ├── create-category.dto.ts
│   │   │       └── update-category.dto.ts
│   │   │
│   │   ├── subservices/
│   │   │   ├── subservices.module.ts
│   │   │   ├── subservices.controller.ts
│   │   │   ├── subservices.service.ts
│   │   │   └── dto/
│   │   │       ├── create-subservice.dto.ts
│   │   │       └── update-subservice.dto.ts
│   │   │
│   │   ├── packages/
│   │   │   ├── packages.module.ts
│   │   │   ├── packages.controller.ts
│   │   │   ├── packages.service.ts
│   │   │   └── dto/
│   │   │       ├── create-package.dto.ts
│   │   │       └── update-package.dto.ts
│   │   │
│   │   ├── jobs/
│   │   │   ├── jobs.module.ts
│   │   │   ├── jobs.controller.ts
│   │   │   ├── jobs.service.ts
│   │   │   └── dto/
│   │   │       ├── create-job.dto.ts
│   │   │       └── update-job.dto.ts
│   │   │
│   │   ├── scholarships/
│   │   │   ├── scholarships.module.ts
│   │   │   ├── scholarships.controller.ts
│   │   │   ├── scholarships.service.ts
│   │   │   └── dto/
│   │   │       ├── create-scholarship.dto.ts
│   │   │       └── update-scholarship.dto.ts
│   │   │
│   │   ├── submissions/
│   │   │   ├── submissions.module.ts
│   │   │   ├── submissions.controller.ts
│   │   │   ├── submissions.service.ts
│   │   │   └── dto/
│   │   │       ├── create-submission.dto.ts
│   │   │       └── update-submission.dto.ts
│   │   │
│   │   ├── settings/
│   │   │   ├── settings.module.ts
│   │   │   ├── settings.controller.ts
│   │   │   ├── settings.service.ts
│   │   │   └── dto/
│   │   │       └── update-settings.dto.ts
│   │   │
│   │   └── init/
│   │       ├── init.module.ts
│   │       ├── init.controller.ts
│   │       ├── init.service.ts
│   │       └── dto/
│   │           └── init-data.dto.ts
│   │
│   └── (optional) upload/
│       └── ... (if implementing file upload later)
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts                    # Optional seed script
│
├── .env
├── .env.example
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

---

## 3. Database Schema (Prisma Models)

### 3.1 ER Overview

- **ServiceCategory** 1 —— * **SubService**
- **SubService** 1 —— * **Package**
- **FormSubmission** references Package / Job / Scholarship by id (optional FKs)
- **Admin** standalone (auth)
- **Settings** single row (singleton)

### 3.2 Prisma Schema (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Admin {
  id           String   @id @default(cuid())
  email        String   @unique
  passwordHash String   @map("password_hash")
  name         String
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
}

model ServiceCategory {
  id          String   @id @default(cuid())
  name        String
  color       String
  icon        String
  description String
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")
  subServices SubService[]
}

model SubService {
  id               String   @id @default(cuid())
  categoryId       String   @map("category_id")
  category         ServiceCategory @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  name             String
  shortDescription String   @map("short_description")
  fullDescription  String   @map("full_description")
  features        Json     @default("[]")   // string[]
  benefits        Json     @default("[]")  // string[]
  icon            String?
  image           String?
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  packages        Package[]

  @@index([categoryId])
}

model Package {
  id          String   @id @default(cuid())
  serviceId   String   @map("service_id")
  service     SubService @relation(fields: [serviceId], references: [id], onDelete: Cascade)
  name        String
  description String
  features    Json     @default("[]")  // string[]
  price       String
  displayPrice Boolean @default(true) @map("display_price")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@index([serviceId])
}

model Job {
  id           String   @id @default(cuid())
  title        String
  organization String
  deadline     DateTime
  location     String
  type         String
  description  String
  requirements Json     @default("[]")  // string[]
  externalLink String?  @map("external_link")
  status       String   @default("active")  // 'active' | 'inactive'
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
}

model Scholarship {
  id           String   @id @default(cuid())
  title        String
  organization String
  deadline     DateTime
  country      String
  level        String
  description  String
  eligibility  Json     @default("[]")  // string[]
  benefits     Json     @default("[]")  // string[]
  externalLink String?  @map("external_link")
  status       String   @default("active")  // 'active' | 'inactive'
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
}

model FormSubmission {
  id                String   @id @default(cuid())
  type              String   // 'service' | 'job' | 'scholarship'
  servicePackageId  String?  @map("service_package_id")
  jobId             String?  @map("job_id")
  scholarshipId     String?  @map("scholarship_id")
  fullName          String   @map("full_name")
  phone             String
  email             String
  message           String?
  files             Json     @default("[]")  // string[] (URLs)
  submittedAt       DateTime @default(now()) @map("submitted_at")
  status            String   @default("pending")  // 'pending' | 'contacted' | 'completed'
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")
}

model Settings {
  id           String   @id @default(cuid())
  siteName     String   @default("NextStep.xyz") @map("site_name")
  contactEmail String   @default("") @map("contact_email")
  contactPhone String   @default("") @map("contact_phone")
  address      String   @default("")
  facebook     String   @default("")
  twitter      String   @default("")
  linkedin     String   @default("")
  instagram    String   @default("")
  whatsapp     String   @default("")
  aboutText    String   @default("") @map("about_text")
  footerText   String   @default("") @map("footer_text")
  createdAt    DateTime @default(now()) @map("created_at")
  updatedAt    DateTime @updatedAt @map("updated_at")
}
```

**Notes:**

- IDs: use `cuid()` so IDs are string and frontend-compatible; frontend can send existing ids on init/update.
- Json fields: Prisma returns arrays from JSON as JavaScript arrays; DTOs accept `string[]`.
- Dates: `deadline` stored as DateTime; API can accept ISO string and convert.
- Settings: single row; service always returns/updates that one row (create on first get if missing).

---

## 4. API Routes Summary

Base path: `/` (or optional global prefix e.g. `/api`). All responses JSON.

| Method | Path | Auth | Controller | Description |
|--------|------|------|------------|-------------|
| POST | /auth/signup | No | AuthController | Register admin |
| POST | /auth/login | No | AuthController | Login → access_token |
| POST | /auth/logout | Yes | AuthController | No-op or blacklist (optional) |
| GET | /auth/session | Yes | AuthController | Return user info / 200 |
| GET | /categories | No | CategoriesController | List all |
| POST | /categories | Yes | CategoriesController | Create |
| PUT | /categories/:id | Yes | CategoriesController | Update |
| DELETE | /categories/:id | Yes | CategoriesController | Delete |
| GET | /subservices | No | SubservicesController | List all |
| POST | /subservices | Yes | SubservicesController | Create |
| PUT | /subservices/:id | Yes | SubservicesController | Update |
| DELETE | /subservices/:id | Yes | SubservicesController | Delete |
| GET | /packages | No | PackagesController | List all |
| POST | /packages | Yes | PackagesController | Create |
| PUT | /packages/:id | Yes | PackagesController | Update |
| DELETE | /packages/:id | Yes | PackagesController | Delete |
| GET | /jobs | No | JobsController | List all |
| POST | /jobs | Yes | JobsController | Create |
| PUT | /jobs/:id | Yes | JobsController | Update |
| DELETE | /jobs/:id | Yes | JobsController | Delete |
| GET | /scholarships | No | ScholarshipsController | List all |
| POST | /scholarships | Yes | ScholarshipsController | Create |
| PUT | /scholarships/:id | Yes | ScholarshipsController | Update |
| DELETE | /scholarships/:id | Yes | ScholarshipsController | Delete |
| GET | /submissions | Yes | SubmissionsController | List all |
| POST | /submissions | No | SubmissionsController | Create (inquiry) |
| PUT | /submissions/:id | Yes | SubmissionsController | Update |
| DELETE | /submissions/:id | Yes | SubmissionsController | Delete |
| GET | /settings | No | SettingsController | Get singleton |
| PUT | /settings | Yes | SettingsController | Update singleton |
| POST | /init | Yes | InitController | Seed data |

---

## 5. Request / Response Formats

### 5.1 Auth

**POST /auth/signup**  
Request: `{ "email": string, "password": string, "name": string }`  
Response: `{ "message": "Account created" }` or user (no token; they login next).

**POST /auth/login**  
Request: `{ "email": string, "password": string }`  
Response: `{ "access_token": string }`  
Frontend stores this as `admin_token` and sends `Authorization: Bearer <access_token>`.

**GET /auth/session**  
Headers: `Authorization: Bearer <token>`  
Response: `200` with e.g. `{ "email": string, "name": string }` or `401`.

### 5.2 Wrapped List Responses (frontend compatibility)

- GET /categories → `{ "categories": ServiceCategory[] }`
- GET /subservices → `{ "subservices": SubService[] }`
- GET /packages → `{ "packages": Package[] }`
- GET /jobs → `{ "jobs": Job[] }`
- GET /scholarships → `{ "scholarships": Scholarship[] }`
- GET /submissions → `{ "submissions": FormSubmission[] }`

### 5.3 Wrapped Single Entity (create/update)

- POST/PUT categories → `{ "category": ServiceCategory }`
- POST/PUT subservices → `{ "subservice": SubService }`
- POST/PUT packages → `{ "package": Package }`
- POST/PUT jobs → `{ "job": Job }`
- POST/PUT scholarships → `{ "scholarship": Scholarship }`
- POST/PUT submissions → `{ "submission": FormSubmission }`
- GET/PUT settings → `{ "settings": SettingsObject }`

### 5.4 Entity Shapes (API JSON)

Match frontend types; use camelCase in JSON. Dates as ISO strings.

- **ServiceCategory:** id, name, color, icon, description (createdAt/updatedAt optional).
- **SubService:** id, categoryId, name, shortDescription, fullDescription, features[], benefits[], icon?, image?.
- **Package:** id, serviceId, name, description, features[], price, displayPrice?.
- **Job:** id, title, organization, deadline (ISO), location, type, description, requirements[], externalLink?, status.
- **Scholarship:** id, title, organization, deadline (ISO), country, level, description, eligibility[], benefits[], externalLink?, status.
- **FormSubmission:** id, type, servicePackageId?, jobId?, scholarshipId?, fullName, phone, email, message?, files?, submittedAt (ISO), status.
- **Settings:** flat object with siteName, contactEmail, contactPhone, address, facebook, twitter, linkedin, instagram, whatsapp, aboutText, footerText.

### 5.5 Init

**POST /init**  
Request: `{ "categories": ServiceCategory[], "subservices": SubService[], "packages": Package[], "jobs": Job[], "scholarships": Scholarship[] }`  
- IDs in payload can be frontend mock ids (e.g. `s1`, `p1`); backend uses them when creating so relations stay consistent.  
Response: `201` or `200` with e.g. `{ "message": "Data initialized" }`.

---

## 6. DTOs and Validation (class-validator)

### 6.1 Auth

- **SignUpDto:** email (IsEmail), password (MinLength 6), name (IsString, not empty).
- **LoginDto:** email (IsEmail), password (IsString).

### 6.2 Categories

- **CreateCategoryDto:** name, color, icon, description (all required strings).
- **UpdateCategoryDto:** PartialType(CreateCategoryDto).

### 6.3 SubServices

- **CreateSubserviceDto:** name, categoryId, shortDescription, fullDescription, features (IsArray, IsString[]), benefits (IsArray, IsString[]), icon?, image? (optional).
- **UpdateSubserviceDto:** PartialType(CreateSubserviceDto).

### 6.4 Packages

- **CreatePackageDto:** serviceId, name, description, features (array of strings), price, displayPrice? (boolean, default true).
- **UpdatePackageDto:** PartialType(CreatePackageDto).

### 6.5 Jobs

- **CreateJobDto:** title, organization, deadline (IsDateString or transform to Date), location, type, description, requirements (string[]), externalLink? (IsUrl, optional), status (IsIn ['active','inactive']).
- **UpdateJobDto:** PartialType(CreateJobDto).

### 6.6 Scholarships

- **CreateScholarshipDto:** title, organization, deadline, country, level, description, eligibility[], benefits[], externalLink?, status.
- **UpdateScholarshipDto:** PartialType(CreateScholarshipDto).

### 6.7 Submissions

- **CreateSubmissionDto:** type (IsIn ['service','job','scholarship']), servicePackageId?, jobId?, scholarshipId?, fullName, phone, email, message?, files? (string[]).
- **UpdateSubmissionDto:** status? (IsIn ['pending','contacted','completed']), and optionally other fields.

### 6.8 Settings

- **UpdateSettingsDto:** all optional: siteName, contactEmail, contactPhone, address, facebook, twitter, linkedin, instagram, whatsapp, aboutText, footerText.

### 6.9 Init

- **InitDataDto:** categories (IsArray, ValidateNested), subservices (IsArray, ValidateNested), packages (IsArray, ValidateNested), jobs (IsArray, ValidateNested), scholarships (IsArray, ValidateNested). Each item validated with its create DTO or a minimal DTO (id, required fields).

---

## 7. Modules and Dependency Flow

- **AppModule:** imports ConfigModule, PrismaModule, AuthModule, CategoriesModule, SubservicesModule, PackagesModule, JobsModule, ScholarshipsModule, SubmissionsModule, SettingsModule, InitModule.
- **PrismaModule:** global; exports PrismaService.
- **AuthModule:** uses JwtModule, PrismaService; exports JwtStrategy, JwtAuthGuard; AuthService (login, signup, validateUser, session).
- **CategoriesModule:** PrismaModule; CategoriesService (CRUD); controller uses JwtAuthGuard on protected routes; Public() on GET list.
- **SubservicesModule, PackagesModule, JobsModule, ScholarshipsModule, SubmissionsModule, SettingsModule, InitModule:** same pattern — service uses PrismaService; controller guards on write/delete and GET submissions; Public() on GET list for public resources and GET settings.

---

## 8. Error Handling and HTTP Status

- 400: Validation errors (ValidationPipe).
- 401: Unauthorized (invalid/missing JWT on protected routes).
- 404: Resource not found (e.g. category id, subservice id).
- 409: Conflict (e.g. email already exists on signup).
- 500: Internal server error (generic).

Return structure for validation: NestJS default or `{ "statusCode": 400, "message": [...], "error": "Bad Request" }`.

---

## 9. Data Relationships (Recap)

- **ServiceCategory** → **SubService** (one-to-many; categoryId).
- **SubService** → **Package** (one-to-many; serviceId).
- **FormSubmission:** optional servicePackageId, jobId, scholarshipId (no Prisma relation needed if we only store ids; optional FKs can be added later for referential integrity).
- **Settings:** single row; create on first GET if not present.
- **Admin:** standalone for JWT auth.

---

## 10. Environment Variables

- `DATABASE_URL`: PostgreSQL connection string.
- `JWT_SECRET`: Secret for signing JWT.
- `JWT_EXPIRES_IN`: e.g. `7d`.
- `PORT`: Server port (e.g. 3001).

---

## 11. Migration and Seed

- Run `npx prisma migrate dev` to create migrations from schema.
- Optional: `prisma/seed.ts` to create one default admin and default settings; run with `npx prisma db seed`. Init endpoint can still seed categories/subservices/packages/jobs/scholarships when DB is empty.

---

**End of STEP 2 — Backend Architecture Design.**

Next: **STEP 3 — Create Backend Project** (scaffold NestJS, Prisma, env, folder structure).
