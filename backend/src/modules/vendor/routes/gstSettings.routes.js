import express from 'express';
import { authenticate } from '../../../middlewares/authenticate.js';
import { authorize, enforceAccountStatus } from '../../../middlewares/authorize.js';
import {
  getVendorGstSettings,
  updateGlobalGst,
  updateCategoryGst,
  quickUpdateProductGst,
} from '../controllers/gstSettings.controller.js';

const router = express.Router();
const strictVendorAuth = [authenticate, authorize('vendor', 'managed_vendor'), enforceAccountStatus];

router.use(...strictVendorAuth);

router.get('/', getVendorGstSettings);
router.post('/global', updateGlobalGst);
router.post('/category', updateCategoryGst);
router.patch('/product', quickUpdateProductGst);

export default router;
