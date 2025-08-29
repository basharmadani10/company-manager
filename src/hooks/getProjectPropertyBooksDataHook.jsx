import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl";
import { getProjectBookDetailsApi, getProjectBooksApi } from "../shared/APIs"; // افترض وجود هذا المسار
import { getAuthToken } from "../shared/Permissions";

const useProjectPropertyBooksData = ({ projectId }) => {
  const [propertyBooks, setPropertyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetchPropertyBooks = useCallback(async () => {
    if (!projectId) {
      setPropertyBooks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}` } };
      const response = await axios.get(`${baseUrl}${getProjectBooksApi}${projectId}`, config);
      setPropertyBooks(response.data.data || []);
    } catch (err) {
      console.error("Error fetching property books:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    refetchPropertyBooks();
  }, [refetchPropertyBooks]);

  return { propertyBooks, loading, error, refetchPropertyBooks };
};

export default useProjectPropertyBooksData;