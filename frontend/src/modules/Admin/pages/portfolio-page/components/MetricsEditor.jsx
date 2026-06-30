import React from 'react';
import { usePortfolioPageStore } from '../../../store/portfolioPageStore';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';

export default function MetricsEditor() {
  const { content, updateContent } = usePortfolioPageStore();
  const metrics = content?.metrics || {};

  const [formData, setFormData] = React.useState({
    title: '',
    subtitle: '',
    description: '',
    list: []
  });

  React.useEffect(() => {
    if (content?.metrics) {
      setFormData({
        title: content.metrics.title || '',
        subtitle: content.metrics.subtitle || '',
        description: content.metrics.description || '',
        list: content.metrics.list || []
      });
    }
  }, [content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleListChange = (index, field, value) => {
    const newList = [...formData.list];
    if (field === 'numericValue') {
      newList[index][field] = Number(value) || 0;
    } else {
      newList[index][field] = value;
    }
    setFormData((prev) => ({ ...prev, list: newList }));
  };

  const addMetric = () => {
    setFormData((prev) => ({
      ...prev,
      list: [...prev.list, { numericValue: 0, suffix: '', label: '', desc: '', iconName: 'Check' }]
    }));
  };

  const removeMetric = (index) => {
    const newList = [...formData.list];
    newList.splice(index, 1);
    setFormData((prev) => ({ ...prev, list: newList }));
  };

  const handleSave = async () => {
    await updateContent('metrics', formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Metrics Section</h2>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FiSave /> Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subtitle (Badge)</label>
          <input
            type="text"
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg p-2.5"
            rows="2"
          />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Metrics List</h3>
          <button
            onClick={addMetric}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            <FiPlus /> Add Metric
          </button>
        </div>

        <div className="space-y-4">
          {formData.list.map((item, index) => (
            <div key={index} className="flex gap-4 items-start p-4 bg-gray-50 rounded-lg border">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1">Numeric Value (Number only)</label>
                  <input
                    type="number"
                    value={item.numericValue}
                    onChange={(e) => handleListChange(index, 'numericValue', e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Suffix (e.g. +, %)</label>
                  <input
                    type="text"
                    value={item.suffix}
                    onChange={(e) => handleListChange(index, 'suffix', e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Label</label>
                  <input
                    type="text"
                    value={item.label}
                    onChange={(e) => handleListChange(index, 'label', e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Icon Name (lucide)</label>
                  <input
                    type="text"
                    value={item.iconName}
                    onChange={(e) => handleListChange(index, 'iconName', e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={item.desc}
                    onChange={(e) => handleListChange(index, 'desc', e.target.value)}
                    className="w-full border rounded p-2 text-sm"
                  />
                </div>
              </div>
              <button
                onClick={() => removeMetric(index)}
                className="mt-6 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Remove Item"
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
          {formData.list.length === 0 && (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border">
              No metrics added yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
