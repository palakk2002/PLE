import React from 'react';
import { usePortfolioPageStore } from '../../../store/portfolioPageStore';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function CTAEditor() {
  const { content, updateContent } = usePortfolioPageStore();
  const cta = content?.cta || {};

  const [formData, setFormData] = React.useState({
    title1: '',
    title2: '',
    subtitle: '',
    buttonText: '',
    buttonLink: '',
    features: []
  });

  React.useEffect(() => {
    if (content?.cta) {
      setFormData({
        title1: content.cta.title1 || '',
        title2: content.cta.title2 || '',
        subtitle: content.cta.subtitle || '',
        buttonText: content.cta.buttonText || '',
        buttonLink: content.cta.buttonLink || '',
        features: content.cta.features || []
      });
    }
  }, [content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index][field] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { text: '', iconName: 'Check' }]
    }));
  };

  const removeFeature = (index) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const handleSave = async () => {
    await updateContent('cta', formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Call to Action (CTA) Section</h2>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiSave /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Title Part 1</label>
          <input
            type="text"
            name="title1"
            value={formData.title1}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5"
            placeholder="Ready to Build Your"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Title Part 2 (Gradient)</label>
          <input
            type="text"
            name="title2"
            value={formData.title2}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5"
            placeholder="Digital Legacy?"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Subtitle (Badge)</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5"
            placeholder="Let's Collaborate"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Button Text</label>
          <input
            type="text"
            name="buttonText"
            value={formData.buttonText}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Button Link</label>
          <input
            type="text"
            name="buttonLink"
            value={formData.buttonLink}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Features List</h3>
          <button
            onClick={addFeature}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            <FiPlus /> Add Feature
          </button>
        </div>

        <div className="space-y-4">
          {formData.features.map((item, index) => (
            <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Feature Text</label>
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => handleFeatureChange(index, 'text', e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Icon Name (lucide)</label>
                  <input
                    type="text"
                    value={item.iconName}
                    onChange={(e) => handleFeatureChange(index, 'iconName', e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
              </div>
              <button
                onClick={() => removeFeature(index)}
                className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove Item"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          {formData.features.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border">
              No features added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
