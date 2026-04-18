import { useState, useEffect } from 'react';
import { PortfolioData, initialData } from './data';

const API_BASE = '/api';

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [loading, setLoading] = useState(true);

  // Load data from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_BASE}/portfolio`);
        if (response.ok) {
          const result = await response.json();
          if (result.profile) {
            // FIX: Sanitise hardcoded localhost URLs for production
            Object.keys(result.profile).forEach(key => {
              const value = result.profile[key];
              if (typeof value === 'string' && value.includes('localhost:5000')) {
                result.profile[key] = value.split('5000')[1];
                console.log(`🛡️ SENTINELL: Sanitised URL for ${key}`);
              }
            });
            result.profile = { ...initialData.profile, ...result.profile };
          }
          setData(result);
        } else {
          console.log('Using initial data (portfolio not found on server)');
        }
      } catch (err) {
        console.error('Failed to fetch from backend, using initial data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Sync with backend on change
  const syncWithBackend = async (updatedData: PortfolioData) => {
    const token = localStorage.getItem('adminToken');
    if (!token) return; // Don't sync if not logged in

    try {
      const response = await fetch(`${API_BASE}/portfolio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        throw new Error('Failed to sync with backend');
      }
    } catch (err) {
      console.error('Sync error:', err);
    }
  };

  const updateProfile = (profile: PortfolioData['profile']) => {
    const newData = { ...data, profile };
    setData(newData);
    syncWithBackend(newData);
  };

  const updateExperiences = (experiences: PortfolioData['experiences']) => {
    const newData = { ...data, experiences };
    setData(newData);
    syncWithBackend(newData);
  };

  const updateProjects = (projects: PortfolioData['projects']) => {
    const newData = { ...data, projects };
    setData(newData);
    syncWithBackend(newData);
  };

  const updateSkills = (skills: PortfolioData['skills']) => {
    const newData = { ...data, skills };
    setData(newData);
    syncWithBackend(newData);
  };

  const updateFeatures = (features: PortfolioData['features']) => {
    const newData = { ...data, features };
    setData(newData);
    syncWithBackend(newData);
  };

  return {
    data,
    loading,
    updateProfile,
    updateExperiences,
    updateProjects,
    updateSkills,
    updateFeatures,
    setData
  };
}
