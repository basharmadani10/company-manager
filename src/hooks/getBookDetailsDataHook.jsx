// src/hooks/useBookDetailsData.js

import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl";
import { getProjectBookDetailsApi } from "../shared/APIs"; // تأكد من استيراد هذا
import { getAuthToken } from "../shared/Permissions";

/**
 * Custom Hook to fetch details for a single project book.
 * @param {string | number} bookId - The ID of the book to fetch.
 * @returns {object} { bookDetails, loading, error }
 */
const useBookDetailsData = ({ bookId }) => {
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // لا تقم بالجلب إذا لم يكن هناك bookId
    if (!bookId) {
      setLoading(false);
      return;
    }

    const fetchBookDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        };
        // بناء الرابط بشكل صحيح مع الـ ID
        console.log("asfdas");
        const response = await axios.get(`${baseUrl}${getProjectBookDetailsApi}${bookId}`, config);
        // بناءً على هيكل الـ API لديك، البيانات قد تكون في response.data.data
        if (response.data.data ) {
          setBookDetails(response.data.data[0]);
        } else {
            console.warn("Unexpected API response structure:", response.data);
            setError("Could not parse book details from API response.");
        }

      } catch (err) {
        console.error("Error fetching book details:", err);
        setError("Failed to load book details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]); // يتم إعادة الجلب فقط عند تغير bookId

  return { bookDetails, loading, error };
};

export default useBookDetailsData;