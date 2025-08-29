// src/hooks/useBookDetailsData.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl";
import { getProjectBookDetailsApi } from "../shared/APIs";
import { getAuthToken } from "../shared/Permissions";

/**
 * Custom Hook to fetch details for a single project book.
 * @param {string | number} bookId - The ID of the book to fetch.
 * @returns {object} { bookDetails, loading, error, refetchBookDetails }
 */
const useBookDetailsData = (bookId) => {
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookDetails = useCallback(async () => {
    // Do not fetch if bookId is not provided
    if (!bookId) {
      setLoading(false);
      setError(new Error("No book ID provided."));
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
      const apiUrl = `${baseUrl}${getProjectBookDetailsApi}${bookId}`;
      
      const response = await axios.get(apiUrl, config);
      
      // Assuming the detailed object is in response.data.data
      setBookDetails(response.data.data);

    } catch (err) {
      console.error("Failed to fetch book details:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [bookId]); // The function is recreated only when bookId changes

  useEffect(() => {
    // Fetch data on initial mount or when the fetch function itself changes
    fetchBookDetails();
  }, [fetchBookDetails]);

  // Return the state and the fetch function for manual refetching
  return { bookDetails, loading, error, refetchBookDetails: fetchBookDetails };
};

export default useBookDetailsData;