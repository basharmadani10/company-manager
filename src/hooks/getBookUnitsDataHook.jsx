// src/hooks/useBookUnitsData.js

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl";
import { getBookUnitsApi } from "../shared/APIs"; // Make sure to add this to your APIs file
import { getAuthToken } from "../shared/Permissions";

/**
 * Custom Hook to fetch units for a specific project book.
 * @param {object} params - The parameters object.
 * @param {string | number} params.bookId - The ID of the book to fetch units for.
 * @returns {{units: Array|null, loading: boolean, error: string|null, refetch: Function}}
 */
const useBookUnitsData = ({ bookId }) => {
  const [units, setUnits] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback to wrap the data fetching logic
  // This allows us to reuse it for the refetch function
  const fetchUnits = useCallback(async () => {
    // Don't fetch if bookId is not provided
    if (!bookId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      };
      
      const response = await axios.get(`${baseUrl}${getBookUnitsApi}${bookId}`, config);
      
      // Check if the response data is a valid array
      if (response.data && Array.isArray(response.data.data)) {
        setUnits(response.data.data);
      } else {
        console.warn("API response for units is not a valid array:", response.data);
        setError("Could not parse units from API response.");
        setUnits([]); // Set to an empty array to prevent UI errors
      }

    } catch (err) {
      console.error("Error fetching book units:", err);
      setError("Failed to load book units. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [bookId]); // This function is rebuilt only when bookId changes

  // useEffect to fetch data when the component mounts
  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  // Return the data, loading state, error, and the refetch function
  return { units, loading, error, refetch: fetchUnits };
};

export default useBookUnitsData;