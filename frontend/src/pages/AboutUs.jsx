import React from 'react';
import { 
  Users, 
  UserCheck, 
  Target, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Mail, 
  ArrowRight,
  FileText,
  Activity,
  Layers,
  Search
} from 'lucide-react';

const AboutUs = () => {
  const teamMembers = [
    {
      name: 'Member 1',
      role: 'Frontend Developer',
      desc: 'Crafting futuristic user interfaces and seamless digital experiences.',
      icon: Layers
    },
    {
      name: 'Member 2',
      role: 'Backend Developer',
      desc: 'Architecting robust server-side logic and database infrastructures.',
      icon: Activity
    },
    {
      name: 'Member 3',
      role: 'Deep Learning Engineer',
      desc: 'Developing neural networks for advanced spectral pattern recognition.',
      icon: Cpu
    },
    {
      name: 'Member 4',
      role: 'Data Processing & Research',
      desc: 'Expertise in FTIR spectral datasets and environmental impact analysis.',
      icon: FileText
    }
  ];

  const guides = [
    {
      name: 'Guide 1',
      designation: 'Project Supervisor / Professor',
      desc: 'Providing strategic direction and academic oversight for the research project.'
    },
    {
      name: 'Guide 2',
      designation: 'Technical Mentor',
      desc: 'Guiding the implementation of advanced AI algorithms and system architecture.'
    }
  ];

  const timeline = [
    { title: 'Idea Formation', date: 'Phase 1', desc: 'Conceptualizing AI-powered microplastics detection.' },
    { title: 'Dataset Collection', date: 'Phase 2', desc: 'Acquiring high-fidelity FTIR spectral datasets.' },
    { title: 'Model Training', date: 'Phase 3', desc: 'Training CNN and Hybrid models on spectral data.' },
    { title: 'FTIR Integration', date: 'Phase 4', desc: 'Integrating laboratory analysis with the digital platform.' },
    { title: 'Frontend Development', date: 'Phase 5', desc: 'Building the futuristic glassmorphism interface.' },
    { title: 'Final System', date: 'Phase 6', desc: 'Deploying the complete end-to-end analysis system.' }
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-6 pt-10">
          <h1 className="text-2xl lg:text-4xl font-bold tracking-tight text-slate-950 dark:text-white leading-[1.2] uppercase">
            Meet the Team Behind <br />
            <span className="text-gradient">Microplastics AI</span>
          </h1>
          <p className="text-sm text-slate-700 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium uppercase tracking-wide">
            A collaborative effort combining AI-powered environmental research, 
            innovative deep learning models, and a shared mission to combat microplastic pollution.
          </p>
        </section>

        {/* PROJECT OVERVIEW CARD */}
        <section className="glass-card p-12 md:p-24 relative overflow-hidden border-primary-500/30 dark:border-white/10 shadow-2xl bg-white dark:bg-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/10 blur-[120px] -z-10 rounded-full" />
          <div className="grid md:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white dark:bg-primary-500/10 border border-primary-500/40 dark:border-primary-500/20 text-primary-900 dark:text-primary-400 text-[10px] font-black uppercase tracking-[0.3em] shadow-md">
                Our Mission
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[var(--heading-color)] tracking-tighter leading-tight">Redefining Environmental Analysis with Deep Learning</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed font-medium text-base">
                Microplastics AI was born from the need for faster, more accurate detection of microscopic pollutants. By combining FTIR spectral analysis with state-of-the-art neural networks, we aim to provide researchers and policymakers with the data they need to make real environmental changes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
               {[
                 { label: 'Technology', val: 'DL & FTIR' },
                 { label: 'Impact', val: 'Global' },
                 { label: 'Approach', val: 'Scientific' },
                 { label: 'Vision', val: 'AI-First' }
               ].map((stat, i) => (
                 <div key={i} className="p-10 bg-white dark:bg-white/5 border border-primary-500/30 dark:border-white/10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 group">
                    <span className="text-[10px] uppercase font-black text-gray-500 mb-3 block tracking-[0.25em] group-hover:text-primary-800 transition-colors">{stat.label}</span>
                    <p className="text-xl font-bold text-primary-800 dark:text-primary-400 tracking-tighter">{stat.val}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* TEAM MEMBERS SECTION */}
        <section className="space-y-20">
          <div className="text-center space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--heading-color)] tracking-tighter">Core Development Team</h2>
            <p className="text-[var(--text-secondary)] font-medium text-base">The innovative minds building the future of microplastics detection.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {teamMembers.map((member, i) => (
              <div key={i} className="glass-card p-12 text-center space-y-10 group border-primary-500/30 dark:border-white/10 shadow-2xl hover:border-primary-500/50 transition-all hover:-translate-y-3 bg-white dark:bg-white/5">
                <div className="w-32 h-32 rounded-[3rem] bg-white dark:bg-white/5 border border-primary-500/30 dark:border-white/10 mx-auto flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 group-hover:bg-primary-600/10 transition-all shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <member.icon className="w-14 h-14 text-primary-800 dark:text-primary-400 relative z-10" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-[var(--heading-color)] tracking-tighter leading-tight">{member.name}</h3>
                  <p className="text-[11px] font-bold text-primary-800 dark:text-primary-400 uppercase tracking-[0.3em]">{member.role}</p>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-500 font-medium italic leading-relaxed">"{member.desc}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* GUIDES SECTION */}
        <section className="space-y-20 pt-16">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--heading-color)] tracking-tighter">Project Guides & Mentors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {guides.map((guide, i) => (
              <div key={i} className="glass-card p-12 flex flex-col sm:flex-row gap-12 items-start border-primary-500/30 dark:border-white/10 shadow-2xl hover:border-primary-500/50 transition-all hover:-translate-y-2 bg-white dark:bg-white/5">
                <div className="p-6 bg-white dark:bg-primary-500/20 rounded-[2.5rem] shadow-2xl border border-primary-500/30 dark:border-none flex-shrink-0">
                  <UserCheck className="w-14 h-14 text-primary-800 dark:text-primary-400" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-[var(--heading-color)] tracking-tighter leading-tight">{guide.name}</h3>
                  <p className="text-[11px] font-bold text-accent-800 dark:text-accent-400 uppercase tracking-[0.3em]">{guide.designation}</p>
                  <p className="text-base text-gray-800 dark:text-gray-500 font-medium leading-relaxed">{guide.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* JOURNEY SECTION */}
        <section className="space-y-20 pt-16 pb-24">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-[var(--heading-color)] tracking-tighter">Project Journey</h2>
          </div>
          <div className="space-y-10 max-w-5xl mx-auto">
            {timeline.map((event, i) => (
              <div key={i} className="flex flex-col md:flex-row gap-10 items-center p-10 bg-white dark:bg-white/5 border border-primary-500/30 dark:border-white/10 rounded-[3rem] shadow-2xl hover:shadow-[0_20px_50px_rgba(3,105,161,0.2)] hover:border-primary-500/60 transition-all group hover:-translate-y-2">
                <div className="text-primary-900 dark:text-primary-500 font-black text-[11px] uppercase tracking-[0.3em] bg-primary-600/10 px-8 py-4 rounded-[1.5rem] whitespace-nowrap shadow-inner border border-primary-500/20 group-hover:bg-primary-600/20 transition-colors">{event.date}</div>
                <div className="space-y-2 text-center md:text-left flex-1">
                  <h4 className="text-xl font-bold text-[var(--heading-color)] tracking-tighter group-hover:text-primary-800 transition-colors leading-tight">{event.title}</h4>
                  <p className="text-base text-gray-800 dark:text-gray-400 font-medium leading-relaxed">{event.desc}</p>
                </div>
                <ArrowRight className="w-8 h-8 text-primary-500/40 group-hover:text-primary-800 transition-all group-hover:translate-x-3 hidden md:block" />
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;
