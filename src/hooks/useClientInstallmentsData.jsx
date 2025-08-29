// src/hooks/useClientInstallmentsData.js

import { useState, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl";
import { getClientInstallmentsApi } from "../shared/APIs";
import { getAuthToken } from "../shared/Permissions";

const useClientInstallmentsData = ({ unitId, clientId }) => { 
  const [installments, setInstallments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInstallments = useCallback(async () => {
    // Don't fetch if IDs are not provided
    if (!unitId || !clientId) { 
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const config = { headers: { 'Authorization': `Bearer ${getAuthToken()}` } };
      

      const response = await axios.get(`${baseUrl}${getClientInstallmentsApi}/${unitId}/${clientId}`, config);
      
      if (response.data && Array.isArray(response.data.data)) {
        setInstallments(response.data.data);
      } else {
        console.warn("API response for installments is not a valid array:", response.data);
        setError("Could not parse installments from API response.");
        setInstallments([]);
      }

    } catch (err) {
      console.error("Error fetching client installments:", err);
      setError("Failed to load client installments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [unitId, clientId]); // <-- CHANGED: from bookId to unitId

  return { installments, loading, error, fetchInstallments };
};

export default useClientInstallmentsData;