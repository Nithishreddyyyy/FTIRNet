import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Beaker, PieChart, UploadCloud, FileImage, Settings, LogOut } from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, active }) => (
  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-primary-500/10 text-primary-400 border border-primary-500/20' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}>
    <Icon className="w-5 h-5" />
    <span className="font-medium text-sm">{label}</span>
  </div>
);

const DashboardPreview = () => {
  return (
    <section id="detection" className="py-12 relative z-10 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Analysis Workspace</h2>
          <p className="text-sm text-gray-400">Manage samples and view detailed particle classifications.</p>
        </div>

        {/* Dashboard Container */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="glass rounded-3xl overflow-hidden border border-white/10 flex flex-col md:flex-row min-h-[600px] shadow-2xl relative"
        >
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIvPjwvc3ZnPg==')] opacity-50 z-0" />

          {/* Left Sidebar */}
          <div className="w-full md:w-64 bg-dark-bg/50 border-r border-white/5 p-6 flex flex-col gap-2 relative z-10">
            <div className="mb-6 px-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Menu</span>
            </div>
            <SidebarItem icon={LayoutDashboard} label="Overview" active />
            <SidebarItem icon={Beaker} label="Samples" />
            <SidebarItem icon={PieChart} label="Analytics" />
            
            <div className="mt-8 mb-6 px-4">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</span>
            </div>
            <SidebarItem icon={Settings} label="Preferences" />
            
            <div className="mt-auto pt-8">
              <SidebarItem icon={LogOut} label="Log Out" />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 p-6 md:p-8 relative z-10 flex flex-col gap-8">
            
            {/* Top Analytics Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 h-32 flex flex-col justify-between hover:bg-white/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-2 w-1/3 bg-white/10 rounded-full" />
                    <div className="h-4 w-2/3 bg-white/20 rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 flex-1">
              {/* Upload Area */}
              <div className="xl:col-span-2 glass-card rounded-2xl p-8 border border-white/5 flex flex-col items-center justify-center text-center group cursor-pointer border-dashed">
                <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mb-4 group-hover:bg-primary-500/20 group-hover:scale-110 transition-all duration-300">
                  <UploadCloud className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">Upload Sample Image</h3>
                <p className="text-sm text-gray-400 max-w-sm mb-6">
                  Drag and drop your high-resolution microscope images here, or click to browse files.
                </p>
                <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-full transition-colors">
                  Select Files
                </button>
              </div>

              {/* Recent Uploads */}
              <div className="glass-card rounded-2xl p-6 border border-white/5 flex flex-col">
                <h3 className="text-sm font-medium text-white mb-4">Recent Analyses</h3>
                <div className="space-y-4 flex-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                        <FileImage className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-200 truncate">sample_{1024 + i}_px.png</div>
                        <div className="text-xs text-gray-500">Processed 2h ago</div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    </div>
                  ))}
                </div>
                <button className="w-full py-2 mt-4 text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors">
                  View All Reports &rarr;
                </button>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
