// src/hooks/useBookOrdersData.js

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl";
import { getBookOrdersApi } from "../shared/APIs"; // تأكد من إضافة هذا المتغير في ملف APIs
import { getAuthToken } from "../shared/Permissions";

/**
 * Custom Hook to fetch orders for a specific project book.
 * @param {object} params - The parameters object.
 * @param {string | number} params.bookId - The ID of the book to fetch orders for.
 * @returns {{orders: Array|null, loading: boolean, error: string|null, refetch: Function}}
 */
const useBookOrdersData = ({ bookId }) => {
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // استخدام useCallback لتغليف منطق جلب البيانات
  // هذا يسمح لنا بإعادة استخدامه للـ refetch
  const fetchOrders = useCallback(async () => {
    // التوقف إذا لم يتم توفير bookId
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
      
      const response = await axios.get(`${baseUrl}${getBookOrdersApi}${bookId}`, config);
      
      // تحقق من أن البيانات موجودة وهي عبارة عن مصفوفة
      if (response.data && Array.isArray(response.data.data)) {
        setOrders(response.data.data);
      } else {
        console.warn("API response for orders is not a valid array:", response.data);
        setError("Could not parse orders from API response.");
        setOrders([]); // تعيين مصفوفة فارغة لتجنب أخطاء في واجهة المستخدم
      }

    } catch (err) {
      console.error("Error fetching book orders:", err);
      setError("Failed to load book orders. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [bookId]); // يتم إعادة بناء هذه الدالة فقط عند تغير bookId

  // useEffect لجلب البيانات عند تحميل المكون لأول مرة
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // إرجاع البيانات وحالة التحميل والخطأ مع دالة الـ refetch
  return { orders, loading, error, refetch: fetchOrders };
};

export default useBookOrdersData;