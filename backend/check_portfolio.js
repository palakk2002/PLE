import mongoose from 'mongoose';
import dotenv from 'dotenv';
import PortfolioPage from './src/models/PortfolioPage.model.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');
    const page = await PortfolioPage.findOne();
    console.log('PortfolioPage doc:', JSON.stringify(page, null, 2));
    
    // If it's missing fields, let's delete it so it can be recreated with defaults
    if (page && (!page.hero || !page.hero.title1)) {
        console.log('Deleting malformed page document to allow recreation...');
        await PortfolioPage.deleteMany({});
        const newPage = await PortfolioPage.create({});
        console.log('Recreated page doc:', JSON.stringify(newPage, null, 2));
    }
    
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
