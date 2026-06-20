import api from '../../../shared/utils/api';

// ─── Auth ───────────────────────────────────────────────────────────────────
export const loginB2BAdmin = (data) => api.post('/b2b-user/auth/login', data);
export const registerB2BAdmin = (data) => api.post('/b2b-user/auth/register', data);

// ─── Dashboard ──────────────────────────────────────────────────────────────
export const getDashboardOverview = () => api.get('/b2b-user/admin/dashboard');

// ─── Employees ──────────────────────────────────────────────────────────────
export const getEmployees = () => api.get('/b2b-user/admin/employees');
export const createEmployee = (data) => api.post('/b2b-user/admin/employees', data);
export const updateEmployee = (id, data) => api.put(`/b2b-user/admin/employees/${id}`, data);
export const deleteEmployee = (id) => api.delete(`/b2b-user/admin/employees/${id}`);

// ─── Profiles ───────────────────────────────────────────────────────────────
export const getCompanyProfile = () => api.get('/b2b-user/admin/company');
export const updateCompanyProfile = (data) => api.put('/b2b-user/admin/company', data);

export const getAdminProfile = () => api.get('/b2b-user/admin/profile');
export const updateAdminProfile = (data) => api.put('/b2b-user/admin/profile', data);

// ─── Notifications ──────────────────────────────────────────────────────────
export const getNotifications = (page = 1) => api.get('/b2b-user/admin/notifications', { params: { page, limit: 10 } });
export const markNotificationAsRead = (id) => api.put(`/b2b-user/admin/notifications/${id}/read`);
export const markAllNotificationsAsRead = () => api.put('/b2b-user/admin/notifications/read-all');
export const deleteNotification = (id) => api.delete(`/b2b-user/admin/notifications/${id}`);

