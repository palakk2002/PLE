import { Router } from 'express';
import { 
    getAboutPage, updateAboutPage, 
    getPortfolios, createPortfolio, updatePortfolio, deletePortfolio,
    getPortfolioPage, updatePortfolioPage
} from '../controllers/cms.controller.js';

const router = Router();

// About Page CMS
router.get('/about', getAboutPage);
router.put('/about', updateAboutPage);

// Portfolio CMS
router.get('/portfolio', getPortfolios);
router.post('/portfolio', createPortfolio);
router.put('/portfolio/:id', updatePortfolio);
router.delete('/portfolio/:id', deletePortfolio);

// Portfolio Page CMS (Hero, Metrics, CTA)
router.get('/portfolio-page', getPortfolioPage);
router.put('/portfolio-page', updatePortfolioPage);

export default router;
