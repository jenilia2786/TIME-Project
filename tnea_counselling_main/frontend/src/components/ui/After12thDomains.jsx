import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, Info, X, Cpu, Heart, Briefcase, BookOpen,
  Microscope, Scale, PenTool, Brain, Shield, Leaf, Coffee,
  GraduationCap, Activity, Wrench, Rocket, ChevronRight,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════════
   DATA — Domain → Degrees → Courses
   ═══════════════════════════════════════════════════════════════════ */
const DOMAINS_12TH = [
  {
    id: 'engineering',
    title: 'Engineering & Technology',
    icon: Cpu, emoji: '⚙️',
    color: 'from-sky-500 to-blue-500', accent: '#0ea5e9',
    glow: 'rgba(14,165,233,0.25)',
    desc: 'Build software, hardware, and infrastructure that powers modern civilization.',
    degrees: [
      {
        id: 'be', label: 'B.E', full: 'Bachelor of Engineering', icon: '🏗️',
        note: '4 years · Anna University affiliated',
        courses: [
          { name: 'Computer Science Engineering', about: 'Core software engineering stream — algorithms, OS, databases, programming languages, and system design.' },
          { name: 'Electronics & Communication Engineering', about: 'Covers signal processing, VLSI, embedded systems, antenna design, and communication networks.' },
          { name: 'Electrical & Electronics Engineering', about: 'Power systems, electric machines, control systems, and renewable energy technologies.' },
          { name: 'Mechanical Engineering', about: 'Thermodynamics, fluid mechanics, machine design, manufacturing processes, and CAD/CAM systems.' },
          { name: 'Civil Engineering', about: 'Structural design, construction management, transportation, environmental and geo-technical engineering.' },
          { name: 'Biomedical Engineering', about: 'Combines biology and engineering to build medical devices, prosthetics, imaging systems, and health-tech.' },
          { name: 'Automobile Engineering', about: 'Vehicle design, automotive electronics, EV technology, engine systems, and safety engineering.' },
          { name: 'Mechatronics Engineering', about: 'Integrates mechanics, electronics, computing, and control to build smart automated systems.' },
          { name: 'Aeronautical Engineering', about: 'Aircraft design, aerodynamics, propulsion, avionics, and flight mechanics.' },
          { name: 'Marine Engineering', about: 'Ship machinery, offshore structures, naval architecture, and maritime systems engineering.' },
          { name: 'Industrial Engineering', about: 'Optimizes complex systems — supply chain, operations research, quality control, ergonomics.' },
          { name: 'Production Engineering', about: 'Manufacturing planning, CNC machining, tool design, and production system optimization.' },
          { name: 'Agricultural Engineering', about: 'Irrigation systems, farm machinery, post-harvest technology, and soil & water conservation.' },
          { name: 'Textile Engineering', about: 'Fiber science, yarn manufacturing, textile chemistry, fabric production, and finishing technologies.' },
          { name: 'Petrochemical Engineering', about: 'Refinery operations, polymer science, chemical process design, and energy systems.' },
          { name: 'Mining Engineering', about: 'Mine planning, geology, blasting, mineral processing, and environmental reclamation.' },
          { name: 'Metallurgical Engineering', about: 'Metal extraction, alloy design, heat treatment, corrosion science, and materials testing.' },
        ],
      },
      {
        id: 'btech', label: 'B.Tech', full: 'Bachelor of Technology', icon: '💡',
        note: '4 years · Emerging tech specializations',
        courses: [
          { name: 'Artificial Intelligence & Data Science', about: 'ML models, big data analytics, NLP, computer vision, and intelligent system design.' },
          { name: 'Artificial Intelligence & Machine Learning', about: 'Deep learning, neural networks, reinforcement learning, and AI application development.' },
          { name: 'Cybersecurity', about: 'Ethical hacking, network security, digital forensics, cryptography, and cyber-law fundamentals.' },
          { name: 'Data Science', about: 'Statistical analysis, data wrangling, visualization, predictive modeling, and business intelligence.' },
          { name: 'Information Technology', about: 'Networking, database administration, web development, cloud services, and IT project management.' },
          { name: 'Cloud Computing', about: 'AWS, Azure, GCP architecture, containerization, DevOps pipelines, and microservices.' },
          { name: 'Internet of Things (IoT)', about: 'Sensor networks, embedded systems, smart devices, edge computing, and IoT security.' },
          { name: 'Robotics & Automation', about: 'Robot kinematics, PLC programming, industrial automation, computer vision, and AGV systems.' },
          { name: 'Biotechnology', about: 'Genetic engineering, fermentation technology, bioinformatics, and industrial bioprocessing.' },
          { name: 'Food Technology', about: 'Food processing, quality control, packaging engineering, food safety regulations, and nutrition science.' },
          { name: 'Nanotechnology', about: 'Nanomaterials, quantum dots, nano-fabrication, drug delivery systems, and nano-electronics.' },
          { name: 'Genetic Engineering', about: 'CRISPR gene editing, recombinant DNA, genomics, molecular cloning, and synthetic biology.' },
          { name: 'Pharmaceutical Technology', about: 'Drug formulation, pharmacokinetics, clinical trials, regulatory affairs, and pharmaceutical manufacturing.' },
          { name: 'Textile Technology', about: 'Technical textiles, smart fabrics, sustainable fiber innovation, and garment technology.' },
        ],
      },
      {
        id: 'barch', label: 'B.Arch', full: 'Bachelor of Architecture', icon: '🏛️',
        note: '5 years · Council of Architecture approved',
        courses: [
          { name: 'Architecture', about: 'Building design, structural systems, construction technology, environmental design, and architectural history.' },
          { name: 'Interior Architecture', about: 'Interior spatial design, lighting, furniture design, materials, and human-environment psychology.' },
          { name: 'Urban Planning', about: 'City design, zoning, transportation networks, housing policy, and sustainable urban development.' },
          { name: 'Landscape Architecture', about: 'Outdoor space design, ecological planning, park design, and green infrastructure systems.' },
          { name: 'Heritage Conservation', about: 'Preservation of historical structures, adaptive reuse, restoration techniques, and conservation policy.' },
          { name: 'Sustainable Architecture', about: 'Green building design, passive cooling, solar integration, LEED certification, and eco-materials.' },
        ],
      },
      {
        id: 'diploma', label: 'Diploma / Polytechnic', full: 'Government Polytechnic Diploma', icon: '📋',
        note: '3 years · Entry into industry or lateral B.E entry',
        courses: [
          { name: 'Diploma in Computer Engineering', about: 'Programming, networking, OS fundamentals — ideal for quick entry into IT support or lateral B.E.' },
          { name: 'Diploma in Electronics & Comm.', about: 'Circuit design, PCB fabrication, telecommunications basics, and consumer electronics repair.' },
          { name: 'Diploma in Mechanical Engineering', about: 'Lathe operations, CAD/CAM, workshop practice, and mechanical drafting.' },
          { name: 'Diploma in Civil Engineering', about: 'Surveying, construction drawing, estimation and costing, and building material science.' },
          { name: 'Diploma in Electrical Engineering', about: 'Wiring, transformer installation, power distribution, and substation maintenance.' },
          { name: 'Diploma in Automobile Engineering', about: 'Vehicle servicing, engine overhauling, two/four-wheeler technology, and EV basics.' },
          { name: 'Diploma in Chemical Engineering', about: 'Process operations, lab techniques, industrial chemistry, and safety management.' },
          { name: 'Diploma in Instrumentation Engineering', about: 'Process control instruments, calibration, PLC/SCADA systems, and sensor technology.' },
        ],
      },
      {
        id: 'integrated', label: 'Integrated Programs', full: '5-Year Integrated Degrees', icon: '🔗',
        note: '5 years · Combined UG + PG programs',
        courses: [
          { name: 'Integrated M.Tech (CSE)', about: 'Combined B.Tech + M.Tech in Computer Science — saves a year over separate degrees.' },
          { name: 'Integrated M.Tech (ECE)', about: 'Five-year deep-dive into advanced electronics, VLSI, and communication technologies.' },
          { name: 'Integrated M.Sc (Applied Mathematics)', about: 'Pure and applied math, numerical methods, operations research, and mathematical modeling.' },
          { name: 'Dual Degree (B.Tech + MBA)', about: 'Technical engineering foundation combined with business management for tech-leadership roles.' },
        ],
      },
      {
        id: 'higher', label: 'Higher Studies', full: 'M.Tech / M.E / Ph.D', icon: '🎓',
        note: 'PG & Research · After B.E/B.Tech',
        courses: [
          { name: 'M.Tech in VLSI Design', about: 'Advanced chip design, semiconductor fabrication, and electronic design automation tools.' },
          { name: 'M.Tech in Structural Engineering', about: 'Advanced structural analysis, finite element methods, and earthquake-resistant design.' },
          { name: 'M.E in Computer Science', about: 'Advanced algorithms, distributed systems, AI research, and systems architecture.' },
          { name: 'M.Tech in Power Electronics', about: 'EV drive systems, inverter design, renewable energy converters, and smart grids.' },
          { name: 'Ph.D in Engineering', about: 'Original research contribution — publishable findings in your specialization area.' },
          { name: 'GATE + PSU Recruitment', about: 'Post-graduation exam for M.Tech admission and PSU jobs like BHEL, ONGC, NTPC, and ISRO.' },
        ],
      },
    ],
  },

  {
    id: 'medicine',
    title: 'Medicine & Healthcare',
    icon: Heart, emoji: '🏥',
    color: 'from-rose-500 to-pink-500', accent: '#f43f5e',
    glow: 'rgba(244,63,94,0.25)',
    desc: 'Heal lives and drive medical breakthroughs through science and compassion.',
    degrees: [
      {
        id: 'mbbs', label: 'MBBS', full: 'Bachelor of Medicine & Bachelor of Surgery', icon: '🩺',
        note: '5.5 years · NEET-UG required',
        courses: [
          { name: 'General Medicine (MBBS)', about: 'The foundational medical degree — diagnosis, internal medicine, surgery basics, and clinical rotations.' },
          { name: 'MD (General Medicine)', about: 'Postgraduate specialization in internal medicine, managing complex multi-system diseases.' },
          { name: 'MS (Surgery)', about: 'Advanced surgical training — general, laparoscopic, and specialty surgical procedures.' },
          { name: 'MD Paediatrics', about: 'Child health, developmental disorders, neonatal care, and pediatric emergency medicine.' },
          { name: 'MD Radiology', about: 'Medical imaging — X-ray, CT, MRI, ultrasound, and interventional radiology procedures.' },
        ],
      },
      {
        id: 'allied', label: 'Allied Health', full: 'B.Sc / B.Pharm Allied Programs', icon: '⚕️',
        note: '3–4 years · Strong clinical demand',
        courses: [
          { name: 'BDS (Dentistry)', about: 'Oral health, dental surgery, orthodontics, endodontics, and maxillofacial procedures.' },
          { name: 'B.Pharm (Pharmacy)', about: 'Drug formulation, pharmacology, clinical pharmacy, and pharmaceutical manufacturing.' },
          { name: 'B.Sc Nursing', about: 'Patient care, clinical nursing, community health, and nursing administration.' },
          { name: 'B.Sc Physiotherapy', about: 'Rehabilitation, musculoskeletal therapy, neurological rehab, and sports injury recovery.' },
          { name: 'B.Sc Occupational Therapy', about: 'Helps patients regain functional independence in daily activities after illness or injury.' },
          { name: 'B.Sc Medical Lab Technology (MLT)', about: 'Clinical lab diagnostics, hematology, microbiology, and pathology testing.' },
          { name: 'B.Sc Radiology & Imaging Technology', about: 'Operating imaging equipment, MRI safety, CT scanning, and radiographic techniques.' },
          { name: 'B.Sc Optometry', about: 'Eye care, refraction testing, contact lens fitting, and vision therapy.' },
          { name: 'B.Sc Dialysis Technology', about: 'Kidney failure management, hemodialysis machine operation, and ICU support care.' },
          { name: 'B.Sc Respiratory Therapy', about: 'Ventilator management, pulmonary function testing, and critical care breathing support.' },
        ],
      },
      {
        id: 'ayush', label: 'AYUSH', full: 'Traditional & Alternative Medicine', icon: '🌿',
        note: '5.5 years · NEET-UG required',
        courses: [
          { name: 'BAMS (Ayurveda)', about: 'Ancient Indian herbal medicine system gaining global recognition and modern research backing.' },
          { name: 'BHMS (Homeopathy)', about: 'Homeopathic treatment principles, drug proving, repertory, and case management.' },
          { name: 'BUMS (Unani)', about: 'Greco-Arabic medicine system using herbs, diet therapy, and physical therapies.' },
          { name: 'BNYS (Naturopathy & Yoga)', about: 'Drugless healing through diet, hydrotherapy, yoga, and lifestyle modification.' },
          { name: 'B.Sc Yoga & Naturopathy', about: 'Yoga therapy, wellness coaching, and natural health promotion programs.' },
        ],
      },
      {
        id: 'nursing_pg', label: 'Paramedical / Short Programs', full: 'Paramedical Diplomas', icon: '🏨',
        note: '1–2 years · Direct entry into healthcare',
        courses: [
          { name: 'GNM (General Nursing & Midwifery)', about: '3-year diploma nursing program — direct entry into hospital nursing without a degree.' },
          { name: 'ANM (Auxiliary Nurse Midwife)', about: 'Community health nursing, primary care, and maternal-child health programs.' },
          { name: 'DMLT (Diploma in Medical Lab)', about: 'Quick entry into clinical lab technician roles — blood tests, urine analysis, cultures.' },
          { name: 'D.Pharm (Diploma Pharmacy)', about: '2-year pharmacy diploma for working in retail pharmacy or hospital dispensary.' },
          { name: 'Diploma in Operation Theatre', about: 'Surgical assistance, sterilization, instrument handling, and OT protocols.' },
          { name: 'Diploma in Radiography', about: 'X-ray and basic imaging equipment operation for diagnostic centers.' },
        ],
      },
    ],
  },

  {
    id: 'commerce',
    title: 'Commerce & Business',
    icon: Briefcase, emoji: '💼',
    color: 'from-amber-500 to-orange-500', accent: '#f59e0b',
    glow: 'rgba(245,158,11,0.25)',
    desc: 'Navigate the world of money, markets, management, and business strategy.',
    degrees: [
      {
        id: 'bcom', label: 'B.Com', full: 'Bachelor of Commerce', icon: '📊',
        note: '3 years · Core commerce foundation',
        courses: [
          { name: 'B.Com General', about: 'Accounting, economics, business law, taxation, and auditing — broad commerce foundation.' },
          { name: 'B.Com (Hons)', about: 'Advanced accounting, corporate finance, and in-depth business analysis.' },
          { name: 'B.Com Accounting & Finance', about: 'Financial reporting, IFRS, investment analysis, and corporate governance.' },
          { name: 'B.Com Computer Applications', about: 'Accounting software like Tally, ERP systems, e-commerce, and business computing.' },
          { name: 'B.Com Banking & Insurance', about: 'Banking regulations, insurance products, risk management, and financial intermediation.' },
          { name: 'B.Com Taxation', about: 'GST, income tax, customs duty, corporate tax planning, and tax compliance.' },
          { name: 'B.Com E-Commerce', about: 'Digital business models, online payment systems, supply chain, and digital marketing.' },
        ],
      },
      {
        id: 'bba', label: 'BBA', full: 'Bachelor of Business Administration', icon: '📋',
        note: '3 years · Management & Leadership focus',
        courses: [
          { name: 'BBA General Management', about: 'Business strategy, organizational behavior, HR, marketing, and operations management.' },
          { name: 'BBA Finance', about: 'Financial markets, investment analysis, portfolio management, and corporate finance fundamentals.' },
          { name: 'BBA Marketing', about: 'Consumer behavior, digital marketing, brand management, and sales strategy.' },
          { name: 'BBA Human Resources', about: 'Talent acquisition, performance management, labor laws, and organizational development.' },
          { name: 'BBA International Business', about: 'Global trade, foreign exchange, international marketing, and cross-cultural management.' },
          { name: 'BBA Logistics & Supply Chain', about: 'Procurement, warehousing, distribution networks, and global logistics operations.' },
          { name: 'BBA Entrepreneurship', about: 'Startup ideation, business plan writing, venture capital, and new business development.' },
          { name: 'BBA Aviation Management', about: 'Airport operations, airline revenue management, cargo logistics, and aviation regulations.' },
        ],
      },
      {
        id: 'professional', label: 'Professional Programs', full: 'CA / CS / CMA / CFA', icon: '🏆',
        note: 'After 12th/UG · Elite finance certifications',
        courses: [
          { name: 'CA (Chartered Accountancy)', about: 'ICAI-governed elite finance certification — audit, taxation, financial advisory, and corporate reporting.' },
          { name: 'CS (Company Secretary)', about: 'Corporate governance, securities law, SEBI compliance, and board-level advisory.' },
          { name: 'CMA (Cost Management Accountant)', about: 'Cost control, management accounting, budgeting, and financial performance analysis.' },
          { name: 'CFA (Chartered Financial Analyst)', about: 'Investment analysis, portfolio management, equity research, and wealth management.' },
          { name: 'CFP (Certified Financial Planner)', about: 'Personal financial planning, retirement, tax optimization, and insurance advisory.' },
          { name: 'ACCA (International Accounting)', about: 'Global accounting qualification recognized across 180+ countries.' },
        ],
      },
      {
        id: 'mba', label: 'MBA / Higher Studies', full: 'Postgraduate Business Programs', icon: '🎓',
        note: 'After BBA/B.Com or work experience',
        courses: [
          { name: 'MBA Finance', about: 'Corporate finance, M&A analysis, financial modeling, valuation, and investment banking.' },
          { name: 'MBA Marketing', about: 'Brand strategy, market research, digital advertising, and product lifecycle management.' },
          { name: 'MBA HR', about: 'Organizational development, change management, compensation design, and talent strategy.' },
          { name: 'MBA Business Analytics', about: 'Data-driven decision making, SQL, Tableau, predictive modeling, and business intelligence.' },
          { name: 'MBA Operations', about: 'Process improvement, Six Sigma, lean manufacturing, supply chain optimization.' },
          { name: 'MBA Entrepreneurship & Innovation', about: 'Design thinking, startup ecosystem, venture capital, and innovation management.' },
        ],
      },
    ],
  },

  {
    id: 'arts',
    title: 'Arts, Humanities & Social Sciences',
    icon: BookOpen, emoji: '🎭',
    color: 'from-violet-500 to-purple-500', accent: '#8b5cf6',
    glow: 'rgba(139,92,246,0.25)',
    desc: 'Explore human culture, social systems, history, and the power of language.',
    degrees: [
      {
        id: 'ba', label: 'B.A', full: 'Bachelor of Arts', icon: '📖',
        note: '3 years · Foundation in Humanities',
        courses: [
          { name: 'B.A English Literature', about: 'Literary analysis, creative writing, linguistics, British & American literature, and critical theory.' },
          { name: 'B.A Tamil Literature', about: 'Classical Tamil texts, Sangam literature, modern Tamil poetry, and language history.' },
          { name: 'B.A History', about: 'Ancient, medieval, and modern Indian and world history, archaeology, and historiography.' },
          { name: 'B.A Economics', about: 'Micro/macroeconomics, econometrics, public policy, development economics, and monetary theory.' },
          { name: 'B.A Political Science', about: 'Governance, political theory, international relations, Indian constitution, and comparative politics.' },
          { name: 'B.A Sociology', about: 'Social structure, cultural institutions, gender studies, urban sociology, and social research methods.' },
          { name: 'B.A Philosophy', about: 'Logic, ethics, epistemology, Indian and Western philosophical traditions.' },
          { name: 'B.A Public Administration', about: 'Government policy, administrative law, public finance, and bureaucratic systems.' },
          { name: 'B.A Geography', about: 'Physical and human geography, GIS mapping, climatology, and regional planning.' },
        ],
      },
      {
        id: 'social', label: 'Social Sciences', full: 'Specialized Social Science Degrees', icon: '🤝',
        note: '3 years · People and community focused',
        courses: [
          { name: 'B.Sc Psychology', about: 'Human behavior, cognitive psychology, counseling basics, neuropsychology, and social influence.' },
          { name: 'BSW (Social Work)', about: 'Community development, NGO management, welfare law, case management, and field practicum.' },
          { name: 'B.A Journalism & Mass Communication', about: 'News writing, TV production, radio broadcasting, digital journalism, and media ethics.' },
          { name: 'B.A Mass Communication & Media', about: 'Advertising, PR, film studies, digital content, and communication theory.' },
          { name: 'B.A Criminology', about: 'Criminal justice, forensic psychology, corrections, victimology, and law enforcement systems.' },
          { name: 'B.A Development Studies', about: 'International development, poverty alleviation, sustainability policy, and global governance.' },
        ],
      },
      {
        id: 'lang', label: 'Languages', full: 'Foreign & Classical Languages', icon: '🌐',
        note: '3 years · High value in global careers',
        courses: [
          { name: 'B.A French', about: 'Spoken and written French, French literature, and cultural studies. Opens global job markets.' },
          { name: 'B.A German', about: 'German language proficiency — aerospace, automotive, and engineering industries value German speakers.' },
          { name: 'B.A Japanese', about: 'Japanese language and culture — in demand for BPO, auto, and electronics companies in India.' },
          { name: 'B.A Arabic', about: 'Arabic language — high demand for Gulf jobs, diplomatic services, and Islamic studies.' },
          { name: 'B.A Hindi', about: 'Hindi literature, translation, journalism, and national administrative roles.' },
          { name: 'B.A Sanskrit', about: 'Classical language, Vedic studies, Ayurvedic texts, and academic research.' },
        ],
      },
    ],
  },

  {
    id: 'science',
    title: 'Science & Research',
    icon: Microscope, emoji: '🔬',
    color: 'from-blue-500 to-indigo-500', accent: '#3b82f6',
    glow: 'rgba(59,130,246,0.25)',
    desc: 'Push the boundaries of human knowledge through rigorous scientific discovery.',
    degrees: [
      {
        id: 'bsc', label: 'B.Sc', full: 'Bachelor of Science', icon: '🧪',
        note: '3 years · Core science foundation',
        courses: [
          { name: 'B.Sc Mathematics', about: 'Algebra, calculus, real analysis, number theory, and mathematical modeling.' },
          { name: 'B.Sc Physics', about: 'Classical mechanics, electromagnetism, quantum physics, optics, and thermodynamics.' },
          { name: 'B.Sc Chemistry', about: 'Organic, inorganic, physical, and analytical chemistry with industrial applications.' },
          { name: 'B.Sc Biology (Zoology/Botany)', about: 'Cell biology, genetics, ecology, taxonomy, and evolutionary biology.' },
          { name: 'B.Sc Microbiology', about: 'Bacteriology, virology, immunology, food microbiology, and clinical microbiology.' },
          { name: 'B.Sc Biochemistry', about: 'Metabolic pathways, enzyme kinetics, protein structure, and molecular biology.' },
          { name: 'B.Sc Statistics', about: 'Probability, inference, sampling, regression, and statistical computing with R/Python.' },
          { name: 'B.Sc Computer Science', about: 'Programming, data structures, algorithms, networking, and software development.' },
          { name: 'B.Sc Electronics', about: 'Analog circuits, digital systems, microprocessors, and communication electronics.' },
        ],
      },
      {
        id: 'integrated_sci', label: 'Integrated M.Sc', full: '5-Year Integrated Science', icon: '🔭',
        note: '5 years · IIT/NIT/Central Universities',
        courses: [
          { name: 'Integrated M.Sc Physics', about: 'Deep physics education ending with a master\'s — pathway to BARC, ISRO, and research institutes.' },
          { name: 'Integrated M.Sc Chemistry', about: 'Research-oriented chemistry training combining UG and PG in a single program.' },
          { name: 'Integrated M.Sc Mathematics', about: 'Advanced mathematical training for careers in actuarial science, research, and finance.' },
          { name: 'Integrated M.Sc Biological Sciences', about: 'Comprehensive biology research degree for pharmaceutical and biotech research careers.' },
        ],
      },
      {
        id: 'research', label: 'Research & Higher Studies', full: 'M.Sc / Ph.D Pathways', icon: '🧬',
        note: 'After B.Sc · Academic and R&D careers',
        courses: [
          { name: 'M.Sc Physics', about: 'Condensed matter, nuclear physics, astrophysics, and materials research.' },
          { name: 'M.Sc Bioinformatics', about: 'Genomics, computational biology, sequence analysis, and drug discovery pipelines.' },
          { name: 'M.Sc Data Science', about: 'Statistical modeling, machine learning algorithms, big data tools, and visualization.' },
          { name: 'M.Sc Environmental Science', about: 'Climate change, pollution control, environmental policy, and ecological systems.' },
          { name: 'CSIR-NET / SET Qualification', about: 'National eligibility for lectureship and JRF research fellowships in science disciplines.' },
          { name: 'Ph.D Research', about: 'Original research contribution published in peer-reviewed journals — the highest academic qualification.' },
        ],
      },
    ],
  },

  {
    id: 'law',
    title: 'Law & Government Services',
    icon: Scale, emoji: '⚖️',
    color: 'from-emerald-600 to-teal-700', accent: '#059669',
    glow: 'rgba(5,150,105,0.25)',
    desc: 'Uphold justice, write legislation, and serve the nation in public sectors.',
    degrees: [
      {
        id: 'llb', label: 'LLB / BA LLB', full: 'Bachelor of Law', icon: '⚖️',
        note: '3 or 5 years · BCI regulated',
        courses: [
          { name: 'BA LLB (5 Year Integrated)', about: 'Combined arts and law degree — preferred path for direct entry from 12th grade.' },
          { name: 'B.Com LLB', about: 'Commerce and law combined — ideal for corporate, taxation, and banking law careers.' },
          { name: 'LLB General (3 Year)', about: 'After any bachelor\'s degree — covers constitutional, criminal, and civil law subjects.' },
          { name: 'Corporate Law', about: 'Company law, mergers and acquisitions, SEBI regulations, and board-level compliance.' },
          { name: 'Criminal Law', about: 'IPC, CrPC, evidence law, and court practice for defense and prosecution.' },
          { name: 'Intellectual Property Law', about: 'Patent filing, trademark registration, copyright protection, and IP litigation.' },
          { name: 'Cyber Law', about: 'IT Act, data protection, cyber crime investigation, and digital rights management.' },
          { name: 'International Law', about: 'Treaties, human rights law, WTO regulations, and public international law.' },
        ],
      },
      {
        id: 'civil', label: 'Civil Services', full: 'UPSC / TNPSC / State Services', icon: '🏛️',
        note: 'After graduation · India\'s most competitive exams',
        courses: [
          { name: 'UPSC Civil Services (IAS/IPS/IFS)', about: 'India\'s most prestigious exam for district collectors, police chiefs, and ambassadors.' },
          { name: 'TNPSC Group I / II / IV', about: 'Tamil Nadu government administrative, revenue, and public health service roles.' },
          { name: 'Indian Forest Service (IFS)', about: 'Managing India\'s forests, wildlife, and natural resources through UPSC.' },
          { name: 'IBPS / SBI PO & Clerk', about: 'Recruitment into public sector banks as Probationary Officers and Clerks.' },
          { name: 'SSC CGL / CHSL', about: 'Central government clerical and officer roles in Income Tax, CBI, and ministries.' },
        ],
      },
      {
        id: 'defence', label: 'Defence & Forces', full: 'Armed Forces Entry', icon: '🎖️',
        note: 'After 10th/12th/Graduation · NDA / CDS / AFCAT',
        courses: [
          { name: 'NDA (National Defence Academy)', about: '3-year tri-services training after 12th for commission in Army, Navy, and Air Force.' },
          { name: 'CDS (Combined Defence Services)', about: 'After graduation entry into officer ranks of Army, Navy, and Air Force.' },
          { name: 'AFCAT (Air Force Common Admission Test)', about: 'Entry into flying, technical, and ground duty branches of Indian Air Force.' },
          { name: 'Indian Coast Guard', about: 'Maritime law enforcement, search and rescue, and coastal security service.' },
          { name: 'CRPF / BSF / CISF', about: 'Central paramilitary forces for border security, industrial security, and counterterrorism.' },
        ],
      },
    ],
  },

  {
    id: 'design',
    title: 'Design, Media & Creative Industries',
    icon: PenTool, emoji: '🎨',
    color: 'from-fuchsia-500 to-pink-500', accent: '#d946ef',
    glow: 'rgba(217,70,239,0.25)',
    desc: 'Shape visual culture through graphic design, animation, fashion, and media.',
    degrees: [
      {
        id: 'bdes', label: 'B.Des', full: 'Bachelor of Design', icon: '✏️',
        note: '4 years · NID / NIFT / CEED pathway',
        courses: [
          { name: 'Industrial Design', about: 'Product form, ergonomics, usability, and manufacturing design for consumer and industrial goods.' },
          { name: 'Communication Design', about: 'Graphic design, typography, brand identity, packaging, and visual communication systems.' },
          { name: 'UI/UX Design', about: 'User research, wireframing, prototyping, interaction design, and usability testing.' },
          { name: 'Fashion Design', about: 'Garment construction, textile selection, trend forecasting, and fashion illustration.' },
          { name: 'Jewellery Design', about: 'Gem setting, metal work, CAD jewellery design, and gemology fundamentals.' },
          { name: 'Interior Design', about: 'Spatial planning, furniture selection, lighting design, and interior materials finishes.' },
          { name: 'Textile Design', about: 'Weave structures, print design, surface ornamentation, and sustainable textile innovation.' },
          { name: 'Animation & Film Design', about: '2D/3D animation, storyboarding, visual development, and motion picture production design.' },
        ],
      },
      {
        id: 'bfa', label: 'B.F.A', full: 'Bachelor of Fine Arts', icon: '🖼️',
        note: '4 years · Creative arts mastery',
        courses: [
          { name: 'Painting', about: 'Oil, watercolor, acrylic, and mixed media painting — traditional and contemporary approaches.' },
          { name: 'Sculpture', about: 'Clay modeling, stone carving, metal casting, and installation art.' },
          { name: 'Printmaking', about: 'Etching, lithography, screen printing, and digital printmaking techniques.' },
          { name: 'Applied Arts / Commercial Art', about: 'Advertising illustration, poster design, layout, and digital art for commercial use.' },
          { name: 'Photography', about: 'Camera techniques, composition, lighting, darkroom, and digital post-processing.' },
          { name: 'Art History & Criticism', about: 'Global and Indian art movements, art theory, museum curation, and critical analysis.' },
        ],
      },
      {
        id: 'media', label: 'Media & Journalism', full: 'Mass Communication Programs', icon: '📽️',
        note: '3 years · Digital content era',
        courses: [
          { name: 'B.A Journalism & Mass Communication', about: 'News reporting, media writing, TV broadcasting, and digital journalism.' },
          { name: 'B.A Advertising', about: 'Campaign creation, copywriting, media planning, and brand communication strategies.' },
          { name: 'B.A Public Relations', about: 'Corporate communications, crisis management, event planning, and media relations.' },
          { name: 'B.Sc Animation & VFX', about: '3D modeling, rigging, compositing, and visual effects for film and gaming.' },
          { name: 'B.Sc Film & Television Production', about: 'Screenwriting, cinematography, editing, sound design, and documentary production.' },
          { name: 'B.A New Media & Digital Content', about: 'Social media management, podcast production, content strategy, and digital storytelling.' },
        ],
      },
    ],
  },

  {
    id: 'cs',
    title: 'Computer Science, AI & Emerging Tech',
    icon: Brain, emoji: '🤖',
    color: 'from-indigo-500 to-violet-600', accent: '#6366f1',
    glow: 'rgba(99,102,241,0.25)',
    desc: 'Write the code that runs the world, from mobile apps to superintelligent AI.',
    degrees: [
      {
        id: 'btech_cs', label: 'B.Tech / B.E (CS)', full: 'Core CS Engineering Degree', icon: '💻',
        note: '4 years · Highest placement stream',
        courses: [
          { name: 'Computer Science & Engineering', about: 'Algorithms, OS, databases, software engineering, networks, and cloud computing.' },
          { name: 'Artificial Intelligence & Data Science', about: 'ML, deep learning, NLP, computer vision, and large-scale data analytics.' },
          { name: 'Cybersecurity & Ethical Hacking', about: 'Network defense, penetration testing, cryptography, VAPT, and digital forensics.' },
          { name: 'Data Science & Business Analytics', about: 'Statistical models, Python/R, Tableau, SQL, and business intelligence dashboards.' },
          { name: 'Cloud Computing & DevOps', about: 'AWS/Azure/GCP architecture, CI/CD pipelines, Kubernetes, Docker, and SRE.' },
          { name: 'Internet of Things (IoT)', about: 'Embedded systems, MQTT, sensor networks, edge computing, and IoT security.' },
          { name: 'Robotics & Automation', about: 'ROS framework, robot kinematics, PLC programming, and autonomous systems.' },
          { name: 'Game Development', about: 'Unity/Unreal engine, game physics, 3D modeling, and multiplayer architecture.' },
          { name: 'Blockchain Technology', about: 'Smart contracts, Ethereum, Solidity, DeFi, and decentralized application development.' },
        ],
      },
      {
        id: 'bsc_cs', label: 'B.Sc (CS / IT)', full: 'Bachelor of Science in CS/IT', icon: '📱',
        note: '3 years · Affordable CS pathway',
        courses: [
          { name: 'B.Sc Computer Science', about: 'Programming, algorithms, databases, and networking with project-based learning.' },
          { name: 'B.Sc Information Technology', about: 'Web development, ERP systems, networking, and IT project management.' },
          { name: 'B.Sc Software Systems', about: 'Software design patterns, agile development, testing, and software project management.' },
          { name: 'B.Sc Data Science', about: 'Python, R, machine learning algorithms, data visualization, and statistical analysis.' },
          { name: 'B.Sc Cyber Security', about: 'Network security, ethical hacking tools, SOC operations, and incident response.' },
        ],
      },
      {
        id: 'emerging', label: 'Emerging Programs', full: 'New Age Tech Degrees', icon: '🚀',
        note: '4 years · Future-ready specialized tracks',
        courses: [
          { name: 'B.Tech Quantum Computing', about: 'Quantum algorithms, qubit systems, quantum cryptography, and quantum hardware basics.' },
          { name: 'B.Tech Extended Reality (XR/AR/VR)', about: 'Immersive experience design, Unity 3D, spatial computing, and mixed reality dev.' },
          { name: 'B.Tech Fintech', about: 'Digital payments, blockchain, regtech, algorithmic trading, and financial AI systems.' },
          { name: 'B.Tech Health Informatics', about: 'Electronic health records, medical AI, hospital management systems, and telemedicine.' },
          { name: 'B.Tech Autonomous Vehicles', about: 'Self-driving car tech — sensor fusion, LIDAR, computer vision, and motion planning.' },
        ],
      },
    ],
  },

  {
    id: 'aviation',
    title: 'Aviation, Marine & Defence',
    icon: Shield, emoji: '✈️',
    color: 'from-sky-600 to-blue-700', accent: '#0284c7',
    glow: 'rgba(2,132,199,0.25)',
    desc: 'Protect borders, fly aircraft, and navigate the world\'s oceans with expertise.',
    degrees: [
      {
        id: 'aviation_deg', label: 'Aviation', full: 'Pilot & Aerospace Programs', icon: '🛫',
        note: 'DGCA regulated · High investment, high reward',
        courses: [
          { name: 'Commercial Pilot License (CPL)', about: 'Multi-engine training, IFR flying, ATPL theory, and airline assessment readiness.' },
          { name: 'B.Sc Aviation', about: 'Aviation meteorology, air traffic control, aircraft systems, and aviation management.' },
          { name: 'Aerospace Engineering (B.E/B.Tech)', about: 'Aircraft aerodynamics, propulsion, avionics, structural analysis, and flight testing.' },
          { name: 'Aircraft Maintenance Engineering (AME)', about: 'DGCA-licensed aircraft maintenance — avionics, airframe, and powerplant systems.' },
          { name: 'Airport Management (MBA)', about: 'Airport operations, ground handling, cargo, terminal management, and aviation security.' },
          { name: 'Cabin Crew / Flight Dispatcher Training', about: 'Airline procedures, safety protocols, passenger handling, and emergency response.' },
        ],
      },
      {
        id: 'marine_deg', label: 'Marine', full: 'Merchant Navy & Naval Programs', icon: '⚓',
        note: 'DNS / IMO regulated · Global career',
        courses: [
          { name: 'B.Sc Nautical Science (DNS)', about: 'Navigation, cargo handling, maritime law, and officer career on commercial ships.' },
          { name: 'Marine Engineering', about: 'Ship machinery maintenance, engine room operations, and marine electrical systems.' },
          { name: 'Naval Architecture', about: 'Ship design, stability calculations, offshore platforms, and underwater vehicle engineering.' },
          { name: 'Merchant Navy Deck Cadet', about: 'Sponsored cadet programs for ship officer training through shipping companies.' },
          { name: 'Port & Shipping Management', about: 'Container logistics, port operations, freight forwarding, and shipping documentation.' },
        ],
      },
    ],
  },

  {
    id: 'agriculture',
    title: 'Agriculture, Environment & Food',
    icon: Leaf, emoji: '🌾',
    color: 'from-green-500 to-lime-600', accent: '#22c55e',
    glow: 'rgba(34,197,94,0.25)',
    desc: 'Feed the world, innovate food production, and protect our natural resources.',
    degrees: [
      {
        id: 'bsc_ag', label: 'B.Sc Agriculture', full: 'Agricultural Sciences', icon: '🌱',
        note: '4 years · ICAR regulated',
        courses: [
          { name: 'B.Sc Agriculture (General)', about: 'Agronomy, soil science, plant breeding, crop protection, and farm management.' },
          { name: 'B.Sc Horticulture', about: 'Fruit, vegetable, and flower production, landscape gardening, and post-harvest management.' },
          { name: 'B.Sc Forestry', about: 'Forest management, wildlife conservation, agroforestry, and biodiversity protection.' },
          { name: 'B.Sc Sericulture', about: 'Silk worm rearing, mulberry cultivation, silk reeling, and textile applications.' },
          { name: 'B.Sc Agricultural Economics', about: 'Farm finance, market analysis, agricultural policy, rural development, and agribusiness.' },
          { name: 'B.Sc Fisheries Science', about: 'Aquaculture, marine fisheries, fish processing technology, and fishery management.' },
        ],
      },
      {
        id: 'food_tech', label: 'Food Technology', full: 'Food Science Programs', icon: '🍱',
        note: '4 years · B.Tech Food Technology',
        courses: [
          { name: 'B.Tech Food Technology', about: 'Food processing, preservation methods, quality control, packaging, and food safety standards.' },
          { name: 'B.Sc Food Science & Nutrition', about: 'Human nutrition, dietetics, food analysis, nutraceuticals, and clinical nutrition.' },
          { name: 'B.Tech Dairy Technology', about: 'Milk processing, cheese/butter/yogurt production, dairy plant operations, and dairy chemistry.' },
          { name: 'B.Tech Sugar Technology', about: 'Sugarcane processing, ethanol production, by-product utilization, and refinery operations.' },
        ],
      },
      {
        id: 'env', label: 'Environmental Sciences', full: 'Ecology & Sustainability', icon: '🌍',
        note: '3–4 years · Green economy demand',
        courses: [
          { name: 'B.Sc Environmental Science', about: 'Ecology, pollution control, climate change, environmental law, and sustainability strategies.' },
          { name: 'B.E Environmental Engineering', about: 'Wastewater treatment, air pollution control, solid waste management, and EIA.' },
          { name: 'B.Sc Wildlife Science', about: 'Animal behavior, conservation biology, camera trapping, and wildlife policy.' },
          { name: 'B.Sc Oceanography', about: 'Marine ecosystems, ocean circulation, coastal geology, and deep-sea research.' },
        ],
      },
    ],
  },

  {
    id: 'hospitality',
    title: 'Hospitality, Tourism & Events',
    icon: Coffee, emoji: '🏨',
    color: 'from-orange-500 to-red-500', accent: '#f97316',
    glow: 'rgba(249,115,22,0.25)',
    desc: 'Create world-class experiences in hotels, travel destinations, and events.',
    degrees: [
      {
        id: 'bhmct', label: 'B.H.M.C.T', full: 'Hotel Management & Catering Technology', icon: '🍽️',
        note: '4 years · NCHMCT regulated',
        courses: [
          { name: 'B.H.M.C.T (General)', about: 'Comprehensive hotel management — front office, food production, housekeeping, and F&B service.' },
          { name: 'Culinary Arts (B.Sc)', about: 'Professional cooking techniques, international cuisine, pastry arts, and kitchen management.' },
          { name: 'Food & Beverage Management', about: 'Restaurant operations, menu engineering, bar management, and hospitality financial controls.' },
          { name: 'Hospitality & Tourism Management', about: 'Destination marketing, tour operations, online travel platforms, and guest experience design.' },
        ],
      },
      {
        id: 'event', label: 'Event & Tourism', full: 'Tourism & Event Programs', icon: '🎪',
        note: '3 years · Experience economy growth',
        courses: [
          { name: 'B.A Tourism & Travel Management', about: 'Tour planning, travel agency operations, air ticketing (GDS), and destination knowledge.' },
          { name: 'B.Sc Event Management', about: 'Corporate event planning, wedding management, vendor coordination, and live event logistics.' },
          { name: 'B.A Cruise Management', about: 'Cruise line operations, onboard hospitality, port logistics, and maritime tourism.' },
          { name: 'B.A Heritage Tourism', about: 'Cultural tourism, historical site management, and tourism policy for heritage conservation.' },
        ],
      },
    ],
  },

  {
    id: 'education',
    title: 'Education, Psychology & Public Services',
    icon: GraduationCap, emoji: '🧑‍🏫',
    color: 'from-cyan-500 to-blue-500', accent: '#06b6d4',
    glow: 'rgba(6,182,212,0.25)',
    desc: 'Shape minds, support mental health, and improve community well-being.',
    degrees: [
      {
        id: 'bed', label: 'B.Ed / Teaching', full: 'Teacher Education Programs', icon: '📚',
        note: '2 years after UG · NCTE regulated',
        courses: [
          { name: 'B.Ed (General)', about: 'Pedagogy, curriculum design, classroom management, and teaching practice in schools.' },
          { name: 'B.El.Ed (Elementary Education)', about: '4-year integrated program for primary and upper primary school teachers.' },
          { name: 'D.El.Ed (Diploma in Elementary Ed)', about: '2-year diploma for primary school teachers — mandatory for TET/CTET eligibility.' },
          { name: 'B.P.Ed (Physical Education)', about: 'Sports coaching, physical fitness education, and school sports program management.' },
          { name: 'Special Education (B.Ed Spl.Ed)', about: 'Teaching children with visual, hearing, or intellectual disabilities.' },
        ],
      },
      {
        id: 'psych', label: 'Psychology', full: 'Psychology & Counseling Programs', icon: '🧠',
        note: '3–5 years · Growing mental health sector',
        courses: [
          { name: 'B.Sc Psychology', about: 'Human behavior, cognitive processes, social psychology, and psychological research methods.' },
          { name: 'Clinical Psychology (M.Sc/Ph.D)', about: 'Diagnosing and treating mental disorders using CBT, psychoanalysis, and behavioral therapy.' },
          { name: 'Counseling Psychology', about: 'Individual and group counseling for career, relationship, and personal challenges.' },
          { name: 'Forensic Psychology', about: 'Criminal profiling, offender rehabilitation, and court assessment of psychological fitness.' },
          { name: 'Organizational / Industrial Psychology', about: 'Employee behavior, HR consulting, leadership assessment, and workplace mental health.' },
        ],
      },
      {
        id: 'pub_service', label: 'Public Services', full: 'Social & Public Sector Programs', icon: '🌏',
        note: '3 years · NGO & welfare sector',
        courses: [
          { name: 'BSW (Bachelor of Social Work)', about: 'Community organizing, NGO field work, welfare law, and social research methods.' },
          { name: 'B.A Public Administration', about: 'Government policy, public finance, administrative law, and municipal governance.' },
          { name: 'B.A Development Studies', about: 'International development, sustainable goals, poverty alleviation, and global aid programs.' },
        ],
      },
    ],
  },

  {
    id: 'sports',
    title: 'Sports, Fitness & Wellness',
    icon: Activity, emoji: '🏃‍♂️',
    color: 'from-red-500 to-rose-600', accent: '#ef4444',
    glow: 'rgba(239,68,68,0.25)',
    desc: 'Promote physical excellence, athletic performance, and holistic well-being.',
    degrees: [
      {
        id: 'sports_sci', label: 'Sports Science', full: 'Exercise & Sports Science', icon: '🏋️',
        note: '3–4 years · High performance sector',
        courses: [
          { name: 'B.Sc Sports Science', about: 'Exercise physiology, biomechanics, sport psychology, nutrition, and strength & conditioning.' },
          { name: 'B.Sc Sports Nutrition', about: 'Macronutrient timing, supplement science, athlete dietary planning, and metabolic testing.' },
          { name: 'B.P.Ed (Physical Education)', about: 'Sports coaching methodology, school fitness programs, and athletic training.' },
          { name: 'B.Sc Physiotherapy (Sports)', about: 'Sports injury assessment, rehabilitation protocols, taping techniques, and return-to-play programs.' },
          { name: 'B.Sc Kinesiology', about: 'Human movement science, motor learning, exercise biomechanics, and musculoskeletal anatomy.' },
        ],
      },
      {
        id: 'wellness', label: 'Wellness & Yoga', full: 'Holistic Health Programs', icon: '🧘',
        note: '1–3 years · Growing wellness industry',
        courses: [
          { name: 'B.Sc Yoga & Naturopathy', about: 'Yoga asanas, pranayama, naturopathic healing, and wellness center management.' },
          { name: 'B.Sc Fitness & Health Promotion', about: 'Gym programming, personal training, wellness coaching, and community fitness.' },
          { name: 'B.A Sports Management', about: 'Sports business, athlete marketing, stadium operations, and sports media.' },
          { name: 'Diploma in Coaching', about: 'Sport-specific coaching certifications for athletes — SAI and NSNIS programs.' },
        ],
      },
    ],
  },

  {
    id: 'vocational',
    title: 'Vocational, Skill-Based & Industrial',
    icon: Wrench, emoji: '🛠️',
    color: 'from-slate-500 to-neutral-600', accent: '#64748b',
    glow: 'rgba(100,116,139,0.25)',
    desc: 'Master high-value technical hands-on skills for specialized industrial trades.',
    degrees: [
      {
        id: 'iti', label: 'ITI Courses', full: 'Industrial Training Institute', icon: '🔧',
        note: '1–2 years · NCVT certified',
        courses: [
          { name: 'Electrician Trade', about: 'Wiring, installation, motor controls, electrical panels, and domestic/industrial electrical systems.' },
          { name: 'Fitter Trade', about: 'Bench work, fitting, drilling, lathe operations, and assembly of mechanical components.' },
          { name: 'Welder Trade', about: 'MIG, TIG, arc welding, cutting processes, and weld quality inspection.' },
          { name: 'Plumber Trade', about: 'Pipe fitting, sanitation systems, water supply, drainage, and plumbing code compliance.' },
          { name: 'Turner / Machinist', about: 'CNC lathe operations, precision machining, surface finishing, and dimensional inspection.' },
          { name: 'Refrigeration & AC Mechanic', about: 'HVAC systems, refrigerant handling, compressor repair, and energy efficiency.' },
          { name: 'Electronics Mechanic', about: 'PCB repair, consumer electronics servicing, mobile repair, and TV/LCD diagnostics.' },
          { name: 'Carpenter Trade', about: 'Wood joinery, furniture making, cabinetry, and interior woodwork installations.' },
        ],
      },
      {
        id: 'polytechnic', label: 'Polytechnic Diploma', full: 'Government Polytechnic', icon: '📐',
        note: '3 years · Direct entry or lateral B.E',
        courses: [
          { name: 'Diploma in Mechanical Engineering', about: 'Workshop skills, manufacturing processes, machine design, and production planning.' },
          { name: 'Diploma in Computer Engineering', about: 'Programming basics, networking, OS, and IT support for industry entry.' },
          { name: 'Diploma in Civil Engineering', about: 'Construction drawing, site supervision, quantity surveying, and material testing.' },
          { name: 'Diploma in Electrical Engineering', about: 'Power distribution, substation maintenance, wiring, and electrical safety.' },
          { name: 'Diploma in Electronics', about: 'Circuit design, PCB troubleshooting, microcontrollers, and consumer electronics.' },
          { name: 'Diploma in Automobile Engineering', about: 'Vehicle maintenance, engine technology, EV basics, and automotive diagnosis.' },
        ],
      },
      {
        id: 'skill', label: 'Skill Certifications', full: 'NSDC / PMKVY Programs', icon: '🏅',
        note: 'Weeks to months · Industry-aligned',
        courses: [
          { name: 'PMKVY Skill Courses', about: 'Free government short-term courses in 200+ trades under Skill India mission.' },
          { name: 'Certified Nursing Assistant (CNA)', about: 'Patient care skills for hospital support — entry into healthcare support roles.' },
          { name: 'Digital Marketing Certificate', about: 'SEO, SEM, social media, email marketing, and analytics fundamentals.' },
          { name: 'Tally & GST Accounting', about: 'Business accounting, GST filing, payroll, and TDS management using Tally ERP.' },
          { name: 'AutoCAD Certification', about: '2D/3D drafting for architecture, civil, and mechanical engineering roles.' },
        ],
      },
    ],
  },

  {
    id: 'entrepreneurship',
    title: 'Entrepreneurship & Creator Economy',
    icon: Rocket, emoji: '🚀',
    color: 'from-yellow-400 to-amber-500', accent: '#eab308',
    glow: 'rgba(234,179,8,0.25)',
    desc: 'Start your own business, build personal brands, and create the future economy.',
    degrees: [
      {
        id: 'startup', label: 'Startup & Business', full: 'Entrepreneurship Programs', icon: '💡',
        note: '3–4 years · IIT / IIM programs',
        courses: [
          { name: 'BBA Entrepreneurship', about: 'Startup ideation, business planning, pitching investors, and venture development.' },
          { name: 'MBA Innovation & Entrepreneurship', about: 'Design thinking, startup ecosystem navigation, corporate innovation, and growth hacking.' },
          { name: 'B.Tech with Entrepreneurship Minor', about: 'Technical skill base with startup management — ideal for deep-tech founders.' },
          { name: 'EDII Programs', about: 'Entrepreneurship Development Institute of India programs for aspiring founders.' },
          { name: 'Incubator / Accelerator Programs', about: 'IIT/NIT/College incubators providing mentorship, funding, and market access for startups.' },
        ],
      },
      {
        id: 'digital', label: 'Digital & Creator', full: 'Digital Economy Programs', icon: '📲',
        note: '3 years + certifications',
        courses: [
          { name: 'Digital Marketing (B.Sc/Diploma)', about: 'SEO, paid ads, content strategy, social media analytics, and conversion rate optimization.' },
          { name: 'Content Creation & Personal Branding', about: 'YouTube strategy, Instagram growth, podcasting, brand deals, and monetization frameworks.' },
          { name: 'E-Commerce & Dropshipping', about: 'Shopify store setup, Amazon FBA, product sourcing, logistics, and digital catalog management.' },
          { name: 'Influencer Marketing Management', about: 'Managing brand-creator partnerships, campaign ROI, and influencer contract negotiations.' },
          { name: 'NFT, Web3 & Crypto Business', about: 'Blockchain business models, NFT creation, DAO governance, and decentralized finance.' },
        ],
      },
    ],
  },
]

/* ═══════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════════════════ */

function AboutPanel({ text, onClose, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden"
    >
      <div
        className="mt-2 p-3 rounded-xl text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 relative"
        style={{ background: `${accent}12`, border: `1px solid ${accent}30` }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-neutral-400 hover:text-neutral-600"
        >
          <X size={11} />
        </button>
        <span className="font-semibold pr-4 inline-flex items-center gap-1" style={{ color: accent }}><Info size={12} /> About  </span>
        {text}
      </div>
    </motion.div>
  )
}

function CourseChip({ course, accent, index }) {
  const [open, setOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.035, duration: 0.3 }}
      className="col-span-1"
    >
      <div className="flex items-start gap-2">
        <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: accent }} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 leading-snug">
              {course.name}
            </span>
            <button
              onClick={() => setOpen(v => !v)}
              className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-bold border transition-all shrink-0"
              style={{
                borderColor: open ? accent : 'rgba(148,163,184,0.4)',
                color: open ? accent : '#94a3b8',
                background: open ? `${accent}18` : 'transparent',
              }}
            >
              <Info size={8} /> About
            </button>
          </div>
          <AnimatePresence>
            {open && (
              <AboutPanel text={course.about} onClose={() => setOpen(false)} accent={accent} />
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

function DegreeCard({ degree, accent, glow, color, isActive, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.025, rotateY: isActive ? 0 : 2, rotateX: isActive ? 0 : -1 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      className="relative text-left rounded-2xl p-4 transition-all duration-300 overflow-hidden"
      style={{
        background: isActive
          ? `linear-gradient(135deg, ${accent}22 0%, ${accent}10 100%)`
          : 'rgba(255,255,255,0.7)',
        border: `1.5px solid ${isActive ? accent : 'rgba(226,232,240,0.8)'}`,
        boxShadow: isActive
          ? `0 0 0 1px ${accent}40, 0 8px 32px ${glow}`
          : '0 2px 8px rgba(0,0,0,0.05)',
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Subtle shimmer overlay */}
      <div
        className="absolute inset-0 opacity-20 rounded-2xl pointer-events-none"
        style={{ background: isActive ? `linear-gradient(135deg, ${accent}30, transparent)` : 'none' }}
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1.5">
          <GraduationCap size={20} className="text-neutral-500" />
          <motion.div
            animate={{ rotate: isActive ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            style={{ color: isActive ? accent : '#94a3b8' }}
          >
            <ChevronRight size={14} />
          </motion.div>
        </div>
        <p className="font-extrabold text-sm text-neutral-900 dark:text-white leading-tight">
          {degree.label}
        </p>
        <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
          {degree.full}
        </p>
        <p
          className="text-[9px] font-semibold mt-1.5 px-2 py-0.5 rounded-full inline-block"
          style={{ background: `${accent}18`, color: accent }}
        >
          {degree.note}
        </p>
      </div>
    </motion.button>
  )
}

function DomainRow({ domain, delay }) {
  const [expanded, setExpanded] = useState(false)
  const [activeDegree, setActiveDegree] = useState(null)
  const Icon = domain.icon

  const handleDegreeClick = (degId) => {
    setActiveDegree(prev => prev === degId ? null : degId)
  }

  const activeDegreeData = domain.degrees.find(d => d.id === activeDegree)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay, type: 'spring', bounce: 0.2 }}
      className="rounded-2xl border border-neutral-200 dark:border-slate-700 overflow-hidden bg-white dark:bg-slate-800 shadow-sm"
      style={{ boxShadow: expanded ? `0 8px 32px ${domain.glow}` : '0 2px 8px rgba(0,0,0,0.04)' }}
    >
      {/* ── Domain Header ── */}
      <button
        onClick={() => { setExpanded(v => !v); if (expanded) setActiveDegree(null) }}
        className="w-full flex items-center gap-4 p-4 md:p-5 text-left group hover:bg-neutral-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <div className={`w-1 h-10 rounded-full bg-gradient-to-b ${domain.color} shrink-0`} />
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${domain.color} flex items-center justify-center text-xl shrink-0`}
          style={{ boxShadow: `0 4px 16px ${domain.glow}` }}
        >
          <Icon size={20} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-sm text-neutral-900 dark:text-white">{domain.title}</p>
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">{domain.desc}</p>
        </div>
        <span className="text-[10px] font-bold shrink-0 px-2 py-1 rounded-full" style={{ background: `${domain.accent}18`, color: domain.accent }}>
          {domain.degrees.length} degrees
        </span>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="shrink-0 text-neutral-400"
        >
          <ChevronDown size={18} />
        </motion.div>
      </button>

      {/* ── Expanded Area ── */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div style={{ borderTop: `1px solid ${domain.accent}25` }}>

              {/* ── Level 2: Degree Cards Grid ── */}
              <div className="px-5 pt-5 pb-4">
                <p className="text-[9px] font-black uppercase tracking-widest mb-3" style={{ color: domain.accent }}>
                  Choose a Degree Path ↓
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {domain.degrees.map((deg, i) => (
                    <motion.div
                      key={deg.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.35, type: 'spring', bounce: 0.25 }}
                    >
                      <DegreeCard
                        degree={deg}
                        accent={domain.accent}
                        glow={domain.glow}
                        color={domain.color}
                        isActive={activeDegree === deg.id}
                        onClick={() => handleDegreeClick(deg.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ── Level 3: Courses for selected Degree ── */}
              <AnimatePresence>
                {activeDegreeData && (
                  <motion.div
                    key={activeDegreeData.id}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <div
                      className="mx-5 mb-5 rounded-2xl p-4"
                      style={{
                        background: `linear-gradient(135deg, ${domain.accent}08, ${domain.accent}04)`,
                        border: `1px solid ${domain.accent}25`,
                      }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-base">{activeDegreeData.icon}</span>
                        <div>
                          <p className="font-extrabold text-sm text-neutral-900 dark:text-white">
                            {activeDegreeData.full}
                          </p>
                          <p className="text-[9px] font-black uppercase tracking-widest mt-0.5" style={{ color: domain.accent }}>
                            Specializations & Fields
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                        {activeDegreeData.courses.map((course, i) => (
                          <CourseChip
                            key={course.name}
                            course={course}
                            accent={domain.accent}
                            index={i}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   EXPORT
   ═══════════════════════════════════════════════════════════════════ */
export default function After12thDomains() {
  return (
    <div className="flex flex-col gap-3">
      {DOMAINS_12TH.map((domain, i) => (
        <DomainRow key={domain.id} domain={domain} delay={i * 0.04} />
      ))}
    </div>
  )
}
