import asyncHandler from '../../../utils/asyncHandler.js';
import ApiResponse from '../../../utils/ApiResponse.js';
import ApiError from '../../../utils/ApiError.js';
import AboutPage from '../../../models/AboutPage.model.js';
import Portfolio from '../../../models/Portfolio.model.js';
import PortfolioPage from '../../../models/PortfolioPage.model.js';

// --- ABOUT PAGE CONTROLLERS ---

export const getAboutPage = asyncHandler(async (req, res) => {
    let about = await AboutPage.findOne();
    if (!about) {
        // Create default if none exists
        about = await AboutPage.create({});
    }
    res.status(200).json(new ApiResponse(200, about, 'About page content fetched successfully'));
});

export const updateAboutPage = asyncHandler(async (req, res) => {
    let about = await AboutPage.findOne();
    if (!about) {
        about = new AboutPage(req.body);
        await about.save();
    } else {
        about = await AboutPage.findOneAndUpdate({}, req.body, { new: true, runValidators: true });
    }
    res.status(200).json(new ApiResponse(200, about, 'About page content updated successfully'));
});


// --- PORTFOLIO CONTROLLERS ---

export const getPortfolios = asyncHandler(async (req, res) => {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;

    const numericPage = Math.max(Number(page) || 1, 1);
    const numericLimit = Math.max(Number(limit) || 10, 1);
    const skip = (numericPage - 1) * numericLimit;

    const portfolios = await Portfolio.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numericLimit);
    
    const total = await Portfolio.countDocuments(filter);

    res.status(200).json(new ApiResponse(200, {
        data: portfolios,
        pagination: {
            page: numericPage,
            limit: numericLimit,
            total,
            totalPages: Math.ceil(total / numericLimit)
        }
    }, 'Portfolios fetched successfully'));
});

export const createPortfolio = asyncHandler(async (req, res) => {
    const portfolio = await Portfolio.create(req.body);
    res.status(201).json(new ApiResponse(201, portfolio, 'Portfolio item created successfully'));
});

export const updatePortfolio = asyncHandler(async (req, res) => {
    const portfolio = await Portfolio.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!portfolio) throw new ApiError(404, 'Portfolio item not found');
    res.status(200).json(new ApiResponse(200, portfolio, 'Portfolio item updated successfully'));
});

export const deletePortfolio = asyncHandler(async (req, res) => {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);
    if (!portfolio) throw new ApiError(404, 'Portfolio item not found');
    res.status(200).json(new ApiResponse(200, null, 'Portfolio item deleted successfully'));
});

// ==========================================
// PORTFOLIO PAGE CONTENT CMS
// ==========================================

export const getPortfolioPage = asyncHandler(async (req, res) => {
    let page = await PortfolioPage.findOne();

    // If there is no page OR if the page is completely empty/corrupt (no hero title AND no metrics), force a reset to defaults
    if (!page || (page && !page.hero?.title1 && (!page.metrics?.list || page.metrics.list.length === 0))) {
        await PortfolioPage.deleteMany({});
        page = await PortfolioPage.create({
            hero: {
                title1: 'Proven Engineering Standards',
                title2: '& Strategic Growth',
                subtitle: 'Success Showcases',
                description: 'Explore our real-world portfolio of partnerships across India. From full-scale multivendor e-commerce hubs and automated inventory sync tools, to organic shopping SEO domination and high-converting retail user experience (UX) pipelines.'
            },
            metrics: {
                title: 'Concrete Metrics. Exceptional Outcomes.',
                subtitle: 'Demonstrated Proof',
                description: 'We focus on measurable statistics. From performance scores and user acquisition speeds, to manual administrative hours eliminated.',
                list: [
                    { numericValue: 140, suffix: '+', label: 'E-commerce Hubs Launched', desc: 'Secure digital storefronts and multivendor marketplaces.', iconName: 'Zap' },
                    { numericValue: 99, suffix: '%', label: 'Order Delivery Success Rate', desc: 'Smooth shipping updates from checkout to doorstep.', iconName: 'Award' },
                    { numericValue: 300, suffix: '%+', label: 'Average Conversions Growth', desc: 'Acquisition increase across digital shopping funnels.', iconName: 'Share2' },
                    { numericValue: 25, suffix: ' Hrs', label: 'Saved per Week', desc: 'Through automated logistics, shipping and stock sync.', iconName: 'Database' }
                ]
            },
            cta: {
                title1: 'Ready to Build Your',
                title2: 'Digital Legacy?',
                subtitle: "Let's Collaborate",
                features: [
                    { text: 'Free Visual Mockup Draft', iconName: 'Sparkles' },
                    { text: 'Direct Engineering Channel', iconName: 'Laptop' },
                    { text: 'High-Performance Launch', iconName: 'Zap' }
                ],
                buttonText: 'Start a Project',
                buttonLink: '/get-quote'
            }
        });
    }
    res.status(200).json(new ApiResponse(200, page, 'Portfolio Page content fetched successfully'));
});

export const updatePortfolioPage = asyncHandler(async (req, res) => {
    const { hero, metrics, cta } = req.body;
    let page = await PortfolioPage.findOne();
    
    if (!page) {
        page = await PortfolioPage.create(req.body);
    } else {
        if (hero) page.hero = hero;
        if (metrics) page.metrics = metrics;
        if (cta) page.cta = cta;
        await page.save();
    }
    
    res.status(200).json(new ApiResponse(200, page, 'Portfolio Page content updated successfully'));
});
