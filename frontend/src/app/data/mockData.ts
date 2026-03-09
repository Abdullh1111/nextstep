// Mock data structures for NextStep.xyz

export interface SubService {
  id: string;
  name: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  benefits: string[];
  categoryId: string;
  icon?: string;
  image?: string;
}

export interface Package {
  id: string;
  serviceId: string;
  name: string;
  description: string;
  features: string[];
  price: string;
  displayPrice?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  description: string;
}

export interface Job {
  id: string;
  title: string;
  organization: string;
  deadline: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  externalLink?: string;
  status: 'active' | 'inactive';
}

export interface Scholarship {
  id: string;
  title: string;
  organization: string;
  deadline: string;
  country: string;
  level: string;
  description: string;
  eligibility: string[];
  benefits: string[];
  externalLink?: string;
  status: 'active' | 'inactive';
}

export interface FormSubmission {
  id: string;
  type: 'service' | 'job' | 'scholarship';
  servicePackageId?: string;
  jobId?: string;
  scholarshipId?: string;
  fullName: string;
  phone: string;
  email: string;
  message?: string;
  files?: string[];
  submittedAt: string;
  status: 'pending' | 'contacted' | 'completed';
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'career',
    name: 'Career & Job',
    color: '#0D69EA',
    icon: 'Briefcase',
    description: 'Helping job seekers and professionals grow their careers'
  },
  {
    id: 'study',
    name: 'Study & Higher Study',
    color: '#7C3AED',
    icon: 'GraduationCap',
    description: 'Helping students plan and apply for local and global education'
  },
  {
    id: 'digital',
    name: 'Digital Services',
    color: '#F97316',
    icon: 'Globe',
    description: 'Essential online government and business services'
  },
  {
    id: 'travels',
    name: 'Travels',
    color: '#10B981',
    icon: 'Plane',
    description: 'One-stop travel solutions'
  }
];

export const subServices: SubService[] = [
  // Career & Job Services
  {
    id: 's1',
    categoryId: 'career',
    name: 'CV / Resume Writing',
    shortDescription: 'Professional resume writing in Basic, Professional, and International formats',
    fullDescription: 'Get a professionally crafted CV that stands out to employers. Our expert writers understand what recruiters look for and will highlight your skills and experience effectively.',
    features: ['ATS-Optimized', 'Industry-specific keywords', 'Professional formatting', 'Unlimited revisions'],
    benefits: ['Higher interview callbacks', 'Stand out from competition', 'Save time and effort']
  },
  {
    id: 's2',
    categoryId: 'career',
    name: 'Cover Letter & Job Application Support',
    shortDescription: 'Compelling cover letters and application assistance',
    fullDescription: 'Craft the perfect cover letter that complements your CV and makes a strong first impression.',
    features: ['Customized for each job', 'Persuasive language', 'Industry best practices'],
    benefits: ['Better first impression', 'Increased interview chances']
  },
  {
    id: 's3',
    categoryId: 'career',
    name: 'LinkedIn Profile Optimization',
    shortDescription: 'Optimize your LinkedIn presence for better visibility',
    fullDescription: 'Transform your LinkedIn profile into a powerful personal brand that attracts recruiters and opportunities.',
    features: ['Keyword optimization', 'Professional headline', 'Engaging summary', 'Skills endorsement strategy'],
    benefits: ['Increased profile views', 'More connection requests', 'Better job opportunities']
  },
  {
    id: 's4',
    categoryId: 'career',
    name: 'BDJobs Profile Setup',
    shortDescription: 'Complete BDJobs profile setup and optimization',
    fullDescription: 'Get your BDJobs profile professionally set up to maximize your chances in the Bangladeshi job market.',
    features: ['Complete profile setup', 'Keyword optimization', 'Regular updates'],
    benefits: ['More employer views', 'Higher application success rate']
  },
  {
    id: 's5',
    categoryId: 'career',
    name: 'Video Resume',
    shortDescription: 'Create impactful video resumes',
    fullDescription: 'Stand out with a professional video resume that showcases your personality and communication skills.',
    features: ['Professional filming', 'Script assistance', 'Editing and effects'],
    benefits: ['Unique presentation', 'Better personal branding']
  },
  {
    id: 's6',
    categoryId: 'career',
    name: 'Interview Preparation & Mock Session',
    shortDescription: 'Comprehensive interview training with mock sessions',
    fullDescription: 'Build confidence with expert interview coaching and realistic mock sessions.',
    features: ['Common questions practice', 'Behavioral interviews', 'Technical interviews', 'Feedback and tips'],
    benefits: ['Increased confidence', 'Better performance', 'Reduced anxiety']
  },
  {
    id: 's7',
    categoryId: 'career',
    name: 'Career Counseling for Fresh Graduates',
    shortDescription: 'Professional guidance for career starters',
    fullDescription: 'Navigate your career path with expert guidance tailored for fresh graduates.',
    features: ['Career path planning', 'Skill gap analysis', 'Industry insights'],
    benefits: ['Clear career direction', 'Better decision making']
  },
  {
    id: 's8',
    categoryId: 'career',
    name: 'Corporate Training & Skill Development Session',
    shortDescription: 'Professional skill development programs',
    fullDescription: 'Enhance your professional skills with targeted training sessions.',
    features: ['Customized curriculum', 'Expert trainers', 'Certification'],
    benefits: ['Career advancement', 'Increased productivity']
  },
  {
    id: 's9',
    categoryId: 'career',
    name: 'Freelancing & Remote Job Guidance',
    shortDescription: 'Start your freelancing journey with expert guidance',
    fullDescription: 'Learn how to succeed in the freelancing and remote work economy.',
    features: ['Platform selection', 'Profile setup', 'Bidding strategies', 'Portfolio building'],
    benefits: ['Location independence', 'Flexible income']
  },
  {
    id: 's10',
    categoryId: 'career',
    name: 'Internship Placement Support',
    shortDescription: 'Get assistance in securing internships',
    fullDescription: 'Find and secure internships that align with your career goals.',
    features: ['Opportunity matching', 'Application support', 'Follow-up assistance'],
    benefits: ['Practical experience', 'Career kickstart']
  },
  {
    id: 's11',
    categoryId: 'career',
    name: 'Govt-MNC-Bank Jobs Updates',
    shortDescription: 'Regular updates on government, MNC, and bank job opportunities',
    fullDescription: 'Stay informed about the latest job opportunities in government, multinational corporations, and banking sectors.',
    features: ['Daily updates', 'Application deadline reminders', 'Eligibility criteria'],
    benefits: ['Never miss opportunities', 'Timely applications']
  },

  // Study & Higher Study Services
  {
    id: 's12',
    categoryId: 'study',
    name: 'SOP & Motivation Letter Writing',
    shortDescription: 'Compelling SOPs and motivation letters for admissions',
    fullDescription: 'Get expertly crafted statements that effectively communicate your goals and passion.',
    features: ['Personalized content', 'University-specific', 'Multiple revisions'],
    benefits: ['Higher acceptance rates', 'Stand out from applicants']
  },
  {
    id: 's13',
    categoryId: 'study',
    name: 'University & Scholarship Guidance',
    shortDescription: 'Expert guidance for UK, Canada, USA, Malaysia universities',
    fullDescription: 'Navigate the complex university application process with country-specific expertise.',
    features: ['University selection', 'Program matching', 'Application timeline', 'Scholarship opportunities'],
    benefits: ['Better university fit', 'Scholarship chances']
  },
  {
    id: 's14',
    categoryId: 'study',
    name: 'Admission & Application Support',
    shortDescription: 'End-to-end admission application assistance',
    fullDescription: 'Complete support throughout your university application journey.',
    features: ['Document preparation', 'Application review', 'Submission support'],
    benefits: ['Error-free applications', 'Peace of mind']
  },
  {
    id: 's15',
    categoryId: 'study',
    name: 'Visa Documentation & Processing Help',
    shortDescription: 'Student visa application support',
    fullDescription: 'Expert assistance with student visa documentation and processing.',
    features: ['Document checklist', 'Form filling', 'Interview preparation', 'Follow-up'],
    benefits: ['Higher visa success', 'Stress-free process']
  },
  {
    id: 's16',
    categoryId: 'study',
    name: 'IELTS / English Preparation Guidance',
    shortDescription: 'Comprehensive IELTS and English test preparation',
    fullDescription: 'Achieve your target IELTS score with structured preparation.',
    features: ['Practice materials', 'Mock tests', 'Speaking practice', 'Writing feedback'],
    benefits: ['Higher scores', 'Confidence boost']
  },
  {
    id: 's17',
    categoryId: 'study',
    name: 'Study Abroad Counseling',
    shortDescription: 'Country-wise study abroad packages and counseling',
    fullDescription: 'Personalized counseling for studying in your dream destination.',
    features: ['Country comparison', 'Cost analysis', 'Career prospects', 'Cultural guidance'],
    benefits: ['Informed decisions', 'Better planning']
  },
  {
    id: 's18',
    categoryId: 'study',
    name: 'Research Proposal & Academic Writing Support',
    shortDescription: 'Expert help with research proposals and academic writing',
    fullDescription: 'Professional support for research proposals and academic documents.',
    features: ['Topic selection', 'Structure guidance', 'Citation help', 'Proofreading'],
    benefits: ['Quality submissions', 'Academic success']
  },
  {
    id: 's19',
    categoryId: 'study',
    name: 'Scholarship & Exchange Program Updates',
    shortDescription: 'Latest scholarship and exchange program opportunities',
    fullDescription: 'Stay updated on scholarship and exchange opportunities worldwide.',
    features: ['Regular updates', 'Eligibility matching', 'Application reminders'],
    benefits: ['More opportunities', 'Timely applications']
  },

  // Digital Services
  {
    id: 's20',
    categoryId: 'digital',
    name: 'NID Reissue / Correction / Online Copy',
    shortDescription: 'National ID card services',
    fullDescription: 'Get assistance with NID reissue, corrections, and online copy.',
    features: ['Online application', 'Correction support', 'Download assistance'],
    benefits: ['Time saving', 'Error-free process']
  },
  {
    id: 's21',
    categoryId: 'digital',
    name: 'Passport Application & Renewal',
    shortDescription: 'Bangladesh passport application and renewal support',
    fullDescription: 'Complete support for new passport applications and renewals.',
    features: ['Form filling', 'Document verification', 'Appointment booking'],
    benefits: ['Hassle-free process', 'Time efficient']
  },
  {
    id: 's22',
    categoryId: 'digital',
    name: 'Driving License Application Support',
    shortDescription: 'Driving license application assistance',
    fullDescription: 'Get help with driving license applications and renewals.',
    features: ['Application guidance', 'Document preparation', 'Follow-up'],
    benefits: ['Smooth process', 'Quick processing']
  },
  {
    id: 's23',
    categoryId: 'digital',
    name: 'Trade License & TIN Certificate',
    shortDescription: 'Business registration services',
    fullDescription: 'Professional assistance with trade license and TIN certificate.',
    features: ['Application filing', 'Documentation', 'Follow-up support'],
    benefits: ['Legal compliance', 'Business credibility']
  },
  {
    id: 's24',
    categoryId: 'digital',
    name: 'Birth Certificate Online Service',
    shortDescription: 'Birth certificate online application and correction',
    fullDescription: 'Get or correct your birth certificate online.',
    features: ['Online application', 'Correction support', 'Download'],
    benefits: ['Convenient', 'Fast processing']
  },
  {
    id: 's25',
    categoryId: 'digital',
    name: 'E-TIN & VAT Registration',
    shortDescription: 'E-TIN and VAT registration support',
    fullDescription: 'Register for E-TIN and VAT with professional assistance.',
    features: ['Registration guidance', 'Document preparation', 'Submission'],
    benefits: ['Tax compliance', 'Business legitimacy']
  },
  {
    id: 's26',
    categoryId: 'digital',
    name: 'Smart ID & Voter Registration Help',
    shortDescription: 'Smart card and voter registration services',
    fullDescription: 'Assistance with smart card and voter registration.',
    features: ['Application support', 'Document help', 'Verification'],
    benefits: ['Civic participation', 'Identity verification']
  },
  {
    id: 's27',
    categoryId: 'digital',
    name: 'Online Form Fill-Up',
    shortDescription: 'Job, admission, and other online form filling',
    fullDescription: 'Professional form filling service for various online applications.',
    features: ['Accurate filling', 'Document upload', 'Submission'],
    benefits: ['Error-free', 'Time saving']
  },
  {
    id: 's28',
    categoryId: 'digital',
    name: 'Document Print, Scan, & PDF Services',
    shortDescription: 'Document conversion and printing services',
    fullDescription: 'Professional document printing, scanning, and PDF conversion.',
    features: ['High-quality print', 'Scanning', 'PDF conversion', 'Format support'],
    benefits: ['Professional quality', 'Quick turnaround']
  },

  // Travel Services
  {
    id: 's29',
    categoryId: 'travels',
    name: 'Air Ticket Booking',
    shortDescription: 'Domestic and international air ticket booking',
    fullDescription: 'Book domestic and international flights at competitive prices.',
    features: ['Best price search', 'Multiple airlines', 'Booking assistance', 'Group bookings'],
    benefits: ['Cost savings', 'Convenient booking']
  },
  {
    id: 's30',
    categoryId: 'travels',
    name: 'Hotel Booking & Tour Packages',
    shortDescription: 'Hotel reservations and complete tour packages',
    fullDescription: 'Book hotels and complete tour packages for your perfect vacation.',
    features: ['Wide selection', 'Package deals', 'Customization', 'Best rates'],
    benefits: ['Value for money', 'Hassle-free travel']
  },
  {
    id: 's31',
    categoryId: 'travels',
    name: 'Visa Assistance',
    shortDescription: 'Tourist, work, and student visa support',
    fullDescription: 'Professional visa assistance for tourism, work, and study purposes.',
    features: ['Documentation', 'Application support', 'Interview prep', 'Follow-up'],
    benefits: ['Higher approval', 'Stress-free process']
  },
  {
    id: 's32',
    categoryId: 'travels',
    name: 'Umrah & Religious Tour Management',
    shortDescription: 'Complete Umrah and religious tour packages',
    fullDescription: 'Organized Umrah and religious tour packages with complete support.',
    features: ['Package planning', 'Visa support', 'Accommodation', 'Guidance'],
    benefits: ['Peaceful journey', 'Complete care']
  },
  {
    id: 's33',
    categoryId: 'travels',
    name: 'Travel Insurance Support',
    shortDescription: 'Travel insurance for safe journeys',
    fullDescription: 'Get comprehensive travel insurance for worry-free trips.',
    features: ['Coverage comparison', 'Application support', 'Claim assistance'],
    benefits: ['Peace of mind', 'Financial protection']
  },
  {
    id: 's34',
    categoryId: 'travels',
    name: 'Customized Group / Family Tour Planning',
    shortDescription: 'Personalized tour planning for groups and families',
    fullDescription: 'Create memorable experiences with customized tour planning.',
    features: ['Custom itinerary', 'Budget planning', 'Booking coordination', 'Local guides'],
    benefits: ['Personalized experience', 'Memorable trips']
  },
  {
    id: 's35',
    categoryId: 'travels',
    name: 'Travel Document Preparation',
    shortDescription: 'Complete travel document support',
    fullDescription: 'Assistance with all travel-related document preparation.',
    features: ['Document checklist', 'Form filling', 'Verification', 'Submission'],
    benefits: ['Complete documentation', 'Error-free']
  },
  {
    id: 's36',
    categoryId: 'travels',
    name: 'Airfare Comparison & Best Deal Finder',
    shortDescription: 'Find the best flight deals and prices',
    fullDescription: 'Compare airfares and find the best deals for your travel.',
    features: ['Multi-airline search', 'Price alerts', 'Deal notifications', 'Booking support'],
    benefits: ['Cost savings', 'Best value']
  }
];

export const packages: Package[] = [
  // CV / Resume Writing packages
  { id: 'p1', serviceId: 's1', name: 'Basic CV', description: 'Standard format CV', features: ['1 page CV', 'Basic formatting', '1 revision'], price: '৳500', displayPrice: true },
  { id: 'p2', serviceId: 's1', name: 'Professional CV', description: 'Industry-standard professional CV', features: ['2 page CV', 'ATS-optimized', 'Professional design', '3 revisions'], price: '৳1,500', displayPrice: true },
  { id: 'p3', serviceId: 's1', name: 'International CV', description: 'International format with cover letter', features: ['2-3 page CV', 'International format', 'Cover letter included', 'Unlimited revisions', 'LinkedIn optimization'], price: '৳3,000', displayPrice: true },
  
  // Cover Letter packages
  { id: 'p4', serviceId: 's2', name: 'Standard', description: 'Single cover letter', features: ['Tailored cover letter', '1 revision'], price: '৳500', displayPrice: true },
  { id: 'p5', serviceId: 's2', name: 'Premium', description: 'Multiple cover letters', features: ['3 cover letters', 'Job-specific', '2 revisions each'], price: '৳1,200', displayPrice: true },
  
  // LinkedIn Profile
  { id: 'p6', serviceId: 's3', name: 'Basic Optimization', description: 'Essential LinkedIn setup', features: ['Profile audit', 'Headline & summary', 'Skills optimization'], price: '৳1,000', displayPrice: true },
  { id: 'p7', serviceId: 's3', name: 'Complete Overhaul', description: 'Full LinkedIn transformation', features: ['Complete rewrite', 'Keyword research', 'Recommendations strategy', 'Banner design'], price: '৳2,500', displayPrice: true },

  // Add more packages for other services...
  { id: 'p8', serviceId: 's12', name: 'Single SOP', description: 'One Statement of Purpose', features: ['Customized content', '2 revisions', 'University-specific'], price: '৳2,000', displayPrice: true },
  { id: 'p9', serviceId: 's12', name: 'SOP Package', description: 'Multiple SOPs and motivation letter', features: ['3 SOPs', '1 motivation letter', 'Unlimited revisions', 'Expert consultation'], price: '৳5,000', displayPrice: true },
];

export const jobs: Job[] = [
  {
    id: 'j1',
    title: 'Senior Software Engineer',
    organization: 'Tech Solutions Ltd',
    deadline: '2025-01-15',
    location: 'Dhaka',
    type: 'Full-time',
    description: 'Looking for experienced software engineer with expertise in React and Node.js',
    requirements: ['5+ years experience', 'React, Node.js', 'Team leadership'],
    externalLink: 'https://example.com/job1',
    status: 'active'
  },
  {
    id: 'j2',
    title: 'Marketing Manager',
    organization: 'Global Brands Inc',
    deadline: '2025-01-20',
    location: 'Chattogram',
    type: 'Full-time',
    description: 'Seeking creative marketing professional to lead campaigns',
    requirements: ['3+ years in marketing', 'Digital marketing expertise', 'MBA preferred'],
    status: 'active'
  },
  {
    id: 'j3',
    title: 'Data Analyst',
    organization: 'Finance Corp',
    deadline: '2025-01-10',
    location: 'Dhaka',
    type: 'Contract',
    description: 'Data analyst needed for financial analysis and reporting',
    requirements: ['Python, SQL', 'Statistics background', '2+ years experience'],
    externalLink: 'https://example.com/job3',
    status: 'active'
  }
];

export const scholarships: Scholarship[] = [
  {
    id: 'sc1',
    title: 'Commonwealth Scholarship 2025',
    organization: 'British Council',
    deadline: '2025-02-28',
    country: 'United Kingdom',
    level: 'Master\'s',
    description: 'Full scholarship for Master\'s programs in UK universities',
    eligibility: ['Bachelor degree with 60%+', 'IELTS 6.5', 'Work experience preferred'],
    benefits: ['Full tuition', 'Living allowance', 'Airfare'],
    externalLink: 'https://example.com/scholarship1',
    status: 'active'
  },
  {
    id: 'sc2',
    title: 'Fulbright Scholarship Program',
    organization: 'US Embassy',
    deadline: '2025-03-15',
    country: 'United States',
    level: 'PhD',
    description: 'Fully funded PhD opportunities in US universities',
    eligibility: ['Master degree', 'Research proposal', 'English proficiency'],
    benefits: ['Full funding', 'Health insurance', 'Travel costs'],
    status: 'active'
  },
  {
    id: 'sc3',
    title: 'MEXT Scholarship',
    organization: 'Japanese Government',
    deadline: '2025-02-15',
    country: 'Japan',
    level: 'Master\'s/PhD',
    description: 'Japanese government scholarship for postgraduate studies',
    eligibility: ['Bachelor/Master degree', 'Under 35 years', 'Academic excellence'],
    benefits: ['Tuition waiver', 'Monthly stipend', 'Airfare'],
    externalLink: 'https://example.com/scholarship3',
    status: 'active'
  }
];
