import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SubService,
  Package,
  Job,
  Scholarship,
  FormSubmission,
  ServiceCategory,
  serviceCategories as initialCategories,
  subServices as initialSubServices,
  packages as initialPackages,
  jobs as initialJobs,
  scholarships as initialScholarships
} from '../data/mockData';
import {
  authAPI,
  categoriesAPI,
  subServicesAPI,
  packagesAPI,
  jobsAPI,
  scholarshipsAPI,
  submissionsAPI,
  settingsAPI,
  initAPI
} from '../utils/api';

interface AppContextType {
  // Data
  categories: ServiceCategory[];
  subServices: SubService[];
  packages: Package[];
  jobs: Job[];
  scholarships: Scholarship[];
  formSubmissions: FormSubmission[];
  settings: any;
  loading: boolean;
  
  // Auth
  isAdminLoggedIn: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  
  // Refresh data
  refreshData: () => Promise<void>;
  
  // CRUD operations
  addCategory: (category: ServiceCategory) => Promise<void>;
  updateCategory: (id: string, category: Partial<ServiceCategory>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  addSubService: (service: SubService) => Promise<void>;
  updateSubService: (id: string, service: Partial<SubService>) => Promise<void>;
  deleteSubService: (id: string) => Promise<void>;
  
  addPackage: (pkg: Package) => Promise<void>;
  updatePackage: (id: string, pkg: Partial<Package>) => Promise<void>;
  deletePackage: (id: string) => Promise<void>;
  
  addJob: (job: Job) => Promise<void>;
  updateJob: (id: string, job: Partial<Job>) => Promise<void>;
  deleteJob: (id: string) => Promise<void>;
  
  addScholarship: (scholarship: Scholarship) => Promise<void>;
  updateScholarship: (id: string, scholarship: Partial<Scholarship>) => Promise<void>;
  deleteScholarship: (id: string) => Promise<void>;
  
  addFormSubmission: (submission: FormSubmission) => Promise<void>;
  updateFormSubmission: (id: string, submission: Partial<FormSubmission>) => Promise<void>;
  deleteFormSubmission: (id: string) => Promise<void>;
  
  updateSettings: (settings: any) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<ServiceCategory[]>(initialCategories);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [formSubmissions, setFormSubmissions] = useState<FormSubmission[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dataInitialized, setDataInitialized] = useState(false);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token');
      if (token) {
        try {
          await authAPI.getSession();
          setIsAdminLoggedIn(true);
        } catch (error) {
          console.error('Session check failed:', error);
          localStorage.removeItem('admin_token');
          setIsAdminLoggedIn(false);
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  // Load data from backend
  const refreshData = async () => {
    setLoading(true);
    try {
      const [categoriesData, subServicesData, packagesData, jobsData, scholarshipsData, settingsData] = await Promise.all([
        categoriesAPI.getAll(),
        subServicesAPI.getAll(),
        packagesAPI.getAll(),
        jobsAPI.getAll(),
        scholarshipsAPI.getAll(),
        settingsAPI.get()
      ]);

      // If database is empty, initialize with default data
      if (categoriesData.length === 0 && !dataInitialized) {
        console.log('Initializing database with default data...');
        try {
          await initAPI.initializeData({
            categories: initialCategories,
            subservices: initialSubServices,
            packages: initialPackages,
            jobs: initialJobs,
            scholarships: initialScholarships
          });
          // Refresh after initialization
          const [newCategories, newSubServices, newPackages, newJobs, newScholarships] = await Promise.all([
            categoriesAPI.getAll(),
            subServicesAPI.getAll(),
            packagesAPI.getAll(),
            jobsAPI.getAll(),
            scholarshipsAPI.getAll()
          ]);
          setCategories(newCategories);
          setSubServices(newSubServices);
          setPackages(newPackages);
          setJobs(newJobs);
          setScholarships(newScholarships);
          setDataInitialized(true);
        } catch (error) {
          console.error('Failed to initialize data:', error);
          // Fall back to local data
          setSubServices(initialSubServices);
          setPackages(initialPackages);
          setJobs(initialJobs);
          setScholarships(initialScholarships);
        }
      } else {
        setCategories(categoriesData.length > 0 ? categoriesData : initialCategories);
        setSubServices(subServicesData);
        setPackages(packagesData);
        setJobs(jobsData);
        setScholarships(scholarshipsData);
      }
      
      setSettings(settingsData);

      // Only load submissions if admin is logged in
      if (isAdminLoggedIn) {
        try {
          const submissionsData = await submissionsAPI.getAll();
          setFormSubmissions(submissionsData);
        } catch (error) {
          console.error('Failed to load submissions:', error);
        }
      }
    } catch (error) {
      console.error('Failed to load data:', error);
      // Fall back to local data
      setSubServices(initialSubServices);
      setPackages(initialPackages);
      setJobs(initialJobs);
      setScholarships(initialScholarships);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, [isAdminLoggedIn]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await authAPI.login(email, password);
      setIsAdminLoggedIn(true);
      await refreshData();
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAdminLoggedIn(false);
      setFormSubmissions([]);
    }
  };

  // Category CRUD
  const addCategory = async (category: ServiceCategory) => {
    try {
      await categoriesAPI.create(category);
      await refreshData();
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<ServiceCategory>) => {
    try {
      await categoriesAPI.update(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await categoriesAPI.delete(id);
      await refreshData();
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  };

  // SubService CRUD
  const addSubService = async (service: SubService) => {
    try {
      await subServicesAPI.create(service);
      await refreshData();
    } catch (error) {
      console.error('Failed to add sub-service:', error);
      throw error;
    }
  };

  const updateSubService = async (id: string, updates: Partial<SubService>) => {
    try {
      await subServicesAPI.update(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Failed to update sub-service:', error);
      throw error;
    }
  };

  const deleteSubService = async (id: string) => {
    try {
      await subServicesAPI.delete(id);
      await refreshData();
    } catch (error) {
      console.error('Failed to delete sub-service:', error);
      throw error;
    }
  };

  // Package CRUD
  const addPackage = async (pkg: Package) => {
    try {
      await packagesAPI.create(pkg);
      await refreshData();
    } catch (error) {
      console.error('Failed to add package:', error);
      throw error;
    }
  };

  const updatePackage = async (id: string, updates: Partial<Package>) => {
    try {
      await packagesAPI.update(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Failed to update package:', error);
      throw error;
    }
  };

  const deletePackage = async (id: string) => {
    try {
      await packagesAPI.delete(id);
      await refreshData();
    } catch (error) {
      console.error('Failed to delete package:', error);
      throw error;
    }
  };

  // Job CRUD
  const addJob = async (job: Job) => {
    try {
      await jobsAPI.create(job);
      await refreshData();
    } catch (error) {
      console.error('Failed to add job:', error);
      throw error;
    }
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    try {
      await jobsAPI.update(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Failed to update job:', error);
      throw error;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      await jobsAPI.delete(id);
      await refreshData();
    } catch (error) {
      console.error('Failed to delete job:', error);
      throw error;
    }
  };

  // Scholarship CRUD
  const addScholarship = async (scholarship: Scholarship) => {
    try {
      await scholarshipsAPI.create(scholarship);
      await refreshData();
    } catch (error) {
      console.error('Failed to add scholarship:', error);
      throw error;
    }
  };

  const updateScholarship = async (id: string, updates: Partial<Scholarship>) => {
    try {
      await scholarshipsAPI.update(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Failed to update scholarship:', error);
      throw error;
    }
  };

  const deleteScholarship = async (id: string) => {
    try {
      await scholarshipsAPI.delete(id);
      await refreshData();
    } catch (error) {
      console.error('Failed to delete scholarship:', error);
      throw error;
    }
  };

  // Form Submission CRUD
  const addFormSubmission = async (submission: FormSubmission) => {
    try {
      await submissionsAPI.create(submission);
      await refreshData();
    } catch (error) {
      console.error('Failed to add form submission:', error);
      throw error;
    }
  };

  const updateFormSubmission = async (id: string, updates: Partial<FormSubmission>) => {
    try {
      await submissionsAPI.update(id, updates);
      await refreshData();
    } catch (error) {
      console.error('Failed to update form submission:', error);
      throw error;
    }
  };

  const deleteFormSubmission = async (id: string) => {
    try {
      await submissionsAPI.delete(id);
      await refreshData();
    } catch (error) {
      console.error('Failed to delete form submission:', error);
      throw error;
    }
  };

  // Settings
  const updateSettings = async (newSettings: any) => {
    try {
      await settingsAPI.update(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        categories,
        subServices,
        packages,
        jobs,
        scholarships,
        formSubmissions,
        settings,
        loading,
        isAdminLoggedIn,
        login,
        logout,
        refreshData,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubService,
        updateSubService,
        deleteSubService,
        addPackage,
        updatePackage,
        deletePackage,
        addJob,
        updateJob,
        deleteJob,
        addScholarship,
        updateScholarship,
        deleteScholarship,
        addFormSubmission,
        updateFormSubmission,
        deleteFormSubmission,
        updateSettings
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};