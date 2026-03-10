import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { ServiceCategory, SubService, Package, Job, Scholarship, FormSubmission } from '../data/mockData';

const baseUrl =  'http://localhost:3001';

export const nextstepApi = createApi({
  reducerPath: 'nextstepApi',
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: 'include',
    prepareHeaders: (headers) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Category', 'SubService', 'Package', 'Job', 'Scholarship', 'Submission', 'Settings', 'Auth'],
  endpoints: (builder) => ({
    // Auth
    signup: builder.mutation<{ access_token: string }, { email: string; password: string; name: string }>({
      query: (body) => ({ url: '/auth/signup', method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),
    login: builder.mutation<{ access_token: string }, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      invalidatesTags: ['Auth'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['Auth'],
    }),
    getSession: builder.query<{ user: unknown }, void>({
      query: () => '/auth/session',
      providesTags: ['Auth'],
    }),

    // Categories
    getCategories: builder.query<ServiceCategory[], void>({
      query: () => '/categories',
      transformResponse: (response: { categories?: ServiceCategory[] }) => response.categories ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((category) => ({ type: 'Category' as const, id: category.id })),
              { type: 'Category' as const, id: 'LIST' },
            ]
          : [{ type: 'Category' as const, id: 'LIST' }],
    }),
    createCategory: builder.mutation<ServiceCategory, Partial<ServiceCategory>>({
      query: (body) => ({ url: '/categories', method: 'POST', body }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    updateCategory: builder.mutation<ServiceCategory, { id: string; updates: Partial<ServiceCategory> }>({
      query: ({ id, updates }) => ({ url: `/categories/${id}`, method: 'PUT', body: updates }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Category', id: arg.id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
    deleteCategory: builder.mutation<void, string>({
      query: (id) => ({ url: `/categories/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),

    // Subservices
    getSubServices: builder.query<SubService[], void>({
      query: () => '/subservices',
      transformResponse: (response: { subservices?: SubService[] }) => response.subservices ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: 'SubService' as const, id: item.id })),
              { type: 'SubService' as const, id: 'LIST' },
            ]
          : [{ type: 'SubService' as const, id: 'LIST' }],
    }),
    createSubService: builder.mutation<SubService, Partial<SubService>>({
      query: (body) => ({ url: '/subservices', method: 'POST', body }),
      invalidatesTags: [{ type: 'SubService', id: 'LIST' }],
    }),
    updateSubService: builder.mutation<SubService, { id: string; updates: Partial<SubService> }>({
      query: ({ id, updates }) => ({ url: `/subservices/${id}`, method: 'PUT', body: updates }),
      invalidatesTags: (result, error, arg) => [
        { type: 'SubService', id: arg.id },
        { type: 'SubService', id: 'LIST' },
      ],
    }),
    deleteSubService: builder.mutation<void, string>({
      query: (id) => ({ url: `/subservices/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'SubService', id },
        { type: 'SubService', id: 'LIST' },
      ],
    }),

    // Packages
    getPackages: builder.query<Package[], void>({
      query: () => '/packages',
      transformResponse: (response: { packages?: Package[] }) => response.packages ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: 'Package' as const, id: item.id })),
              { type: 'Package' as const, id: 'LIST' },
            ]
          : [{ type: 'Package' as const, id: 'LIST' }],
    }),
    createPackage: builder.mutation<Package, Partial<Package>>({
      query: (body) => ({ url: '/packages', method: 'POST', body }),
      invalidatesTags: [{ type: 'Package', id: 'LIST' }],
    }),
    updatePackage: builder.mutation<Package, { id: string; updates: Partial<Package> }>({
      query: ({ id, updates }) => ({ url: `/packages/${id}`, method: 'PUT', body: updates }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Package', id: arg.id },
        { type: 'Package', id: 'LIST' },
      ],
    }),
    deletePackage: builder.mutation<void, string>({
      query: (id) => ({ url: `/packages/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Package', id },
        { type: 'Package', id: 'LIST' },
      ],
    }),

    // Jobs
    getJobs: builder.query<Job[], void>({
      query: () => '/jobs',
      transformResponse: (response: { jobs?: Job[] }) => response.jobs ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: 'Job' as const, id: item.id })),
              { type: 'Job' as const, id: 'LIST' },
            ]
          : [{ type: 'Job' as const, id: 'LIST' }],
    }),
    createJob: builder.mutation<Job, Partial<Job>>({
      query: (body) => ({ url: '/jobs', method: 'POST', body }),
      invalidatesTags: [{ type: 'Job', id: 'LIST' }],
    }),
    updateJob: builder.mutation<Job, { id: string; updates: Partial<Job> }>({
      query: ({ id, updates }) => ({ url: `/jobs/${id}`, method: 'PUT', body: updates }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Job', id: arg.id },
        { type: 'Job', id: 'LIST' },
      ],
    }),
    deleteJob: builder.mutation<void, string>({
      query: (id) => ({ url: `/jobs/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Job', id },
        { type: 'Job', id: 'LIST' },
      ],
    }),

    // Scholarships
    getScholarships: builder.query<Scholarship[], void>({
      query: () => '/scholarships',
      transformResponse: (response: { scholarships?: Scholarship[] }) => response.scholarships ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: 'Scholarship' as const, id: item.id })),
              { type: 'Scholarship' as const, id: 'LIST' },
            ]
          : [{ type: 'Scholarship' as const, id: 'LIST' }],
    }),
    createScholarship: builder.mutation<Scholarship, Partial<Scholarship>>({
      query: (body) => ({ url: '/scholarships', method: 'POST', body }),
      invalidatesTags: [{ type: 'Scholarship', id: 'LIST' }],
    }),
    updateScholarship: builder.mutation<Scholarship, { id: string; updates: Partial<Scholarship> }>({
      query: ({ id, updates }) => ({ url: `/scholarships/${id}`, method: 'PUT', body: updates }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Scholarship', id: arg.id },
        { type: 'Scholarship', id: 'LIST' },
      ],
    }),
    deleteScholarship: builder.mutation<void, string>({
      query: (id) => ({ url: `/scholarships/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Scholarship', id },
        { type: 'Scholarship', id: 'LIST' },
      ],
    }),

    // Submissions
    getSubmissions: builder.query<FormSubmission[], void>({
      query: () => '/submissions',
      transformResponse: (response: { submissions?: FormSubmission[] }) => response.submissions ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({ type: 'Submission' as const, id: item.id })),
              { type: 'Submission' as const, id: 'LIST' },
            ]
          : [{ type: 'Submission' as const, id: 'LIST' }],
    }),
    createSubmission: builder.mutation<FormSubmission, Partial<FormSubmission>>({
      query: (body) => ({ url: '/submissions', method: 'POST', body }),
      invalidatesTags: [{ type: 'Submission', id: 'LIST' }],
    }),
    updateSubmission: builder.mutation<FormSubmission, { id: string; updates: Partial<FormSubmission> }>({
      query: ({ id, updates }) => ({ url: `/submissions/${id}`, method: 'PUT', body: updates }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Submission', id: arg.id },
        { type: 'Submission', id: 'LIST' },
      ],
    }),
    deleteSubmission: builder.mutation<void, string>({
      query: (id) => ({ url: `/submissions/${id}`, method: 'DELETE' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Submission', id },
        { type: 'Submission', id: 'LIST' },
      ],
    }),

    // Settings
    getSettings: builder.query<Record<string, unknown>, void>({
      query: () => '/settings',
      transformResponse: (response: { settings?: Record<string, unknown> }) => response.settings ?? {},
      providesTags: ['Settings'],
    }),
    updateSettings: builder.mutation<Record<string, unknown>, Record<string, unknown>>({
      query: (body) => ({ url: '/settings', method: 'PUT', body }),
      invalidatesTags: ['Settings'],
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
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
} = nextstepApi;
