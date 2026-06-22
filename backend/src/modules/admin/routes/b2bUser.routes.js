import express from 'express';
import {
    getAllB2BUsers,
    getB2BUserDetail,
    updateB2BUserStatus,
    deleteB2BUser
} from '../controllers/b2bUser.controller.js';
import { authenticate } from '../../../middlewares/authenticate.js';
import { authorize } from '../../../middlewares/authorize.js';

const router = express.Router();

// Apply admin protection to all routes in this file
router.use(authenticate, authorize('admin'));

router.get('/', getAllB2BUsers);
router.get('/:id', getB2BUserDetail);
router.patch('/:id/status', updateB2BUserStatus);
router.delete('/:id', deleteB2BUser);

export default router;
