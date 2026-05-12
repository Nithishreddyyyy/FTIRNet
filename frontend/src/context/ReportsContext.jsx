import React, { createContext, useState, useCallback, useEffect } from 'react';
import api from '../services/api';

const ReportsContext = createContext();

export const useReports = () => {
  const context = React.useContext(ReportsContext);
  if (!context) {
    throw new Error('useReports must be used within ReportsProvider');
  }
  return context;
};

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const [currentReport, setCurrentReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ limit: 20, offset: 0, total: 0 });

  const fetchReports = useCallback(async (limit, offset) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/reports?limit=${limit || pagination.limit}&offset=${offset || pagination.offset}`
      );
      setReports(response.data.data || []);
      setPagination((prev) => ({
        ...prev,
        total: response.data.pagination?.total || 0,
        limit: limit || prev.limit,
        offset: offset || prev.offset,
        has_more: response.data.pagination?.has_more ?? false,
      }));
    } catch (err) {
      setError(err.message);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, pagination.offset]);

  const fetchReport = useCallback(async (reportId) => {
    try {
      const response = await api.get(`/reports/${reportId}`);
      setCurrentReport(response.data.data || null);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  const createReport = useCallback(async (reportData) => {
    try {
      const response = await api.post('/reports', reportData);
      // Refresh the list after creating
      await fetchReports();
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchReports]);

  const deleteReport = useCallback(async (reportId) => {
    try {
      await api.delete(`/reports/${reportId}`);
      await fetchReports();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [fetchReports]);

  const searchReports = useCallback(async (query, searchBy = 'all') => {
    if (!query || query.trim().length < 2) return [];
    try {
      const response = await api.get(
        `/reports/search?query=${encodeURIComponent(query)}&search_by=${searchBy}`
      );
      return response.data.data || [];
    } catch {
      return [];
    }
  }, []);

  const filterReports = useCallback(async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.polymer) params.set('polymer', filters.polymer);
    if (filters.status) params.set('status', filters.status);
    if (filters.min_confidence !== undefined)
      params.set('min_confidence', filters.min_confidence);
    if (filters.max_confidence !== undefined)
      params.set('max_confidence', filters.max_confidence);

    try {
      const response = await api.get(`/reports/filter?${params.toString()}`);
      setReports(response.data.data || []);
      return response.data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, []);

  // Load reports on mount and when pagination changes
  useEffect(() => {
    if (pagination.limit > 0) {
      fetchReports(pagination.limit, pagination.offset);
    }
  }, [pagination.limit, pagination.offset]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <ReportsContext.Provider
      value={{
        reports,
        currentReport,
        loading,
        error,
        pagination,
        setPagination,
        fetchReports,
        fetchReport,
        createReport,
        deleteReport,
        searchReports,
        filterReports,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
};