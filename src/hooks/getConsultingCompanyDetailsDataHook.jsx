// src/hooks/getConsultingCompanyDetailsDataHook.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl";
import { getConsultingCompanyDetailsApi } from "../shared/APIs";
import { getAuthToken } from "../shared/Permissions";

const useConsultingCompanyDetailsData = (companyId) => {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanyDetails = useCallback(async () => {
    if (!companyId) {
      setLoading(false);
      setError(new Error("No company ID provided."));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      
      // Construct the dynamic API URL
      const apiUrl = `${baseUrl}${getConsultingCompanyDetailsApi}${companyId}`;
      
      const response = await axios.get(apiUrl, config);
      
      setCompany(response.data.data);
    } catch (err) {
      console.error("Failed to fetch company details:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchCompanyDetails();
  }, [fetchCompanyDetails]);

  return { company, loading, error, refetchCompanyDetails: fetchCompanyDetails };
};

export default useConsultingCompanyDetailsData;