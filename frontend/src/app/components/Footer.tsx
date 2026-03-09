import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { serviceCategories } from '../data/mockData';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white mb-4">About NextStep.xyz</h3>
            <p className="text-sm text-gray-400">
              Your trusted partner for career services, higher education support, digital services, and travel solutions. We help you take the next step towards your goals.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="hover:text-[#0D69EA] transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#0D69EA] transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#0D69EA] transition">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-[#0D69EA] transition">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              {serviceCategories.map(category => (
                <li key={category.id}>
                  <Link
                    to={`/services/${category.id}`}
                    className="hover:text-[#0D69EA] transition"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/jobs" className="hover:text-[#0D69EA] transition">
                  Job Opportunities
                </Link>
              </li>
              <li>
                <Link to="/scholarships" className="hover:text-[#0D69EA] transition">
                  Scholarships
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#0D69EA] transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#0D69EA] transition">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <span>123 Main Street, Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2" />
                <span>info@nextstep.xyz</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© 2024 NextStep.xyz. All rights reserved.</p>
          <p className="mt-4 md:mt-0">
            Developed by <span className="text-[#0D69EA]">CodeFuturist</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
