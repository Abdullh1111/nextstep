# NextStep.xyz Admin Panel - Complete Guide

## Overview

Your NextStep.xyz platform now has a fully functional Admin Panel with complete database integration through Supabase. The admin can manage all content without touching code after initial setup.

## Features

### ✅ Complete CRUD Operations For:
- **Service Categories** (4 main categories: Career & Job, Study & Higher Study, Digital Services, Travels)
- **Sub-Services** (36 services total with full details)
- **Packages** (Basic/Standard/Premium packages for each service)
- **Job Posts** (with status management)
- **Scholarship Posts** (with status management)
- **Form Submissions** (inquiry form management)
- **Website Settings** (contact info, social links, general settings)

### ✅ Admin Features:
- Secure authentication with Supabase Auth
- Dashboard with overview statistics
- Search and filter functionality
- Status toggle for jobs and scholarships
- File upload support (ready for images/documents)
- Real-time data synchronization
- Responsive design

## Getting Started

### 1. First-Time Setup - Create Admin Account

**Important:** You need to create an admin account before you can login.

1. Navigate to `/admin/signup` in your browser
2. Fill in the registration form:
   - Full Name
   - Email Address
   - Password (minimum 6 characters)
   - Confirm Password
3. Click "Create Admin Account"
4. You'll be automatically redirected to the login page

### 2. Admin Login

1. Go to `/admin/login`
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to the admin dashboard

### 3. Admin Dashboard

The dashboard provides:
- **Overview Cards**: Total counts for services, packages, jobs, scholarships, and submissions
- **Quick Actions**: Direct links to all management pages
- **Recent Submissions**: Latest inquiry form submissions

## Managing Content

### Services Management (`/admin/services`)

**Features:**
- View all 36 sub-services
- Filter by category
- Search by name or description
- Add new services
- Edit existing services
- Delete services

**To Add a Service:**
1. Click "Add Service"
2. Fill in the form:
   - Service Name (required)
   - Category (required)
   - Short Description (required)
   - Full Description (required)
   - Features (add multiple)
   - Benefits (add multiple)
3. Click "Create Service"

**To Edit a Service:**
1. Click the edit icon (pencil) on any service row
2. Modify the fields
3. Click "Update Service"

**To Delete a Service:**
1. Click the delete icon (trash) on any service row
2. Confirm the deletion

### Packages Management (`/admin/packages`)

**Features:**
- View all packages
- Filter by service
- Search packages
- Add/Edit/Delete packages

**To Add a Package:**
1. Click "Add Package"
2. Fill in:
   - Package Name (e.g., "Basic CV", "Premium Package")
   - Service (select from dropdown)
   - Description
   - Price (e.g., "৳500", "Contact Us")
   - Features (add multiple)
   - Display Price checkbox (whether to show price on website)
3. Click "Create Package"

### Jobs Management (`/admin/jobs`)

**Features:**
- View all job posts
- Search jobs
- Toggle active/inactive status
- Add/Edit/Delete jobs

**To Add a Job:**
1. Click "Add Job"
2. Fill in:
   - Job Title (required)
   - Organization (required)
   - Location (required)
   - Job Type (Full-time, Part-time, Contract, Internship)
   - Deadline (date picker)
   - Description (required)
   - Requirements (add multiple)
   - External Link (optional - link to job posting)
   - Status (Active/Inactive)
3. Click "Create Job"

**To Toggle Job Status:**
- Click the toggle icon (looks like a switch) to activate/deactivate

### Scholarships Management (`/admin/scholarships`)

**Features:**
- View all scholarships
- Search scholarships
- Toggle active/inactive status
- Add/Edit/Delete scholarships

**To Add a Scholarship:**
1. Click "Add Scholarship"
2. Fill in:
   - Scholarship Title (required)
   - Organization (required)
   - Country (required)
   - Level (e.g., "Master's", "PhD")
   - Deadline (date picker)
   - Description (required)
   - Eligibility Criteria (add multiple)
   - Benefits (add multiple)
   - External Link (optional)
   - Status (Active/Inactive)
3. Click "Create Scholarship"

### Form Submissions Management (`/admin/submissions`)

**Features:**
- View all inquiry form submissions
- Filter by status (All, Pending, Contacted, Completed)
- Update submission status
- Delete submissions
- View submission details (name, email, phone, message, type)

**To Update Submission Status:**
1. Use the dropdown menu on each submission
2. Select: Pending, Contacted, or Completed
3. Status updates automatically

**To Delete a Submission:**
1. Click the delete icon (trash)
2. Confirm deletion

### Website Settings (`/admin/settings`)

**Configure:**
- **General Information:**
  - Site Name
  - About Text
  - Footer Text

- **Contact Information:**
  - Contact Email
  - Contact Phone
  - WhatsApp Number
  - Address

- **Social Media Links:**
  - Facebook URL
  - Twitter URL
  - LinkedIn URL
  - Instagram URL

**To Update Settings:**
1. Modify any fields
2. Click "Save Settings"
3. Changes are applied site-wide

## Data Persistence

All data is stored in Supabase's Key-Value database with the following structure:

- `category:*` - Service categories
- `subservice:*` - Sub-services
- `package:*` - Service packages
- `job:*` - Job posts
- `scholarship:*` - Scholarship posts
- `submission:*` - Form submissions
- `settings:general` - Website settings

### Auto-Initialization

On first load, the system automatically initializes the database with default data:
- 4 service categories
- 36 sub-services
- Sample packages
- Sample jobs
- Sample scholarships

## File Upload Support

The system includes Supabase Storage integration for file uploads:
- **Bucket Name:** `make-3e8e17c2-nextstep-files`
- **Max File Size:** 10MB
- **Supported:** Images, documents, PDFs
- **Access:** Private bucket with signed URLs (1-year expiry)

## Security Features

✅ **Authentication:**
- Supabase Auth for admin login
- Session management
- Password hashing
- Email confirmation (auto-enabled for demo)

✅ **Authorization:**
- Protected admin routes
- Token-based API authentication
- Admin-only endpoints

✅ **Data Protection:**
- Submissions only visible to logged-in admins
- Service role key never exposed to frontend
- Secure API endpoints

## Important Notes

### For Development/Demo:
- This setup is designed for prototypes and demos
- Not recommended for handling real PII (Personally Identifiable Information)
- For production use with real users, deploy to your own infrastructure

### Best Practices:
1. **Use Strong Passwords:** Minimum 6 characters, include numbers and symbols
2. **Keep Credentials Secure:** Never share admin login details
3. **Regular Backups:** Export important data regularly
4. **Test Before Deleting:** Always verify before deleting services, jobs, or scholarships
5. **Logout When Done:** Always logout from admin panel when finished

### Changing Admin Credentials:
- Currently managed through Supabase Auth
- To change email/password, use Supabase dashboard or contact system administrator
- Cannot be changed from the settings page (security feature)

## API Endpoints

All admin endpoints require authentication token:

```
POST   /auth/signup           - Create admin account
POST   /auth/login            - Admin login
GET    /auth/session          - Get current session
POST   /auth/logout           - Logout

GET    /categories            - Get all categories
POST   /categories            - Create category (admin)
PUT    /categories/:id        - Update category (admin)
DELETE /categories/:id        - Delete category (admin)

GET    /subservices           - Get all sub-services
POST   /subservices           - Create sub-service (admin)
PUT    /subservices/:id       - Update sub-service (admin)
DELETE /subservices/:id       - Delete sub-service (admin)

GET    /packages              - Get all packages
POST   /packages              - Create package (admin)
PUT    /packages/:id          - Update package (admin)
DELETE /packages/:id          - Delete package (admin)

GET    /jobs                  - Get all jobs
POST   /jobs                  - Create job (admin)
PUT    /jobs/:id              - Update job (admin)
DELETE /jobs/:id              - Delete job (admin)

GET    /scholarships          - Get all scholarships
POST   /scholarships          - Create scholarship (admin)
PUT    /scholarships/:id      - Update scholarship (admin)
DELETE /scholarships/:id      - Delete scholarship (admin)

GET    /submissions           - Get all submissions (admin)
POST   /submissions           - Create submission (public)
PUT    /submissions/:id       - Update submission (admin)
DELETE /submissions/:id       - Delete submission (admin)

GET    /settings              - Get website settings
PUT    /settings              - Update settings (admin)

POST   /upload                - Upload file (admin)
POST   /upload-public         - Upload file (public for submissions)

POST   /init                  - Initialize default data (admin)
GET    /stats                 - Get dashboard stats (admin)
```

## Troubleshooting

### Can't Login?
- Verify you've created an admin account at `/admin/signup`
- Check email and password are correct
- Clear browser cache and try again

### Data Not Showing?
- Check your internet connection
- Refresh the page
- Logout and login again
- Check browser console for errors

### Changes Not Saving?
- Ensure you're logged in as admin
- Check all required fields are filled
- Look for error messages/toasts
- Verify network connection

### Error Messages?
- Check browser console for detailed errors
- Ensure Supabase connection is active
- Verify API endpoints are accessible

## Support

For issues or questions:
1. Check browser console for error messages
2. Verify all required fields are filled correctly
3. Try logging out and back in
4. Check the Supabase dashboard for backend issues

## Future Enhancements

Potential additions for production:
- Bulk operations (import/export CSV)
- Image upload for services
- Email notifications for submissions
- Activity logs
- User role management
- Advanced search and filters
- Analytics dashboard
- Email templates

---

**Version:** 1.0  
**Last Updated:** December 2024  
**Platform:** NextStep.xyz Admin Panel
