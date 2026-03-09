import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { serviceCategories } from '../data/mockData';
import { useApp } from '../context/AppContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const { subServices } = useApp();

  const getServicesByCategory = (categoryId: string) => {
    return subServices.filter(s => s.categoryId === categoryId);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl" style={{ color: '#0D69EA' }}>
              NextStep<span className="text-gray-700">.xyz</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-[#0D69EA] transition">
              Home
            </Link>
            <Link to="/jobs" className="text-gray-700 hover:text-[#0D69EA] transition">
              Job Apply
            </Link>
            <Link to="/scholarships" className="text-gray-700 hover:text-[#0D69EA] transition">
              Scholarship Apply
            </Link>

            {/* Services Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className="flex items-center text-gray-700 hover:text-[#0D69EA] transition">
                Our Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {isServicesOpen && (
                <div className="absolute left-0 mt-2 w-screen max-w-5xl -ml-96 bg-white shadow-2xl rounded-lg p-8 border border-gray-100">
                  <div className="grid grid-cols-2 gap-8">
                    {serviceCategories.map(category => (
                      <div key={category.id}>
                        <Link
                          to={`/services/${category.id}`}
                          className="flex items-center mb-4 group"
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                            style={{ backgroundColor: `${category.color}15` }}
                          >
                            <span style={{ color: category.color }}>📁</span>
                          </div>
                          <div>
                            <h3
                              className="group-hover:text-[#0D69EA] transition"
                              style={{ color: category.color }}
                            >
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-500">{category.description}</p>
                          </div>
                        </Link>
                        <div className="ml-13 space-y-2">
                          {getServicesByCategory(category.id).slice(0, 5).map(service => (
                            <Link
                              key={service.id}
                              to={`/service/${service.id}`}
                              className="block text-sm text-gray-600 hover:text-[#0D69EA] hover:pl-2 transition-all"
                            >
                              • {service.name}
                            </Link>
                          ))}
                          {getServicesByCategory(category.id).length > 5 && (
                            <Link
                              to={`/services/${category.id}`}
                              className="block text-sm text-[#0D69EA] hover:underline"
                            >
                              View all ({getServicesByCategory(category.id).length})
                            </Link>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg text-white transition hover:opacity-90"
              style={{ backgroundColor: '#0D69EA' }}
            >
              Sign Up / Log In
            </Link>

            <Link
              to="/admin/login"
              className="px-3 py-1.5 rounded-md border-2 text-[#0D69EA] border-[#0D69EA] hover:bg-[#0D69EA] hover:text-white transition text-sm"
            >
              Admin Panel
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link
              to="/"
              className="block text-gray-700 hover:text-[#0D69EA] py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="block text-gray-700 hover:text-[#0D69EA] py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Job Apply
            </Link>
            <Link
              to="/scholarships"
              className="block text-gray-700 hover:text-[#0D69EA] py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Scholarship Apply
            </Link>

            {/* Mobile Services */}
            <div className="border-t pt-3">
              <p className="text-gray-500 mb-2">Our Services</p>
              {serviceCategories.map(category => (
                <Link
                  key={category.id}
                  to={`/services/${category.id}`}
                  className="block py-2 pl-4 text-gray-700 hover:text-[#0D69EA]"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ borderLeft: `3px solid ${category.color}` }}
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <Link
              to="/signup"
              className="block px-4 py-2 rounded-lg text-white text-center"
              style={{ backgroundColor: '#0D69EA' }}
              onClick={() => setIsMenuOpen(false)}
            >
              Sign Up / Log In
            </Link>

            <Link
              to="/admin/login"
              className="block px-4 py-2 rounded-lg border-2 text-[#0D69EA] border-[#0D69EA] text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin Panel
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
