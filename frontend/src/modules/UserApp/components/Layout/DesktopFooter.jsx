import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import appLogoBlack from "../../../../assets/PLELOGOBLACK.jpg";
import appLogoWhite from "../../../../assets/PLEwhite.png";
import { useThemeStore } from "../../../../shared/store/themeStore";
import { useState } from 'react';
import toast from 'react-hot-toast';

const DesktopFooter = () => {
  const { theme } = useThemeStore();
  const [email, setEmail] = useState('');

  const appLogo = {
    src: theme === "dark" ? appLogoBlack : appLogoWhite,
    alt: "PLE Logo",
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    toast.success("Thank you for subscribing to our newsletter!");
    setEmail('');
  };

  return (
    <footer className="hidden md:block bg-[#f3f4f6] dark:bg-[#080808] border-t border-gray-200 dark:border-neutral-900 transition-colors duration-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 md:px-12 lg:px-24 xl:px-40 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-6">
            <Link to="/home" className="flex items-center gap-2">
              {appLogo.src ? (
                <img
                  src={appLogo.src}
                  alt={appLogo.alt}
                  className="h-14 w-auto object-contain"
                />
              ) : (
                <span className="text-2xl font-bold text-primary-600">PLE</span>
              )}
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Your ultimate destination for curated premium fashion, tech, baby care, and everyday essentials. Experience quality and luxury delivered to your doorstep.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-gray-100 hover:bg-primary-50 text-gray-600 hover:text-primary-600 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-gray-400 dark:hover:text-primary-400 transition-all duration-300">
                <FiFacebook className="text-lg" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-gray-100 hover:bg-primary-50 text-gray-600 hover:text-primary-600 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-gray-400 dark:hover:text-primary-400 transition-all duration-300">
                <FiInstagram className="text-lg" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-gray-100 hover:bg-primary-50 text-gray-600 hover:text-primary-600 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-gray-400 dark:hover:text-primary-400 transition-all duration-300">
                <FiTwitter className="text-lg" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-full bg-gray-100 hover:bg-primary-50 text-gray-600 hover:text-primary-600 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:text-gray-400 dark:hover:text-primary-400 transition-all duration-300">
                <FiLinkedin className="text-lg" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-6">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/home" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
                  Offers
                </Link>
              </li>
              <li>
                <Link to="/search?condition=refurbished" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
                  Refurbished
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-6">
              Customer Support
            </h3>
            <ul className="space-y-4">
              <li>
                <Link to="/help-support" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
                  Help & Support
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/return-policy" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
                  Return Policy
                </Link>
              </li>
              <li>
                <Link to="/user-agreement" className="text-sm text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200">
                  User Agreement
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter & Contact */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase tracking-wider mb-4">
                Subscribe to Newsletter
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Be the first to hear about special offers, new arrivals, and events.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-2 text-sm bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-500 dark:text-gray-300 placeholder-gray-400"
                  required
                />
                <button
                  type="submit"
                  className="p-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors flex items-center justify-center"
                >
                  <FiSend />
                </button>
              </form>
            </div>
            
            {/* Contact Details */}
            <div className="flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <FiMail className="flex-shrink-0 text-gray-400" />
                <span>support@ple.com</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="flex-shrink-0 text-gray-400" />
                <span>+1 (555) 019-2834</span>
              </div>
              <div className="flex items-center gap-2">
                <FiMapPin className="flex-shrink-0 text-gray-400" />
                <span>100 E-Commerce Way, Suite 400</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Credits */}
      <div className="border-t border-gray-200 dark:border-neutral-900 py-6 transition-colors duration-300">
        <div className="container mx-auto px-4 md:px-12 lg:px-24 xl:px-40 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400 dark:text-gray-500">
          <span>&copy; {new Date().getFullYear()} PLE Inc. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-primary-600 transition-colors">Privacy</Link>
            <Link to="/terms-conditions" className="hover:text-primary-600 transition-colors">Terms</Link>
            <Link to="/help-support" className="hover:text-primary-600 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default DesktopFooter;
