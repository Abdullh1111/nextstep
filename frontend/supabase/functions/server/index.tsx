import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Create storage bucket on startup
const BUCKET_NAME = 'make-3e8e17c2-nextstep-files';
(async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 10485760, // 10MB
      });
      console.log(`Created storage bucket: ${BUCKET_NAME}`);
    }
  } catch (error) {
    console.error('Error setting up storage bucket:', error);
  }
})();

// Helper function to verify admin auth
async function verifyAdmin(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { authorized: false, userId: null };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return { authorized: false, userId: null };
  }
  
  return { authorized: true, userId: user.id };
}

// ============================================
// AUTHENTICATION ROUTES
// ============================================

// Admin signup
app.post('/make-server-3e8e17c2/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name, role: 'admin' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.error('Error creating admin user during signup:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.error('Server error during admin signup:', error);
    return c.json({ error: 'Internal server error during signup' }, 500);
  }
});

// Admin login
app.post('/make-server-3e8e17c2/auth/login', async (c) => {
  try {
    const { email, password } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Error during admin login:', error);
      return c.json({ error: error.message }, 401);
    }

    return c.json({ 
      access_token: data.session.access_token,
      user: data.user
    });
  } catch (error) {
    console.error('Server error during admin login:', error);
    return c.json({ error: 'Internal server error during login' }, 500);
  }
});

// Get current session
app.get('/make-server-3e8e17c2/auth/session', async (c) => {
  const { authorized, userId } = await verifyAdmin(c.req.raw);
  
  if (!authorized) {
    return c.json({ error: 'Not authenticated' }, 401);
  }
  
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  const { data: { user } } = await supabase.auth.getUser(accessToken || '');
  
  return c.json({ user });
});

// Logout
app.post('/make-server-3e8e17c2/auth/logout', async (c) => {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  
  if (accessToken) {
    await supabase.auth.admin.signOut(accessToken);
  }
  
  return c.json({ success: true });
});

// ============================================
// SERVICE CATEGORIES ROUTES
// ============================================

app.get('/make-server-3e8e17c2/categories', async (c) => {
  try {
    const categories = await kv.getByPrefix('category:');
    return c.json({ categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

app.post('/make-server-3e8e17c2/categories', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const category = await c.req.json();
    await kv.set(`category:${category.id}`, category);
    return c.json({ category });
  } catch (error) {
    console.error('Error creating category:', error);
    return c.json({ error: 'Failed to create category' }, 500);
  }
});

app.put('/make-server-3e8e17c2/categories/:id', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existing = await kv.get(`category:${id}`);
    
    if (!existing) {
      return c.json({ error: 'Category not found' }, 404);
    }
    
    const updated = { ...existing, ...updates };
    await kv.set(`category:${id}`, updated);
    return c.json({ category: updated });
  } catch (error) {
    console.error('Error updating category:', error);
    return c.json({ error: 'Failed to update category' }, 500);
  }
});

app.delete('/make-server-3e8e17c2/categories/:id', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const id = c.req.param('id');
    await kv.del(`category:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting category:', error);
    return c.json({ error: 'Failed to delete category' }, 500);
  }
});

// ============================================
// SUB-SERVICES ROUTES
// ============================================

app.get('/make-server-3e8e17c2/subservices', async (c) => {
  try {
    const subservices = await kv.getByPrefix('subservice:');
    return c.json({ subservices });
  } catch (error) {
    console.error('Error fetching sub-services:', error);
    return c.json({ error: 'Failed to fetch sub-services' }, 500);
  }
});

app.post('/make-server-3e8e17c2/subservices', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const subservice = await c.req.json();
    await kv.set(`subservice:${subservice.id}`, subservice);
    return c.json({ subservice });
  } catch (error) {
    console.error('Error creating sub-service:', error);
    return c.json({ error: 'Failed to create sub-service' }, 500);
  }
});

app.put('/make-server-3e8e17c2/subservices/:id', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existing = await kv.get(`subservice:${id}`);
    
    if (!existing) {
      return c.json({ error: 'Sub-service not found' }, 404);
    }
    
    const updated = { ...existing, ...updates };
    await kv.set(`subservice:${id}`, updated);
    return c.json({ subservice: updated });
  } catch (error) {
    console.error('Error updating sub-service:', error);
    return c.json({ error: 'Failed to update sub-service' }, 500);
  }
});

app.delete('/make-server-3e8e17c2/subservices/:id', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const id = c.req.param('id');
    await kv.del(`subservice:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting sub-service:', error);
    return c.json({ error: 'Failed to delete sub-service' }, 500);
  }
});

// ============================================
// PACKAGES ROUTES
// ============================================

app.get('/make-server-3e8e17c2/packages', async (c) => {
  try {
    const packages = await kv.getByPrefix('package:');
    return c.json({ packages });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return c.json({ error: 'Failed to fetch packages' }, 500);
  }
});

app.post('/make-server-3e8e17c2/packages', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const pkg = await c.req.json();
    await kv.set(`package:${pkg.id}`, pkg);
    return c.json({ package: pkg });
  } catch (error) {
    console.error('Error creating package:', error);
    return c.json({ error: 'Failed to create package' }, 500);
  }
});

app.put('/make-server-3e8e17c2/packages/:id', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existing = await kv.get(`package:${id}`);
    
    if (!existing) {
      return c.json({ error: 'Package not found' }, 404);
    }
    
    const updated = { ...existing, ...updates };
    await kv.set(`package:${id}`, updated);
    return c.json({ package: updated });
  } catch (error) {
    console.error('Error updating package:', error);
    return c.json({ error: 'Failed to update package' }, 500);
  }
});

app.delete('/make-server-3e8e17c2/packages/:id', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const id = c.req.param('id');
    await kv.del(`package:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting package:', error);
    return c.json({ error: 'Failed to delete package' }, 500);
  }
});

// ============================================
// JOBS ROUTES
// ============================================

app.get('/make-server-3e8e17c2/jobs', async (c) => {
  try {
    const jobs = await kv.getByPrefix('job:');
    return c.json({ jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return c.json({ error: 'Failed to fetch jobs' }, 500);
  }
});

app.post('/make-server-3e8e17c2/jobs', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const job = await c.req.json();
    await kv.set(`job:${job.id}`, job);
    return c.json({ job });
  } catch (error) {
    console.error('Error creating job:', error);
    return c.json({ error: 'Failed to create job' }, 500);
  }
});

app.put('/make-server-3e8e17c2/jobs/:id', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existing = await kv.get(`job:${id}`);
    
    if (!existing) {
      return c.json({ error: 'Job not found' }, 404);
    }
    
    const updated = { ...existing, ...updates };
    await kv.set(`job:${id}`, updated);
    return c.json({ job: updated });
  } catch (error) {
    console.error('Error updating job:', error);
    return c.json({ error: 'Failed to update job' }, 500);
  }
});

app.delete('/make-server-3e8e17c2/jobs/:id', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const id = c.req.param('id');
    await kv.del(`job:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting job:', error);
    return c.json({ error: 'Failed to delete job' }, 500);
  }
});

// ============================================
// SCHOLARSHIPS ROUTES
// ============================================

app.get('/make-server-3e8e17c2/scholarships', async (c) => {
  try {
    const scholarships = await kv.getByPrefix('scholarship:');
    return c.json({ scholarships });
  } catch (error) {
    console.error('Error fetching scholarships:', error);
    return c.json({ error: 'Failed to fetch scholarships' }, 500);
  }
});

app.post('/make-server-3e8e17c2/scholarships', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const scholarship = await c.req.json();
    await kv.set(`scholarship:${scholarship.id}`, scholarship);
    return c.json({ scholarship });
  } catch (error) {
    console.error('Error creating scholarship:', error);
    return c.json({ error: 'Failed to create scholarship' }, 500);
  }
});

app.put('/make-server-3e8e17c2/scholarships/:id', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existing = await kv.get(`scholarship:${id}`);
    
    if (!existing) {
      return c.json({ error: 'Scholarship not found' }, 404);
    }
    
    const updated = { ...existing, ...updates };
    await kv.set(`scholarship:${id}`, updated);
    return c.json({ scholarship: updated });
  } catch (error) {
    console.error('Error updating scholarship:', error);
    return c.json({ error: 'Failed to update scholarship' }, 500);
  }
});

app.delete('/make-server-3e8e17c2/scholarships/:id', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const id = c.req.param('id');
    await kv.del(`scholarship:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting scholarship:', error);
    return c.json({ error: 'Failed to delete scholarship' }, 500);
  }
});

// ============================================
// FORM SUBMISSIONS ROUTES
// ============================================

app.get('/make-server-3e8e17c2/submissions', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const submissions = await kv.getByPrefix('submission:');
    return c.json({ submissions });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return c.json({ error: 'Failed to fetch submissions' }, 500);
  }
});

app.post('/make-server-3e8e17c2/submissions', async (c) => {
  try {
    const submission = await c.req.json();
    await kv.set(`submission:${submission.id}`, submission);
    return c.json({ submission });
  } catch (error) {
    console.error('Error creating submission:', error);
    return c.json({ error: 'Failed to create submission' }, 500);
  }
});

app.put('/make-server-3e8e17c2/submissions/:id', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const id = c.req.param('id');
    const updates = await c.req.json();
    const existing = await kv.get(`submission:${id}`);
    
    if (!existing) {
      return c.json({ error: 'Submission not found' }, 404);
    }
    
    const updated = { ...existing, ...updates };
    await kv.set(`submission:${id}`, updated);
    return c.json({ submission: updated });
  } catch (error) {
    console.error('Error updating submission:', error);
    return c.json({ error: 'Failed to update submission' }, 500);
  }
});

app.delete('/make-server-3e8e17c2/submissions/:id', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const id = c.req.param('id');
    await kv.del(`submission:${id}`);
    return c.json({ success: true });
  } catch (error) {
    console.error('Error deleting submission:', error);
    return c.json({ error: 'Failed to delete submission' }, 500);
  }
});

// ============================================
// WEBSITE SETTINGS ROUTES
// ============================================

app.get('/make-server-3e8e17c2/settings', async (c) => {
  try {
    const settings = await kv.get('settings:general') || {
      siteName: 'NextStep.xyz',
      contactEmail: 'info@nextstep.xyz',
      contactPhone: '+880 1234-567890',
      address: 'Dhaka, Bangladesh',
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: ''
    };
    return c.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return c.json({ error: 'Failed to fetch settings' }, 500);
  }
});

app.put('/make-server-3e8e17c2/settings', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const settings = await c.req.json();
    await kv.set('settings:general', settings);
    return c.json({ settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return c.json({ error: 'Failed to update settings' }, 500);
  }
});

// ============================================
// FILE UPLOAD ROUTES
// ============================================

app.post('/make-server-3e8e17c2/upload', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error('Error uploading file to storage:', error);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    // Generate signed URL
    const { data: urlData, error: urlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 31536000); // 1 year expiry

    if (urlError) {
      console.error('Error creating signed URL:', urlError);
      return c.json({ error: 'Failed to generate file URL' }, 500);
    }

    return c.json({ 
      fileName: data.path,
      url: urlData.signedUrl 
    });
  } catch (error) {
    console.error('Server error during file upload:', error);
    return c.json({ error: 'Internal server error during upload' }, 500);
  }
});

// Public file upload for submissions
app.post('/make-server-3e8e17c2/upload-public', async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);
    const fileName = `submissions/${Date.now()}-${file.name}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, buffer, {
        contentType: file.type,
      });

    if (error) {
      console.error('Error uploading submission file:', error);
      return c.json({ error: 'Failed to upload file' }, 500);
    }

    // Generate signed URL
    const { data: urlData, error: urlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 31536000);

    if (urlError) {
      console.error('Error creating signed URL for submission file:', urlError);
      return c.json({ error: 'Failed to generate file URL' }, 500);
    }

    return c.json({ 
      fileName: data.path,
      url: urlData.signedUrl 
    });
  } catch (error) {
    console.error('Server error during public file upload:', error);
    return c.json({ error: 'Internal server error during upload' }, 500);
  }
});

// Initialize default data
app.post('/make-server-3e8e17c2/init', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const { categories, subservices, packages, jobs, scholarships } = await c.req.json();
    
    // Store categories
    if (categories) {
      for (const category of categories) {
        await kv.set(`category:${category.id}`, category);
      }
    }
    
    // Store sub-services
    if (subservices) {
      for (const service of subservices) {
        await kv.set(`subservice:${service.id}`, service);
      }
    }
    
    // Store packages
    if (packages) {
      for (const pkg of packages) {
        await kv.set(`package:${pkg.id}`, pkg);
      }
    }
    
    // Store jobs
    if (jobs) {
      for (const job of jobs) {
        await kv.set(`job:${job.id}`, job);
      }
    }
    
    // Store scholarships
    if (scholarships) {
      for (const scholarship of scholarships) {
        await kv.set(`scholarship:${scholarship.id}`, scholarship);
      }
    }
    
    return c.json({ success: true, message: 'Data initialized successfully' });
  } catch (error) {
    console.error('Error initializing data:', error);
    return c.json({ error: 'Failed to initialize data' }, 500);
  }
});

// Dashboard stats
app.get('/make-server-3e8e17c2/stats', async (c) => {
  const { authorized } = await verifyAdmin(c.req.raw);
  if (!authorized) return c.json({ error: 'Unauthorized' }, 401);

  try {
    const [categories, subservices, packages, jobs, scholarships, submissions] = await Promise.all([
      kv.getByPrefix('category:'),
      kv.getByPrefix('subservice:'),
      kv.getByPrefix('package:'),
      kv.getByPrefix('job:'),
      kv.getByPrefix('scholarship:'),
      kv.getByPrefix('submission:')
    ]);

    return c.json({
      stats: {
        totalCategories: categories.length,
        totalServices: subservices.length,
        totalPackages: packages.length,
        totalJobs: jobs.length,
        totalScholarships: scholarships.length,
        totalSubmissions: submissions.length,
        activeJobs: jobs.filter((j: any) => j.status === 'active').length,
        activeScholarships: scholarships.filter((s: any) => s.status === 'active').length,
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

Deno.serve(app.fetch);
