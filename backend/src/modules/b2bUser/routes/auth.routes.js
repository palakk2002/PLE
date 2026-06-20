import express from 'express';
import { registerB2BUser, loginB2BUser, logoutB2BUser } from '../controllers/auth.controller.js';
import { authenticate } from '../../../middlewares/authenticate.js';

const router = express.Router();

router.post('/register', registerB2BUser);
router.post('/login', loginB2BUser);
router.post('/logout', authenticate, logoutB2BUser);

export default router;
