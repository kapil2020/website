import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, Linkedin, GraduationCap, Globe, 
  ExternalLink, Code2, 
  Menu, X, Sun, Moon,
  Trophy, Mail, ArrowRight,
  Download, Zap, Brain, Shield, BookOpen, 
  Wind, Navigation, CheckCircle2,
  Newspaper, MapPin, Briefcase, Terminal, Database,
  BarChart3, Train, Building2, MousePointer2, FileText, MonitorPlay, FolderGit2,
  Activity, Mic, Presentation, Gavel, Medal, FileCheck, Quote, Leaf, User, Star,
  ZoomIn, Palette, Bike, Cpu, CloudRain, Layers,
  TrendingUp, Users, Library, Mic2, Smartphone, Layout, Target, Lightbulb,
  PenTool, Footprints, ChevronUp, Map, Plane, Crown, Sparkles
} from 'lucide-react';
import Background3D from './components/Background3D';
import GlobalGlobe from './components/GlobalGlobe';
import Section from './components/Section';
import { 
  PROFILE, EDUCATION, RESEARCH_PROJECTS, REPOSITORIES, SKILLS,
  EXPERIENCE, PUBLICATIONS, AWARDS, LEADERSHIP, EXPERT_LECTURES
} from './constants';

const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); 
  const [accentColor, setAccentColor] = useState('#2563eb'); 
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [pubTab, setPubTab] = useState<'journal' | 'conference'>('journal');
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--color-accent', accentColor);
  }, [accentColor]);

  // Scroll listener for header transformation
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll Spy to detect active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        rootMargin: '-20% 0px -50% 0px', // Trigger when section is near center
        threshold: 0.1 
      }
    );

    const sections = document.querySelectorAll('section');
    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const cards = document.getElementsByClassName('spotlight-card');
    for (const card of cards as any) {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  const cvLink = "https://github.com/kapil2020/web/blob/main/CV_GitHub.pdf?raw=true";
  const journalPubs = PUBLICATIONS.filter(p => p.type === 'Journal');
  const confPubs = PUBLICATIONS.filter(p => p.type === 'Conference');
  const patentPubs = PUBLICATIONS.filter(p => p.type === 'Patent');
  const googleTalk = EXPERT_LECTURES[0]; 

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Research', id: 'research' },
    { name: 'Publications', id: 'publications' },
    { name: 'Projects', id: 'projects' },
    { name: 'Experience', id: 'experience' },
    { name: 'Awards', id: 'awards' },
    { name: 'Skills', id: 'skills' },
  ];

  const colors = [
    { name: 'Google Blue', value: '#4285F4' },
    { name: 'Google Green', value: '#34A853' },
    { name: 'Google Red', value: '#EA4335' },
    { name: 'Google Yellow', value: '#FBBC05' },
    { name: 'Purple', value: '#7c3aed' },
    { name: 'Teal', value: '#0d9488' },
  ];

  const getResearchStyle = (title: string) => {
    if (title.includes("Air Quality")) return { icon: <Wind size={32} />, bg: "from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20", text: "text-cyan-600 dark:text-cyan-400", border: "border-cyan-100 dark:border-cyan-800" };
    if (title.includes("Sustainable Routing")) return { icon: <Navigation size={32} />, bg: "from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-100 dark:border-emerald-800" };
    if (title.includes("Travel Behavior")) return { icon: <User size={32} />, bg: "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20", text: "text-purple-600 dark:text-purple-400", border: "border-purple-100 dark:border-purple-800" };
    if (title.includes("Big Data")) return { icon: <Database size={32} />, bg: "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20", text: "text-orange-600 dark:text-orange-400", border: "border-orange-100 dark:border-orange-800" };
    if (title.includes("Machine Learning")) return { icon: <Cpu size={32} />, bg: "from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20", text: "text-red-600 dark:text-red-400", border: "border-red-100 dark:border-red-800" };
    if (title.includes("Active Mobility")) return { icon: <Bike size={32} />, bg: "from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20", text: "text-teal-600 dark:text-teal-400", border: "border-teal-100 dark:border-teal-800" };
    
    return { icon: <Layers size={32} />, bg: "from-slate-50 to-gray-50", text: "text-slate-600", border: "border-slate-100" };
  };

  const openLightbox = (img: string) => setLightboxImage(img);
  const closeLightbox = () => setLightboxImage(null);

  const awardColors = [
      "from-yellow-400 to-orange-500",
      "from-blue-400 to-cyan-500",
      "from-purple-400 to-pink-500",
      "from-emerald-400 to-teal-500",
      "from-red-400 to-rose-500",
      "from-indigo-400 to-violet-500",
      "from-amber-400 to-orange-500"
  ];

  return (
    <div onMouseMove={handleMouseMove} className="relative min-h-screen font-serif selection:bg-accent/30 overflow-x-hidden bg-background text-text transition-colors duration-500 flex flex-col">
      {/* 3D Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60">
        <Background3D darkMode={darkMode} accentColor={accentColor} />
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
            onClick={closeLightbox}
          >
             <button className="absolute top-6 right-6 text-white hover:text-red-500 transition-colors bg-white/10 rounded-full p-2 z-[210]">
                <X size={32} />
             </button>
             <motion.img 
                initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
                src={lightboxImage} 
                className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain"
                onClick={(e) => e.stopPropagation()} 
             />
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODERN STICKY HEADER - FIXED OVERLAP ISSUE */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
          scrolled 
            ? 'py-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm' 
            : 'py-6 bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between gap-4">
            
            {/* Left: Modern Logo - Added shrink-0 and whitespace-nowrap to prevent squashing */}
            <a href="#home" className="flex items-center gap-3 group z-[60] shrink-0" aria-label="Go to Home">
               <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg transition-transform duration-500 group-hover:rotate-12 bg-gradient-to-br from-blue-600 to-purple-600`}>
                 K
               </div>
               <div className="flex flex-col whitespace-nowrap">
                 <span className="font-bold text-lg leading-none tracking-tight">Kapil Meena</span>
                 <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-bold mt-0.5">PhD Researcher</span>
               </div>
            </a>
            
            {/* Center: Smart Floating Navigation (Desktop) - Changed from absolute to flex-1 justify-center */}
            <div 
              className={`hidden lg:flex items-center flex-1 justify-center transition-all duration-500`}
            >
              <div className={`flex items-center gap-1 bg-white/60 dark:bg-slate-900/60 backdrop-blur-lg border border-white/20 dark:border-white/10 p-1.5 rounded-full shadow-lg ${
                scrolled ? 'scale-100' : 'scale-105'
              }`}>
                {navLinks.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a 
                      key={item.name} 
                      href={`#${item.id}`} 
                      onClick={() => setActiveSection(item.id)}
                      className={`relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors hover:text-primary z-10 ${isActive ? 'text-primary' : 'text-text-muted'}`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-white dark:bg-slate-800 rounded-full shadow-sm"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10">{item.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
            
            {/* Right: Controls & Actions - Added shrink-0 */}
            <div className="flex items-center gap-3 z-[60] shrink-0">
                {/* Color Picker */}
                <div className="relative group hidden sm:block">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setShowColorPicker(!showColorPicker); }}
                        className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-text border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                        title="Theme Color"
                        aria-label="Change Color Theme"
                    >
                        <Palette size={18} />
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full ring-2 ring-white dark:ring-black" style={{backgroundColor: accentColor}}></span>
                    </button>
                    <AnimatePresence>
                        {showColorPicker && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }} 
                                animate={{ opacity: 1, y: 0, scale: 1 }} 
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full right-0 mt-4 p-4 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700 grid grid-cols-3 gap-3 w-48 z-[100]"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {colors.map(c => (
                                    <button 
                                        key={c.name}
                                        onClick={() => { setAccentColor(c.value); setShowColorPicker(false); }}
                                        className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-110 transition-transform relative ring-offset-2 ring-offset-white dark:ring-offset-slate-900"
                                        style={{ backgroundColor: c.value }}
                                        title={c.name}
                                    />
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Dark Mode Toggle */}
                <button 
                  onClick={() => setDarkMode(!darkMode)} 
                  className="p-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-text border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  aria-label="Toggle Dark Mode"
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>

                {/* CV Button */}
                <a 
                  href={cvLink} 
                  target="_blank" 
                  className="hidden sm:flex items-center gap-2 px-6 py-2.5 bg-primary text-white dark:bg-white dark:text-black rounded-full text-[11px] font-bold uppercase tracking-widest hover:scale-105 hover:shadow-lg active:scale-95 transition-all shadow-md"
                >
                  <Download size={14} /> CV
                </a>

                {/* Mobile Menu Toggle */}
                <button 
                  onClick={() => setMenuOpen(!menuOpen)} 
                  className="lg:hidden p-2.5 rounded-full bg-slate-100 dark:bg-slate-800 text-text hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  aria-label="Toggle Menu"
                >
                    {menuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay - Redesigned as a Slide-Down Drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: '-100%' }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: '-100%' }} 
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[99] bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl flex flex-col pt-32 px-8"
          >
            <div className="w-full max-w-lg mx-auto space-y-8 relative">
              
              <div className="flex flex-col gap-2">
                {navLinks.map((link, i) => (
                  <motion.a 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 + 0.1 }}
                    key={link.name} 
                    href={`#${link.id}`} 
                    onClick={() => setMenuOpen(false)} 
                    className="flex items-center justify-between group py-4 border-b border-slate-100 dark:border-slate-800"
                  >
                    <span className="text-3xl font-bold text-text-muted group-hover:text-primary transition-colors">{link.name}</span>
                    <ArrowRight className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all text-accent" />
                  </motion.a>
                ))}
              </div>

              {/* Mobile Color Picker */}
              <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.5 }}
                 className="flex justify-between items-center py-6"
              >
                 <span className="text-sm font-bold uppercase tracking-widest text-text-muted">Theme Color</span>
                 <div className="flex gap-3">
                    {colors.slice(0, 5).map(c => (
                        <button 
                            key={c.name}
                            onClick={() => setAccentColor(c.value)}
                            className={`w-8 h-8 rounded-full border border-slate-200 shadow-sm ${accentColor === c.value ? 'scale-125 ring-2 ring-offset-2' : ''}`}
                            style={{ backgroundColor: c.value }}
                        />
                    ))}
                 </div>
              </motion.div>

              <motion.a 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                href={cvLink} 
                className="flex w-full justify-center items-center gap-2 px-8 py-5 bg-primary text-white dark:text-slate-950 rounded-2xl font-bold text-lg shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Download size={20}/> Download CV
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-32 space-y-24 flex-grow">
        
        {/* 1. HERO SECTION */}
        <section id="home" className="min-h-[85vh] flex items-center justify-center px-6 relative overflow-visible">
           <div className="max-w-7xl w-full grid lg:grid-cols-12 gap-12 items-center">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="lg:col-span-7 space-y-8 order-2 lg:order-1 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 text-xs font-bold uppercase tracking-widest border border-blue-100 dark:border-blue-800 mx-auto lg:mx-0 shadow-sm">
                     <Zap size={14} className="text-yellow-500 animate-pulse" /> Open to Post-Doc Opportunities • 2026
                  </div>
                  <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-[6.5rem] font-bold tracking-tight text-primary leading-[1.1] drop-shadow-sm">
                     Decoding <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 italic pb-2">Urban Mobility.</span>
                  </h1>
                  
                  <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 justify-center lg:justify-start text-sm md:text-base font-bold text-text-muted">
                     <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 dark:bg-black/20 backdrop-blur border border-slate-200 dark:border-slate-800 shadow-sm hover:scale-105 transition-transform"><GraduationCap size={18} className="text-accent" /> PhD Candidate, IIT Kharagpur</span>
                     <span className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 dark:bg-black/20 backdrop-blur border border-slate-200 dark:border-slate-800 shadow-sm hover:scale-105 transition-transform"><CheckCircle2 size={18} className="text-green-500" /> MTech, IIT Roorkee</span>
                  </div>

                  <p className="text-xl font-serif text-text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
                     Bridging <span className="text-primary font-bold bg-blue-50/50 px-1 rounded">econometric rigor</span> with <span className="text-primary font-bold bg-purple-50/50 px-1 rounded">data science</span> to build sustainable cities.
                  </p>

                  {/* USP: THE HINDU FEATURE */}
                  <div className="mt-8 flex justify-center lg:justify-start">
                     <div className="relative premium-glass rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 group max-w-lg border-l-4 border-l-red-600 flex items-center pr-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="flex items-center gap-5 p-4 relative z-10 w-full">
                           <div 
                              className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden border border-black/5 bg-white shadow-md cursor-zoom-in relative group/img"
                              onClick={() => openLightbox("https://github.com/kapil2020/web/blob/main/The%20HindU_8%20June_github.jpg?raw=true")}
                           >
                              <img 
                                 src="https://github.com/kapil2020/web/blob/main/The%20HindU_8%20June_github.jpg?raw=true" 
                                 alt="The Hindu Article" 
                                 className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-110"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                 <ZoomIn className="text-white" size={24} />
                              </div>
                           </div>
                           <div className="text-left flex-grow">
                              <div className="flex items-center gap-2 mb-2">
                                 <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-red-600 px-2 py-0.5 rounded-md shadow-sm">The Hindu</span>
                                 <span className="text-[10px] font-bold text-text-muted">Featured Article</span>
                              </div>
                              <a href="https://www.thehindu.com/sci-tech/energy-and-environment/iit-kgp-app-helps-commuters-pick-greener-routes-on-the-road/article69644558.ece" target="_blank" className="font-bold text-primary text-lg leading-tight hover:text-red-600 transition-colors block">
                                 "IIT-KGP app helps commuters pick greener routes"
                              </a>
                           </div>
                           <ExternalLink size={16} className="text-text-muted opacity-50 transition-opacity" />
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-6">
                     <a href="#research" className="px-8 py-4 bg-primary text-white dark:text-slate-950 rounded-2xl font-bold hover:bg-accent hover:text-white dark:hover:text-white transition-all shadow-xl shadow-primary/20 flex items-center gap-2 hover:scale-105 active:scale-95">
                        <Brain size={18} /> Explore Research
                     </a>
                     <a href="#contact" className="px-8 py-4 bg-white/80 dark:bg-white/10 backdrop-blur text-primary dark:text-white border border-primary/10 rounded-2xl font-bold hover:border-accent hover:text-accent transition-colors flex items-center gap-2 hover:shadow-lg">
                        <Mail size={18} /> Contact Me
                     </a>
                  </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
                  <div className="relative w-80 h-80 md:w-96 md:h-96 group perspective-1000">
                     <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 rounded-[3rem] blur-[80px] opacity-40 animate-pulse"></div>
                     <img 
                        src={PROFILE.photoUrl} 
                        alt="Kapil Meena" 
                        className="relative w-full h-full object-cover rounded-[3rem] border-8 border-white dark:border-slate-800 shadow-2xl z-10 transform transition-transform duration-700 hover:rotate-2 hover:scale-105"
                     />
                     {/* Floating Cards */}
                     <div className="absolute top-4 -left-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-white/20 px-5 py-4 rounded-3xl shadow-xl animate-float flex items-center gap-3 z-20">
                        <div className="p-2.5 bg-blue-100 rounded-2xl text-blue-600"><Train size={24} /></div>
                        <div>
                            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Focus</div>
                            <div className="text-sm font-bold text-primary">Transport Systems</div>
                        </div>
                     </div>
                     <div className="absolute bottom-12 -right-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur border border-white/20 px-5 py-4 rounded-3xl shadow-xl animate-float flex items-center gap-3 z-20" style={{animationDelay: '2s'}}>
                        <div className="p-2.5 bg-green-100 rounded-2xl text-green-600"><Database size={24} /></div>
                        <div>
                            <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Expertise</div>
                            <div className="text-sm font-bold text-primary">Data Science</div>
                        </div>
                     </div>
                  </div>
              </motion.div>
           </div>
        </section>

        {/* 2. ABOUT ME - OPTIMIZED BENTO GRID */}
        <Section id="about" className="pt-0">
          <div className="relative">
             {/* Subtle Watermark */}
             <div className="absolute -top-12 left-0 right-0 text-center pointer-events-none select-none z-0">
                 <h2 className="text-[5rem] md:text-[8rem] font-black text-slate-900/5 dark:text-white/5 tracking-tighter leading-none">ABOUT</h2>
             </div>

             <div className="grid md:grid-cols-12 gap-6 relative z-10 mt-12">
                
                {/* 2.1 Narrative Column (7 Cols) - Combined Protocol & Interests */}
                <motion.div 
                    initial={{ x: -20, opacity: 0 }} 
                    whileInView={{ x: 0, opacity: 1 }}
                    className="md:col-span-7 flex flex-col gap-6"
                >
                    <div className="premium-glass p-8 md:p-10 rounded-[2.5rem] relative overflow-hidden h-full flex flex-col">
                        {/* Header */}
                        <div className="relative z-10 mb-6">
                            <h2 className="text-4xl md:text-5xl font-bold">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">About Me</span>
                            </h2>
                        </div>
                        
                        {/* Bio Text */}
                        <div className="prose prose-lg dark:prose-invert font-serif text-text-muted leading-relaxed space-y-5 mb-8">
                            <p className="text-xl md:text-2xl text-primary font-medium leading-relaxed">
                                I am a transportation researcher with <strong className="text-blue-600 dark:text-blue-400">7+ years of experience</strong> in sustainable mobility, travel behavior analysis, and learning-based decision-making for complex urban systems.
                            </p>
                            <p className="text-lg">
                                My core philosophy lies in decoding human decisions. By understanding human behavior through <a href="#skills" className="text-accent font-bold hover:underline decoration-2 underline-offset-4 cursor-pointer">Discrete Choice Modeling</a> and <a href="#skills" className="text-accent font-bold hover:underline decoration-2 underline-offset-4 cursor-pointer">Machine Learning</a>, I design transport systems that are not only efficient but also equitable and low-carbon.
                            </p>
                        </div>

                        {/* 4-Stage Protocol Vis */}
                        <div className="bg-slate-50 dark:bg-black/20 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 mb-8">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted mb-4">My 4-Stage Protocol</div>
                            <div className="flex flex-wrap items-center justify-between gap-4 font-bold text-lg">
                                <span className="text-slate-400 flex items-center gap-2"><BookOpen size={18}/> Read</span>
                                <ArrowRight size={16} className="text-slate-300" />
                                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2"><Brain size={18}/> Learn</span>
                                <ArrowRight size={16} className="text-slate-300" />
                                <span className="text-primary flex items-center gap-2"><Code2 size={18}/> Code</span>
                                <ArrowRight size={16} className="text-slate-300" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-600 flex items-center gap-2"><Zap size={18} className="text-accent"/> Deploy</span>
                            </div>
                        </div>

                        {/* Interests / 5-9 */}
                        <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800">
                             <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                    <span className="opacity-50">9-5 Office</span>
                                    <ArrowRight className="text-text-muted" size={16} />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-600">5-9 Passion</span>
                                </h3>
                             </div>
                             <div className="flex flex-wrap gap-3">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-100 dark:border-blue-800 shadow-sm text-sm font-bold"><PenTool size={16} /> Writing Blogs</div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-100 dark:border-red-800 shadow-sm text-sm font-bold"><Footprints size={16} /> Running</div>
                                <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-100 dark:border-yellow-800 shadow-sm text-sm font-bold"><Bike size={16} /> Cycling</div>
                             </div>
                        </div>
                    </div>
                </motion.div>

                {/* 2.2 Dashboard Column (5 Cols) - Stats & Timeline */}
                <div className="md:col-span-5 flex flex-col gap-6">
                    
                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                       <motion.div whileHover={{ y: -5 }} className="bg-surface border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm text-center">
                           <TrendingUp size={24} className="text-blue-500 mb-2 mx-auto" />
                           <div className="text-3xl font-bold text-primary">130+</div>
                           <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Citations</div>
                       </motion.div>

                       <motion.div whileHover={{ y: -5 }} className="bg-surface border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm text-center">
                           <Users size={24} className="text-green-500 mb-2 mx-auto" />
                           <div className="text-3xl font-bold text-primary">7+</div>
                           <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Years Exp</div>
                       </motion.div>

                       <motion.div whileHover={{ y: -5 }} className="bg-surface border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm text-center">
                            <Library size={24} className="text-purple-500 mb-2 mx-auto" />
                            <div className="text-3xl font-bold text-primary">15+</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Publications</div>
                       </motion.div>

                       <motion.div whileHover={{ y: -5 }} className="bg-surface border border-slate-200 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm text-center">
                           <Mic2 size={24} className="text-orange-500 mb-2 mx-auto" />
                           <div className="text-3xl font-bold text-primary">13+</div>
                           <div className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Conferences</div>
                       </motion.div>
                    </div>

                    {/* Compact Vertical Timeline */}
                    <div className="premium-glass p-8 rounded-[2.5rem] flex-grow flex flex-col">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Activity size={20} className="text-accent"/> Academic Journey</h3>
                        <div className="space-y-0 relative flex-grow flex flex-col justify-center">
                             {/* Line */}
                             <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700"></div>

                             {/* Item 1 */}
                             <div className="relative pl-12 pb-8 group">
                                 <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm z-10"><GraduationCap size={16}/></div>
                                 <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-0.5">2022 - Present</div>
                                 <div className="text-lg font-bold text-primary leading-tight">PhD Candidate</div>
                                 <div className="text-sm font-bold text-text-muted">IIT Kharagpur</div>
                             </div>

                             {/* Item 2 */}
                             <div className="relative pl-12 pb-8 group">
                                 <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm z-10"><BookOpen size={16}/></div>
                                 <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-0.5">2019 - 2021</div>
                                 <div className="text-lg font-bold text-primary leading-tight">M.Tech</div>
                                 <div className="text-sm font-bold text-text-muted">IIT Roorkee</div>
                             </div>

                             {/* Item 3 */}
                             <div className="relative pl-12 group">
                                 <div className="absolute left-0 top-1 w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center border-4 border-white dark:border-slate-900 shadow-sm z-10"><Briefcase size={16}/></div>
                                 <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-0.5">2021 - 2022</div>
                                 <div className="text-lg font-bold text-primary leading-tight">Consultant</div>
                                 <div className="text-sm font-bold text-text-muted">WRI India</div>
                             </div>
                        </div>
                    </div>

                </div>
             </div>
          </div>
        </Section>

        {/* 3. RESEARCH AREAS - DYNAMIC GRID */}
        <Section id="research">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Research Areas</h2>
              <p className="text-xl text-text-muted font-serif italic max-w-2xl mx-auto">
                 Decoding complex mobility choices for greener, healthier cities.
              </p>
           </div>
           
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {RESEARCH_PROJECTS.map((proj, i) => {
                const style = getResearchStyle(proj.title);
                return (
                  <div key={i} className={`group relative p-8 rounded-[2.5rem] transition-all duration-300 flex flex-col h-full shadow-lg hover:shadow-2xl hover:-translate-y-2 bg-gradient-to-br ${style.bg} border ${style.border}`}>
                     <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 rounded-2xl shadow-sm flex items-center justify-center bg-white dark:bg-black/20 ${style.text} group-hover:scale-110 transition-transform`}>
                           {style.icon}
                        </div>
                        {proj.type && (
                            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase border bg-white/50 dark:bg-black/10 backdrop-blur-sm">
                              {proj.type}
                            </span>
                        )}
                     </div>
                     <h4 className={`text-2xl font-bold mb-3 ${style.text}`}>{proj.title}</h4>
                     <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed text-sm flex-grow font-serif">{proj.description}</p>
                     
                     <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/5">
                       {proj.link && (
                          <a href={proj.link} target="_blank" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/80 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 text-xs font-bold uppercase tracking-widest transition-all shadow-sm w-full justify-center group-hover:shadow-md">
                            {proj.linkText || 'View Details'} <ArrowRight size={14} />
                          </a>
                        )}
                     </div>
                  </div>
                );
              })}
           </div>
        </Section>

        {/* 4. PUBLICATIONS */}
        <Section id="publications" className="bg-surface/30">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                 <h2 className="text-4xl md:text-5xl font-bold mb-4">Publications</h2>
                 <p className="text-xl text-text-muted font-serif italic">Verified entries from TRR, Transport Policy, Urban Climate, etc.</p>
              </div>
              <div className="flex bg-white dark:bg-slate-900 rounded-xl p-1.5 border border-slate-200 dark:border-slate-800 shadow-sm">
                 <button onClick={() => setPubTab('journal')} className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${pubTab === 'journal' ? 'bg-primary text-white dark:text-slate-950 shadow-lg' : 'text-text-muted hover:text-primary hover:bg-slate-50'}`}>Journals</button>
                 <button onClick={() => setPubTab('conference')} className={`px-8 py-3 rounded-lg text-sm font-bold transition-all ${pubTab === 'conference' ? 'bg-primary text-white dark:text-slate-950 shadow-lg' : 'text-text-muted hover:text-primary hover:bg-slate-50'}`}>Conferences</button>
              </div>
           </div>

           <div className="space-y-6 font-serif">
              {(pubTab === 'journal' ? journalPubs : confPubs).map((pub, i) => (
                 <div key={i} className="premium-glass p-8 rounded-3xl flex flex-col md:flex-row gap-8 items-start border-l-4 border-l-transparent hover:border-l-accent transition-all group hover:bg-white/80 dark:hover:bg-slate-800/80">
                    <div className="shrink-0 pt-1 flex flex-col items-center min-w-[80px]">
                       <span className="text-4xl font-bold text-slate-300 dark:text-slate-700">{pub.year}</span>
                    </div>
                    <div className="flex-grow">
                       <h4 className="text-xl font-bold text-primary mb-3 leading-snug group-hover:text-accent transition-colors">{pub.title}</h4>
                       <div className="text-text-muted italic mb-4 text-sm border-l-2 border-slate-200 pl-3">{pub.authors}</div>
                       <div className="flex flex-wrap items-center gap-3">
                          <span className="px-3 py-1.5 rounded-lg bg-surface border border-slate-200 dark:border-slate-700 text-xs font-bold uppercase tracking-wider text-text-muted">
                             {pub.venue}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${pub.status?.includes('Published') ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                             {pub.status}
                          </span>
                          {pub.link ? (
                             <a href={pub.link} target="_blank" className="text-xs font-bold text-white bg-accent hover:bg-accent/80 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg shadow-md hover:shadow-lg">
                                DOI <ExternalLink size={12} />
                             </a>
                          ) : (
                             <a href={PROFILE.scholar} target="_blank" className="text-xs font-bold text-primary dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 px-3 py-1.5 rounded-lg">
                                Google Scholar <ExternalLink size={12} />
                             </a>
                          )}
                       </div>
                    </div>
                 </div>
              ))}
           </div>
           
           {/* Global Conference Collage - FULL IMAGE DISPLAY */}
           <div className="mt-20">
               <div className="text-center mb-10">
                   <h3 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3"><Globe className="text-blue-500" /> Global Impact</h3>
                   <p className="text-text-muted text-lg max-w-2xl mx-auto">Disseminating research findings at premier international venues including TRB (Washington D.C.), IATBR (Vienna), and WCTR (Montreal).</p>
               </div>
               <div 
                 className="relative w-full max-w-6xl mx-auto rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl group bg-white dark:bg-black/50 cursor-zoom-in"
                 onClick={() => openLightbox("https://github.com/kapil2020/web/blob/main/conference_github.png?raw=true")}
               >
                  {/* Full Image Display - No Cropping */}
                  <img 
                      src="https://github.com/kapil2020/web/blob/main/conference_github.png?raw=true" 
                      alt="Global Conferences Collage" 
                      className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                  />
                  <div className="absolute top-4 right-4 bg-black/60 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn size={14} /> Click to Expand
                  </div>
               </div>
           </div>
           
           {/* Green Patents Section */}
           <div className="mt-24">
             <h3 className="text-3xl font-bold mb-8 flex items-center gap-3"><Leaf className="text-emerald-500" /> Patents</h3>
             <div className="bg-emerald-50/80 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-[2.5rem] p-10 md:p-14 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none">
                    <Shield size={180} className="text-emerald-600" />
                </div>
                <div className="relative z-10 grid gap-10">
                    {patentPubs.map((p, i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-6 items-start border-b border-emerald-200/50 last:border-0 pb-8 last:pb-0">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold shrink-0 font-sans shadow-sm">
                             {i+1}
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-3">{p.title}</h4>
                            <div className="flex flex-wrap gap-4 text-sm font-medium text-emerald-800 dark:text-emerald-300 font-serif items-center">
                                <span>{p.authors}</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                                <span>{p.venue}</span>
                                <span className="uppercase tracking-widest font-bold text-[10px] bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full font-sans shadow-sm">{p.status}</span>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
             </div>
          </div>
        </Section>

        {/* 5. OPEN SOURCE REPOS - UPGRADED GLASS STYLE */}
        <Section id="projects">
           <div className="text-center mb-10 pt-10 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-2xl font-bold flex items-center justify-center gap-3"><Github className="text-text-muted"/> Open Source Repositories</h3>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8">
              {REPOSITORIES.map((repo, i) => {
                  // Determine icon and color based on index or content for variety
                  let Icon = Code2;
                  let colorClass = "from-blue-500 to-cyan-500";
                  if(repo.name.toLowerCase().includes('app') || repo.name.toLowerCase().includes('mobile')) {
                      Icon = Smartphone;
                      colorClass = "from-purple-500 to-pink-500";
                  } else if (repo.name.toLowerCase().includes('dashboard') || repo.name.toLowerCase().includes('analysis')) {
                      Icon = Layout;
                      colorClass = "from-orange-500 to-yellow-500";
                  } else if (repo.name.toLowerCase().includes('prediction') || repo.name.toLowerCase().includes('ml')) {
                      Icon = Terminal;
                      colorClass = "from-green-500 to-emerald-500";
                  }

                  return (
                 <div key={i} className="premium-glass p-8 rounded-[2rem] flex flex-col hover:border-accent/50 transition-all hover:-translate-y-2 group">
                    <div className="flex justify-between items-start mb-6">
                       <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white shadow-lg`}>
                            <Icon size={24} />
                       </div>
                       <div className="flex items-center gap-1 text-xs font-bold bg-white dark:bg-black/20 text-text-muted px-3 py-1 rounded-full border border-black/5 dark:border-white/10 shadow-sm">
                          <Star size={12} fill="currentColor" className="text-yellow-400" /> {repo.stars}
                       </div>
                    </div>
                    
                    <h3 className="font-bold text-xl text-primary mb-3 group-hover:text-accent transition-colors">{repo.name}</h3>
                    <p className="text-text-muted text-sm font-serif leading-relaxed mb-6 flex-grow line-clamp-3">{repo.description}</p>
                    
                    <a href={repo.link} target="_blank" className="mt-auto w-full py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-accent hover:text-white transition-all text-xs font-bold uppercase tracking-widest text-center flex items-center justify-center gap-2">
                       View Code <ArrowRight size={14} />
                    </a>
                 </div>
              )})}
           </div>
        </Section>

        {/* 6. EXPERIENCE (Grid Layout) */}
        <Section id="experience" className="bg-surface/30">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Professional History</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {EXPERIENCE.map((exp, i) => (
                 <div key={i} className="premium-glass p-8 rounded-[2rem] hover:shadow-xl transition-shadow relative overflow-hidden group flex flex-col h-full">
                    <div className="flex justify-between items-start mb-6">
                        <span className={`inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${i===0?'bg-pink-50 text-pink-600':i===1?'bg-blue-50 text-blue-600':'bg-purple-50 text-purple-600'}`}>{exp.period}</span>
                        <div className={`p-3 rounded-xl text-white shadow-lg ${i===0?'bg-pink-500':i===1?'bg-blue-500':'bg-purple-500'}`}>
                             {i === 0 ? <Building2 size={20} /> : i === 1 ? <Presentation size={20} /> : <Mic size={20} />}
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-primary leading-tight mb-1">{exp.role}</h3>
                    <p className="text-sm font-bold text-text-muted mb-4">{exp.organization}</p>
                    
                    <ul className="space-y-3 text-text-muted font-serif text-sm flex-grow">
                        {exp.points.map((pt, j) => (
                            <li key={j} className="flex items-start gap-3">
                            <CheckCircle2 size={16} className="mt-0.5 text-accent/50 shrink-0" />
                            {pt}
                            </li>
                        ))}
                    </ul>
                 </div>
              ))}
           </div>
        </Section>

        {/* 7. AWARDS - COLORFUL & DYNAMIC */}
        <Section id="awards">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Awards & Honors</h2>
              <p className="text-xl text-text-muted font-serif italic max-w-2xl mx-auto">
                 Recognition for research excellence and academic achievements.
              </p>
           </div>
           
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {AWARDS.map((a, i) => {
                 let Icon = Trophy;
                 let color = "text-yellow-500";
                 let bg = "bg-yellow-50 dark:bg-yellow-900/20";
                 let border = "border-yellow-200 dark:border-yellow-800";
                 
                 const titleLower = a.title.toLowerCase();
                 
                 if (titleLower.includes("presentation")) {
                    Icon = Presentation;
                    color = "text-blue-500";
                    bg = "bg-blue-50 dark:bg-blue-900/20";
                    border = "border-blue-200 dark:border-blue-800";
                 } else if (titleLower.includes("poster")) {
                    Icon = Layout;
                    color = "text-pink-500";
                    bg = "bg-pink-50 dark:bg-pink-900/20";
                    border = "border-pink-200 dark:border-pink-800";
                 } else if (titleLower.includes("grant") || titleLower.includes("travel")) {
                    Icon = Plane; 
                    color = "text-green-500";
                    bg = "bg-green-50 dark:bg-green-900/20";
                    border = "border-green-200 dark:border-green-800";
                 } else if (titleLower.includes("gate")) {
                    Icon = BookOpen;
                    color = "text-purple-500";
                    bg = "bg-purple-50 dark:bg-purple-900/20";
                    border = "border-purple-200 dark:border-purple-800";
                 } else if (titleLower.includes("fellowship")) {
                    Icon = GraduationCap;
                    color = "text-orange-500";
                    bg = "bg-orange-50 dark:bg-orange-900/20";
                    border = "border-orange-200 dark:border-orange-800";
                 } else if (titleLower.includes("winner")) {
                    Icon = Crown;
                    color = "text-amber-500";
                    bg = "bg-amber-50 dark:bg-amber-900/20";
                    border = "border-amber-200 dark:border-amber-800";
                 }

                 return (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        key={i} 
                        className={`group relative p-8 rounded-[2rem] bg-surface border ${border} hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden`}
                    >
                        {/* Decorative Background Blob */}
                        <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full ${bg} opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-700`}></div>
                        
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-16 h-16 rounded-2xl ${bg} flex items-center justify-center ${color} shadow-sm group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                                    <Icon size={32} />
                                </div>
                                <div className={`p-2 rounded-full ${bg} ${color} opacity-0 group-hover:opacity-100 transition-opacity scale-0 group-hover:scale-100`}>
                                    <Sparkles size={16} />
                                </div>
                            </div>
                            
                            <h3 className="text-lg font-bold text-primary leading-tight mb-2 group-hover:text-accent transition-colors">
                                {a.title}
                            </h3>
                            
                            {/* Horizontal Line that expands */}
                            <div className={`w-12 h-1 rounded-full ${bg.replace('50', '500').replace('/20','')} mt-auto group-hover:w-full transition-all duration-500`}></div>
                        </div>
                    </motion.div>
                 )
              })}
           </div>
        </Section>

        {/* 8. SKILLS */}
        <Section id="skills" className="bg-surface/30">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Skills & Expertise</h2>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {SKILLS.map((cat, i) => (
                 <div key={i} className="premium-glass p-8 rounded-[2.5rem] border-t-4 hover:-translate-y-2 transition-transform duration-300" style={{borderColor: i===0?'#3b82f6':i===1?'#10b981':i===2?'#a855f7':'#ef4444'}}>
                    <h3 className="text-xl font-bold text-primary mb-8 flex items-center justify-center gap-3">
                       <span className={`p-2 rounded-lg text-white ${i===0?'bg-blue-500':i===1?'bg-green-500':i===2?'bg-purple-500':'bg-red-500'}`}>
                          {i===0 ? <Code2 size={18}/> : i===1 ? <MapPin size={18}/> : i===2 ? <BarChart3 size={18}/> : <Brain size={18}/>}
                       </span>
                       {cat.category}
                    </h3>
                    <div className="flex flex-wrap justify-center gap-2">
                       {cat.skills.split(',').map((s, j) => (
                          <span key={j} className="px-3 py-1.5 bg-white dark:bg-black/20 border border-slate-100 dark:border-slate-800 rounded-lg text-sm font-bold text-text-muted shadow-sm hover:text-accent hover:border-accent/30 transition-colors cursor-default">{s.trim()}</span>
                       ))}
                    </div>
                 </div>
              ))}
           </div>
        </Section>

        {/* 9. LEADERSHIP */}
        <Section id="leadership">
           <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Leadership & Service</h2>
           </div>
           
           {/* Detailed Talk with Interactive Zoom */}
           <div 
              className="max-w-4xl mx-auto mb-20 relative group rounded-[3rem] overflow-hidden shadow-2xl h-[400px] border-4 border-white dark:border-slate-800 cursor-zoom-in"
              onClick={() => openLightbox(googleTalk.image || "")}
           >
              <div className="absolute inset-0 bg-cover bg-center transform transition-transform duration-1000 group-hover:scale-105" style={{backgroundImage: `url(${googleTalk.image})`}}></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent flex flex-col justify-end p-10 md:p-14">
                  <span className="inline-block px-4 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold uppercase tracking-widest mb-4 w-fit shadow-lg">Featured Talk</span>
                  <h3 className="text-4xl md:text-5xl font-bold text-white mb-3">{googleTalk.title}</h3>
                  <div className="flex items-center gap-6 text-white/90 font-bold text-lg">
                    <span className="flex items-center gap-2"><Globe size={20} /> {googleTalk.event}</span>
                    <span className="flex items-center gap-2"><Zap size={20} className="text-yellow-400" /> {googleTalk.year}</span>
                    <span className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"><ZoomIn size={20}/> View</span>
                  </div>
              </div>
           </div>

           <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Colorful Positions */}
              <div className="premium-glass p-10 rounded-[3rem]">
                 <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3 border-b border-slate-200 pb-4"><Gavel className="text-purple-600"/> Positions of Responsibility</h3>
                 <ul className="space-y-4">
                    {LEADERSHIP.positions.map((pos, i) => (
                       <li key={i} className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/50 transition-colors">
                          <span className="px-4 py-2 rounded-xl bg-purple-100 text-purple-700 text-sm font-bold font-sans shadow-sm shrink-0">{pos.year}</span>
                          <div>
                             <strong className="text-primary block font-sans text-lg leading-tight group-hover:text-purple-600 transition-colors">{pos.role}</strong>
                             <span className="text-sm text-text-muted">{pos.event}</span>
                          </div>
                       </li>
                    ))}
                 </ul>
              </div>
              
              {/* Colorful Reviewer Pills */}
              <div className="premium-glass p-10 rounded-[3rem]">
                 <h3 className="text-2xl font-bold text-primary mb-8 flex items-center gap-3 border-b border-slate-200 pb-4"><FileCheck className="text-teal-600"/> Editorial Service</h3>
                 <div className="flex flex-wrap gap-3">
                    {LEADERSHIP.reviewer.map((r, i) => (
                       <div key={i} className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl border border-teal-100 dark:border-slate-700 shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-default">
                          <CheckCircle2 size={16} className="text-teal-600"/>
                          <span className="text-sm font-bold text-teal-900 dark:text-teal-100">{r}</span>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </Section>

        {/* 10. GLOBAL FOOTPRINT (MAP) */}
        <Section id="travel" title="Global Footprint">
           <div className="h-[400px] md:h-[500px] w-full relative">
              <GlobalGlobe accentColor={accentColor} darkMode={darkMode} />
           </div>
        </Section>

        {/* 11. MODERN FOOTER (Updated) */}
        <footer id="contact" className="relative bg-[#050a18] text-white pt-24 pb-8 overflow-hidden">
            {/* Dark background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 blur-[150px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600 blur-[150px] rounded-full"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Main Content Grid */}
                <div className="grid md:grid-cols-12 gap-12 lg:gap-16 mb-24">
                    
                    {/* Brand & Statement */}
                    <div className="md:col-span-6">
                       {/* Status Indicator */}
                       <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/10 border border-white/5 backdrop-blur-md mb-8">
                          <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                          </span>
                          <span className="text-xs font-bold uppercase tracking-widest text-green-300">Available for Collaborations</span>
                       </div>

                       <h2 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9]">
                          Let's<br/>
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient">Connect.</span>
                       </h2>
                       <p className="text-xl text-white/60 font-serif leading-relaxed max-w-md mb-8">
                          Open to research discussions, speaking opportunities, and coffee chats about the future of sustainable urban mobility.
                       </p>
                       
                       <a 
                         href={`mailto:${PROFILE.email}`} 
                         className="inline-flex items-center gap-3 px-8 py-5 bg-white text-black rounded-full font-bold text-lg hover:bg-accent hover:text-white transition-all shadow-xl hover:shadow-accent/50 group"
                       >
                         <Mail size={20} /> Say Hello 
                         <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                       </a>
                    </div>
                    
                    {/* Links & Info */}
                    <div className="md:col-span-6 grid sm:grid-cols-2 gap-8 items-start">
                        <div className="space-y-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Contact Info</h3>
                            
                            <a href={`mailto:${PROFILE.email}`} className="flex items-center gap-4 group hover:bg-white/5 p-4 rounded-3xl transition-all border border-transparent hover:border-white/10">
                                <div className="p-3 bg-white/10 rounded-full group-hover:bg-blue-600 transition-colors"><Mail size={20} /></div>
                                <div>
                                    <div className="text-xs text-white/50 mb-0.5 uppercase tracking-wide">Email</div>
                                    <div className="font-bold text-sm truncate max-w-[160px]">{PROFILE.email}</div>
                                </div>
                            </a>

                            <a href={PROFILE.linkedin} target="_blank" className="flex items-center gap-4 group hover:bg-white/5 p-4 rounded-3xl transition-all border border-transparent hover:border-white/10">
                                <div className="p-3 bg-white/10 rounded-full group-hover:bg-[#0077b5] transition-colors"><Linkedin size={20} /></div>
                                <div>
                                    <div className="text-xs text-white/50 mb-0.5 uppercase tracking-wide">Social</div>
                                    <div className="font-bold text-sm">LinkedIn Profile</div>
                                </div>
                            </a>
                        </div>

                        <div className="space-y-6">
                             <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Base</h3>
                             <div className="flex items-start gap-4 p-4 rounded-3xl bg-white/5 border border-white/10">
                                <div className="p-3 bg-white/10 rounded-full shrink-0"><MapPin size={20} /></div>
                                <div>
                                    <div className="font-bold text-lg mb-1">IIT Kharagpur</div>
                                    <div className="text-white/60 text-sm leading-relaxed">West Bengal, India<br/>721302</div>
                                </div>
                             </div>
                             
                             <div className="flex gap-3">
                                <a href={PROFILE.github} target="_blank" className="p-4 rounded-full bg-white/5 hover:bg-white hover:text-black transition-all border border-white/10" aria-label="Github"><Github size={20}/></a>
                                <a href={PROFILE.scholar} target="_blank" className="p-4 rounded-full bg-white/5 hover:bg-white hover:text-black transition-all border border-white/10\" aria-label="Scholar"><GraduationCap size={20}/></a>
                             </div>
                        </div>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="text-center md:text-left">
                       <h4 className="font-bold text-xl mb-1">Kapil Meena<span className="text-accent">.</span></h4>
                       <p className="text-xs text-white/40 uppercase tracking-widest">© {new Date().getFullYear()} All Rights Reserved</p>
                    </div>
                    
                    <a 
                      href="#home" 
                      className="group flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all text-xs font-bold uppercase tracking-widest"
                    >
                       Back to Top <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                </div>
            </div>
        </footer>

      </main>
    </div>
  );
};

export default App;