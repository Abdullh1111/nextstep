import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, LogOut, ArrowLeft, Search, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Package } from '../../data/mockData';
import { toast } from 'sonner';

export function ManagePackages() {
  const { packages, subServices, addPackage, updatePackage, deletePackage, logout } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterService, setFilterService] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [formData, setFormData] = useState<Partial<Package>>({
    id: '',
    serviceId: '',
    name: '',
    description: '',
    features: [''],
    price: '',
    displayPrice: true
  });

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pkg.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = filterService === 'all' || pkg.serviceId === filterService;
    return matchesSearch && matchesService;
  });

  const handleOpenModal = (pkg?: Package) => {
    if (pkg) {
      setEditingPackage(pkg);
      setFormData(pkg);
    } else {
      setEditingPackage(null);
      setFormData({
        id: `p${Date.now()}`,
        serviceId: subServices[0]?.id || '',
        name: '',
        description: '',
        features: [''],
        price: '',
        displayPrice: true
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingPackage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const cleanedData = {
        ...formData,
        features: formData.features?.filter(f => f.trim() !== '') || []
      };

      if (editingPackage) {
        await updatePackage(editingPackage.id, cleanedData);
        toast.success('Package updated successfully!');
      } else {
        await addPackage(cleanedData as Package);
        toast.success('Package created successfully!');
      }
      handleCloseModal();
    } catch (error) {
      toast.error('Failed to save package');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await deletePackage(id);
        toast.success('Package deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete package');
        console.error(error);
      }
    }
  };

  const handleArrayChange = (index: number, value: string) => {
    const newArray = [...(formData.features || [])];
    newArray[index] = value;
    setFormData({ ...formData, features: newArray });
  };

  const addArrayItem = () => {
    setFormData({ ...formData, features: [...(formData.features || []), ''] });
  };

  const removeArrayItem = (index: number) => {
    const newArray = [...(formData.features || [])];
    newArray.splice(index, 1);
    setFormData({ ...formData, features: newArray });
  };

  const getServiceName = (serviceId: string) => {
    return subServices.find(s => s.id === serviceId)?.name || serviceId;
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
            <h1 className="text-2xl text-[#0D69EA]">Manage Packages</h1>
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
                  placeholder="Search packages..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-1 md:flex-initial">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent appearance-none"
                  value={filterService}
                  onChange={(e) => setFilterService(e.target.value)}
                >
                  <option value="all">All Services</option>
                  {subServices.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center px-6 py-2 bg-[#0D69EA] text-white rounded-lg hover:opacity-90 transition whitespace-nowrap"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Package
              </button>
            </div>
          </div>
        </div>

        {/* Packages Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Package Name</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Service</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Price</th>
                  <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-gray-700">Features</th>
                  <th className="px-6 py-3 text-right text-xs uppercase tracking-wider text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPackages.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No packages found
                    </td>
                  </tr>
                ) : (
                  filteredPackages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className>{pkg.name}</div>
                        <div className="text-sm text-gray-600">{pkg.description}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                          {getServiceName(pkg.serviceId)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-600">{pkg.price}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">{pkg.features.length} features</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleOpenModal(pkg)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(pkg.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4">
              <h2 className="text-2xl">{editingPackage ? 'Edit Package' : 'Add New Package'}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm">Package Name *</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                
                <div>
                  <label className="block mb-2 text-sm">Service *</label>
                  <select
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.serviceId}
                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                  >
                    {subServices.map(service => (
                      <option key={service.id} value={service.id}>{service.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm">Description *</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm">Price *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., ৳1,500 or Contact Us"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="displayPrice"
                  className="w-4 h-4 text-[#0D69EA] border-gray-300 rounded focus:ring-[#0D69EA]"
                  checked={formData.displayPrice}
                  onChange={(e) => setFormData({ ...formData, displayPrice: e.target.checked })}
                />
                <label htmlFor="displayPrice" className="text-sm">Display price on website</label>
              </div>

              <div>
                <label className="block mb-2 text-sm">Features</label>
                {formData.features?.map((feature, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                      value={feature}
                      onChange={(e) => handleArrayChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
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
                  + Add Feature
                </button>
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
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
