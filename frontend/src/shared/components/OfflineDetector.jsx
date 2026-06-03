import { useState, useEffect } from 'react';
import offlineWifiImage from '../../assets/offline_wifi.png';

const OfflineDetector = ({ children }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isUserAppPath = !window.location.pathname.startsWith('/admin') && 
                         !window.location.pathname.startsWith('/vendor') && 
                         !window.location.pathname.startsWith('/delivery');

  if (!isOnline && isUserAppPath) {
    return (
      <div className="fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center px-6 text-center">
        <div className="max-w-sm flex flex-col items-center">
          {/* Logo */}
          <img
            src={offlineWifiImage}
            alt="Offline Wifi"
            className="w-40 h-40 object-contain mb-8 animate-pulse"
          />
          {/* Title */}
          <h1 className="text-2xl font-black text-gray-900 mb-3 tracking-tight">
            You are Offline
          </h1>
          {/* Description */}
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            You are not connected to the internet. Please connect to the internet and try again
          </p>
          {/* Reload Button */}
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-[#FF0055] hover:bg-[#E6004C] active:scale-[0.98] text-white py-3.5 px-8 rounded-xl font-bold text-base transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default OfflineDetector;
