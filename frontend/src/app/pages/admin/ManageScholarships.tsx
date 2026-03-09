import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, ArrowLeft, Search, ToggleLeft, ToggleRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Scholarship } from '../../data/mockData';
import { toast } from 'sonner';

export function ManageScholarships() {
  const { scholarships, addScholarship, updateScholarship, deleteScholarship, logout } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
  const [formData, setFormData] = useState<Partial<Scholarship>>({
    id: '',
    title: '',
    organization: '',
    deadline: '',
    country: '',
    level: '',
    description: '',
    eligibility: [''],
    benefits: [''],
    externalLink: '',
    status: 'active'
  });

  const filteredScholarships = scholarships.filter(scholarship => 
    scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (scholarship?: Scholarship) => {
    if (scholarship) {
      setEditingScholarship(scholarship);
      setFormData(scholarship);
    } else {
      setEditingScholarship(null);
      setFormData({
        id: `sc${Date.now()}`,
        title: '',
        organization: '',
        deadline: '',
        country: '',
        level: '',
        description: '',
        eligibility: [''],
        benefits: [''],
        externalLink: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingScholarship(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const cleanedData = {
        ...formData,
        eligibility: formData.eligibility?.filter(e => e.trim() !== '') || [],
        benefits: formData.benefits?.filter(b => b.trim() !== '') || []
      };

      if (editingScholarship) {
        await updateScholarship(editingScholarship.id, cleanedData);
        toast.success('Scholarship updated successfully!');
      } else {
        await addScholarship(cleanedData as Scholarship);
        toast.success('Scholarship created successfully!');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save scholarship');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this scholarship?')) {
      try {
        await deleteScholarship(id);
        toast.success('Scholarship deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete scholarship');
        console.error(error);
      }
    }
  };

  const toggleStatus = async (scholarship: Scholarship) => {
    try {
      await updateScholarship(scholarship.id, { 
        status: scholarship.status === 'active' ? 'inactive' : 'active' 
      });
      toast.success(`Scholarship ${scholarship.status === 'active' ? 'deactivated' : 'activated'}!`);
    } catch (error) {
      toast.error('Failed to update scholarship status');
      console.error(error);
    }
  };

  const handleArrayChange = (field: 'eligibility' | 'benefits', index: number, value: string) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData({ ...formData, [field]: newArray });
  };

  const addArrayItem = (field: 'eligibility' | 'benefits') => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), ''] });
  };

  const removeArrayItem = (field: 'eligibility' | 'benefits', index: number) => {
    const newArray = [...(formData[field] || [])];
    newArray.splice(index, 1);
    setFormData({ ...formData, [field]: newArray });
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
            <h1 className="text-2xl text-[#0D69EA]">Manage Scholarships</h1>
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
                  placeholder="Search scholarships..."
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
              Add Scholarship
            </button>
          </div>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 gap-6">
          {filteredScholarships.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center text-gray-500">
              No scholarships found
            </div>
          ) : (
            filteredScholarships.map((scholarship) => (
              <div key={scholarship.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl">{scholarship.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        scholarship.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {scholarship.status}
                      </span>
                    </div>
                    <div className="text-gray-600 mb-3">{scholarship.organization}</div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                      <span>🌍 {scholarship.country}</span>
                      <span>🎓 {scholarship.level}</span>
                      <span>📅 Deadline: {new Date(scholarship.deadline).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700 mb-3">{scholarship.description}</p>
                    
                    {scholarship.eligibility.length > 0 && (
                      <div className="mb-3">
                        <div className="text-sm mb-1">Eligibility:</div>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {scholarship.eligibility.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {scholarship.benefits.length > 0 && (
                      <div className="mb-3">
                        <div className="text-sm mb-1">Benefits:</div>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {scholarship.benefits.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {scholarship.externalLink && (
                      <a
                        href={scholarship.externalLink}
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
                      onClick={() => toggleStatus(scholarship)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                      title={scholarship.status === 'active' ? 'Deactivate' : 'Activate'}
                    >
                      {scholarship.status === 'active' ? (
                        <ToggleRight className="h-6 w-6 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-6 w-6" />
                      )}
                    </button>
                    <button
                      onClick={() => handleOpenModal(scholarship)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(scholarship.id)}
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
              <h2 className="text-2xl">{editingScholarship ? 'Edit Scholarship' : 'Add New Scholarship'}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block mb-2 text-sm">Scholarship Title *</label>
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
                  <label className="block mb-2 text-sm">Country *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm">Level *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Master's, PhD, Undergraduate"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  />
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
                <label className="block mb-2 text-sm">Eligibility Criteria</label>
                {formData.eligibility?.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                      value={item}
                      onChange={(e) => handleArrayChange('eligibility', index, e.target.value)}
                      placeholder={`Criteria ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('eligibility', index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('eligibility')}
                  className="text-sm text-[#0D69EA] hover:underline"
                >
                  + Add Eligibility Criteria
                </button>
              </div>

              <div>
                <label className="block mb-2 text-sm">Benefits</label>
                {formData.benefits?.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                      value={item}
                      onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                      placeholder={`Benefit ${index + 1}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('benefits', index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('benefits')}
                  className="text-sm text-[#0D69EA] hover:underline"
                >
                  + Add Benefit
                </button>
              </div>

              <div>
                <label className="block mb-2 text-sm">External Link (optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/scholarship"
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
                  {editingScholarship ? 'Update Scholarship' : 'Create Scholarship'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
