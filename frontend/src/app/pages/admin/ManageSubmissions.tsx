import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, Calendar, FileText, LogOut, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner';

export function ManageSubmissions() {
  const { formSubmissions, updateFormSubmission, deleteFormSubmission, logout } = useApp();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'pending' | 'contacted' | 'completed'>('all');

  const filteredSubmissions = filter === 'all'
    ? formSubmissions
    : formSubmissions.filter(s => s.status === filter);

  const updateStatus = async (id: string, status: 'pending' | 'contacted' | 'completed') => {
    try {
      await updateFormSubmission(id, { status });
      toast.success('Submission status updated!');
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await deleteFormSubmission(id);
        toast.success('Submission deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete submission');
        console.error(error);
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="text-gray-600 hover:text-[#0D69EA]">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl text-[#0D69EA]">Form Submissions</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 transition"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'contacted', 'completed'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg transition ${
                  filter === status
                    ? 'bg-[#0D69EA] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.map(submission => (
            <div key={submission.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div className="flex-1">
                  <h3 className="text-xl mb-2">{submission.fullName}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      {submission.email}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      {submission.phone}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(submission.submittedAt).toLocaleString()}
                    </div>
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-2" />
                      Type: {submission.type}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={submission.status}
                    onChange={(e) => updateStatus(submission.id, e.target.value as any)}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="contacted">Contacted</option>
                    <option value="completed">Completed</option>
                  </select>
                  <button
                    onClick={() => handleDelete(submission.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
              {submission.message && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm mb-1">Message:</p>
                  <p className="text-gray-700">{submission.message}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredSubmissions.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
            No submissions found
          </div>
        )}
      </div>
    </div>
  );
}