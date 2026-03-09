import { Link, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Briefcase, ExternalLink } from 'lucide-react';
import { useApp } from '../context/AppContext';

export function Jobs() {
  const { jobs } = useApp();
  const navigate = useNavigate();
  const activeJobs = jobs.filter(j => j.status === 'active');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-[#0D69EA] to-[#0952ba] text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl mb-4">Job Opportunities</h1>
          <p className="text-xl text-blue-100">Find your dream job or apply with NextStep</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-6">
          {activeJobs.map(job => (
            <div key={job.id} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl mb-2">{job.title}</h3>
                  <p className="text-gray-600 mb-3">{job.organization}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" />
                      {job.type}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Deadline: {new Date(job.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex flex-col gap-2">
                  {job.externalLink && (
                    <a
                      href={job.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 border-2 border-[#0D69EA] text-[#0D69EA] rounded-lg hover:bg-[#0D69EA] hover:text-white transition text-center flex items-center justify-center"
                    >
                      Apply Now
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  )}
                  <button
                    onClick={() => navigate(`/inquiry?job=${job.id}`)}
                    className="px-6 py-2 bg-[#0D69EA] text-white rounded-lg hover:opacity-90 transition"
                  >
                    Apply with NextStep
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-3">{job.description}</p>
                <div>
                  <p className="mb-2">Requirements:</p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {activeJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No active job postings at the moment. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
}
