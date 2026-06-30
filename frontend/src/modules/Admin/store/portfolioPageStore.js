import { create } from 'zustand';
import { getPortfolioPage, updatePortfolioPage } from '../services/adminService';
import toast from 'react-hot-toast';

export const usePortfolioPageStore = create((set, get) => ({
  content: null,
  loading: false,
  error: null,

  fetchContent: async () => {
    set({ loading: true, error: null });
    try {
      const res = await getPortfolioPage();
      set({ content: res.data?.data || {}, loading: false });
    } catch (error) {
      console.error('Error fetching Portfolio Page content:', error);
      set({ error: 'Failed to fetch Portfolio Page content', loading: false });
      toast.error('Failed to load Portfolio Page content');
    }
  },

  updateContent: async (section, data) => {
    try {
      const currentContent = get().content || {};
      const payload = {
        ...currentContent,
        [section]: {
          ...currentContent[section],
          ...data
        }
      };

      const res = await updatePortfolioPage(payload);
      set({ content: res.data?.data });
      toast.success('Saved successfully');
      return true;
    } catch (error) {
      console.error(`Error updating Portfolio Page ${section}:`, error);
      toast.error('Failed to save changes');
      return false;
    }
  }
}));
