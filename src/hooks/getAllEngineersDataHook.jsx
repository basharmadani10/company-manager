// src/hooks/useEngineersData.js
import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // Adjust path as needed
import { getAllEngineersApi } from "../shared/APIs"; // Adjust path as needed
import { getAuthToken } from "../shared/Permissions";

const useEngineersData = () => {
  const [engineers, setEngineers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // ✅ الخطوة 1: إضافة متغير حالة ليكون "زناد" التحديث
  const [refetch, setRefetch] = useState(0);

  // ✅ الخطوة 2: إنشاء دالة بسيطة لتغيير قيمة "الزناد"
  // هذه هي الدالة التي ستعيدها للخارج
  const refetchEngineers = () => {
    setRefetch(prev => prev + 1); // أي تغيير في القيمة سيعيد تشغيل useEffect
  };

  // ✅ الخطوة 3: ربط useEffect بمتغير "الزناد"
  useEffect(() => {
    // نقل منطق جلب البيانات إلى دالة داخلية
    const fetchEngineers = async () => {
      setLoading(true); // إعادة التحميل عند كل استدعاء
      try {
        const config = {
          headers: {
            'Authorization': `Bearer ${getAuthToken()}`
          }
        };
        const response = await axios.get(`${baseUrl}${getAllEngineersApi}`, config);
        const engineersData = response.data.data;
        console.log(engineersData);

        const formattedEngineers = engineersData.map((engineer) => ({
          id: engineer.id,
          first_name: engineer.user.first_name,
          last_name: engineer.user.last_name,
          email: engineer.user.email,
          phone_number: engineer.user.phone_number,
          is_active: engineer.user.is_active,
          specialization_name: engineer.specialization.name,

        }));

        setEngineers(formattedEngineers);
        setError(null); // مسح أي أخطاء سابقة عند النجاح
      } catch (err) {
        console.error("Error fetching engineers:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEngineers();
  }, [refetch]); //  dependents: سيعمل هذا الكود في كل مرة تتغير فيها قيمة 'refetch'

  // ✅ الخطوة 4: إرجاع دالة "الزناد" بدلاً من دالة جلب البيانات
  return { engineers, loading, error, refetchEngineers };
};

export default useEngineersData;