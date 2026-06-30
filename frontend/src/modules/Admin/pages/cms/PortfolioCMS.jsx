import { useState, useEffect } from 'react';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getPortfolios, createPortfolio, updatePortfolio, deletePortfolio } from '../../services/adminService';

const PortfolioCMS = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const initialForm = {
    title: '', category: 'development', icon: 'Laptop', image: '', tagline: '', description: '',
    tags: '', statLabel: '', statValue: '', clientUrl: ''
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getPortfolios({ limit: 100 });
      setItems(res.data?.data || []);
    } catch (err) {
      toast.error('Failed to fetch portfolios');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        ...item,
        tags: item.tags?.join(', ') || ''
      });
    } else {
      setEditingItem(null);
      setFormData(initialForm);
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData(initialForm);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      if (editingItem) {
        await updatePortfolio(editingItem._id, payload);
        toast.success('Updated successfully');
      } else {
        await createPortfolio(payload);
        toast.success('Created successfully');
      }
      closeModal();
      fetchData();
    } catch (err) {
      toast.error('Failed to save portfolio');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deletePortfolio(id);
        toast.success('Deleted successfully');
        fetchData();
      } catch (err) {
        toast.error('Failed to delete');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Portfolio Projects</h2>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          <FiPlus /> Add Project
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map(item => (
              <tr key={item._id}>
                <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => openModal(item)} className="text-blue-600 hover:text-blue-900 mr-4"><FiEdit /></button>
                  <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-900"><FiTrash2 /></button>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No portfolios found. Add some!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-2xl my-8">
            <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit Portfolio' : 'Add Portfolio'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full border rounded p-2">
                    <option value="development">Web & App Engineering</option>
                    <option value="automation">Automation & Finance</option>
                    <option value="marketing">SEO & Marketing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Icon Name (lucide)</label>
                  <input type="text" value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL</label>
                  <input type="text" required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tagline</label>
                  <input type="text" required value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Client URL</label>
                  <input type="text" value={formData.clientUrl} onChange={e => setFormData({...formData, clientUrl: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stat Label</label>
                  <input type="text" value={formData.statLabel} onChange={e => setFormData({...formData, statLabel: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stat Value</label>
                  <input type="text" value={formData.statValue} onChange={e => setFormData({...formData, statValue: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                  <input type="text" value={formData.tags} onChange={e => setFormData({...formData, tags: e.target.value})} className="w-full border rounded p-2" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full border rounded p-2" rows="3" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button type="button" onClick={closeModal} className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioCMS;
