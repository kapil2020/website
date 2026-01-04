
import { Education, ResearchProject, Repository, Experience, Publication, SkillCategory, Award, MapLocation, Lecture } from './types';

export const PROFILE = {
  name: "Kapil Kumar Meena",
  title: "PhD Researcher | Sustainable Mobility",
  subtitle: "Decoding Urban Mobility",
  email: "kapil.meena@kgpian.iitkgp.ac.in",
  linkedin: "https://www.linkedin.com/in/kapilmeena/",
  github: "https://github.com/kapil2020",
  scholar: "https://scholar.google.com/citations?user=5jIAPTEAAAAJ&hl=en",
  website: "https://kapil2020.github.io/web",
  photoUrl: "https://github.com/kapil2020/web/blob/main/kp_1.png?raw=true", 
  summary: "I am a transportation researcher with 7+ years of experience in sustainable mobility, travel behavior analysis, and urban computing. My research focuses on developing robust technical frameworks and data-driven solutions to solve real-world urban mobility challenges. I bridge the gap between econometric rigor and engineering applications to decarbonize cities. My work has resulted in 15+ publications in top-tier venues, accumulating over 130 citations. Currently, as a PhD Researcher at IIT Kharagpur, I develop novel approaches using discrete choice models and machine learning to decipher complex travel decisions."
};

export const EDUCATION: Education[] = [
  {
    period: "2022–Present",
    degree: "PhD in Infrastructure Design & Management",
    institution: "IIT Kharagpur",
    location: "West Bengal, India",
    details: "Focus: Travel Behaviour, Micromobility Integration, and Urban Computing."
  },
  {
    period: "2021–2022",
    degree: "Research Consultant",
    institution: "WRI India",
    location: "Remote",
    details: "Focus: Electric Mobility & Commuter Exposure."
  },
  {
    period: "2019–2021",
    degree: "M.Tech in Transportation Engineering",
    institution: "IIT Roorkee",
    location: "Uttarakhand, India",
    details: "Thesis: Commuter Exposure to Air Pollution."
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
    title: "Air Quality Exposure",
    role: "Core Research",
    description: "Modeling the invisible: Quantifying how air quality impacts your travel decisions.",
    link: "https://www.sciencedirect.com/science/article/pii/S2212095521001310",
    linkText: "View Studies",
    tags: ["Exposure", "Health"],
    type: "Report"
  },
  {
    title: "Sustainable Routing",
    role: "Lead Developer",
    description: "From data to decision: The DRUM app for real-time, pollution-aware route planning.",
    link: "https://leap-routing-iitkgp.vercel.app/",
    linkText: "Demo App",
    tags: ["Web App", "Routing"],
    type: "Web App"
  },
  {
    title: "Travel Behavior Modeling",
    role: "Researcher",
    description: "Decoding decisions: Using discrete choice models to promote cycling and optimize urban development.",
    link: "https://survey-iitkgp.vercel.app/",
    linkText: "See the Survey",
    tags: ["DCM", "Behavior"],
    type: "Abstract"
  },
  {
    title: "Big Data Analysis",
    role: "Data Scientist",
    description: "Handling large-scale spatial and temporal datasets to uncover hidden mobility patterns and trends.",
    link: "https://kapil2020.github.io/cycling-dashboard/",
    linkText: "View Tools",
    tags: ["Big Data", "Analytics"],
    type: "Live"
  },
  {
    title: "Machine Learning",
    role: "ML Engineer",
    description: "Applying ML for predictive modeling, from landslide prediction to identifying travel behavior drivers.",
    link: "https://www.sciencedirect.com/science/article/pii/S2772662224000638",
    linkText: "See Projects",
    tags: ["AI", "Prediction"],
    type: "Project"
  },
  {
    title: "Active Mobility",
    role: "Researcher",
    description: "Analyzing and promoting walking and cycling through health impact assessment and choice modeling.",
    link: "https://www.tandfonline.com/doi/full/10.1080/15568318.2025.2572818",
    linkText: "See Papers",
    tags: ["Cycling", "Health"],
    type: "Abstract"
  }
];

export const REPOSITORIES: Repository[] = [
  {
    name: "DRUM-Web-App",
    description: "Source code for the Dynamic Route Planning for Urban Mobility (DRUM) web application, featured in The Hindu.",
    stars: 4,
    link: "https://github.com/orgs/clean-route/repositories"
  },
  {
    name: "Next day PM 2.5 Prediction",
    description: "Predicting next-day fine particulate matter (PM2.5) concentrations using Machine Learning techniques.",
    stars: 3,
    link: "https://kapil2020.github.io/global-PM-2.5-next-day-forecasting/"
  },
  {
    name: "Dynamic Travel Survey",
    description: "A Dynamic Custom Travel Survey with Real-Time analysis capabilities.",
    stars: 7,
    link: "https://github.com/kapil2020/react-frontend-kgp"
  },
  {
    name: "Routing Mobile App",
    description: "A modern UI routing mobile application for different route options.",
    stars: 0,
    link: "https://kapil2020.github.io/dummy-mobile-application/"
  },
  {
    name: "City Mode Share Dashboard",
    description: "A modern, interactive dashboard for visualizing and predicting cycling and motorcycle mode share.",
    stars: 2,
    link: "https://kapil2020.github.io/cycling-dashboard/"
  }
];

export const EXPERIENCE: Experience[] = [
  {
    period: "Nov 2021 – Mar 2022",
    role: "Research Consultant",
    organization: "World Resources Institute (WRI) India",
    location: "Remote",
    points: [
      "Analyzed inhaled dose and exposure for commuters inside vehicles vs. ambient conditions.",
      "Developed recommendations for deploying electric mobility solutions in Tier-2 cities."
    ]
  },
  {
    period: "2019–2023",
    role: "Teaching Assistant",
    organization: "IIT Kharagpur & IIT Roorkee",
    location: "India",
    points: [
      "Courses: Multimodal Urban Transport (NPTEL), Intersection Design, Engineering Drawing.",
      "Mentored students in laboratory sessions and simulation tools (VISSIM)."
    ]
  },
  {
    period: "2019–2025",
    role: "Expert Lectures",
    organization: "Various Institutions",
    location: "India",
    points: [
      "DRUM Talk, Google India (June 2025)",
      "Data Visualization with Tableau, Swastik Edustart",
      "Transportation Data Analysis, NIT Calicut"
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
  { category: "Programming", skills: "Python, R, JavaScript, ReactJS" },
  { category: "Data Analysis", skills: "Tableau, NLOGIT, SPSS, QGIS, MiniTab" },
  { category: "Tools", skills: "MySQL, MongoDB, LaTeX, JabRef" },
  { category: "Modeling", skills: "Machine Learning, Discrete Choice, VISSIM" }
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
  { year: "2024", title: "Impact of air pollution on informed decision-making for choice of a travel mode", authors: "Meena, K. K., R. Taneja, A. Agarwal", venue: "16th International Conference on COMmunication Systems & NETworkS (COMSNETS). IEEE", type: "Conference", status: "Published" },
  { year: "2023", title: "Perception of commuters towards air quality in Delhi", authors: "Meena, K. K., V. Singh, A. Agarwal", venue: "Journal of Transport & Health, vol. 31", type: "Journal", status: "Published" },
  { year: "2021", title: "Travellers’ exposure to air pollution: A systematic review and future directions", authors: "V. Singh, Meena, K. K., A. Agarwal", venue: "Urban Climate, vol. 38", type: "Journal", status: "Published" },
  
  // Conferences
  { year: "2026", title: "Not all travellers think alike: Segmenting travel behaviour under air pollution exposure", authors: "Meena, K. K., A.K. Goswami", venue: "TRB 2026 Annual Meeting", type: "Conference", status: "Accepted" },
  { year: "2026", title: "A Hybrid Geostatistical and Deep Learning Framework for Urban Pollutant Concentration Prediction", authors: "C. Gupta, A. Amitabh, Meena, K. K., A.K. Goswami", venue: "COMSNETS 2026 (IEEE)", type: "Conference", status: "Accepted" },
  { year: "2026", title: "Developing an integrated walkability score using image-based feature extraction", authors: "A. Singh, Meena, K. K., G. Sharma, A.K. Goswami, S. Mishra", venue: "TRB 2026 Annual Meeting", type: "Conference", status: "Accepted" },
  { year: "2025", title: "Dynamic route planning for urban green mobility", authors: "Meena, K. K., A.K. Singh, A.K. Goswami", venue: "CTRG-2023, SVNIT Surat", type: "Conference", status: "Published" },
  { year: "2025", title: "Assessing the air pollution exposure to school children", authors: "A. Sumbhate, Meena, K. K., A.K. Goswami", venue: "Proceedings of EASTS", type: "Conference", status: "Published" },
  
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
  { name: "Jakarta, Indonesia", lat: -6.2088, lng: 106.8456, base: false, type: 'intl', event: "EASTS 2025" },
  { name: "Surat, India", lat: 21.1702, lng: 72.8311, base: false, type: 'domestic', event: "CTRG 2023" },
  { name: "Bangalore, India", lat: 12.9716, lng: 77.5946, base: false, type: 'domestic', event: "WSSTL" }
];

export const GALLERY_IMAGES = [];
