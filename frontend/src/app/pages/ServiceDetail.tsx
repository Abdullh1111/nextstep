import { useParams, Link, useNavigate } from 'react-router-dom';
import { Check, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ServiceDetail() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { categories, subServices, packages } = useApp();
  
  const service = subServices.find(s => s.id === serviceId);
  const servicePackages = packages.filter(p => p.serviceId === serviceId);
  const category = categories.find(c => c.id === service?.categoryId);

  if (!service) {
    return <div className="container mx-auto px-4 py-12">Service not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Link to="/" className="hover:text-[#0D69EA]">Home</Link>
            <span className="mx-2">/</span>
            <Link to={`/services/${category?.id}`} className="hover:text-[#0D69EA]">{category?.name}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{service.name}</span>
          </div>
          <h1 className="text-4xl mb-4">{service.name}</h1>
          <p className="text-gray-700 text-lg">{service.fullDescription}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg p-6 shadow-md mb-6">
              <h2 className="text-2xl mb-4">Key Features</h2>
              <ul className="space-y-3">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h2 className="text-2xl mb-4">Benefits</h2>
              <ul className="space-y-3">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Packages */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-md sticky top-24">
              <h2 className="text-2xl mb-6">Choose Your Package</h2>
              <div className="space-y-4">
                {servicePackages.length > 0 ? (
                  servicePackages.map(pkg => (
                    <div key={pkg.id} className="border rounded-lg p-4 hover:border-[#0D69EA] transition">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg">{pkg.name}</h3>
                        {pkg.displayPrice && (
                          <span className="text-lg text-[#0D69EA]">{pkg.price}</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{pkg.description}</p>
                      <ul className="space-y-2 mb-4">
                        {pkg.features.map((feature, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={() => navigate(`/inquiry?package=${pkg.id}`)}
                        className="w-full py-2 bg-[#0D69EA] text-white rounded-lg hover:opacity-90 transition flex items-center justify-center"
                      >
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Custom pricing available</p>
                    <button
                      onClick={() => navigate(`/inquiry?service=${serviceId}`)}
                      className="px-6 py-2 bg-[#0D69EA] text-white rounded-lg hover:opacity-90 transition"
                    >
                      Request Quote
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
