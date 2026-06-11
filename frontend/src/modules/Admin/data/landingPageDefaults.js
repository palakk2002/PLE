export const LANDING_PAGE_DEFAULTS = {
  sections: [
    { id: 'hero', name: 'Hero Section', visible: true, order: 0 },
    { id: 'services', name: 'Services / Categories', visible: true, order: 1 },
    { id: 'whyChooseUs', name: 'Features (Why Choose Us)', visible: true, order: 2 },
    { id: 'comparison', name: 'Comparison Table', visible: true, order: 3 },
    { id: 'stats', name: 'Stats Counter', visible: true, order: 4 },
    { id: 'testimonials', name: 'Testimonials', visible: true, order: 5 },
    { id: 'portfolio', name: 'Product Showcase', visible: true, order: 6 },
    { id: 'pricing', name: 'Deals & Rewards', visible: true, order: 7 },
    { id: 'gallery', name: 'Gallery', visible: true, order: 8 },
    { id: 'presenceMap', name: 'Presence Map', visible: true, order: 9 },
    { id: 'ctaBanner', name: 'CTA Banner', visible: true, order: 10 },
  ],
  hero: {
    tagline: 'REAL DEALS. FAST DELIVERY. HAPPY SHOPPING',
    heading: 'Shop. Save. Smile. Enjoy.',
    subheading: 'Get the best values on top brands. Curated marketplace with lightning-fast delivery and verified sellers.',
    description: 'Explore thousands of products across electronics, fashion, home essentials, and more. Experience shopping redefined.',
    primaryBtnText: 'Explore Deals',
    primaryBtnLink: '#pricing',
    secondaryBtnText: 'Our Services',
    secondaryBtnLink: '#services',
    rotatingPhrases: ['Electronics', 'Fashion', 'Home & Living', 'Groceries', 'Daily Deals', 'Verified Sellers'],
    videoBackground: '/hero-video.mp4',
    imageFallback: '/hero_modern.png',
  },
  services: [
    {
      id: 'web-dev',
      slug: 'website-development',
      title: 'Website Development',
      subtitle: 'High Performance & Stunning Layouts',
      shortDescription: 'We build fast, mobile-friendly websites — from landing pages to full web portals.',
      description: 'Our development team specializes in crafting high-converting, blazing-fast web solutions that represent your brand with prestige.',
      subServices: 'Static sites, CMS, E-commerce, Web Apps',
      icon: 'Globe',
      features: ['Custom Responsive UI/UX Design', 'Modern Single Page Applications', 'High-Speed Performance', 'SEO-Friendly Structure'],
      cta: 'Get Started'
    },
    {
      id: 'app-dev',
      slug: 'mobile-app-development',
      title: 'App Development',
      subtitle: 'Seamless iOS & Android Experiences',
      shortDescription: 'Native and cross-platform mobile apps for iOS and Android.',
      description: 'We develop highly interactive, feature-rich native and cross-platform mobile apps.',
      subServices: 'Flutter, React Native, Android, iOS',
      icon: 'Smartphone',
      features: ['Cross-Platform Apps', 'Highly Intuitive Mobile UI/UX', 'Real-Time Push Notifications', 'Offline Storage & Cloud Sync'],
      cta: 'Get Started'
    },
    {
      id: 'social-media',
      slug: 'social-media-management',
      title: 'Social Media Management',
      subtitle: 'Build an Unforgettable Social Presence',
      shortDescription: 'Consistent, creative content that builds your brand and engages your audience.',
      description: 'Our social media experts curate compelling content and schedule engaging interactions across platforms.',
      subServices: 'Posts, Reels, Stories, Strategy',
      icon: 'Share2',
      features: ['Custom Content Calendar', 'High-Engagement Reels & Stories', 'Community Management', 'Brand Tone Development'],
      cta: 'Get Started'
    },
    {
      id: 'performance-marketing',
      slug: 'performance-marketing',
      title: 'Performance Marketing',
      subtitle: 'Paid Ads, Brand Awareness & Content Strategy',
      shortDescription: 'Data-driven ad campaigns across Google, Meta, and more.',
      description: 'We deploy high-performance outbound marketing models.',
      subServices: 'Google Ads, Meta Ads, A/B Testing',
      icon: 'TrendingUp',
      features: ['Laser-Targeted Google & Social Ads', 'Creative Design & Ad Copywriting', 'Continuous Conversion Optimization'],
      cta: 'Get Started'
    },
    {
      id: 'accounting-finance',
      slug: 'accounting-financial-services',
      title: 'Accounting & Finance',
      subtitle: 'Streamlined Compliance & MIS Reporting',
      shortDescription: 'Indian and US accounting, GST, compliance, bookkeeping.',
      description: 'Manage your operations with absolute precision.',
      subServices: 'GST Filing, ITR, US GAAP, Bookkeeping',
      icon: 'Calculator',
      features: ['Multi-Currency Bookkeeping', 'Tax Planning & Statutory Filings', 'Reconciliation of Accounts', 'Real-Time Cash Flow Analysis'],
      cta: 'Get Started'
    },
    {
      id: 'mis-reporting',
      slug: 'mis-reporting-services',
      title: 'MIS & Reporting Services',
      subtitle: 'SQL, Power BI, Python integrations',
      shortDescription: 'Automated dashboards and reports using Excel, Power BI.',
      description: 'We create automated pipelines using Python scripts and SQL.',
      subServices: 'Excel Dashboards, Power BI, Automation, KPI Reports',
      icon: 'LayoutDashboard',
      features: ['Automated Data Pipelines', 'Custom Power BI Dashboards', 'Python Automation & Web Scraping', 'SQL Query Optimization'],
      cta: 'Get Started'
    }
  ],
  whyChooseUs: [
    { title: 'Economical & Pricing-Friendly', description: 'We deliver top-of-the-line creative solutions at competitive prices.', icon: 'DollarSign' },
    { title: 'Hands-On Tech Experience', description: 'Our team comprises diverse expert minds and seasoned growth marketers.', icon: 'Award' },
    { title: 'Continuous Support & Strategy', description: 'We support you from initial concept drafting through deployment and pivots.', icon: 'Clock' },
    { title: 'Lead-Building Machinery', description: 'Our applications are engineered to actively acquire and capture high-intent leads.', icon: 'Users' }
  ],
  comparison: {
    header: {
      heading: 'The Marketplace Advantage',
      description: 'Shop with more confidence, better value, and less friction. Here is how our marketplace improves the usual online shopping experience.',
      vedhuntColumnHeader: 'Our Marketplace',
      typicalColumnHeader: 'Typical Store',
      bottomNote: 'Customer Shopping Experience Benchmarks 2026'
    },
    rows: [
      { feature: 'Product Range', vedhunt: 'Multiple categories in one cart', typical: 'Limited catalog choices' },
      { feature: 'Pricing', vedhunt: 'Clear deals and visible savings', typical: 'Hidden fees at checkout' },
      { feature: 'Sellers', vedhunt: 'Verified sellers and ratings', typical: 'Limited seller transparency' },
      { feature: 'Checkout', vedhunt: 'Fast, secure payment flow', typical: 'Long and confusing forms' },
      { feature: 'Delivery', vedhunt: 'Order updates from cart to doorstep', typical: 'Unclear delivery timelines' },
      { feature: 'Returns', vedhunt: 'Easy return and support process', typical: 'Complicated return steps' },
      { feature: 'Support', vedhunt: 'Help available when you need it', typical: 'Slow ticket responses' }
    ]
  },
  stats: [
    { value: '15,000+', label: 'Products Listed' },
    { value: '250+', label: 'Verified Sellers' },
    { value: '99.9%', label: 'Secure Checkout' },
    { value: '24/7', label: 'Customer Support' }
  ],
  testimonials: [
    { quote: 'It really met my requirements. You guys were very patient even though there were delays from my side. The price was competitive and all our requirements were met.', author: 'Reshma S.', role: 'E-commerce Founder', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&h=150&fit=crop', country: 'India', countryFlag: '🇮🇳' },
    { quote: 'Working with PLE was extremely professional. They took our complex reporting workflow and transformed it into a fully automated Power BI dashboard.', author: 'Piyush K.', role: 'Finance Director', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&h=150&fit=crop', country: 'India', countryFlag: '🇮🇳' },
    { quote: 'Their SEO service is top-notch. Our organic search leads increased by nearly 180% within four months. They are very analytical and direct with their projections.', author: 'Shweta G.', role: 'Real Estate Marketer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&h=150&fit=crop', country: 'United States', countryFlag: '🇺🇸' }
  ],
  products: [
    { id: 1, name: 'Wireless Noise-Cancelling Headphones', price: '₹4,999', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300&h=300&fit=crop', link: '#', featured: true },
    { id: 2, name: 'Minimalist Leather Watch', price: '₹2,499', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300&h=300&fit=crop', link: '#', featured: true },
    { id: 3, name: 'Ergonomic Office Chair', price: '₹8,999', image: 'https://images.unsplash.com/photo-1580481072645-022f9a6dbf27?q=80&w=300&h=300&fit=crop', link: '#', featured: true }
  ],
  pricing: [
    {
      id: 'pricing-1',
      title: 'Basic Plan',
      description: 'Ideal for small projects and initial experiments.',
      price: '₹9,999',
      period: '/one-time',
      features: ['1 Website Project', 'Standard Responsive Layout', 'Basic SEO Setup', '2 Revisions', '5 Business Days Delivery'],
      ctaText: 'Get Started',
      highlight: false
    },
    {
      id: 'pricing-2',
      title: 'Growth Plan',
      description: 'Best for growing businesses wanting custom designs.',
      price: '₹24,999',
      period: '/one-time',
      features: ['1 Premium React/WordPress Project', 'Full UI/UX Tailoring', 'Advanced SEO & Analytics', 'Unlimited Revisions', '10 Business Days Delivery', 'Priority 24/7 Support'],
      ctaText: 'Choose Growth',
      highlight: true
    },
    {
      id: 'pricing-3',
      title: 'Enterprise Plan',
      description: 'Complete custom workflow and API integration.',
      price: '₹59,999',
      period: '/one-time',
      features: ['Full Web Portal or Native App', 'Advanced Animations & API integration', 'Dedicated PM & Architecture support', 'Lifetime Maintenance (1 Year)', 'Custom MIS Analytics Dashboard'],
      ctaText: 'Contact Enterprise',
      highlight: false
    }
  ],
  gallery: [
    { id: 'gal-1', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=400&h=300&fit=crop', title: 'Modern Workspace' },
    { id: 'gal-2', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=400&h=300&fit=crop', title: 'Data Analytics Chart' },
    { id: 'gal-3', url: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400&h=300&fit=crop', title: 'Co-working Collaboration' }
  ],
  presenceMap: {
    heading: 'Our Presence',
    description: 'From thriving startup ecosystems to rapidly growing business hubs, our network spans across the nation—helping us deliver innovation, collaboration, and technology without boundaries.',
    locations: [
      { name: 'Karnataka', top: '72%', left: '41%' }
    ]
  },
  ctaBanner: {
    heading: 'Ready to elevate your business operations?',
    description: 'Get in touch with our team today and discover how our solutions can accelerate your growth.',
    primaryBtnText: 'Get Free Estimate',
    primaryBtnLink: '#pricing',
    secondaryBtnText: 'Read Success Stories',
    secondaryBtnLink: '/portfolio'
  },
  faq: [
    { question: 'What services does PLE offer?', answer: 'We offer Website Development, App Development, Social Media Management, Performance Marketing, Accounting & Finance, and MIS Reporting.' },
    { question: 'What is the typical delivery timeline?', answer: 'Simple projects take 5–10 working days, while complex web portals or mobile apps can take 15–30 working days.' },
    { question: 'Do you offer post-launch support?', answer: 'Yes, we provide ongoing maintenance, analytics tracking, and conversion optimization updates.' }
  ],
  contact: {
    phone: '+91 86524 10289',
    phoneDisplay: '+91 86524 10289',
    email: 'support@ple.in',
    hours: 'Mon – Fri: 8:00am – 7:00pm',
    cin: 'CIN - U62099MH2025PTC447275',
    registration: 'Company Registration: CIN - U62099MH2025PTC447275',
    copyright: '© 2026 PLE (Peoples League of Electronics). All Rights Reserved.'
  },
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com',
  },
  footer: {
    text: 'People’s League of Electronics (PLE) is a unified service ecosystem delivering next-generation digital products, high-yield growth marketing, and robust compliance management.',
    copyright: '© 2026 PLE. All Rights Reserved.'
  },
  seo: {
    metaTitle: 'PLE - Peoples League of Electronics',
    metaDescription: 'Unifying digital development, performance marketing, and business-focused finance services under one roof.',
    keywords: 'electronics, web development, app development, marketing, accounting'
  },
  blogs: [
    { id: 1, title: 'The Future of Web Development: What to Expect in 2026', category: 'DEVELOPMENT', date: 'May 12, 2026', excerpt: 'Explore the latest trends in web development, from AI-driven coding to the rise of edge computing.', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&h=500&fit=crop', author: 'Andrew Wills' },
    { id: 2, title: 'Mastering Brand Identity in a Digital-First World', category: 'BRANDING', date: 'May 08, 2026', excerpt: 'How to build a brand that resonates with modern consumers and stands out.', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&h=500&fit=crop', author: 'Alisha Smith' }
  ],
  adLandingPages: {
    'website-development': {
      title: 'Get a Professional Website Starting at ₹15,000',
      subtitle: 'Mobile-friendly, fast, and built to convert visitors into customers.',
      primaryCta: 'Get Free Website Quote',
      problem: 'Struggling with a slow, outdated website that doesn’t generate leads?',
      solution: 'We build blazingly fast, modern websites optimized for SEO and conversion.',
      highlights: [
        { title: 'Custom Design', desc: 'No cookie-cutter templates. 100% bespoke designs.' },
        { title: 'SEO Optimized', desc: 'Built to rank higher on Google from day one.' }
      ]
    },
    'app-development': {
      title: 'Custom Mobile App Development for Your Business',
      subtitle: 'High-performance iOS and Android apps designed for scale and user engagement.',
      primaryCta: 'Get App Development Quote',
      problem: 'Does your business need a reliable mobile app but you lack the technical team?',
      solution: 'PLE provides end-to-end mobile app development.',
      highlights: [
        { title: 'Cross-Platform', desc: 'One codebase for both iOS and Android.' },
        { title: 'Scalable Architecture', desc: 'Built to handle millions of active users.' }
      ]
    }
  }
};
