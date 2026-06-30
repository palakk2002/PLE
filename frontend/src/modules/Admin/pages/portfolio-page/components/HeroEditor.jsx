import React from 'react';
import { usePortfolioPageStore } from '../../../store/portfolioPageStore';
import { FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function HeroEditor() {
  const { content, updateContent } = usePortfolioPageStore();
  const hero = content?.hero || {};

  const [formData, setFormData] = React.useState({
    title1: '',
    title2: '',
    subtitle: '',
    description: ''
  });

  React.useEffect(() => {
    if (content?.hero) {
      setFormData({
        title1: content.hero.title1 || '',
        title2: content.hero.title2 || '',
        subtitle: content.hero.subtitle || '',
        description: content.hero.description || ''
      });
    }
  }, [content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await updateContent('hero', formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Hero Section</h2>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiSave /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">Title Part 1 (Standard text)</label>
          <input
            type="text"
            name="title1"
            value={formData.title1}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5"
            placeholder="Proven Engineering Standards"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title Part 2 (Gradient text)</label>
          <input
            type="text"
            name="title2"
            value={formData.title2}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5"
            placeholder="& Strategic Growth"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Subtitle (Accent tag)</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5"
            placeholder="Success Showcases"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5"
            rows="4"
          />
        </div>
      </div>
    </div>
  );
}
