import { Link, useNavigate } from 'react-router-dom';
import { FileText, Package, Briefcase, GraduationCap, Inbox, Settings, LogOut, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function AdminDashboard() {
  const { subServices, packages, jobs, scholarships, formSubmissions, logout } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const stats = [
    { label: 'Total Services', value: subServices.length, icon: FileText, color: 'blue', link: '/admin/services' },
    { label: 'Total Packages', value: packages.length, icon: Package, color: 'purple', link: '/admin/packages' },
    { label: 'Job Posts', value: jobs.length, icon: Briefcase, color: 'green', link: '/admin/jobs' },
    { label: 'Scholarships', value: scholarships.length, icon: GraduationCap, color: 'orange', link: '/admin/scholarships' },
    { label: 'Form Submissions', value: formSubmissions.length, icon: Inbox, color: 'red', link: '/admin/submissions' },
  ];

  const colorMap: { [key: string]: string } = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    red: 'bg-red-100 text-red-600',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl text-[#0D69EA]">Admin Dashboard</h1>
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
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Link
                key={index}
                to={stat.link}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition"
              >
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${colorMap[stat.color]}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-3xl mb-1">{stat.value}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </Link>
            );
          })}
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/admin/services" className="flex items-center p-4 border rounded-lg hover:border-[#0D69EA] hover:bg-blue-50 transition">
              <FileText className="h-6 w-6 mr-3 text-[#0D69EA]" />
              <div>
                <div className="font-medium">Manage Services</div>
                <div className="text-sm text-gray-600">Add, edit, or delete services</div>
              </div>
            </Link>
            <Link to="/admin/packages" className="flex items-center p-4 border rounded-lg hover:border-[#0D69EA] hover:bg-blue-50 transition">
              <Package className="h-6 w-6 mr-3 text-[#0D69EA]" />
              <div>
                <div>Manage Packages</div>
                <div className="text-sm text-gray-600">Configure service packages</div>
              </div>
            </Link>
            <Link to="/admin/jobs" className="flex items-center p-4 border rounded-lg hover:border-[#0D69EA] hover:bg-blue-50 transition">
              <Briefcase className="h-6 w-6 mr-3 text-[#0D69EA]" />
              <div>
                <div>Manage Jobs</div>
                <div className="text-sm text-gray-600">Post and manage job listings</div>
              </div>
            </Link>
            <Link to="/admin/scholarships" className="flex items-center p-4 border rounded-lg hover:border-[#0D69EA] hover:bg-blue-50 transition">
              <GraduationCap className="h-6 w-6 mr-3 text-[#0D69EA]" />
              <div>
                <div>Manage Scholarships</div>
                <div className="text-sm text-gray-600">Update scholarship opportunities</div>
              </div>
            </Link>
            <Link to="/admin/submissions" className="flex items-center p-4 border rounded-lg hover:border-[#0D69EA] hover:bg-blue-50 transition">
              <Inbox className="h-6 w-6 mr-3 text-[#0D69EA]" />
              <div>
                <div>View Submissions</div>
                <div className="text-sm text-gray-600">Review inquiry forms</div>
              </div>
            </Link>
            <Link to="/admin/settings" className="flex items-center p-4 border rounded-lg hover:border-[#0D69EA] hover:bg-blue-50 transition">
              <Settings className="h-6 w-6 mr-3 text-[#0D69EA]" />
              <div>
                <div>Settings</div>
                <div className="text-sm text-gray-600">Website configuration</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl mb-4">Recent Submissions</h2>
          {formSubmissions.length > 0 ? (
            <div className="space-y-3">
              {formSubmissions.slice(0, 5).map(submission => (
                <div key={submission.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <div className>{submission.fullName}</div>
                      <div className="text-sm text-gray-600">{submission.email}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(submission.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No submissions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}