// src/hooks/useConsultingCompanyDetailsData.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl";
import { getConsultingCompanyDetailsApi } from "../shared/APIs"; // Make sure to add this to your APIs file
import { getAuthToken } from "../shared/Permissions";

/**
 * Custom Hook to fetch details for a single consulting company.
 * @param {string | number} companyId - The ID of the company to fetch.
 * @returns {object} { companyDetails, loading, error, refetchCompanyDetails }
 */
const useConsultingCompanyDetailsData = ({companyId}) => {
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompanyDetails = useCallback(async () => {
    // Do not fetch if companyId is not provided
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
      console.log(response.data.data) 
      // Assuming the detailed object is in response.data.data
      setCompanyDetails(response.data.data);

    } catch (err) {
      console.error("Failed to fetch company details:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [companyId]); // The function is recreated only when companyId changes

  useEffect(() => {
    // Fetch data on initial mount or when the fetch function itself changes
    fetchCompanyDetails();
  }, [fetchCompanyDetails]);

  // Return the state and the fetch function for manual refetching
  return { companyDetails, loading, error, refetchCompanyDetails: fetchCompanyDetails };
};

export default useConsultingCompanyDetailsData;