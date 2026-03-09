import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, ArrowLeft, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Job } from '../../data/mockData';
import { toast } from 'sonner';

export function ManageJobs() {
  const { jobs, addJob, updateJob, deleteJob, logout } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<Partial<Job>>({
    id: '',
    title: '',
    organization: '',
    deadline: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: [''],
    externalLink: '',
    status: 'active'
  });

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (job?: Job) => {
    if (job) {
      setEditingJob(job);
      setFormData(job);
    } else {
      setEditingJob(null);
      setFormData({
        id: `j${Date.now()}`,
        title: '',
        organization: '',
        deadline: '',
        location: '',
        type: 'Full-time',
        description: '',
        requirements: [''],
        externalLink: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingJob(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const cleanedData = {
        ...formData,
        requirements: formData.requirements?.filter(r => r.trim() !== '') || []
      };

      if (editingJob) {
        await updateJob(editingJob.id, cleanedData);
        toast.success('Job updated successfully!');
      } else {
        await addJob(cleanedData as Job);
        toast.success('Job created successfully!');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save job');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await deleteJob(id);
        toast.success('Job deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete job');
        console.error(error);
      }
    }
  };

  const toggleStatus = async (job: Job) => {
    try {
      await updateJob(job.id, { status: job.status === 'active' ? 'inactive' : 'active' });
      toast.success(`Job ${job.status === 'active' ? 'deactivated' : 'activated'}!`);
    } catch (error) {
      toast.error('Failed to update job status');
      console.error(error);
    }
  };

  const handleArrayChange = (index: number, value: string) => {
    const newArray = [...(formData.requirements || [])];
    newArray[index] = value;
    setFormData({ ...formData, requirements: newArray });
  };

  const addArrayItem = () => {
    setFormData({ ...formData, requirements: [...(formData.requirements || []), ''] });
  };

  const removeArrayItem = (index: number) => {
    const newArray = [...(formData.requirements || [])];
    newArray.splice(index, 1);
    setFormData({ ...formData, requirements: newArray });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin/dashboard" className="text-gray-600 hover:text-[#0D69EA]">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl text-[#0D69EA]">Manage Jobs</h1>
          </div>
          <button
            onClick={() => logout()}
            className="flex items-center px-4 py-2 text-gray-700 hover:text-red-600 transition"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jobs..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center px-6 py-2 bg-[#0D69EA] text-white rounded-lg hover:opacity-90 transition whitespace-nowrap"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Job
            </button>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
              No jobs found
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl">{job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <div className="text-gray-600 mb-3">{job.organization}</div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span>📍 {job.location}</span>
                      <span>💼 {job.type}</span>
                      <span>📅 Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{job.description}</p>
                    {job.requirements.length > 0 && (
                      <div className="mb-3">
                        <div className="text-sm mb-1">Requirements:</div>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {job.requirements.map((req, idx) => (
                            <li key={idx}>{req}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {job.externalLink && (
                      <a
                        href={job.externalLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#0D69EA] hover:underline"
                      >
                        View External Link →
                      </a>
                    )}
                  </div>
                  
                  <div className="flex md:flex-col gap-2">
                    <button
                      onClick={() => toggleStatus(job)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                      title={job.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {job.status === 'active' ? (
                        <ToggleRight className="h-6 w-6 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-6 w-6" />
                      )}
                    </button>
                    <button
                      onClick={() => handleOpenModal(job)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4">
              <h2 className="text-2xl">{editingJob ? 'Edit Job' : 'Add New Job'}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block mb-2 text-sm">Job Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm">Organization *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm">Location *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm">Job Type *</label>
                  <select
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block mb-2 text-sm">Deadline *</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm">Description *</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Requirements</label>
                {formData.requirements?.map((req, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                      value={req}
                      onChange={(e) => handleArrayChange(index, e.target.value)}
                      placeholder={`Requirement ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addArrayItem}
                  className="text-sm text-[#0D69EA] hover:underline"
                >
                  + Add Requirement
                </button>
              </div>

              <div>
                <label className="block mb-2 text-sm">External Link (optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/job"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                  value={formData.externalLink}
                  onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Status *</label>
                <select
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex gap-4 justify-end pt-4 border-t">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#0D69EA] text-white rounded-lg hover:opacity-90 transition"
                >
                  {editingJob ? 'Update Job' : 'Create Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
