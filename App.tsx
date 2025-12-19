
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Github, Linkedin, GraduationCap, Globe, 
  ExternalLink, Code2, 
  Menu, X, Sun, Moon,
  Trophy, Mail, ArrowRight,
  Download, Zap, Brain, Shield, BookOpen, 
  Wind, Navigation, Binary, Layout, UserCheck, Star, Users, CheckCircle2,
  Newspaper, MapPin, Calendar, Layers, Briefcase, Terminal, Database, Laptop,
  BarChart3, Train, Building2, Car, MousePointer2, FileText, MonitorPlay, FolderGit2,
  Cpu, Activity, Mic, Video, Presentation, Radio, Gavel, Medal, FileCheck
} from 'lucide-react';
import Background3D from './components/Background3D';
import GlobalGlobe from './components/GlobalGlobe';
import Section from './components/Section';
import { 
  PROFILE, EDUCATION, RESEARCH_PROJECTS, REPOSITORIES, SKILLS,
  EXPERIENCE, PUBLICATIONS, AWARDS, PEER_REVIEW_JOURNALS, EXPERT_LECTURES, LEADERSHIP
} from './constants';

const App: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false); 
  const [accentColor, setAccentColor] = useState('#0ea5e9'); 
  const [pubTab, setPubTab] = useState<'journal' | 'conference'>('journal');

  // Auto Dark Mode (4PM - 8AM)
  useEffect(() => {
    const hour = new Date().getHours();
    // If time is 16:00 (4PM) or later, OR before 08:00 (8AM)
    if (hour >= 16 || hour < 8) {
      setDarkMode(true);
    } else {
      setDarkMode(false);
    }
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.style.setProperty('--color-accent', accentColor);
  }, [accentColor]);

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
  const googleTalk = EXPERT_LECTURES[0]; // Assuming first item is always Google Talk based on constant order
  const otherTalks = EXPERT_LECTURES.slice(1);

  const navLinks = [
    { name: 'Research', id: 'research' },
    { name: 'Skills', id: 'skills' },
    { name: 'Impact', id: 'publications' },
    { name: 'Projects', id: 'projects' },
    { name: 'Experience', id: 'experience' },
    { name: 'Education', id: 'education' },
  ];

  const getProjectIcon = (type?: string) => {
    switch(type) {
       case 'Web App': return <Globe className="text-cyan-500" />;
       case 'Project': return <FolderGit2 className="text-blue-500" />;
       case 'Live': return <MonitorPlay className="text-emerald-500" />;
       case 'Report': return <FileText className="text-orange-500" />;
       case 'Abstract': return <Newspaper className="text-purple-500" />;
       default: return <Code2 className="text-slate-500" />;
    }
  };

  return (
    <div onMouseMove={handleMouseMove} className="relative min-h-screen font-sans selection:bg-accent/30 overflow-x-hidden bg-background text-text transition-colors duration-500 flex flex-col">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60">
        <Background3D darkMode={darkMode} accentColor={accentColor} />
      </div>

      {/* Main Navigation - ABSOLUTE (Scrolls away) */}
      <nav className="absolute top-0 left-0 right-0 z-[50] p-4 md:p-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          <div className="academic-glass rounded-full px-8 py-4 flex justify-between items-center shadow-lg border-white/20 backdrop-blur-xl">
            <div className="flex flex-col">
               <div className="text-xl font-heading font-extrabold tracking-tight text-primary leading-none">
                 Kapil Meena<span className="text-accent">.</span>
               </div>
               <div className="text-[10px] uppercase tracking-[0.25em] text-accent font-black mt-1">
                 PhD IIT Kharagpur | MTech IIT Roorkee
               </div>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-10">
              <div className="flex space-x-8 text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted">
                {navLinks.map((item) => (
                  <a key={item.name} href={`#${item.id}`} className="hover:text-primary transition-colors relative group py-2">
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
                  </a>
                ))}
              </div>
              <div className="h-6 w-px bg-text-muted/20"></div>
              <div className="flex items-center gap-3">
                <button onClick={() => setDarkMode(!darkMode)} className="p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-all text-text">
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
                <a href={cvLink} target="_blank" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white dark:bg-accent rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95">
                  <Download size={14} /> CV
                </a>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* FIXED Floating Menu Button (Always visible) */}
      <div className="fixed top-6 right-6 z-[100] flex gap-3">
         {/* Toggle Theme (Mobile only, or always if you prefer) - keeping visible on scroll for utility */}
         <button 
           onClick={() => setDarkMode(!darkMode)} 
           className="p-3 rounded-full bg-surface/80 backdrop-blur-md border border-white/20 text-text shadow-xl hover:scale-110 transition-transform lg:hidden"
         >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
         </button>
         {/* Hamburger Menu */}
         <button 
            onClick={() => setMenuOpen(!menuOpen)} 
            className="p-3 rounded-full bg-accent text-white shadow-xl hover:scale-110 transition-transform hover:shadow-2xl hover:shadow-accent/40"
         >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
         </button>
      </div>

      {/* Mobile/Floating Nav Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-background/80 backdrop-blur-2xl"
          >
            <div className="w-full max-w-lg bg-surface border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative">
              <button 
                onClick={() => setMenuOpen(false)}
                className="absolute top-6 right-6 p-2 text-text-muted hover:text-primary transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="mb-8 text-center">
                 <div className="text-2xl font-heading font-extrabold text-primary">Kapil Meena<span className="text-accent">.</span></div>
                 <div className="text-xs text-text-muted uppercase tracking-widest mt-2">Navigation</div>
              </div>

              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <a 
                    key={link.name} 
                    href={`#${link.id}`} 
                    onClick={() => setMenuOpen(false)}
                    className="text-xl font-heading font-bold text-text-muted hover:text-primary hover:translate-x-2 transition-all flex items-center gap-4 group p-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <span className="w-2 h-2 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                    <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-all ml-auto" />
                  </a>
                ))}
              </div>

              <div className="pt-8 mt-8 border-t border-text-muted/10 space-y-4">
                 <div className="flex justify-center gap-8">
                    <a href={PROFILE.linkedin} target="_blank" className="text-text-muted hover:text-[#0077b5] transition-colors"><Linkedin size={28} /></a>
                    <a href={PROFILE.scholar} target="_blank" className="text-text-muted hover:text-[#4285F4] transition-colors"><GraduationCap size={28} /></a>
                    <a href={PROFILE.github} target="_blank" className="text-text-muted hover:text-text transition-colors"><Github size={28} /></a>
                 </div>
                 <a href={cvLink} target="_blank" className="flex items-center justify-center gap-3 w-full py-4 bg-primary text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-transform">
                   <Download size={16} /> DOWNLOAD FULL CV
                 </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-32 lg:pt-40 space-y-32 flex-grow">
        
        {/* ELITE HERO */}
        <section id="home" className="min-h-[85vh] flex items-center justify-center px-6">
          <div className="max-w-7xl w-full grid lg:grid-cols-12 gap-12 items-center">
            
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="lg:col-span-7 space-y-8 order-2 lg:order-1">
              <div className="inline-flex items-center gap-3 bg-accent/10 border border-accent/20 px-5 py-2 rounded-full shadow-sm">
                 <Zap className="text-accent animate-pulse" size={16} />
                 <span className="text-[10px] font-bold uppercase tracking-widest text-accent">Available for Post-Doc • 2026</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-[7.5rem] font-heading font-extrabold tracking-tighter text-primary leading-[0.9]">
                Decoding <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-blue-600 italic pr-4">Urban Mobility.</span>
              </h1>
              <div className="text-xl md:text-2xl font-bold text-text-muted border-l-4 border-accent pl-6 py-2">
                 PhD IIT Kharagpur | MTech IIT Roorkee
              </div>
              <p className="text-lg md:text-xl text-text-muted font-medium max-w-2xl leading-relaxed">
                Interdisciplinary researcher bridging <span className="text-primary font-bold">econometric rigor</span> with <span className="text-primary font-bold">data science</span>. Analyzing behavioral dynamics for sustainable transitions.
              </p>
              
              {/* Media Feature Badge - THE HINDU - Separate & Nice */}
              <div className="mt-8 relative group max-w-xl">
                 <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>
                 <div className="relative bg-surface border border-white/10 rounded-xl overflow-hidden shadow-xl">
                    <div className="flex flex-col sm:flex-row">
                       {/* Image Section */}
                       <div className="sm:w-2/5 h-48 sm:h-auto relative bg-gray-100 dark:bg-gray-800">
                          <img 
                             src="https://github.com/kapil2020/web/blob/main/The%20HindU_8%20June_github.jpg?raw=true" 
                             alt="The Hindu Feature" 
                             className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                       </div>
                       
                       {/* Content Section */}
                       <div className="p-6 sm:w-3/5 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-3">
                              <span className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-[10px] font-bold uppercase tracking-wider">The Hindu</span>
                              <span className="text-[10px] text-text-muted font-medium">Energy & Environment</span>
                          </div>
                          <h4 className="font-heading font-bold text-primary text-lg leading-tight mb-4 group-hover:text-accent transition-colors">
                             "IIT-KGP app helps commuters pick greener routes"
                          </h4>
                          <a 
                             href="https://www.thehindu.com/sci-tech/energy-and-environment/iit-kgp-app-helps-commuters-pick-greener-routes-on-the-road/article69644558.ece" 
                             target="_blank"
                             className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-accent hover:underline"
                          >
                             Read Article <ExternalLink size={12} />
                          </a>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="flex flex-wrap gap-4 pt-4">
                {/* LinkedIn: Brand Color for Visibility */}
                <a href={PROFILE.linkedin} target="_blank" className="flex items-center gap-3 px-8 py-4 bg-[#0077b5] text-white rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 hover:bg-[#006097] transition-all shadow-lg">
                  <Linkedin size={18} /> LinkedIn
                </a>
                <a href={PROFILE.scholar} target="_blank" className="flex items-center gap-3 px-8 py-4 bg-surface text-primary border border-text-muted/10 rounded-full font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-md">
                  <GraduationCap size={18} className="text-accent" /> Scholar
                </a>
              </div>
            </motion.div>

            {/* Profile Picture with Keywords - LOGO REMOVED */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }} className="lg:col-span-5 flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative w-80 h-80 md:w-96 md:h-96 group">
                <div className="absolute inset-0 bg-gradient-to-tr from-accent to-blue-600 blur-[100px] opacity-40 group-hover:opacity-60 transition-all duration-700"></div>
                <img 
                  src={PROFILE.photoUrl} 
                  onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=Kapil+Meena&size=512&background=0ea5e9&color=fff` }}
                  alt={PROFILE.name} 
                  className="relative w-full h-full object-cover rounded-full border-[8px] border-white/90 dark:border-slate-800 shadow-2xl z-10 grayscale-[20%] hover:grayscale-0 transition-all duration-700" 
                />
                
                {/* Floating Keywords with Icons */}
                <div className="absolute top-0 -left-4 md:-left-12 z-20 animate-float bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs font-mono font-bold text-blue-400 shadow-lg transform -rotate-6 flex items-center gap-2">
                  <Train size={14} /> &lt;Transport/&gt;
                </div>
                <div className="absolute bottom-10 -right-4 md:-right-8 z-20 animate-float bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs font-mono font-bold text-emerald-400 shadow-lg transform rotate-3 delay-700 flex items-center gap-2">
                  <Database size={14} /> &lt;DataScience/&gt;
                </div>
                <div className="absolute top-1/2 -right-8 md:-right-16 z-20 animate-float bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs font-mono font-bold text-purple-400 shadow-lg transform -rotate-3 delay-300 flex items-center gap-2">
                   <Building2 size={14} /> &lt;UrbanPolicy/&gt;
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* RESEARCH FOUNDATIONS */}
        <Section id="research" title="Scientific Focus">
           <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Behavioral Econometrics", desc: "Expertise in Hybrid Choice Models (Latent Variables) to decode decision-making under uncertainty.", icon: <Brain className="text-blue-600" size={32} />, color: "border-blue-500/30", bg: "bg-blue-500/10" },
                { title: "Environmental Risk", desc: "Quantifying inhaled pollution dose and personal exposure vulnerability across transport modes.", icon: <Wind className="text-emerald-600" size={32} />, color: "border-emerald-500/30", bg: "bg-emerald-500/10" },
                { title: "Urban Computing", desc: "Developing scalable routing engines (GraphHopper) and dashboards for policy monitoring.", icon: <Navigation className="text-orange-600" size={32} />, color: "border-orange-500/30", bg: "bg-orange-500/10" }
              ].map((f, i) => (
                <div key={i} className={`academic-glass p-10 rounded-[2.5rem] spotlight-card border-t-[6px] ${f.color} hover:-translate-y-2 transition-transform duration-300`}>
                   <div className={`w-16 h-16 rounded-2xl ${f.bg} shadow-inner flex items-center justify-center mb-8`}>{f.icon}</div>
                   <h3 className="text-2xl font-heading font-bold text-primary mb-4">{f.title}</h3>
                   <p className="text-text-muted leading-relaxed text-sm font-medium">{f.desc}</p>
                </div>
              ))}
           </div>
        </Section>

        {/* SKILLS SECTION (NEW) */}
        <Section id="skills" title="Technical Expertise" altBg>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {SKILLS.map((skillGroup, idx) => {
              const colors = [
                { text: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                { text: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
                { text: 'text-orange-500', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
                { text: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' }
              ];
              const theme = colors[idx % colors.length];
              
              return (
                <div key={idx} className={`academic-glass p-8 rounded-[2rem] border ${theme.border} relative overflow-hidden group hover:shadow-lg transition-all`}>
                  <div className={`absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity ${theme.text}`}>
                     {idx === 0 && <Terminal size={80} />}
                     {idx === 1 && <Globe size={80} />}
                     {idx === 2 && <BarChart3 size={80} />}
                     {idx === 3 && <Brain size={80} />}
                  </div>
                  <h3 className={`text-xl font-heading font-bold ${theme.text} mb-6 flex items-center gap-3`}>
                    <span className={`w-10 h-10 rounded-xl ${theme.bg} flex items-center justify-center`}>
                      {idx === 0 && <Terminal size={20} />}
                      {idx === 1 && <Globe size={20} />}
                      {idx === 2 && <BarChart3 size={20} />}
                      {idx === 3 && <Brain size={20} />}
                    </span>
                    {skillGroup.category}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {skillGroup.skills.split(',').map((skill, sIdx) => (
                      <span key={sIdx} className={`px-3 py-1.5 rounded-lg bg-surface border border-text-muted/10 text-xs font-bold text-text-muted hover:${theme.text} hover:border-current transition-colors cursor-default`}>
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        {/* PUBLICATIONS & CONFERENCE VISUALS - TABBED INTERFACE */}
        <Section id="publications" title="Publications & Impact">
          
          {/* Conference Collage Display - TEXT FIRST, THEN IMAGE */}
          <div className="mb-24 flex flex-col gap-10">
             <div className="md:px-4">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-4 shadow-lg shadow-blue-500/20">
                    <Globe size={12} /> Global Presence
                </div>
                <h3 className="text-3xl md:text-5xl font-heading font-extrabold text-primary mb-4">Scientific Discourse</h3>
                <p className="text-text-muted font-medium max-w-2xl text-lg leading-relaxed border-l-4 border-accent pl-4">
                  Presenting research findings at premier international venues including TRB, IATBR, WCTR, and COMSNETS.
                </p>
             </div>

             <div className="relative h-[350px] md:h-[500px] w-full max-w-5xl mx-auto group perspective-1000">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-[2.5rem] blur-xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative h-full w-full rounded-[2.5rem] overflow-hidden border border-white/30 shadow-2xl bg-surface/50 backdrop-blur-sm">
                   {/* Glass Sheen */}
                   <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent z-10 pointer-events-none"></div>
                   
                   <img 
                      src="https://github.com/kapil2020/web/blob/main/conference_github.png?raw=true" 
                      alt="Global Conferences Collage" 
                      className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-1000"
                   />
                   
                   {/* Overlay Badge */}
                   <div className="absolute bottom-6 right-6 z-20">
                      <div className="bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-xs font-bold border border-white/10 flex items-center gap-2">
                         <Users size={14} className="text-accent" /> Network & Impact
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <div className="flex justify-center mb-12">
             <div className="p-1.5 bg-surface/50 rounded-full border border-text-muted/10 flex gap-2 backdrop-blur-md">
                <button 
                  onClick={() => setPubTab('journal')}
                  className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${pubTab === 'journal' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-primary'}`}
                >
                  Journals ({journalPubs.length})
                </button>
                <button 
                  onClick={() => setPubTab('conference')}
                  className={`px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all ${pubTab === 'conference' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-primary'}`}
                >
                  Conferences ({confPubs.length})
                </button>
             </div>
          </div>

          <div className="min-h-[600px]">
            <AnimatePresence mode='wait'>
               {pubTab === 'journal' ? (
                 <motion.div 
                   key="journals"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="grid gap-6"
                 >
                   {journalPubs.map((pub, i) => (
                     <div key={i} className="academic-glass p-8 rounded-[2rem] flex flex-col md:flex-row gap-8 items-start hover:border-accent/40 transition-colors">
                        <div className="shrink-0 flex flex-col items-center gap-2 min-w-[80px]">
                           <span className="text-2xl font-heading font-black text-primary/20">{pub.year}</span>
                           {/* Dark Mode Fixed: Adjusted text colors for status badges */}
                           <div className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${pub.status?.includes('Published') ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'}`}>
                             {pub.status}
                           </div>
                        </div>
                        <div className="flex-grow">
                           <h4 className="text-xl font-heading font-bold text-primary mb-2 leading-tight">{pub.title}</h4>
                           <div className="text-sm font-medium text-text-muted mb-3 italic">{pub.authors}</div>
                           <div className="flex items-center gap-3">
                              <span className="px-3 py-1 rounded-lg bg-surface border border-text-muted/10 text-[10px] font-bold uppercase tracking-wider text-primary">
                                {pub.venue}
                              </span>
                              {pub.link && (
                                <a href={pub.link} target="_blank" className="flex items-center gap-1 text-[10px] font-bold uppercase text-accent hover:underline">
                                  DOI / Link <ExternalLink size={10} />
                                </a>
                              )}
                           </div>
                        </div>
                     </div>
                   ))}
                 </motion.div>
               ) : (
                 <motion.div 
                   key="conference"
                   initial={{ opacity: 0, y: 20 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -20 }}
                   className="grid md:grid-cols-2 gap-6"
                 >
                   {confPubs.map((pub, i) => (
                     <div key={i} className="bg-surface/60 p-8 rounded-[2rem] border border-white/10 hover:shadow-lg transition-all">
                        <div className="flex justify-between items-start mb-4">
                           <span className="text-sm font-black text-accent">{pub.year}</span>
                           <Globe size={16} className="text-text-muted/40" />
                        </div>
                        <h4 className="text-lg font-heading font-bold text-primary mb-3 leading-snug">{pub.title}</h4>
                        <div className="text-xs text-text-muted font-medium mb-4">{pub.authors}</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-text-muted/70 bg-black/5 dark:bg-white/5 p-2 rounded-lg inline-block">
                           {pub.venue}
                        </div>
                     </div>
                   ))}
                 </motion.div>
               )}
            </AnimatePresence>
          </div>

          {/* Patent Section */}
          <div className="mt-20">
             <h3 className="text-2xl font-heading font-bold mb-8 flex items-center gap-3"><Shield className="text-orange-500" /> Patents</h3>
             <div className="bg-gradient-to-r from-orange-500/5 to-transparent border-l-4 border-orange-500 p-8 rounded-r-2xl">
                {patentPubs.map((p, i) => (
                  <div key={i}>
                     <h4 className="text-xl font-bold text-primary mb-2">{p.title}</h4>
                     <p className="text-sm text-text-muted">{p.venue} • {p.status}</p>
                  </div>
                ))}
             </div>
          </div>
        </Section>

        {/* PROJECTS & REPOSITORIES */}
        <Section id="projects" title="Technical Systems" altBg>
           <div className="grid md:grid-cols-2 gap-8 mb-20">
              {RESEARCH_PROJECTS.map((proj, i) => (
                <div key={i} className="group academic-glass p-10 rounded-[2.5rem] hover:bg-surface transition-all duration-300 flex flex-col h-full border border-white/10">
                   <div className="flex justify-between items-start mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-surface shadow-sm flex items-center justify-center border border-text-muted/10">
                         {getProjectIcon(proj.type)}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border 
                        ${proj.type === 'Web App' ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' : 
                          proj.type === 'Live' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          'bg-surface text-text-muted border-text-muted/10'}`}>
                        {proj.type || 'Project'}
                      </span>
                   </div>
                   <h4 className="text-2xl font-heading font-bold text-primary mb-3 group-hover:text-accent transition-colors">{proj.title}</h4>
                   <p className="text-text-muted mb-8 leading-relaxed text-sm flex-grow">{proj.description}</p>
                   
                   <div className="mt-auto">
                     <div className="flex flex-wrap gap-2 mb-6">
                        {proj.tags.map(t => (
                          <span key={t} className="px-3 py-1 rounded-md bg-background border border-text-muted/5 text-[10px] font-bold text-text-muted/70 flex items-center gap-1">
                             <Activity size={10} className="text-accent/50" /> {t}
                          </span>
                        ))}
                     </div>
                     {proj.link && (
                        <a href={proj.link} target="_blank" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:text-accent transition-colors">
                          {proj.linkText || 'View Details'} <ArrowRight size={14} />
                        </a>
                      )}
                   </div>
                </div>
              ))}
           </div>
           
           {/* OPEN SOURCE REPOSITORIES */}
           <div>
              <h3 className="text-2xl font-heading font-bold mb-10 flex items-center gap-3">
                 <Github className="text-text-muted" /> Open Source Repositories
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                 {REPOSITORIES.map((repo, i) => (
                    <a key={i} href={repo.link} target="_blank" className="group academic-glass p-8 rounded-[2rem] hover:-translate-y-1 transition-transform block border border-white/10 hover:border-accent/30">
                       <div className="flex justify-between items-start mb-4">
                          <Code2 size={24} className="text-accent" />
                          <div className="flex items-center gap-1 text-xs font-bold text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-full border border-yellow-500/20">
                             <Star size={10} fill="currentColor" /> {repo.stars}
                          </div>
                       </div>
                       <h4 className="font-bold text-primary mb-2 group-hover:text-accent transition-colors text-lg">{repo.name}</h4>
                       <p className="text-xs text-text-muted leading-relaxed line-clamp-3">{repo.description}</p>
                    </a>
                 ))}
              </div>
           </div>
        </Section>

        {/* EXPERIENCE TIMELINE */}
        <Section id="experience" title="Professional History">
           <div className="relative border-l-2 border-text-muted/10 ml-4 md:ml-12 space-y-16">
              {EXPERIENCE.map((exp, i) => (
                 <div key={i} className="relative pl-8 md:pl-16">
                    <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-accent border-4 border-background"></div>
                    <div className="text-xs font-black uppercase tracking-widest text-accent mb-2">{exp.period}</div>
                    <h3 className="text-3xl font-heading font-bold text-primary mb-1">{exp.role}</h3>
                    <div className="text-lg font-medium text-text-muted mb-6 flex items-center gap-2">
                       <Briefcase size={16} className="text-accent" /> {exp.organization}
                    </div>
                    <ul className="space-y-3">
                       {exp.points.map((pt, j) => (
                          <li key={j} className="flex items-start gap-3 text-text-muted leading-relaxed">
                             <span className="mt-2 w-1.5 h-1.5 rounded-full bg-text-muted/40 shrink-0"></span>
                             {pt}
                          </li>
                       ))}
                    </ul>
                 </div>
              ))}
           </div>
        </Section>

        {/* EXPERT LECTURES SECTION */}
        <Section id="lectures" title="Expert Lectures & Workshops">
          <div className="mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-1.5 rounded-full text-white text-[10px] font-black uppercase tracking-widest mb-4 shadow-lg shadow-emerald-500/20">
               <Mic size={12} /> Knowledge Sharing | 2019–2025
            </div>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
             {/* Feature Google Talk Card - IMPROVED */}
             <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl h-[400px] lg:h-auto bg-black border border-white/10">
                {/* Background blurred effect for premium fill */}
                <div className="absolute inset-0 bg-cover bg-center blur-2xl opacity-50 scale-110" style={{backgroundImage: `url(${googleTalk.image})`}}></div>
                
                {/* Main contained image - Zoomed Out */}
                <img 
                   src={googleTalk.image} 
                   alt={googleTalk.title} 
                   className="absolute inset-0 w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 z-10 p-4"
                />
                
                {/* Overlay Content */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end p-8 md:p-12 z-20">
                   <div className="inline-flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest w-fit mb-3">
                      <Presentation size={12} /> Keynote
                   </div>
                   <h3 className="text-3xl md:text-4xl font-heading font-extrabold text-white mb-2 leading-tight">
                     {googleTalk.title}
                   </h3>
                   <div className="flex flex-wrap items-center gap-4 text-white/80 font-medium">
                      <span className="flex items-center gap-2"><Globe size={16} className="text-blue-400" /> {googleTalk.event}</span>
                      <span className="w-1 h-1 rounded-full bg-white/50"></span>
                      <span>{googleTalk.year}</span>
                   </div>
                </div>
             </div>

             {/* Other Lectures List */}
             <div className="space-y-4 flex flex-col justify-center">
                {otherTalks.map((talk, idx) => (
                   <div key={idx} className="group flex items-center gap-6 p-6 rounded-3xl bg-surface border border-text-muted/5 hover:border-accent/20 hover:shadow-lg transition-all duration-300">
                      <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                         {idx % 2 === 0 ? <Presentation size={24} className="text-accent" /> : <Mic size={24} className="text-accent" />}
                      </div>
                      <div>
                         <h4 className="text-lg font-heading font-bold text-primary leading-snug group-hover:text-accent transition-colors">
                           {talk.title}
                         </h4>
                         <div className="flex items-center gap-3 text-sm font-medium text-text-muted mt-1">
                            <span className="flex items-center gap-1.5"><Building2 size={12} /> {talk.event}</span>
                            <span className="w-1 h-1 rounded-full bg-text-muted/30"></span>
                            <span className="text-xs font-black uppercase tracking-wider bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-md">{talk.year}</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </Section>

        {/* LEADERSHIP & COMMUNITY SECTION - REVISED TO SHOW ALL */}
        <Section id="leadership" title="Leadership & Community" altBg>
           <div className="mb-12">
               <p className="text-xl text-text-muted font-medium max-w-2xl mb-8">
                 Organizing for sustainable infrastructure futures through active participation in global academic societies and local administration.
               </p>
           </div>
           
           <div className="space-y-20">
              {/* BLOCK 1: POSITIONS OF RESPONSIBILITY */}
              <div>
                  <h3 className="text-2xl font-heading font-bold mb-8 flex items-center gap-3 text-primary">
                      <div className="p-2 bg-purple-500/10 rounded-xl text-purple-600 dark:text-purple-400"><Gavel size={24} /></div>
                      Positions of Responsibility
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {LEADERSHIP.positions.map((pos, i) => (
                        <div key={i} className="academic-glass p-8 rounded-[2rem] border-t-4 border-t-purple-500/50 hover:-translate-y-1 transition-transform group">
                            <div className="flex justify-between items-start mb-4">
                              <span className="px-3 py-1 rounded-md bg-purple-50 dark:bg-purple-900/20 text-[10px] font-black uppercase tracking-wider text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-purple-800">
                                {pos.year}
                              </span>
                            </div>
                            <h4 className="text-lg font-heading font-bold text-primary mb-2 leading-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{pos.role}</h4>
                            <div className="text-sm font-medium text-text-muted flex items-center gap-2"><Building2 size={12} /> {pos.event}</div>
                        </div>
                      ))}
                  </div>
              </div>

              {/* BLOCK 2: CONFERENCES ORGANIZED */}
              <div>
                  <h3 className="text-2xl font-heading font-bold mb-8 flex items-center gap-3 text-primary">
                      <div className="p-2 bg-pink-500/10 rounded-xl text-pink-600 dark:text-pink-400"><Calendar size={24} /></div>
                      Conferences Organized
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                      {LEADERSHIP.conferences.map((conf, i) => (
                        <div key={i} className="academic-glass p-8 rounded-[2rem] border-l-4 border-l-pink-500/50 flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left hover:shadow-lg transition-all">
                            <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-500 shrink-0">
                              <Users size={28} />
                            </div>
                            <div>
                              <div className="text-[10px] font-black uppercase tracking-widest text-pink-500 mb-2">{conf.role}</div>
                              <h4 className="text-xl font-heading font-bold text-primary mb-2">{conf.title}</h4>
                              <div className="text-sm font-bold text-text-muted flex items-center justify-center md:justify-start gap-2">
                                  <MapPin size={14}/> {conf.loc}
                              </div>
                            </div>
                        </div>
                      ))}
                  </div>
              </div>

              {/* BLOCK 3: COMMUNITY & MEMBERSHIPS */}
              <div className="grid lg:grid-cols-2 gap-12">
                  <div>
                    <h3 className="text-xl font-heading font-bold flex items-center gap-3 text-primary border-b border-text-muted/10 pb-4 mb-6">
                        <FileCheck className="text-teal-500" size={20} /> Peer Reviewer
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        {LEADERSHIP.reviewer.map((journal, i) => (
                          <div key={i} className="bg-surface border border-text-muted/10 p-4 rounded-xl flex items-center gap-3 hover:border-teal-500/30 transition-colors shadow-sm group">
                              <div className="w-8 h-8 rounded-full bg-teal-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <BookOpen size={14} className="text-teal-600 dark:text-teal-400" />
                              </div>
                              <span className="text-xs font-bold text-text-muted dark:text-teal-100 leading-tight">{journal}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-heading font-bold flex items-center gap-3 text-primary border-b border-text-muted/10 pb-4 mb-6">
                        <Medal className="text-orange-500" size={20} /> Professional Memberships
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {LEADERSHIP.memberships.map((mem, i) => (
                          <div key={i} className="group px-6 py-3 bg-surface border border-text-muted/10 rounded-full hover:border-orange-500/50 hover:shadow-md transition-all cursor-default flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-orange-500/50 group-hover:bg-orange-500 transition-colors"></span>
                              <span className="font-bold text-text-muted group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">{mem}</span>
                          </div>
                        ))}
                    </div>
                  </div>
              </div>
           </div>
        </Section>

        {/* EDUCATION & GLOBAL MAP */}
        <Section id="education" title="Academic Journey" altBg>
           <div className="grid lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 space-y-8">
                 {EDUCATION.map((edu, i) => (
                   <div key={i} className="bg-surface p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow border border-text-muted/5 group">
                      <div className="flex justify-between mb-4">
                         <span className="text-xs font-black uppercase tracking-widest text-accent">{edu.period}</span>
                         <MapPin size={14} className="text-text-muted group-hover:text-accent transition-colors" />
                      </div>
                      <h4 className="text-xl font-heading font-bold text-primary mb-2">{edu.degree}</h4>
                      <div className="text-sm font-bold text-text-muted mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> {edu.institution}
                      </div>
                      <p className="text-xs text-text-muted/80 leading-relaxed border-t border-text-muted/10 pt-3">{edu.details}</p>
                   </div>
                 ))}
              </div>
              <div className="lg:col-span-7 h-[600px] academic-glass rounded-[3rem] overflow-hidden p-2 shadow-xl">
                 <GlobalGlobe darkMode={darkMode} accentColor={accentColor} />
              </div>
           </div>
        </Section>

        {/* DISTINCTIONS */}
        <Section id="awards" title="Honors & Grants">
           <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {AWARDS.map((a, i) => (
                <div key={i} className="p-8 rounded-[2rem] bg-gradient-to-br from-surface to-transparent border border-white/10 hover:border-accent/30 transition-all group">
                   <div className="mb-6 w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                     <Trophy size={24} className="text-yellow-500 group-hover:scale-110 transition-transform" />
                   </div>
                   <h4 className="font-bold text-primary leading-snug">{a.title}</h4>
                </div>
              ))}
           </div>
        </Section>

        {/* PROFESSIONAL FOOTER */}
        <Section id="contact" className="pb-0 px-0 max-w-full">
            <div className="w-full bg-[#020617] text-white pt-24 pb-12 px-6 relative border-t border-white/10">
                <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 lg:gap-24 mb-16">
                    <div className="md:col-span-2 space-y-6">
                       <div>
                          <h3 className="text-3xl font-heading font-extrabold tracking-tight mb-2">Kapil Meena<span className="text-accent">.</span></h3>
                          <div className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">PhD IIT Kharagpur | MTech IIT Roorkee</div>
                       </div>
                       <p className="text-white/60 leading-relaxed max-w-md">
                          Bridging the gap between econometric theory and urban policy through data science. Dedicated to creating sustainable, equitable, and efficient transport systems for the future smart cities.
                       </p>
                       <div className="flex gap-4 pt-2">
                          <a href={PROFILE.linkedin} target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0077b5] hover:text-white transition-all"><Linkedin size={18} /></a>
                          <a href={PROFILE.github} target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#333] hover:text-white transition-all"><Github size={18} /></a>
                          <a href={PROFILE.scholar} target="_blank" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#4285F4] hover:text-white transition-all"><GraduationCap size={18} /></a>
                       </div>
                    </div>
                    
                    <div className="space-y-6">
                       <h4 className="text-sm font-black uppercase tracking-widest text-white/30">Navigate</h4>
                       <ul className="space-y-4 text-sm font-medium text-white/70">
                          <li><a href="#research" className="hover:text-accent transition-colors">Research Focus</a></li>
                          <li><a href="#publications" className="hover:text-accent transition-colors">Publications</a></li>
                          <li><a href="#projects" className="hover:text-accent transition-colors">Technical Systems</a></li>
                          <li><a href="#skills" className="hover:text-accent transition-colors">Expertise</a></li>
                       </ul>
                    </div>

                    <div className="space-y-6">
                       <h4 className="text-sm font-black uppercase tracking-widest text-white/30">Contact</h4>
                       <ul className="space-y-4 text-sm font-medium text-white/70">
                          <li className="flex items-center gap-3"><Mail size={16} className="text-accent" /> {PROFILE.email}</li>
                          <li className="flex items-center gap-3"><MapPin size={16} className="text-accent" /> Kharagpur, West Bengal, India</li>
                          <li>
                             <a href={`mailto:${PROFILE.email}`} className="inline-block mt-4 px-6 py-2 bg-accent text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-primary transition-all">
                               Get in Touch
                             </a>
                          </li>
                       </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">
                      © {new Date().getFullYear()} Kapil Kumar Meena
                    </div>
                    <div className="text-white/20 text-[10px] font-medium flex items-center gap-2">
                       Designed with love <span className="text-red-500 text-lg">♥</span>
                    </div>
                </div>
            </div>
        </Section>
      </main>
    </div>
  );
};

export default App;
