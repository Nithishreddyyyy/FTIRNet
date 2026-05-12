import React, { createContext, useState, useCallback } from 'react';
import api from '../services/api';

const PredictionContext = createContext();

export const usePrediction = () => {
  const context = React.useContext(PredictionContext);
  if (!context) {
    throw new Error('usePrediction must be used within PredictionProvider');
  }
  return context;
};

export const PredictionProvider = ({ children }) => {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitPrediction = useCallback(async (formData, modelType = 'base_model') => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = modelType === 'base_model'
        ? '/prediction/base_model/prediction'
        : '/prediction/finetuned_model/prediction';

      const response = await api.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const predictionData = response.data;
      setPredictions(prev => [predictionData, ...prev]);
      return predictionData;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(async (limit = 20, offset = 0) => {
    try {
      const response = await api.get(`/history?limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <PredictionContext.Provider
      value={{
        predictions,
        loading,
        error,
        submitPrediction,
        fetchHistory,
        clearError,
      }}
    >
      {children}
    </PredictionContext.Provider>
  );
};