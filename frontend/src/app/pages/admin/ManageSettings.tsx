import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, ArrowLeft, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner';

export function ManageSettings() {
  const { settings, updateSettings, logout } = useApp();
  const [formData, setFormData] = useState({
    siteName: 'NextStep.xyz',
    contactEmail: 'info@nextstep.xyz',
    contactPhone: '+880 1234-567890',
    address: 'Dhaka, Bangladesh',
    facebook: '',
    twitter: '',
    linkedin: '',
    instagram: '',
    whatsapp: '',
    aboutText: '',
    footerText: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (settings && Object.keys(settings).length > 0) {
      setFormData(prev => ({ ...prev, ...settings }));
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateSettings(formData);
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings');
      console.error(error);
    } finally {
      setLoading(false);
    }
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
            <h1 className="text-2xl text-[#0D69EA]">Website Settings</h1>
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
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* General Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl mb-4">General Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm">Site Name</label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm">About Text</label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.aboutText}
                    onChange={(e) => setFormData({ ...formData, aboutText: e.target.value })}
                    placeholder="Brief description about your organization"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm">Footer Text</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.footerText}
                    onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                    placeholder="Copyright and additional footer information"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl mb-4">Contact Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm">Contact Email</label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm">WhatsApp Number</label>
                  <input
                    type="tel"
                    placeholder="+880 1234-567890"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm">Address</label>
                  <textarea
                    required
                    rows={3}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl mb-4">Social Media Links</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm">Facebook URL</label>
                  <input
                    type="url"
                    placeholder="https://facebook.com/yourpage"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.facebook}
                    onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm">Twitter URL</label>
                  <input
                    type="url"
                    placeholder="https://twitter.com/yourhandle"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm">LinkedIn URL</label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/company/yourcompany"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block mb-2 text-sm">Instagram URL</label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/yourhandle"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#0D69EA] focus:border-transparent"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Admin Account Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl mb-4">Admin Account</h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
                <p className="mb-2">To change your admin email or password, use the Supabase Auth dashboard or contact your system administrator.</p>
                <p className="text-gray-700">Current account credentials are managed through Supabase Authentication.</p>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-8 py-3 bg-[#0D69EA] text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
              >
                <Save className="h-5 w-5 mr-2" />
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
