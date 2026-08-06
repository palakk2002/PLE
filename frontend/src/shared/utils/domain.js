/**
 * Utility helper to determine the current execution domain/hostname.
 * Support landing (plebusiness.com) and portal (peoplesleagueofelectronics.com).
 * Includes development overrides for localhost testing.
 */

export const getCurrentDomain = () => {
  if (typeof window === 'undefined') return 'landing';

  const hostname = window.location.hostname;

  // developer testing overrides
  const override = localStorage.getItem('domain_override');
  if (override === 'landing' || override === 'portal') {
    return override;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const domainParam = urlParams.get('__domain');
  if (domainParam === 'landing' || domainParam === 'portal') {
    localStorage.setItem('domain_override', domainParam);
    return domainParam;
  }

  // Production domain mapping
  if (hostname.includes('plebusiness.com')) {
    return 'landing';
  }
  if (hostname.includes('peoplesleagueofelectronics.com')) {
    return 'portal';
  }

  // Default fallback for development (if no localStorage override is set)
  return 'landing';
};

export const isLandingDomain = () => getCurrentDomain() === 'landing';
export const isPortalDomain = () => getCurrentDomain() === 'portal';
