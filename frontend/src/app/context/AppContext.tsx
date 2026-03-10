import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { SubService, Package, Job, Scholarship, FormSubmission, ServiceCategory } from '../data/mockData';
import {
  useLoginMutation,
  useLogoutMutation,
  useGetSessionQuery,
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetSubServicesQuery,
  useCreateSubServiceMutation,
  useUpdateSubServiceMutation,
  useDeleteSubServiceMutation,
  useGetPackagesQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
  useGetJobsQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useGetScholarshipsQuery,
  useCreateScholarshipMutation,
  useUpdateScholarshipMutation,
  useDeleteScholarshipMutation,
  useGetSubmissionsQuery,
  useCreateSubmissionMutation,
  useUpdateSubmissionMutation,
  useDeleteSubmissionMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
} from '../services/nextstepApi';

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
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategoryMutation] = useUpdateCategoryMutation();
  const [deleteCategoryMutation] = useDeleteCategoryMutation();
  const [createSubService] = useCreateSubServiceMutation();
  const [updateSubServiceMutation] = useUpdateSubServiceMutation();
  const [deleteSubServiceMutation] = useDeleteSubServiceMutation();
  const [createPackage] = useCreatePackageMutation();
  const [updatePackageMutation] = useUpdatePackageMutation();
  const [deletePackageMutation] = useDeletePackageMutation();
  const [createJob] = useCreateJobMutation();
  const [updateJobMutation] = useUpdateJobMutation();
  const [deleteJobMutation] = useDeleteJobMutation();
  const [createScholarship] = useCreateScholarshipMutation();
  const [updateScholarshipMutation] = useUpdateScholarshipMutation();
  const [deleteScholarshipMutation] = useDeleteScholarshipMutation();
  const [createSubmission] = useCreateSubmissionMutation();
  const [updateSubmissionMutation] = useUpdateSubmissionMutation();
  const [deleteSubmissionMutation] = useDeleteSubmissionMutation();
  const [updateSettingsMutation] = useUpdateSettingsMutation();

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const { data: sessionData, error: sessionError, isFetching: sessionLoading } = useGetSessionQuery(undefined, {
    skip: !token,
  });

  useEffect(() => {
    if (sessionData) {
      setIsAdminLoggedIn(true);
    } else if (sessionError) {
      localStorage.removeItem('admin_token');
      setIsAdminLoggedIn(false);
    }
  }, [sessionData, sessionError]);

  const {
    data: categories = [],
    isFetching: categoriesLoading,
    refetch: refetchCategories,
  } = useGetCategoriesQuery();
  const {
    data: subServices = [],
    isFetching: subServicesLoading,
    refetch: refetchSubServices,
  } = useGetSubServicesQuery();
  const {
    data: packages = [],
    isFetching: packagesLoading,
    refetch: refetchPackages,
  } = useGetPackagesQuery();
  const {
    data: jobs = [],
    isFetching: jobsLoading,
    refetch: refetchJobs,
  } = useGetJobsQuery();
  const {
    data: scholarships = [],
    isFetching: scholarshipsLoading,
    refetch: refetchScholarships,
  } = useGetScholarshipsQuery();
  const {
    data: formSubmissions = [],
    isFetching: submissionsLoading,
    refetch: refetchSubmissions,
  } = useGetSubmissionsQuery(undefined, { skip: !isAdminLoggedIn });
  const {
    data: settings = {},
    isFetching: settingsLoading,
    refetch: refetchSettings,
  } = useGetSettingsQuery();

  const loading =
    sessionLoading ||
    categoriesLoading ||
    subServicesLoading ||
    packagesLoading ||
    jobsLoading ||
    scholarshipsLoading ||
    settingsLoading ||
    (isAdminLoggedIn && submissionsLoading);

  const refreshData = async () => {
    await Promise.all([
      refetchCategories(),
      refetchSubServices(),
      refetchPackages(),
      refetchJobs(),
      refetchScholarships(),
      refetchSettings(),
      isAdminLoggedIn ? refetchSubmissions() : Promise.resolve(),
    ]);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await loginMutation({ email, password }).unwrap();
      if (data.access_token) {
        localStorage.setItem('admin_token', data.access_token);
      }
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
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAdminLoggedIn(false);
      localStorage.removeItem('admin_token');
    }
  };

  // Category CRUD
  const addCategory = async (category: ServiceCategory) => {
    try {
      await createCategory(category).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to add category:', error);
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<ServiceCategory>) => {
    try {
      await updateCategoryMutation({ id, updates }).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to update category:', error);
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await deleteCategoryMutation(id).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to delete category:', error);
      throw error;
    }
  };

  // SubService CRUD
  const addSubService = async (service: SubService) => {
    try {
      await createSubService(service).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to add sub-service:', error);
      throw error;
    }
  };

  const updateSubService = async (id: string, updates: Partial<SubService>) => {
    try {
      await updateSubServiceMutation({ id, updates }).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to update sub-service:', error);
      throw error;
    }
  };

  const deleteSubService = async (id: string) => {
    try {
      await deleteSubServiceMutation(id).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to delete sub-service:', error);
      throw error;
    }
  };

  // Package CRUD
  const addPackage = async (pkg: Package) => {
    try {
      await createPackage(pkg).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to add package:', error);
      throw error;
    }
  };

  const updatePackage = async (id: string, updates: Partial<Package>) => {
    try {
      await updatePackageMutation({ id, updates }).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to update package:', error);
      throw error;
    }
  };

  const deletePackage = async (id: string) => {
    try {
      await deletePackageMutation(id).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to delete package:', error);
      throw error;
    }
  };

  // Job CRUD
  const addJob = async (job: Job) => {
    try {
      await createJob(job).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to add job:', error);
      throw error;
    }
  };

  const updateJob = async (id: string, updates: Partial<Job>) => {
    try {
      await updateJobMutation({ id, updates }).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to update job:', error);
      throw error;
    }
  };

  const deleteJob = async (id: string) => {
    try {
      await deleteJobMutation(id).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to delete job:', error);
      throw error;
    }
  };

  // Scholarship CRUD
  const addScholarship = async (scholarship: Scholarship) => {
    try {
      await createScholarship(scholarship).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to add scholarship:', error);
      throw error;
    }
  };

  const updateScholarship = async (id: string, updates: Partial<Scholarship>) => {
    try {
      await updateScholarshipMutation({ id, updates }).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to update scholarship:', error);
      throw error;
    }
  };

  const deleteScholarship = async (id: string) => {
    try {
      await deleteScholarshipMutation(id).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to delete scholarship:', error);
      throw error;
    }
  };

  // Form Submission CRUD
  const addFormSubmission = async (submission: FormSubmission) => {
    try {
      await createSubmission(submission).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to add form submission:', error);
      throw error;
    }
  };

  const updateFormSubmission = async (id: string, updates: Partial<FormSubmission>) => {
    try {
      await updateSubmissionMutation({ id, updates }).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to update form submission:', error);
      throw error;
    }
  };

  const deleteFormSubmission = async (id: string) => {
    try {
      await deleteSubmissionMutation(id).unwrap();
      await refreshData();
    } catch (error) {
      console.error('Failed to delete form submission:', error);
      throw error;
    }
  };

  // Settings
  const updateSettings = async (newSettings: any) => {
    try {
      await updateSettingsMutation(newSettings).unwrap();
      await refreshData();
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
