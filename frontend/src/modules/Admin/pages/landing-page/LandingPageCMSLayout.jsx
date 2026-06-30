import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useLandingPageStore } from '../../store/landingPageStore';
import { FiLoader } from 'react-icons/fi';

const LandingPageCMSLayout = () => {
  const fetchInitialData = useLandingPageStore(state => state.fetchInitialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      await fetchInitialData();
      setLoading(false);
    };
    load();
  }, [fetchInitialData]);

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <FiLoader className="animate-spin text-[#C07A3D] w-8 h-8" />
      </div>
    );
  }

  return <Outlet />;
};

export default LandingPageCMSLayout;
