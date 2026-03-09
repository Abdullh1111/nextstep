import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Upload } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function InquiryForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { addFormSubmission, packages, subServices } = useApp();
  const [submitted, setSubmitted] = useState(false);
  
  const packageId = searchParams.get('package');
  const serviceId = searchParams.get('service');
  const jobId = searchParams.get('job');
  const scholarshipId = searchParams.get('scholarship');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    message: '',
    files: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submission = {
      id: `sub-${Date.now()}`,
      type: jobId ? 'job' : scholarshipId ? 'scholarship' : 'service',
      servicePackageId: packageId || serviceId,
      jobId: jobId || undefined,
      scholarshipId: scholarshipId || undefined,
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'pending' as const
    };

    addFormSubmission(submission);
    setSubmitted(true);
  };

  const pkg = packageId ? packages.find(p => p.id === packageId) : null;
  const service = serviceId ? subServices.find(s => s.id === serviceId) : null;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl mb-4">Thank You!</h2>
          <p className="text-gray-600 mb-6">
            We have received your request. Our team will contact you very soon.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-[#0D69EA] text-white rounded-lg hover:opacity-90 transition"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl mb-2">Submit Your Request</h1>
          <p className="text-gray-600 mb-8">
            {pkg && `Package: ${pkg.name}`}
            {service && `Service: ${service.name}`}
            {jobId && 'Job Application'}
            {scholarshipId && 'Scholarship Application'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div>
              <label className="block mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <label className="block mb-2">
                Upload Files (CV/Documents)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0D69EA] transition">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Click or drag files to upload</p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block mt-2 px-4 py-2 bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200 transition"
                >
                  Choose Files
                </label>
              </div>
            </div>

            <div>
              <label className="block mb-2">
                Comment / Message
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us more about your requirements..."
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 py-3 bg-[#0D69EA] text-white rounded-lg hover:opacity-90 transition"
              >
                Submit Request
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
