import { useState, useEffect } from 'react';
import { PortfolioData, initialData } from './data';

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('portfolioData_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.profile && parsed.profile.logoUrl === undefined) {
          parsed.profile.logoUrl = initialData.profile.logoUrl;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse portfolio data', e);
      }
    }
    return initialData;
  });

  useEffect(() => {
    localStorage.setItem('portfolioData_v2', JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolioData_v2' && e.newValue) {
        try {
          setData(JSON.parse(e.newValue));
        } catch (err) {
          console.error('Failed to parse portfolio data from storage event', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const updateProfile = (profile: PortfolioData['profile']) => {
    setData(prev => ({ ...prev, profile }));
  };

  const updateExperiences = (experiences: PortfolioData['experiences']) => {
    setData(prev => ({ ...prev, experiences }));
  };

  const updateProjects = (projects: PortfolioData['projects']) => {
    setData(prev => ({ ...prev, projects }));
  };

  const updateSkills = (skills: PortfolioData['skills']) => {
    setData(prev => ({ ...prev, skills }));
  };

  return {
    data,
    updateProfile,
    updateExperiences,
    updateProjects,
    updateSkills,
    setData
  };
}
