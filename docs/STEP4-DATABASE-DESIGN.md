# STEP 4 — Database Design

## Schema Summary

The Prisma schema in `backend/prisma/schema.prisma` defines:

| Model | Purpose |
|-------|---------|
| **Admin** | Admin auth (email, passwordHash, name) |
| **ServiceCategory** | Service categories (name, color, icon, description) |
| **SubService** | Sub-services under a category; JSON features/benefits |
| **Package** | Packages under a sub-service; JSON features |
| **Job** | Job listings; JSON requirements; status active/inactive |
| **Scholarship** | Scholarship listings; JSON eligibility/benefits; status |
| **FormSubmission** | Inquiry form submissions; optional refs to package/job/scholarship |
| **Settings** | Singleton row for site/contact/social/about/footer |

## Relationships

- `ServiceCategory` 1 → * `SubService` (categoryId, cascade delete)
- `SubService` 1 → * `Package` (serviceId, cascade delete)
- `FormSubmission`: optional `servicePackageId`, `jobId`, `scholarshipId` (stored as strings; no FK to avoid orphan issues if job/scholarship deleted)

## Indexes

- `SubService`: index on `categoryId`
- `Package`: index on `serviceId`

## Timestamps

All models have `createdAt` and `updatedAt` (mapped to `created_at` / `updated_at`).

## Migration Instructions

1. Ensure PostgreSQL is running and create a database, e.g.:
   ```bash
   createdb nextstep_db
   ```

2. Set `DATABASE_URL` in `backend/.env`:
   ```
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/nextstep_db?schema=public"
   ```

3. From `backend/` create and apply the initial migration:
   ```bash
   npm run prisma:migrate
   ```
   When prompted for a migration name, use e.g. `init`.

4. (Optional) Seed default settings and an admin:
   - Use the **POST /init** endpoint after first admin signup, or
   - Add `prisma/seed.ts` and run `npx prisma db seed`.

## Notes

- JSON columns (`features`, `benefits`, `requirements`, `eligibility`, `files`) store arrays; Prisma returns them as JavaScript arrays.
- IDs use `cuid()` for URL-safe unique strings.
- Settings: ensure one row exists (create in service on first GET if empty).
