import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLayout, FiImage, FiSettings, FiGrid, FiFeather, FiStar } from 'react-icons/fi';
import { useAboutPageStore } from '../../store/aboutPageStore';
import toast from 'react-hot-toast';

const AboutPageDashboard = () => {
  const navigate = useNavigate();
  const { fetchInitialData, isLoading } = useAboutPageStore();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const sections = [
    { id: 'hero', title: 'Hero Section', desc: 'Main titles, stats, and background image', icon: <FiLayout />, path: '/admin/about-page/hero' },
    { id: 'company', title: 'About Company', desc: 'Founder info, dual images, and core paragraphs', icon: <FiImage />, path: '/admin/about-page/company' },
    { id: 'what-we-do', title: 'What We Do', desc: 'Grid of features (Smart Shopping, etc)', icon: <FiGrid />, path: '/admin/about-page/what-we-do' },
    { id: 'vision-mission', title: 'Vision & Mission', desc: 'Company vision and mission statements', icon: <FiFeather />, path: '/admin/about-page/vision-mission' },
    { id: 'our-edge', title: 'Our Edge', desc: 'Why shoppers trust PLE (4 steps)', icon: <FiStar />, path: '/admin/about-page/our-edge' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">About Page CMS</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage sections and content for the About Page</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12 text-gray-400">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white rounded-xl border border-gray-100 p-5 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-primary/20"
              onClick={() => navigate(section.path)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{section.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{section.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AboutPageDashboard;
