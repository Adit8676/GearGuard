import { useEffect } from 'react';

const usePageTitle = (title) => {
  useEffect(() => {
    const fullTitle = title 
      ? `${title} - GearGuard - Powering Smarter Maintenance`
      : 'GearGuard - Powering Smarter Maintenance';
    
    document.title = fullTitle;
  }, [title]);
};

export default usePageTitle;