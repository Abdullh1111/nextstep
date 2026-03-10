import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Users, Award, Globe, Briefcase, GraduationCap, Plane, MapPin, Calendar, Building2, DollarSign } from 'lucide-react';
import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

export function Home() {
  const { categories, jobs, scholarships, loading } = useApp();

  const latestJobs = useMemo(
    () =>
      jobs
        .filter((job: any) => job.status === 'active')
        .sort((a: any, b: any) => new Date(b.updatedAt ?? b.deadline ?? 0).getTime() - new Date(a.updatedAt ?? a.deadline ?? 0).getTime())
        .slice(0, 3),
    [jobs]
  );

  const latestScholarships = useMemo(
    () =>
      scholarships
        .filter((scholarship: any) => scholarship.status === 'active')
        .sort((a: any, b: any) => new Date(b.updatedAt ?? b.deadline ?? 0).getTime() - new Date(a.updatedAt ?? a.deadline ?? 0).getTime())
        .slice(0, 3),
    [scholarships]
  );

  const iconMap: { [key: string]: any } = {
    Briefcase,
    GraduationCap,
    Globe,
    Plane
  };

  const features = [
    {
      icon: CheckCircle2,
      title: 'Professional Services',
      description: 'Expert assistance in career, education, digital, and travel services'
    },
    {
      icon: Users,
      title: 'Experienced Team',
      description: 'Dedicated professionals committed to your success'
    },
    {
      icon: Award,
      title: 'Proven Results',
      description: 'Thousands of satisfied clients achieving their goals'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#0D69EA] to-[#0952ba] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl mb-6">
              Take Your <span className="text-yellow-300">Next Step</span> With Confidence
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Your trusted partner for career growth, higher education, digital services, and travel solutions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/services/career"
                className="px-8 py-3 bg-white text-[#0D69EA] rounded-lg hover:bg-gray-100 transition inline-flex items-center justify-center"
              >
                Explore Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/jobs"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white hover:text-[#0D69EA] transition"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 text-[#0D69EA] mb-4">
                    <Icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl mb-4">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive solutions tailored to help you achieve your personal and professional goals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map(category => {
              const Icon = iconMap[category.icon] || Globe;
              return (
                <Link
                  key={category.id}
                  to={`/services/${category.id}`}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition group"
                >
                  <div
                    className="w-14 h-14 rounded-lg flex items-center justify-center mb-4 transition group-hover:scale-110"
                    style={{ backgroundColor: `${category.color}15` }}
                  >
                    <Icon className="h-7 w-7" style={{ color: category.color }} />
                  </div>
                  <h3 className="text-xl mb-2 group-hover:text-[#0D69EA] transition">
                    {category.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">{category.description}</p>
                  <span className="text-[#0D69EA] flex items-center text-sm">
                    Learn more
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Latest Jobs Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl mb-2">Latest Job Opportunities</h2>
              <p className="text-gray-600">
                Discover the newest career opportunities posted by our partners
              </p>
            </div>
            <Link
              to="/jobs"
              className="hidden md:flex items-center text-[#0D69EA] hover:underline"
            >
              View All Jobs
              <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-50 rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : latestJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl group-hover:text-[#0D69EA] transition">
                      {job.title}
                    </h3>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Building2 className="h-4 w-4 mr-2 text-[#0D69EA]" />
                      {job.company}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-[#0D69EA]" />
                      {job.location}
                    </div>
                    {job.salary && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <DollarSign className="h-4 w-4 mr-2 text-[#0D69EA]" />
                        {job.salary}
                      </div>
                    )}
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-[#0D69EA]" />
                      Posted {new Date(job.postedDate).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-blue-50 text-[#0D69EA] rounded-full text-xs">
                      {job.type}
                    </span>
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs">
                      {job.experience}
                    </span>
                  </div>

                  <Link
                    to="/jobs"
                    className="text-[#0D69EA] flex items-center text-sm hover:underline"
                  >
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No job opportunities available at the moment</p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/jobs"
              className="inline-flex items-center text-[#0D69EA] hover:underline"
            >
              View All Jobs
              <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Scholarships Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl mb-2">Latest Scholarship Opportunities</h2>
              <p className="text-gray-600">
                Explore newest scholarship programs to fund your education
              </p>
            </div>
            <Link
              to="/scholarships"
              className="hidden md:flex items-center text-[#0D69EA] hover:underline"
            >
              View All Scholarships
              <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : latestScholarships.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestScholarships.map((scholarship) => (
                <div
                  key={scholarship.id}
                  className="bg-white rounded-xl p-6 hover:shadow-lg transition group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl group-hover:text-[#0D69EA] transition">
                      {scholarship.title}
                    </h3>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Building2 className="h-4 w-4 mr-2 text-[#0D69EA]" />
                      {scholarship.provider}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-[#0D69EA]" />
                      {scholarship.country}
                    </div>
                    {scholarship.amount && (
                      <div className="flex items-center text-gray-600 text-sm">
                        <DollarSign className="h-4 w-4 mr-2 text-[#0D69EA]" />
                        {scholarship.amount}
                      </div>
                    )}
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-[#0D69EA]" />
                      Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs">
                      {scholarship.level}
                    </span>
                    <span className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs">
                      {scholarship.field}
                    </span>
                  </div>

                  <Link
                    to="/scholarships"
                    className="text-[#0D69EA] flex items-center text-sm hover:underline"
                  >
                    View Details
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No scholarship opportunities available at the moment</p>
            </div>
          )}

          <div className="mt-8 text-center md:hidden">
            <Link
              to="/scholarships"
              className="inline-flex items-center text-[#0D69EA] hover:underline"
            >
              View All Scholarships
              <ArrowRight className="ml-1 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-[#0D69EA] to-[#0952ba] rounded-2xl p-12 text-white text-center">
            <h2 className="text-4xl mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Join thousands of satisfied clients who have achieved their goals with NextStep.xyz
            </p>
            <Link
              to="/signup"
              className="inline-block px-8 py-3 bg-white text-[#0D69EA] rounded-lg hover:bg-gray-100 transition"
            >
              Sign Up Now
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl text-[#0D69EA] mb-2">10K+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl text-[#0D69EA] mb-2">50+</div>
              <div className="text-gray-600">Services</div>
            </div>
            <div>
              <div className="text-4xl text-[#0D69EA] mb-2">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl text-[#0D69EA] mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
