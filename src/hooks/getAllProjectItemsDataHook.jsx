import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../shared/baseUrl"; // Adjust path as needed
import { getAllProjectItemsApi } from "../shared/APIs"; // Adjust path as needed
import { getAuthToken } from "../shared/Permissions";
import { useProject } from '../contexts/ProjectContext';


const useProjectItemsData = ({}) => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedProjectId } = useProject();

  const refetchMaterials = async () => {
    setLoading(true);
    setError(null);
    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      };
      const response = await axios.get(`${baseUrl}${getAllProjectItemsApi(selectedProjectId)}`, config);
      console.log(response.data)
      const itemsData = response.data.data;

      // Flatten the response data to make it easier to work with
      const materials = itemsData.map((item) => ({
        
        expected_quantity: item.expected_quantity,
        // Safely access nested properties from the "items_id" object
        id:item.id,
        name: item.items_id ? item.items_id.name : 'Not Available',
        category: item.items_id ? item.items_id.category : 'N/A',
        unit: item.items_id ? item.items_id.unit : "alll",
        itemId: item.items_id ? item.items_id.id : null,
      }));

      setMaterials(materials);
    } catch (err) {
      console.error("Error fetching project items:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchMaterials();
  }, []);

  return { materials, loading, error, refetchMaterials };
};

export default useProjectItemsData;