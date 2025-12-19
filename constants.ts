
import { Education, ResearchProject, Repository, Experience, Publication, SkillCategory, Award, MapLocation, Lecture } from './types';
import { Code2, Database, BarChart3, Globe, PenTool } from 'lucide-react';

export const PROFILE = {
  name: "Kapil Kumar Meena",
  title: "PhD IIT Kharagpur | MTech IIT Roorkee",
  subtitle: "Transport • Data • Environment",
  email: "kapil.meena@kgpian.iitkgp.ac.in",
  linkedin: "https://www.linkedin.com/in/kapilmeena/",
  github: "https://github.com/kapil2020",
  scholar: "https://scholar.google.com/citations?user=5jIAPTEAAAAJ&hl=en",
  website: "https://kapil2020.github.io/web",
  photoUrl: "https://github.com/kapil2020/web/blob/main/kp_1.png?raw=true", 
  summary: "Travel Behavior Researcher (Emerging Mobility · Discrete Choice Modeling · Sustainable Transitions) with a dual IIT pedigree. I specialize in decoding behavioral dynamics related to shared mobility, EV adoption, and the health impacts of transportation. Expert in applying Hybrid Choice Models (Latent Variables) and Machine Learning to large-scale travel datasets. My research focuses on bridging econometric rigor with policy-driven solutions for equitable and decarbonized urban mobility."
};

export const PEER_REVIEW_JOURNALS = [
  "Transportation Research Part D",
  "Journal of Transport & Health",
  "Sustainable Cities and Society",
  "Travel Behaviour and Society",
  "Decision Analytics Journal",
  "Transportation Research Record",
  "Urban Climate",
  "Sustainable Transport and Livability"
];

export const EDUCATION: Education[] = [
  {
    period: "2022–Present",
    degree: "PhD in Infrastructure Design & Management",
    institution: "Indian Institute of Technology Kharagpur",
    location: "West Bengal, India",
    details: "Focus: Travel Behaviour, Micromobility Integration, and Urban Computing | Advisor: Prof. Arkopal Goswami"
  },
  {
    period: "2019–2021",
    degree: "M.Tech in Transportation Engineering",
    institution: "Indian Institute of Technology Roorkee",
    location: "Uttarakhand, India",
    details: "Thesis: Commuter Exposure to Air Pollution | Advisor: Prof. Amit Agarwal"
  },
  {
    period: "2015–2019",
    degree: "B.Tech in Civil Engineering (Honors)",
    institution: "Rajasthan Technical University",
    location: "Kota, India",
    details: "Graduated with Honors | Top 5% of class"
  }
];

export const RESEARCH_PROJECTS: ResearchProject[] = [
  {
    title: "DRUM Web App",
    role: "Lead Developer",
    description: "Dynamic route planning integrating air pollution and energy efficiency for urban commuters. Featured in The Hindu.",
    link: "https://leap-routing-iitkgp.vercel.app/",
    linkText: "View Live App",
    tags: ["GraphHopper", "React JS", "Leaflet"],
    type: "Web App"
  },
  {
    title: "TUTEM (ADB-Funded)",
    role: "Researcher",
    description: "Technologies for urban transit enhancement and safe accessibility at IIT Kharagpur. Focusing on micromobility integration.",
    link: "https://www.tutem.org/home",
    linkText: "Project Site",
    tags: ["ADB", "Policy", "Transit"],
    type: "Project"
  },
  {
    title: "Air Quality Dashboard",
    role: "Developer",
    description: "Interactive Streamlit application that visualizes and analyzes air quality data (AQI) across major Indian cities.",
    link: "https://github.com/kapil2020/india-air-quality-dashboard",
    linkText: "View Code",
    tags: ["Streamlit", "Python", "Visualization"],
    type: "Live"
  },
  {
    title: "MaaS Demand Study",
    role: "Analyst",
    description: "Forecasting demand for Mobility as a Service in Indian contexts using stated preference surveys.",
    link: "https://drive.google.com/file/d/1ljzvRLdij5J9SCCP5NxnIqnH5Ovsq8U7/view?usp=drivesdk",
    linkText: "View Report",
    tags: ["SPSS", "Choice Modeling"],
    type: "Report"
  },
  {
    title: "Bicycle Choice Modeling",
    role: "Lead Researcher",
    description: "Health impacts of first/last-mile cycling to rail stations. Published in Int. J. of Sustainable Transportation.",
    link: "https://www.tandfonline.com/doi/abs/10.1080/15568318.2025.2572818",
    linkText: "Read Paper",
    tags: ["R", "Health Impact"],
    type: "Project"
  }
];

export const REPOSITORIES: Repository[] = [
  {
    name: "DRUM-Web-App",
    description: "Source code for the Dynamic Route Planning for Urban Mobility (DRUM) web application.",
    stars: 4,
    link: "https://github.com/orgs/clean-route/repositories"
  },
  {
    name: "Dynamic Travel Survey",
    description: "A Dynamic Custom Travel Survey with Real-Time analysis capabilities.",
    stars: 7,
    link: "https://github.com/kapil2020/react-frontend-kgp"
  },
  {
    name: "Next day PM 2.5 Prediction",
    description: "Predicting next-day fine particulate matter (PM2.5) concentrations using Machine Learning.",
    stars: 3,
    link: "https://kapil2020.github.io/global-PM-2.5-next-day-forecasting/"
  },
  {
    name: "City Mode Share Dashboard",
    description: "Interactive dashboard for visualizing and predicting cycling and motorcycle mode share.",
    stars: 2,
    link: "https://kapil2020.github.io/cycling-dashboard/"
  },
  {
    name: "Routing Mobile App",
    description: "A modern UI routing mobile application for different route options.",
    stars: 0,
    link: "https://kapil2020.github.io/dummy-mobile-application/"
  }
];

export const EXPERIENCE: Experience[] = [
  {
    period: "Nov 2021 – Mar 2022",
    role: "Research Consultant | Electric Mobility",
    organization: "World Resources Institute (WRI) India",
    location: "Remote",
    points: [
      "Conducted comparative analysis of inhaled pollution dose for commuters (EV vs. ICE), contributing to data-driven policy frameworks.",
      "Developed recommendations for deploying electric mobility solutions in Tier-2 cities, bridging research and public sector implementation."
    ]
  },
  {
    period: "2019–2023",
    role: "Teaching Assistant",
    organization: "IIT Kharagpur & IIT Roorkee",
    location: "India",
    points: [
      "Courses: Multimodal Urban Transport (NPTEL), Intersection Design (CEN 662), Engineering Drawing (CE13001).",
      "Mentored students in laboratory sessions, simulation tools (VISSIM), and geospatial analysis (QGIS)."
    ]
  }
];

export const EXPERT_LECTURES: Lecture[] = [
  {
    title: "DRUM Talk",
    event: "Google India",
    year: "June 2025",
    image: "https://github.com/kapil2020/web/blob/main/google_github.jpg?raw=true"
  },
  {
    title: "Data Visualization with Tableau",
    event: "Swastik Edustart",
    year: "2022"
  },
  {
    title: "Transportation Data Analysis",
    event: "NIT Calicut",
    year: "2022"
  },
  {
    title: "Quality Control in Roads",
    event: "IIT Roorkee",
    year: "2020"
  },
  {
    title: "Concrete Mix Design",
    event: "Wonder Cement",
    year: "2019"
  }
];

export const LEADERSHIP = {
  positions: [
    { role: "Technical Session Chair", event: "EASTS 2025 Conference", year: "2025" },
    { role: "Overall Coordinator", event: "2nd IBSR Conference 2024, IITKGP", year: "2024" },
    { role: "Overall Coordinator", event: "IBSR Conference 2023, IITKGP", year: "2023" },
    { role: "Dept. Social Media Head", event: "IIT Kharagpur", year: "2022-23" },
    { role: "Placement Representative", event: "IIT Roorkee", year: "2020-21" }
  ],
  conferences: [
    { role: "Coordinator", title: "IBSR 2023: Sustainable Societies", loc: "IITKGP" },
    { role: "Coordinator", title: "2nd IBSR 2024: Resilient Infrastructure", loc: "Kolkata" }
  ],
  reviewer: [
    "Transp. Res. Part A", 
    "Transp. Res. Part D", 
    "Transport Policy", 
    "RTBM", 
    "TRR (SAGE)", 
    "Transp. Dev. Econ."
  ],
  memberships: [
    "ASCE T&DI", "TRG India", "WCTR Society", "IATBR"
  ]
};

export const SKILLS: SkillCategory[] = [
  { category: "Programming", skills: "Python, React JS, Vercel, MongoDB, Git, JavaScript, HTML/CSS" },
  { category: "Geospatial", skills: "QGIS, Mapbox API, GraphHopper API, Spatial Data Mining, GeoPandas" },
  { category: "Analytics", skills: "Tableau, D3.js, Streamlit, Plotly, SPSS, Minitab, Excel" },
  { category: "Modeling", skills: "Machine Learning, R, Discrete Choice (Biogeme, NLOGIT), VISSIM, LaTeX" }
];

export const PUBLICATIONS: Publication[] = [
  // Journals
  { year: "2026", title: "Not all travellers think alike: Segmenting travel behaviour under air pollution exposure using a hybrid latent class and discrete choice approach", authors: "Meena, K. K., A.K. Goswami", venue: "Transportation Research Record (TRR)", type: "Journal", status: "In Review" },
  { year: "2025", title: "Beyond choice modelling: Bridging Econometric Theory and Deep Learning for Robust Mode Choice Prediction", authors: "Meena, K. K., A.K. Goswami", venue: "Transportation Research Part A: Policy and Practice", type: "Journal", status: "Submitted" },
  { year: "2025", title: "Dynamic Route Planning for Urban Green Mobility: Development of a Web Application Offering Sustainable Route Options to Commuters", authors: "Meena, K. K., A.K. Singh, A.K. Goswami", venue: "Transportation Research Record", type: "Journal", status: "Published", link: "https://doi.org/10.1177/03611981251331011" },
  { year: "2025", title: "Modeling bicycle choice behavior and its potential health impact: Case of first/last mile access to suburban rail", authors: "B.S. Manoj, Meena, K. K., H. Panchal, G. Sharma, A.K. Goswami", venue: "International Journal of Sustainable Transportation", type: "Journal", status: "Published" },
  { year: "2025", title: "A prioritization framework to identify key attributes of transit-oriented development (TOD) using multi-criteria decision-making (MCDM) approach: an Indian context", authors: "B.S. Manoj, Meena, K. K., A.K. Goswami", venue: "Sustainable Transport and Livability, vol. 2", type: "Journal", status: "Published" },
  { year: "2024", title: "A review of air pollution exposure impacts on travel behaviour and way forward", authors: "Meena, K. K., A.K. Goswami", venue: "Transport Policy, Elsevier", type: "Journal", status: "Published" },
  { year: "2024", title: "A machine learning approach for unraveling the influence of air quality awareness on travel behavior", authors: "Meena, K. K., D. Bairwa, A. Agarwal", venue: "Decision Analytics Journal, vol. 11", type: "Journal", status: "Published" },
  { year: "2023", title: "Perception of commuters towards air quality in Delhi", authors: "Meena, K. K., V. Singh, A. Agarwal", venue: "Journal of Transport & Health, vol. 31", type: "Journal", status: "Published" },
  { year: "2021", title: "Travellers’ exposure to air pollution: A systematic review and future directions", authors: "V. Singh, Meena, K. K., A. Agarwal", venue: "Urban Climate, vol. 38", type: "Journal", status: "Published" },
  
  // Conferences & Proceedings
  { year: "2026", title: "Not all travellers think alike: Segmenting travel behaviour under air pollution exposure", authors: "Meena, K. K., A.K. Goswami", venue: "TRB 2026 Annual Meeting, Washington, DC", type: "Conference", status: "Accepted" },
  { year: "2026", title: "A Hybrid Geostatistical and Deep Learning Framework for Urban Pollutant Concentration Prediction", authors: "C. Gupta, A. Amitabh, Meena, K. K., A.K. Goswami", venue: "COMSNETS 2026 (IEEE)", type: "Conference", status: "Accepted" },
  { year: "2026", title: "Developing an integrated walkability score using image-based feature extraction", authors: "A. Singh, Meena, K. K., G. Sharma, A.K. Goswami, S. Mishra", venue: "TRB 2026 Annual Meeting, Washington, DC", type: "Conference", status: "Accepted" },
  { year: "2025", title: "Dynamic route planning for urban green mobility", authors: "Meena, K. K., A.K. Singh, A.K. Goswami", venue: "CTRG-2023, SVNIT Surat, India", type: "Conference", status: "Published" },
  { year: "2025", title: "Assessing the air pollution exposure to school children", authors: "A. Sumbhate, Meena, K. K., A.K. Goswami", venue: "Proceedings of EASTS", type: "Conference", status: "Published" },
  { year: "2025", title: "A prioritization framework to identify key attributes of TOD", authors: "B.S. Manoj, Meena, K. K., A.K. Goswami", venue: "WSSTL-2025, IISc Bengaluru", type: "Conference", status: "Published" },
  { year: "2025", title: "Accessibility assessment of urban public transit to key facilities", authors: "R. Kodukulla, Meena, K. K., G. Sharma, A.K. Goswami", venue: "TIPCE, IIT Roorkee", type: "Conference", status: "Published" },
  { year: "2025", title: "Air pollution exposure among Kolkata’s auto-rickshaw drivers", authors: "S. Dasgupta, Meena, K. K., D. Majumdar, A.K. Goswami", venue: "Energies, AEEE India", type: "Conference", status: "Published" },
  { year: "2024", title: "Breathable modes to school: Assessing the air pollution exposure", authors: "A. Sumbhate, Meena, K. K., A.K. Goswami", venue: "52nd UAA Annual Meeting, Nashville, USA", type: "Conference", status: "Published" },
  { year: "2024", title: "Analysing user behaviour along dedicated bicycle facilities", authors: "P. Mohanty, Meena, K. K., A.K. Goswami", venue: "52nd UAA Annual Meeting, Nashville, USA", type: "Conference", status: "Published" },
  { year: "2024", title: "Assessing the willingness to bicycle for the first mile", authors: "B.S. Manoj, Meena, K. K., et al.", venue: "17th IATBR, Vienna, Austria", type: "Conference", status: "Published" },
  { year: "2024", title: "Impact of air pollution on informed decision-making for choice of a travel mode", authors: "Meena, K. K., R. Taneja, A. Agarwal", venue: "COMSNETS 2024 (IEEE)", type: "Conference", status: "Published" },
  { year: "2023", title: "A review of air pollution exposure impacts on travel behaviour", authors: "Meena, K. K., A.K. Goswami", venue: "16th WCTR, Montréal, Canada", type: "Conference", status: "Published" },
  { year: "2022", title: "On-road pollution exposure in multiple transport micro-environments", authors: "Meena, K. K., R. Kumar, A.K. Goswami", venue: "14th TPMDC, IIT Bombay, India", type: "Conference", status: "Published" },

  // Patents
  { year: "2025", title: "Personalized dynamic route planning system for sustainable urban mobility", authors: "Meena, K. K., A.K. Goswami", venue: "Indian Patent", type: "Patent", status: "In Process" },
];

export const AWARDS: Award[] = [
  { title: "Best Presentation Award, Research Scholar Day, IIT Kharagpur" },
  { title: "Best Poster Presentation, Cyber-Physical System Summit (CyPhySS 2023)" },
  { title: "Institute Travel Grant (TRB Annual Meeting, Washington D.C.)" },
  { title: "International Research Exchange Grant, University of Leeds, UK" },
  { title: "GATE Qualified (All India Rank 559), Civil Engineering, 2019" },
  { title: "MHRD Fellowship for PhD Research" },
  { title: "Winner at Regional level, National Children Science Congress (DST, India)" }
];

export const MAP_LOCATIONS: MapLocation[] = [
  { name: "IIT Kharagpur", lat: 22.3149, lng: 87.3105, base: true, type: 'domestic', event: "PhD Base" },
  { name: "IIT Roorkee", lat: 29.8543, lng: 77.8880, base: false, type: 'domestic', event: "M.Tech / Research" },
  { name: "Kota, India", lat: 25.2138, lng: 75.8648, base: false, type: 'domestic', event: "B.Tech" },
  { name: "Washington D.C.", lat: 38.9072, lng: -77.0369, base: false, type: 'intl', event: "TRB 2026" },
  { name: "Leeds, UK", lat: 53.8067, lng: -1.5550, base: false, type: 'intl', event: "Exchange Grant" },
  { name: "Vienna, Austria", lat: 48.2082, lng: 16.3738, base: false, type: 'intl', event: "IATBR 2024" },
  { name: "Montréal, Canada", lat: 45.5017, lng: -73.5673, base: false, type: 'intl', event: "WCTR 2023" },
  { name: "Nashville, USA", lat: 36.1627, lng: -86.7816, base: false, type: 'intl', event: "UAA 2024" },
  { name: "Surat, India", lat: 21.1702, lng: 72.8311, base: false, type: 'domestic', event: "CTRG 2023" },
  { name: "Bengaluru, India", lat: 12.9716, lng: 77.5946, base: false, type: 'domestic', event: "WSSTL 2025" },
  { name: "Mumbai, India", lat: 19.0760, lng: 72.8777, base: false, type: 'domestic', event: "TPMDC 2022" },
];

export const GALLERY_IMAGES = [];
