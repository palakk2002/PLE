import { useState, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getAboutContent, updateAboutContent } from '../../services/adminService';

const AboutCMS = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getAboutContent();
      setContent(res.data || {});
    } catch (err) {
      toast.error('Failed to fetch About content');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateAboutContent(content);
      toast.success('About content updated successfully');
    } catch (err) {
      toast.error('Failed to update About content');
    }
  };

  const handleChange = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleRootChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (loading || !content) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">About Page Content</h2>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
          <FiSave /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Hero Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-4">Hero Section</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" value={content.hero?.title || ''} onChange={e => handleChange('hero', 'title', e.target.value)} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input type="text" value={content.hero?.subtitle || ''} onChange={e => handleChange('hero', 'subtitle', e.target.value)} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={content.hero?.description || ''} onChange={e => handleChange('hero', 'description', e.target.value)} className="w-full border rounded p-2" rows="3" />
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-lg mb-4">Vision Section</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={content.vision?.title || ''} onChange={e => handleChange('vision', 'title', e.target.value)} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={content.vision?.description || ''} onChange={e => handleChange('vision', 'description', e.target.value)} className="w-full border rounded p-2" rows="4" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="font-semibold text-lg mb-4">Mission Section</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input type="text" value={content.mission?.title || ''} onChange={e => handleChange('mission', 'title', e.target.value)} className="w-full border rounded p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea value={content.mission?.description || ''} onChange={e => handleChange('mission', 'description', e.target.value)} className="w-full border rounded p-2" rows="4" />
              </div>
            </div>
          </div>
        </div>

        {/* What We Do */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-4">What We Do</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input type="text" value={content.whatWeDoTitle || ''} onChange={e => handleRootChange('whatWeDoTitle', e.target.value)} className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea value={content.whatWeDoDescription || ''} onChange={e => handleRootChange('whatWeDoDescription', e.target.value)} className="w-full border rounded p-2" rows="3" />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AboutCMS;
