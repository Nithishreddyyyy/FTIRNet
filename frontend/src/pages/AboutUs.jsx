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
    <div className="min-h-screen pt-24 pb-20 px-6 bg-[#09090b] text-white">
      <div className="max-w-7xl mx-auto space-y-24 relative z-10">
        
        {/* HERO SECTION */}
        <section className="text-center space-y-6 pt-12">
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
            Meet the Team Behind <br />
            <span className="text-cyan-500">Microplastics AI</span>
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A collaborative effort combining AI-powered environmental research, 
            innovative deep learning models, and a shared mission to combat microplastic pollution.
          </p>
        </section>

        {/* PROJECT OVERVIEW CARD */}
        <section className="bg-white/5 border border-white/10 rounded-3xl p-10 md:p-16 relative overflow-hidden">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-widest">
                Our Mission
              </div>
              <h2 className="text-3xl font-bold">Redefining Environmental Analysis with Deep Learning</h2>
              <p className="text-gray-400 leading-relaxed">
                Microplastics AI was born from the need for faster, more accurate detection of microscopic pollutants. By combining FTIR spectral analysis with state-of-the-art neural networks, we aim to provide researchers and policymakers with the data they need to make real environmental changes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
               {[
                 { label: 'Technology', val: 'DL & FTIR' },
                 { label: 'Impact', val: 'Environmental' },
                 { label: 'Approach', val: 'Scientific' },
                 { label: 'Vision', val: 'AI-First' }
               ].map((stat, i) => (
                 <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <span className="text-[10px] uppercase font-bold text-gray-500">{stat.label}</span>
                    <p className="text-lg font-bold text-cyan-400">{stat.val}</p>
                 </div>
               ))}
            </div>
          </div>
        </section>

        {/* TEAM MEMBERS SECTION */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Core Development Team</h2>
            <p className="text-gray-500 mt-2">The innovative minds building the future of microplastics detection.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center space-y-6">
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 mx-auto flex items-center justify-center">
                  <Users className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{member.name}</h3>
                  <p className="text-xs font-semibold text-cyan-400 uppercase">{member.role}</p>
                </div>
                <p className="text-sm text-gray-500 italic">"{member.desc}"</p>
              </div>
            ))}
          </div>
        </section>

        {/* GUIDES SECTION */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Project Guides & Mentors</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {guides.map((guide, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-10 flex gap-6 items-start">
                <div className="p-4 bg-cyan-500/10 rounded-2xl">
                  <UserCheck className="w-8 h-8 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{guide.name}</h3>
                  <p className="text-sm text-purple-400 mb-2">{guide.designation}</p>
                  <p className="text-sm text-gray-500">{guide.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* JOURNEY SECTION */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Project Journey</h2>
          </div>
          <div className="space-y-6 max-w-3xl mx-auto">
            {timeline.map((event, i) => (
              <div key={i} className="flex gap-6 items-center p-6 bg-white/5 border border-white/10 rounded-2xl">
                <div className="text-cyan-500 font-bold whitespace-nowrap">{event.date}</div>
                <div>
                  <h4 className="font-bold">{event.title}</h4>
                  <p className="text-sm text-gray-500">{event.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUs;
