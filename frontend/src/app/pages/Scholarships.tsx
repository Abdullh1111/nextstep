import { useNavigate } from 'react-router-dom';
import { Calendar, Globe, GraduationCap, ExternalLink, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Scholarships() {
  const { scholarships } = useApp();
  const navigate = useNavigate();
  const activeScholarships = scholarships.filter(s => s.status === 'active');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl mb-4">Scholarship Opportunities</h1>
          <p className="text-xl text-purple-100">Fund your education with global scholarships</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-6">
          {activeScholarships.map(scholarship => (
            <div key={scholarship.id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl mb-2">{scholarship.title}</h3>
                  <p className="text-gray-600 mb-3">{scholarship.organization}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-1" />
                      {scholarship.country}
                    </div>
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 mr-1" />
                      {scholarship.level}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-col gap-2">
                  {scholarship.externalLink && (
                    <a
                      href={scholarship.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition text-center flex items-center justify-center"
                    >
                      Apply Now
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => navigate(`/inquiry?scholarship=${scholarship.id}`)}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:opacity-90 transition"
                  >
                    Apply with NextStep
                  </button>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{scholarship.description}</p>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="flex items-center mb-2">
                    <Award className="h-5 w-5 mr-2 text-purple-600" />
                    Eligibility
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                    {scholarship.eligibility.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="flex items-center mb-2">
                    <Award className="h-5 w-5 mr-2 text-green-600" />
                    Benefits
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                    {scholarship.benefits.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeScholarships.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No active scholarships at the moment. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
