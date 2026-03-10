import { useParams, Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function ServiceCategory() {
  const { categoryId } = useParams();
  const { categories, subServices } = useApp();
  
  const category = categories.find(c => c.id === categoryId);
  const services = subServices.filter(s => s.categoryId === categoryId);

  if (!category) {
    return <div className="container mx-auto px-4 py-12">Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="py-12" style={{ backgroundColor: `${category.color}10` }}>
        <div className="container mx-auto px-4">
          <h1 className="text-4xl mb-4" style={{ color: category.color }}>
            {category.name}
          </h1>
          <p className="text-gray-700 text-lg">{category.description}</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <Link
              key={service.id}
              to={`/service/${service.id}`}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition group"
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: `${category.color}15` }}
              >
                <span style={{ color: category.color }}>📋</span>
              </div>
              <h3 className="text-xl mb-2 group-hover:text-[#0D69EA] transition">
                {service.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{service.shortDescription}</p>
              <span className="text-[#0D69EA] flex items-center text-sm">
                View Details
                <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
