import { projectId, publicAnonKey } from '../../../utils/supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-3e8e17c2`;

// Get auth token from localStorage
const getAuthToken = () => localStorage.getItem('admin_token');

// Generic API request function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    headers['Authorization'] = `Bearer ${publicAnonKey}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

// Authentication API
export const authAPI = {
  signup: async (email: string, password: string, name: string) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  login: async (email: string, password: string) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.access_token) {
      localStorage.setItem('admin_token', data.access_token);
    }
    return data;
  },

  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('admin_token');
    }
  },

  getSession: async () => {
    return apiRequest('/auth/session');
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const data = await apiRequest('/categories');
    return data.categories || [];
  },

  create: async (category: any) => {
    const data = await apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
    return data.category;
  },

  update: async (id: string, updates: any) => {
    const data = await apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.category;
  },

  delete: async (id: string) => {
    return apiRequest(`/categories/${id}`, { method: 'DELETE' });
  },
};

// Sub-services API
export const subServicesAPI = {
  getAll: async () => {
    const data = await apiRequest('/subservices');
    return data.subservices || [];
  },

  create: async (subservice: any) => {
    const data = await apiRequest('/subservices', {
      method: 'POST',
      body: JSON.stringify(subservice),
    });
    return data.subservice;
  },

  update: async (id: string, updates: any) => {
    const data = await apiRequest(`/subservices/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.subservice;
  },

  delete: async (id: string) => {
    return apiRequest(`/subservices/${id}`, { method: 'DELETE' });
  },
};

// Packages API
export const packagesAPI = {
  getAll: async () => {
    const data = await apiRequest('/packages');
    return data.packages || [];
  },

  create: async (pkg: any) => {
    const data = await apiRequest('/packages', {
      method: 'POST',
      body: JSON.stringify(pkg),
    });
    return data.package;
  },

  update: async (id: string, updates: any) => {
    const data = await apiRequest(`/packages/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.package;
  },

  delete: async (id: string) => {
    return apiRequest(`/packages/${id}`, { method: 'DELETE' });
  },
};

// Jobs API
export const jobsAPI = {
  getAll: async () => {
    const data = await apiRequest('/jobs');
    return data.jobs || [];
  },

  create: async (job: any) => {
    const data = await apiRequest('/jobs', {
      method: 'POST',
      body: JSON.stringify(job),
    });
    return data.job;
  },

  update: async (id: string, updates: any) => {
    const data = await apiRequest(`/jobs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.job;
  },

  delete: async (id: string) => {
    return apiRequest(`/jobs/${id}`, { method: 'DELETE' });
  },
};

// Scholarships API
export const scholarshipsAPI = {
  getAll: async () => {
    const data = await apiRequest('/scholarships');
    return data.scholarships || [];
  },

  create: async (scholarship: any) => {
    const data = await apiRequest('/scholarships', {
      method: 'POST',
      body: JSON.stringify(scholarship),
    });
    return data.scholarship;
  },

  update: async (id: string, updates: any) => {
    const data = await apiRequest(`/scholarships/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.scholarship;
  },

  delete: async (id: string) => {
    return apiRequest(`/scholarships/${id}`, { method: 'DELETE' });
  },
};

// Form Submissions API
export const submissionsAPI = {
  getAll: async () => {
    const data = await apiRequest('/submissions');
    return data.submissions || [];
  },

  create: async (submission: any) => {
    const data = await apiRequest('/submissions', {
      method: 'POST',
      body: JSON.stringify(submission),
    });
    return data.submission;
  },

  update: async (id: string, updates: any) => {
    const data = await apiRequest(`/submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return data.submission;
  },

  delete: async (id: string) => {
    return apiRequest(`/submissions/${id}`, { method: 'DELETE' });
  },
};

// Settings API
export const settingsAPI = {
  get: async () => {
    const data = await apiRequest('/settings');
    return data.settings;
  },

  update: async (settings: any) => {
    const data = await apiRequest('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
    return data.settings;
  },
};

// File Upload API
export const uploadAPI = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = getAuthToken();
    const headers: HeadersInit = {
      'Authorization': token ? `Bearer ${token}` : `Bearer ${publicAnonKey}`,
    };

    const response = await fetch(`${BASE_URL}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },

  uploadPublicFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/upload-public`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },
};

// Initialize data
export const initAPI = {
  initializeData: async (data: any) => {
    return apiRequest('/init', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Stats API
export const statsAPI = {
  getStats: async () => {
    const data = await apiRequest('/stats');
    return data.stats;
  },
};