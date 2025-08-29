// src/hooks/useBookBillsData.js

import { useState, useEffect, useCallback } from "react"; // 1. استيراد useCallback
import axios from "axios";
import { baseUrl } from "../shared/baseUrl";
import { getProjectBookBillsApi } from "../shared/APIs";
import { getAuthToken } from "../shared/Permissions";

/**
 * Custom Hook to fetch bills for a single project book.
 * @param {string | number} bookId - The ID of the book to fetch bills for.
 * @returns {object} { bills, loading, error, refetch }
 */
const useBookBillsData = ({ bookId }) => {
  const [bills, setBills] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. تعريف دالة الجلب خارج useEffect وباستخدام useCallback
  // هذا يجعلها قابلة لإعادة الاستخدام ومستقرة عبر عمليات إعادة التصيير
  const fetchBills = useCallback(async () => {
    // لا تقم بالجلب إذا لم يكن هناك bookId
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
      
      const response = await axios.get(`${baseUrl}${getProjectBookBillsApi}${bookId}`, config);
      
      if (response.data && Array.isArray(response.data.data)) {
        setBills(response.data.data);
      } else {
        console.warn("Unexpected API response structure:", response.data);
        setError("Could not parse bills from API response.");
        setBills([]); // قم بتعيينها كمصفوفة فارغة لتجنب الأخطاء
      }

    } catch (err) {
      console.error("Error fetching book bills:", err);
      setError("Failed to load book bills. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [bookId]); // تعتمد هذه الدالة على bookId، لذا سيتم تحديثها فقط عند تغييره

  // 3. useEffect الآن يقوم فقط باستدعاء دالة الجلب
  useEffect(() => {
    fetchBills();
  }, [fetchBills]); // يتم تشغيله مرة واحدة عند تحميل المكون أو عند تغيير دالة fetchBills (التي تتغير مع bookId)

  // 4. إرجاع الدالة fetchBills باسم refetch
  return { bills, loading, error, refetch: fetchBills };
};

export default useBookBillsData;