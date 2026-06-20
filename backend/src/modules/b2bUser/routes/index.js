import express from 'express';
import authRoutes from './auth.routes.js';
import adminDashboardRoutes from './adminDashboard.routes.js';
import employeeDashboardRoutes from './employeeDashboard.routes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/admin', adminDashboardRoutes);
router.use('/employee', employeeDashboardRoutes);

export default router;
