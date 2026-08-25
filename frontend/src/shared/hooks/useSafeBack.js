import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Hook to safely navigate back in history.
 * If history stack exists in the current session (idx > 0), it steps back naturally via navigate(-1).
 * Otherwise, it safely redirects to fallback path (default '/home').
 */
export const useSafeBack = (fallback = '/home') => {
  const navigate = useNavigate();

  return useCallback(() => {
    if (
      window.history.state &&
      typeof window.history.state.idx === 'number' &&
      window.history.state.idx > 0
    ) {
      navigate(-1);
    } else {
      navigate(fallback, { replace: true });
    }
  }, [navigate, fallback]);
};

export default useSafeBack;
