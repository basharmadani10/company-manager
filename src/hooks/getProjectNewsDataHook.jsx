// src/hooks/useProjectNewsData.js

import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // تأكد من صحة المسار
import { getProjectNewsApi } from "../shared/APIs"; // تأكد من إضافة هذا المتغير في ملف APIs
import { getAuthToken } from "../shared/Permissions";

/**
 * Hook مخصص لجلب أخبار المشروع من الـ API.
 * @param {object} props - الخصائص.
 * @param {string|number} props.projectId - معرّف المشروع لجلب أخباره.
 * @returns {{news: Array, loading: boolean, error: object|null, refetchNews: Function}}
 */
const useProjectNewsData = ({ projectId }) => {
  // الحالة لتخزين قائمة الأخبار
  const [news, setNews] = useState([]);
  // الحالة لتتبع عملية التحميل
  const [loading, setLoading] = useState(true);
  // الحالة لتخزين أي أخطاء تحدث أثناء جلب البيانات
  const [error, setError] = useState(null);
  // الحالة لإعادة جلب البيانات عند الطلب
  const [refetch, setRefetch] = useState(0);

  /**
   * دالة لتشغيل عملية إعادة جلب البيانات.
   */
  const refetchNews = () => {
    setRefetch((prev) => prev + 1);
  };

  useEffect(() => {
    // إذا لم يكن هناك projectId، لا تقم بتنفيذ الطلب
    if (!projectId) {
      setLoading(false);
      return;
    }

    const fetchNews = async () => {
      setLoading(true); // بدء عملية التحميل
      try {
        // إعدادات الطلب مع إضافة رمز المصادقة
            const config = {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
            };
        
        // إرسال طلب GET لجلب أخبار المشروع
        const response = await axios.get(
          `${baseUrl}${getProjectNewsApi}${projectId}`, // بناء الرابط مع projectId
          config
        );
        
        // تحديث الحالة بالبيانات المستلمة
        setNews(response.data.data); // افترض أن البيانات موجودة في response.data.data
        setError(null); // مسح أي أخطاء سابقة
      } catch (err) {
        console.error("Error fetching project news:", err);
        setError(err); // تخزين الخطأ في الحالة
      } finally {
        setLoading(false); // إنهاء عملية التحميل
      }
    };

    fetchNews();
  }, [projectId, refetch]); // يتم تنفيذ هذا التأثير عند تغيير projectId أو refetch

  // إرجاع الحالات والدالة للاستخدام في المكونات الأخرى
  return { news, loading, error, refetchNews };
};

export default useProjectNewsData;