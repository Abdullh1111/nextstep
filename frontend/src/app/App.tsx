import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Toaster } from './components/ui/sonner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ServiceCategory } from './pages/ServiceCategory';
import { ServiceDetail } from './pages/ServiceDetail';
import { InquiryForm } from './pages/InquiryForm';
import { Jobs } from './pages/Jobs';
import { Scholarships } from './pages/Scholarships';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminSignup } from './pages/admin/AdminSignup';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { ManageSubmissions } from './pages/admin/ManageSubmissions';
import { ManageServices } from './pages/admin/ManageServices';
import { ManagePackages } from './pages/admin/ManagePackages';
import { ManageJobs } from './pages/admin/ManageJobs';
import { ManageScholarships } from './pages/admin/ManageScholarships';
import { ManageSettings } from './pages/admin/ManageSettings';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn } = useApp();
  return isAdminLoggedIn ? <>{children}</> : <Navigate to="/admin/login" />;
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}

function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl mb-6 text-center">Sign Up / Log In</h1>
        <p className="text-gray-600 text-center mb-6">
          This is a demo interface. User authentication will be integrated in the full system.
        </p>
        <button className="w-full py-3 bg-[#0D69EA] text-white rounded-lg hover:opacity-90 transition mb-3">
          Sign Up with Email
        </button>
        <button className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
          Log In
        </button>
      </div>
    </div>
  );
}

function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl mb-6">Privacy Policy</h1>
      <div className="prose max-w-none">
        <p className="text-gray-700">
          This is a placeholder for the Privacy Policy page. In the production version, this will contain
          comprehensive privacy policy details.
        </p>
      </div>
    </div>
  );
}

function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl mb-6">Terms & Conditions</h1>
      <div className="prose max-w-none">
        <p className="text-gray-700">
          This is a placeholder for the Terms & Conditions page. In the production version, this will contain
          comprehensive terms and conditions.
        </p>
      </div>
    </div>
  );
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
      <Route path="/services/:categoryId" element={<PublicLayout><ServiceCategory /></PublicLayout>} />
      <Route path="/service/:serviceId" element={<PublicLayout><ServiceDetail /></PublicLayout>} />
      <Route path="/inquiry" element={<PublicLayout><InquiryForm /></PublicLayout>} />
      <Route path="/jobs" element={<PublicLayout><Jobs /></PublicLayout>} />
      <Route path="/scholarships" element={<PublicLayout><Scholarships /></PublicLayout>} />
      <Route path="/signup" element={<PublicLayout><SignUpPage /></PublicLayout>} />
      <Route path="/privacy" element={<PublicLayout><PrivacyPage /></PublicLayout>} />
      <Route path="/terms" element={<PublicLayout><TermsPage /></PublicLayout>} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/submissions" element={<ProtectedRoute><ManageSubmissions /></ProtectedRoute>} />
      <Route path="/admin/services" element={<ProtectedRoute><ManageServices /></ProtectedRoute>} />
      <Route path="/admin/packages" element={<ProtectedRoute><ManagePackages /></ProtectedRoute>} />
      <Route path="/admin/jobs" element={<ProtectedRoute><ManageJobs /></ProtectedRoute>} />
      <Route path="/admin/scholarships" element={<ProtectedRoute><ManageScholarships /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute><ManageSettings /></ProtectedRoute>} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
        <Toaster />
      </AppProvider>
    </BrowserRouter>
  );
}