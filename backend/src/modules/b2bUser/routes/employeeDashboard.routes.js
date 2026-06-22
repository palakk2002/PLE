import express from 'express';
import * as directRfqController from '../controllers/directRfq.controller.js';
import { authenticate } from '../../../middlewares/authenticate.js';
import { authorize } from '../../../middlewares/authorize.js';

const router = express.Router();

router.use(authenticate, authorize('b2bEmployee', 'b2bAdmin'));

router.post('/direct-rfq', directRfqController.createDirectRFQ);
router.get('/direct-rfq', directRfqController.getEmployeeDirectRFQs);
router.get('/direct-rfq/:id', directRfqController.getDirectRFQDetail);
router.post('/direct-rfq/:id/message', directRfqController.sendDirectMessage);

export default router;
