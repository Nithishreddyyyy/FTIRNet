import React, { createContext, useState, useCallback } from 'react';
import api from '../services/api';

const DashboardContext = createContext();

export const useDashboard = () => {
  const context = React.useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [polymerDistribution, setPolymerDistribution] = useState({});
  const [modelUsage, setModelUsage] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, distRes, modelRes] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get('/dashboard/polymer-distribution'),
        api.get('/dashboard/model-usage'),
      ]);
      setStats(statsRes.data.data || {});
      setPolymerDistribution(distRes.data.distribution || {});
      setModelUsage(modelRes.data.model_usage || {});
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        stats,
        polymerDistribution,
        modelUsage,
        loading,
        error,
        fetchStats,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};