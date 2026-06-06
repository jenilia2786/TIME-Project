import { 
  Cpu, Heart, Briefcase, BookOpen, Microscope, Scale, 
  Palette, Plane, Leaf, Coffee, Brain, Activity, Wrench, Rocket,
  Award, Building2, Shield, Globe, Sparkles
} from 'lucide-react'

export const DOMAINS_DATA = {
  engineering: {
    title: 'Engineering & Technology',
    icon: Cpu,
    degrees: [
      { id: 'be', name: 'B.E', fullName: 'Bachelor of Engineering', desc: 'Core Engineering', duration: '4 Years' },
      { id: 'btech', name: 'B.Tech', fullName: 'Bachelor of Technology', desc: 'Emerging Tech', duration: '4 Years' },
      { id: 'arch', name: 'Architecture & Planning', fullName: 'B.Arch & B.Plan', desc: 'Design & Construction', duration: '4-5 Years' },
      { id: 'diploma_eng', name: 'Diploma', fullName: 'Polytechnic Diploma', desc: 'Technical Skills', duration: '3 Years' },
      { id: 'higher_eng', name: 'Higher Studies', fullName: 'M.E / M.Tech / PhD', desc: 'Research & Advanced Tech', duration: '2+ Years' }
    ]
  },
  medicine: {
    title: 'Medicine & Healthcare',
    icon: Heart,
    degrees: [
      { id: 'medical', name: 'Medical Degrees', fullName: 'MBBS & Specializations', desc: 'Core Medical Practice', duration: '5.5 Years' },
      { id: 'dentistry', name: 'Dentistry', fullName: 'BDS & MDS', desc: 'Dental Sciences', duration: '5 Years' },
      { id: 'allied', name: 'Allied Health', fullName: 'B.Sc Allied Health Sciences', desc: 'Critical Care & Tech', duration: '3-4 Years' },
      { id: 'nursing', name: 'Nursing', fullName: 'B.Sc Nursing / GNM', desc: 'Patient Care', duration: '3-4 Years' },
      { id: 'pharmacy', name: 'Pharmacy', fullName: 'B.Pharm / Pharm.D', desc: 'Medicine Formulation', duration: '4-6 Years' },
      { id: 'rehab', name: 'Rehabilitation', fullName: 'BPT / BOT', desc: 'Therapy & Rehab', duration: '4 Years' },
      { id: 'ayush', name: 'AYUSH', fullName: 'Traditional Medicine', desc: 'Siddha, Ayurveda, Homeopathy', duration: '5.5 Years' }
    ]
  },
  commerce: {
    title: 'Commerce & Management',
    icon: Briefcase,
    degrees: [
      { id: 'bcom', name: 'Commerce', fullName: 'B.Com Degrees', desc: 'Accounts, Tax, Banking', duration: '3 Years' },
      { id: 'bba', name: 'Management', fullName: 'BBA / BMS', desc: 'Business Admin & Strategy', duration: '3 Years' },
      { id: 'prof_comm', name: 'Professional', fullName: 'CA / CMA / CS / CFA', desc: 'Financial Certifications', duration: '3-5 Years' }
    ]
  },
  arts: {
    title: 'Arts & Humanities',
    icon: BookOpen,
    degrees: [
      { id: 'arts_deg', name: 'Arts Degrees', fullName: 'B.A Programs', desc: 'Literature, History, Economics', duration: '3 Years' },
      { id: 'social_sci', name: 'Social Sciences', fullName: 'BSW / BA Psychology', desc: 'Human Behavior & Society', duration: '3 Years' },
      { id: 'languages', name: 'Languages', fullName: 'Linguistics & Translation', desc: 'Global Languages', duration: '3 Years' }
    ]
  },
  science: {
    title: 'Science & Research',
    icon: Microscope,
    degrees: [
      { id: 'pure_sci', name: 'Pure Sciences', fullName: 'B.Sc Core Sciences', desc: 'Physics, Chem, Math', duration: '3 Years' },
      { id: 'applied_sci', name: 'Applied Sciences', fullName: 'B.Sc Applied', desc: 'Biotech, Genetics, Forensic', duration: '3 Years' },
      { id: 'research', name: 'Research', fullName: 'M.Sc / PhD', desc: 'Advanced Research Pathways', duration: '5+ Years' }
    ]
  },
  law: {
    title: 'Law & Government',
    icon: Scale,
    degrees: [
      { id: 'law_deg', name: 'Law Degrees', fullName: 'LLB / Integrated Law', desc: 'Legal Practice & Corporate Law', duration: '3-5 Years' },
      { id: 'civil_serv', name: 'Civil Services', fullName: 'UPSC / TNPSC', desc: 'Government Admin', duration: 'Exam Based' },
      { id: 'pub_admin', name: 'Public Admin', fullName: 'Governance Studies', desc: 'Policy & Administration', duration: '3 Years' }
    ]
  },
  design: {
    title: 'Design & Media',
    icon: Palette,
    degrees: [
      { id: 'design_deg', name: 'Design', fullName: 'B.Des', desc: 'Fashion, Product, UI/UX', duration: '4 Years' },
      { id: 'media', name: 'Media & Ent.', fullName: 'Visual Comm & Film', desc: 'Journalism, VFX, Gaming', duration: '3-4 Years' },
      { id: 'fine_arts', name: 'Fine Arts', fullName: 'BFA', desc: 'Music, Dance, Theatre', duration: '3-4 Years' }
    ]
  },
  aviation: {
    title: 'Aviation & Defence',
    icon: Plane,
    degrees: [
      { id: 'aviation_deg', name: 'Aviation', fullName: 'B.Sc Aviation', desc: 'Pilot, Cabin Crew, Mgmt', duration: '3 Years' },
      { id: 'marine', name: 'Marine Studies', fullName: 'Nautical Science', desc: 'Shipping & Logistics', duration: '3-4 Years' },
      { id: 'defence', name: 'Defence', fullName: 'NDA Pathways', desc: 'Army, Navy, Air Force', duration: '3-4 Years' }
    ]
  },
  agriculture: {
    title: 'Agriculture',
    icon: Leaf,
    degrees: [
      { id: 'agri_deg', name: 'Agriculture', fullName: 'B.Sc Agriculture', desc: 'Agronomy, Horticulture', duration: '4 Years' },
      { id: 'food_sci', name: 'Food Sciences', fullName: 'Food Tech & Nutrition', desc: 'Dairy, Dietetics', duration: '3-4 Years' },
      { id: 'environment', name: 'Environment', fullName: 'Environmental Science', desc: 'Sustainability & Wildlife', duration: '3-4 Years' }
    ]
  },
  hospitality: {
    title: 'Hospitality & Tourism',
    icon: Coffee,
    degrees: [
      { id: 'hospitality_deg', name: 'Hospitality', fullName: 'Hotel Management', desc: 'Culinary Arts, Catering', duration: '3-4 Years' },
      { id: 'tourism', name: 'Tourism', fullName: 'Travel & Tourism Mgmt', desc: 'Airlines & Hospitality', duration: '3 Years' },
      { id: 'events', name: 'Events & PR', fullName: 'Event Management', desc: 'Public Relations & Events', duration: '3 Years' }
    ]
  },
  psychology: {
    title: 'Psychology & Education',
    icon: Brain,
    degrees: [
      { id: 'education', name: 'Education', fullName: 'B.Ed & Training', desc: 'Teaching & Special Ed', duration: '2-4 Years' },
      { id: 'psych_deg', name: 'Psychology', fullName: 'Clinical & Counselling', desc: 'Mental Health Sciences', duration: '3-5 Years' },
      { id: 'wellness', name: 'Wellness', fullName: 'Yoga & Wellness Studies', desc: 'Holistic Health', duration: '3 Years' }
    ]
  },
  sports: {
    title: 'Sports & Fitness',
    icon: Activity,
    degrees: [
      { id: 'sports_ed', name: 'Sports Ed', fullName: 'B.P.Ed / Sports Science', desc: 'Sports Management', duration: '3-4 Years' },
      { id: 'fitness', name: 'Fitness', fullName: 'Fitness & Nutrition', desc: 'Training & Wellness', duration: '1-3 Years' }
    ]
  },
  vocational: {
    title: 'Vocational & Industrial',
    icon: Wrench,
    degrees: [
      { id: 'technical', name: 'Technical Skills', fullName: 'ITI Programs', desc: 'Electrician, CNC, Welding', duration: '1-2 Years' },
      { id: 'industrial', name: 'Industrial Skills', fullName: 'Industrial Safety', desc: 'Machine Operations, Tool & Die', duration: '1-2 Years' }
    ]
  },
  entrepreneur: {
    title: 'Entrepreneurship & Digital',
    icon: Rocket,
    degrees: [
      { id: 'startup', name: 'Entrepreneurship', fullName: 'Startup Management', desc: 'Business Incubation', duration: 'Flexible' },
      { id: 'digital', name: 'Digital Careers', fullName: 'Digital Marketing', desc: 'E-Commerce, Freelancing', duration: 'Flexible' },
      { id: 'creator', name: 'Creator Economy', fullName: 'Content Creation', desc: 'YouTube, Podcasting, Social Media', duration: 'Flexible' }
    ]
  }
}

// Helper to generate mock course details
const generateCourse = (name) => ({
  id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
  name,
  fees: '₹1L - 2.5L/yr',
  demand: 'High',
  growth: '25%',
  salary: '₹5L - ₹12L',
  recruiters: ['Top MNCs', 'Govt Sectors', 'Startups']
})

export const COURSES_DATA = {
  // ENGINEERING
  be: [
    'Computer Science Engineering', 'Electronics & Communication Engineering', 'Electrical & Electronics Engineering',
    'Mechanical Engineering', 'Civil Engineering', 'Biomedical Engineering', 'Automobile Engineering',
    'Aeronautical Engineering', 'Marine Engineering', 'Mechatronics Engineering', 'Industrial Engineering',
    'Production Engineering', 'Printing Technology', 'Agricultural Engineering', 'Petrochemical Engineering',
    'Mining Engineering', 'Textile Engineering'
  ].map(generateCourse),
  btech: [
    'Artificial Intelligence & Data Science', 'Artificial Intelligence & Machine Learning', 'Data Science',
    'Cybersecurity', 'Information Technology', 'Cloud Computing', 'Internet of Things (IoT)', 'Robotics & Automation',
    'Biotechnology', 'Food Technology', 'Chemical Technology', 'Nanotechnology', 'Genetic Engineering', 'Petroleum Technology'
  ].map(generateCourse),
  arch: ['B.Arch (Bachelor of Architecture)', 'Bachelor of Planning (B.Plan)', 'Interior Architecture', 'Urban Planning', 'Landscape Architecture'].map(generateCourse),
  diploma_eng: ['Mechanical Diploma', 'Civil Diploma', 'ECE Diploma', 'Electrical Diploma', 'Automobile Diploma', 'Marine Diploma', 'AI & DS Diploma'].map(generateCourse),
  higher_eng: ['M.E', 'M.Tech', 'M.Arch', 'PhD'].map(generateCourse),

  // MEDICINE
  medical: ['MBBS', 'General Medicine', 'Surgery', 'Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Oncology', 'Emergency Medicine'].map(generateCourse),
  dentistry: ['BDS', 'MDS'].map(generateCourse),
  allied: ['Anesthesia Technology', 'Operation Theatre Technology', 'Radiology & Imaging Technology', 'Medical Laboratory Technology', 'Cardiac Technology', 'Dialysis Technology', 'Emergency Care Technology', 'Physician Assistant', 'Respiratory Therapy', 'Optometry'].map(generateCourse),
  nursing: ['B.Sc Nursing', 'GNM', 'ANM'].map(generateCourse),
  pharmacy: ['B.Pharm', 'Pharm.D', 'D.Pharm'].map(generateCourse),
  rehab: ['BPT (Physiotherapy)', 'BOT (Occupational Therapy)', 'Audiology & Speech Therapy'].map(generateCourse),
  ayush: ['BSMS (Siddha)', 'BAMS (Ayurveda)', 'BHMS (Homeopathy)', 'BUMS (Unani)', 'BNYS (Naturopathy & Yoga)'].map(generateCourse),

  // COMMERCE
  bcom: ['B.Com General', 'B.Com Accounting & Finance', 'B.Com Banking & Insurance', 'B.Com Corporate Secretaryship', 'B.Com Computer Applications', 'B.Com Professional Accounting', 'B.Com Taxation'].map(generateCourse),
  bba: ['BBA', 'BBM', 'BMS', 'International Business', 'Business Analytics', 'Entrepreneurship Management'].map(generateCourse),
  prof_comm: ['CA', 'CMA', 'CS', 'CFA', 'Actuarial Science'].map(generateCourse),

  // ARTS
  arts_deg: ['English Literature', 'Tamil Literature', 'History', 'Political Science', 'Sociology', 'Philosophy', 'Economics', 'Anthropology', 'Public Administration'].map(generateCourse),
  social_sci: ['BSW (Social Work)', 'BA Psychology', 'Liberal Arts Programs'].map(generateCourse),
  languages: ['Foreign Languages', 'Linguistics', 'Translation Studies'].map(generateCourse),

  // SCIENCE
  pure_sci: ['B.Sc Physics', 'B.Sc Chemistry', 'B.Sc Mathematics', 'B.Sc Statistics', 'B.Sc Zoology', 'B.Sc Botany'].map(generateCourse),
  applied_sci: ['Biotechnology', 'Microbiology', 'Genetics', 'Biochemistry', 'Environmental Science', 'Forensic Science'].map(generateCourse),
  research: ['Integrated Science Programs', 'M.Sc', 'PhD', 'Research Fellowships'].map(generateCourse),

  // LAW
  law_deg: ['LLB', 'BA LLB', 'BBA LLB', 'B.Com LLB'].map(generateCourse),
  civil_serv: ['UPSC', 'TNPSC', 'Judiciary', 'Police Services', 'Defence Services', 'Intelligence Services'].map(generateCourse),
  pub_admin: ['Public Administration Degrees', 'Governance & Policy Studies'].map(generateCourse),

  // DESIGN
  design_deg: ['B.Des', 'Fashion Design', 'Interior Design', 'Product Design', 'UI/UX Design', 'Graphic Design'].map(generateCourse),
  media: ['Visual Communication', 'Journalism', 'Film Making', 'Photography', 'Animation & VFX', 'Gaming Design'].map(generateCourse),
  fine_arts: ['BFA', 'Performing Arts', 'Music', 'Dance', 'Theatre Arts'].map(generateCourse),

  // AVIATION
  aviation_deg: ['B.Sc Aviation', 'Pilot Training', 'Cabin Crew Training', 'Aviation Management'].map(generateCourse),
  marine: ['Nautical Science', 'Marine Engineering', 'Shipping & Logistics'].map(generateCourse),
  defence: ['NDA', 'Army', 'Navy', 'Air Force', 'Coast Guard'].map(generateCourse),

  // AGRICULTURE
  agri_deg: ['B.Sc Agriculture', 'Agronomy', 'Horticulture', 'Forestry', 'Fisheries Science'].map(generateCourse),
  food_sci: ['Food Technology', 'Dairy Technology', 'Nutrition & Dietetics'].map(generateCourse),
  environment: ['Environmental Science', 'Sustainability Studies', 'Wildlife Studies'].map(generateCourse),

  // HOSPITALITY
  hospitality_deg: ['Hotel Management', 'Catering Technology', 'Culinary Arts', 'Bakery & Confectionery'].map(generateCourse),
  tourism: ['Tourism Management', 'Travel & Tourism', 'Airline & Hospitality Management'].map(generateCourse),
  events: ['Event Management', 'Public Relations'].map(generateCourse),

  // PSYCHOLOGY
  education: ['B.Ed', 'Montessori Training', 'Special Education', 'Educational Leadership'].map(generateCourse),
  psych_deg: ['BA Psychology', 'B.Sc Psychology', 'Clinical Psychology', 'Counselling Psychology'].map(generateCourse),
  wellness: ['Yoga Studies', 'Wellness Programs'].map(generateCourse),

  // SPORTS
  sports_ed: ['B.P.Ed', 'Sports Science', 'Sports Management'].map(generateCourse),
  fitness: ['Fitness Training', 'Nutrition', 'Yoga Training'].map(generateCourse),

  // VOCATIONAL
  technical: ['ITI', 'Electrician', 'Welding', 'Automobile Technician', 'CNC Operations', 'AC Technician', 'Electronics Technician'].map(generateCourse),
  industrial: ['Industrial Safety', 'Machine Operations', 'Tool & Die Engineering'].map(generateCourse),

  // ENTREPRENEURSHIP
  startup: ['Startup Management', 'Business Incubation', 'Innovation Programs'].map(generateCourse),
  digital: ['Digital Marketing', 'Content Creation', 'Influencer Marketing', 'E-Commerce', 'Freelancing', 'Personal Branding'].map(generateCourse),
  creator: ['YouTuber', 'Podcaster', 'Streamer', 'Digital Creator', 'Social Media Strategist'].map(generateCourse)
}

export const TENTH_FACES = [
  { id: 'groups', title: 'Groups After 10th', color: '#3b82f6', gradient: 'from-blue-400 to-indigo-500', icon: BookOpen, courses: 3, demand: 'Essential', salary: 'N/A' },
  { id: 'diploma', title: 'Diploma Options', color: '#10b981', gradient: 'from-emerald-400 to-teal-500', icon: Award, courses: 15, demand: 'High', salary: '₹2L - ₹6L' },
  { id: 'iti', title: 'ITI & Skill Careers', color: '#f59e0b', gradient: 'from-amber-400 to-orange-500', icon: Wrench, courses: 20, demand: 'Very High', salary: '₹1.5L - ₹4L' },
  { id: 'govt', title: 'Government Careers', color: '#ef4444', gradient: 'from-red-400 to-rose-500', icon: Building2, courses: 5, demand: 'Steady', salary: '₹3L - ₹10L' },
  { id: 'defence', title: 'Defence Careers', color: '#64748b', gradient: 'from-slate-400 to-zinc-600', icon: Shield, courses: 4, demand: 'Steady', salary: '₹3L - ₹8L' },
  { id: 'design_10', title: 'Design & Creative', color: '#ec4899', gradient: 'from-fuchsia-400 to-purple-500', icon: Palette, courses: 10, demand: 'High', salary: '₹2L - ₹10L' },
  { id: 'sports_10', title: 'Sports Careers', color: '#84cc16', gradient: 'from-lime-400 to-green-500', icon: Activity, courses: 5, demand: 'Steady', salary: '₹2L - ₹12L' },
  { id: 'entrepreneur_10', title: 'Entrepreneurship', color: '#f97316', gradient: 'from-orange-400 to-red-500', icon: Rocket, courses: 5, demand: 'High', salary: 'Varies' },
  { id: 'abroad', title: 'Study Abroad', color: '#06b6d4', gradient: 'from-cyan-400 to-blue-500', icon: Globe, courses: 10, demand: 'High', salary: 'N/A' },
  { id: 'future', title: 'Trending Careers', color: '#8b5cf6', gradient: 'from-violet-400 to-purple-500', icon: Sparkles, courses: 10, demand: 'Very High', salary: '₹4L - ₹15L' }
];

export const PG_FACES = [
  { id: 'mtech', title: 'M.E / M.Tech', color: '#0ea5e9', gradient: 'from-sky-500 to-blue-600', icon: Cpu, courses: 20, demand: 'High', salary: '₹8L - ₹30L' },
  { id: 'mba', title: 'MBA & Management', color: '#f59e0b', gradient: 'from-amber-500 to-orange-500', icon: Briefcase, courses: 15, demand: 'Very High', salary: '₹10L - ₹50L+' },
  { id: 'medical_pg', title: 'Medical PG', color: '#f43f5e', gradient: 'from-rose-500 to-pink-500', icon: Heart, courses: 25, demand: 'Critical', salary: '₹12L - ₹40L+' },
  { id: 'phd', title: 'PhD & Research', color: '#10b981', gradient: 'from-emerald-500 to-teal-500', icon: Microscope, courses: 30, demand: 'Steady', salary: '₹6L - ₹20L' },
  { id: 'civil_services', title: 'Civil Services (PG)', color: '#4f46e5', gradient: 'from-indigo-600 to-blue-700', icon: Scale, courses: 10, demand: 'Very High', salary: '₹8L - ₹15L' }
];

export const UG_FACES = [
  { id: 'engineering', title: 'Engineering & Technology', image: '/images/domains/eng_isometric_1780485638860.png', color: '#0ea5e9', gradient: 'from-sky-500 to-blue-600', icon: Cpu, courses: 36, demand: 'High Demand', salary: '₹6L - ₹24L' },
  { id: 'medicine', title: 'Medicine & Healthcare', image: '/images/domains/med_isometric_1780485655492.png', color: '#f43f5e', gradient: 'from-rose-500 to-pink-500', icon: Heart, courses: 28, demand: 'Very High', salary: '₹5L - ₹30L' },
  { id: 'commerce', title: 'Commerce & Management', image: '/images/domains/com_isometric_1780485668761.png', color: '#f59e0b', gradient: 'from-amber-500 to-orange-500', icon: Briefcase, courses: 18, demand: 'High', salary: '₹4L - ₹20L' },
  { id: 'arts', title: 'Arts & Humanities', image: '/images/domains/art_isometric_1780485684593.png', color: '#8b5cf6', gradient: 'from-violet-500 to-purple-500', icon: BookOpen, courses: 15, demand: 'Steady', salary: '₹3L - ₹15L' },
  { id: 'science', title: 'Science & Research', image: '/images/domains/sci_isometric_1780485700998.png', color: '#10b981', gradient: 'from-emerald-500 to-teal-500', icon: Microscope, courses: 16, demand: 'Steady', salary: '₹4L - ₹18L' },
  { id: 'law', title: 'Law & Government', image: '/images/domains/law_isometric_1780485730342.png', color: '#4f46e5', gradient: 'from-indigo-600 to-blue-700', icon: Scale, courses: 12, demand: 'Steady', salary: '₹4L - ₹22L' },
  { id: 'design', title: 'Design & Media', image: '/images/domains/des_isometric_1780485742932.png', color: '#ec4899', gradient: 'from-pink-500 to-fuchsia-600', icon: Palette, courses: 17, demand: 'Very High', salary: '₹5L - ₹25L' },
  { id: 'aviation', title: 'Aviation & Defence', image: '/images/domains/avi_isometric_1780485756766.png', color: '#64748b', gradient: 'from-slate-500 to-slate-700', icon: Plane, courses: 12, demand: 'High', salary: '₹6L - ₹30L' },
  { id: 'agriculture', title: 'Agriculture', image: '/images/domains/agr_isometric_1780485769930.png', color: '#84cc16', gradient: 'from-lime-500 to-green-600', icon: Leaf, courses: 11, demand: 'Steady', salary: '₹4L - ₹15L' },
  { id: 'hospitality', title: 'Hospitality & Tourism', image: '/images/domains/hos_isometric_1780485785036.png', color: '#f97316', gradient: 'from-orange-500 to-red-500', icon: Coffee, courses: 9, demand: 'High', salary: '₹3L - ₹15L' },
  { id: 'psychology', title: 'Psychology & Education', image: '/images/domains/psy_isometric_1780485839154.png', color: '#a855f7', gradient: 'from-purple-500 to-fuchsia-500', icon: Brain, courses: 10, demand: 'High', salary: '₹4L - ₹16L' },
  { id: 'sports', title: 'Sports & Fitness', image: '/images/domains/spo_isometric_1780485859027.png', color: '#ef4444', gradient: 'from-red-500 to-rose-600', icon: Activity, courses: 6, demand: 'Steady', salary: '₹3L - ₹20L' },
  { id: 'vocational', title: 'Vocational Careers', image: '/images/domains/voc_isometric_1780485880472.png', color: '#eab308', gradient: 'from-yellow-400 to-amber-600', icon: Wrench, courses: 10, demand: 'Very High', salary: '₹2L - ₹10L' },
  { id: 'entrepreneur', title: 'Entrepreneurship', image: '/images/domains/ent_isometric_1780485899890.png', color: '#06b6d4', gradient: 'from-cyan-500 to-blue-500', icon: Rocket, courses: 14, demand: 'Very High', salary: '₹5L - ₹50L+' }
];

// Append Mock Data for 10th and PG
DOMAINS_DATA['groups'] = { title: 'Groups After 10th', icon: BookOpen, degrees: [{ id: 'science', name: 'Science', fullName: 'Physics, Chemistry, Math/Bio', desc: 'Core science subjects for engineering/medical.', duration: '2 Years' }, { id: 'commerce', name: 'Commerce', fullName: 'Accounts, Economics, Business', desc: 'For banking, CA, management.', duration: '2 Years' }, { id: 'arts_12', name: 'Arts', fullName: 'History, Geo, Pol Science', desc: 'For civil services, law, media.', duration: '2 Years' }] };
DOMAINS_DATA['diploma'] = { title: 'Diploma Options', icon: Award, degrees: [{ id: 'diploma_eng', name: 'Polytechnic', fullName: 'Engineering Diploma', desc: '3-year tech courses.', duration: '3 Years' }] };
DOMAINS_DATA['iti'] = { title: 'ITI & Skills', icon: Wrench, degrees: [{ id: 'technical', name: 'Technical', fullName: 'ITI Technical', desc: 'Quick skill-based training.', duration: '1-2 Years' }] };
DOMAINS_DATA['govt'] = { title: 'Government Careers', icon: Building2, degrees: [{ id: 'ssc', name: 'SSC & State', fullName: 'Clerk, Constables', desc: 'Direct entry after 10th.', duration: 'Exam Based' }] };
DOMAINS_DATA['defence'] = { title: 'Defence Careers', icon: Shield, degrees: [{ id: 'nda_prep', name: 'NDA Prep', fullName: 'Army/Navy/AirForce', desc: 'Join through NDA after 12th.', duration: 'Prep' }] };
DOMAINS_DATA['design_10'] = { title: 'Design & Creative', icon: Palette, degrees: [{ id: 'fine_arts', name: 'Fine Arts', fullName: 'Arts & Media', desc: 'Vocational design courses.', duration: 'Varies' }] };
DOMAINS_DATA['sports_10'] = { title: 'Sports Careers', icon: Activity, degrees: [{ id: 'fitness', name: 'Sports Academies', fullName: 'Professional Sports', desc: 'Athletics, coaching.', duration: 'Varies' }] };
DOMAINS_DATA['entrepreneur_10'] = { title: 'Entrepreneurship', icon: Rocket, degrees: [{ id: 'startup', name: 'Startups', fullName: 'Digital Businesses', desc: 'Start early.', duration: 'Varies' }] };
DOMAINS_DATA['abroad'] = { title: 'Study Abroad', icon: Globe, degrees: [{ id: 'ib', name: 'Intl Baccalaureate', fullName: 'IB Schools', desc: 'Global curriculum.', duration: '2 Years' }] };
DOMAINS_DATA['future'] = { title: 'Trending Careers', icon: Sparkles, degrees: [{ id: 'digital', name: 'Digital Skills', fullName: 'Coding, AI Basics', desc: 'Future tech skills.', duration: 'Varies' }] };

DOMAINS_DATA['mtech'] = { title: 'M.E / M.Tech', icon: Cpu, degrees: [{ id: 'higher_eng', name: 'M.Tech', fullName: 'Master of Technology', desc: 'Advanced engineering.', duration: '2 Years' }] };
DOMAINS_DATA['mba'] = { title: 'MBA & Management', icon: Briefcase, degrees: [{ id: 'bba', name: 'MBA', fullName: 'Master of Business Admin', desc: 'Business leadership.', duration: '2 Years' }] };
DOMAINS_DATA['medical_pg'] = { title: 'Medical PG', icon: Heart, degrees: [{ id: 'medical', name: 'MD / MS', fullName: 'Doctor of Medicine', desc: 'Specialized surgery/medicine.', duration: '3 Years' }] };
DOMAINS_DATA['phd'] = { title: 'PhD & Research', icon: Microscope, degrees: [{ id: 'research', name: 'PhD', fullName: 'Doctorate', desc: 'Deep research.', duration: '3-5 Years' }] };
DOMAINS_DATA['civil_services'] = { title: 'Civil Services (PG)', icon: Scale, degrees: [{ id: 'civil_serv', name: 'UPSC / State PSC', fullName: 'IAS, IPS, IRS', desc: 'Top government posts.', duration: 'Exam Based' }] };

COURSES_DATA['science'] = [{ id: 'c1', name: 'PCM (Physics, Chem, Math)', salary: 'Foundation', growth: 'High', recruiters: ['N/A'] }, { id: 'c2', name: 'PCB (Physics, Chem, Bio)', salary: 'Foundation', growth: 'High', recruiters: ['N/A'] }];
COURSES_DATA['commerce'] = [{ id: 'c3', name: 'Commerce with Math', salary: 'Foundation', growth: 'High', recruiters: ['N/A'] }];
COURSES_DATA['arts_12'] = [{ id: 'c4', name: 'Humanities & Arts', salary: 'Foundation', growth: 'Steady', recruiters: ['N/A'] }];
COURSES_DATA['ssc'] = [{ id: 'c5', name: 'SSC CHSL', salary: '₹3L - ₹5L', growth: 'Steady', recruiters: ['Govt'] }];
COURSES_DATA['nda_prep'] = [{ id: 'c6', name: 'National Defence Academy', salary: '₹8L+', growth: 'High', recruiters: ['Indian Army, Navy'] }];
COURSES_DATA['ib'] = [{ id: 'c7', name: 'IB Diploma Programme', salary: 'N/A', growth: 'Global', recruiters: ['Intl Universities'] }];
