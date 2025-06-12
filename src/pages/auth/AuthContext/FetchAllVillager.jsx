import { useState, useEffect } from "react";
import $ from "jquery";

const useFetchAllVillagers = () => {
  const [allVillagers, setAllVillagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data using jQuery's $.ajax
    $.ajax({
      url: import.meta.env.VITE_API_URL + "auth/fetchallvillagers",
      type: "GET",
      timeout: 10000, // 10 seconds
      success: function (response) {
        const responseData = JSON.parse(response);

        if (responseData.status === "OK") {
          // Set the list of villagers
          setAllVillagers(responseData.VillagersData);
        } else {
          setError(responseData.api_message || "Failed to fetch villagers.");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setError("An error occurred while fetching villagers.");
      },
      complete: function () {
        setLoading(false);
      },
    });
  }, []);

  return { allVillagers, total: allVillagers.length, loading, error };
};

export default useFetchAllVillagers;

export const useFetchTotalCommunityVillagers = ({ communityId }) => {
  const [allVillagers, setAllVillagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = () => {
    const data = new FormData();
    data.append("community_id", communityId);
    // console.log('fuck',communityId);
    $.ajax({
      url: import.meta.env.VITE_API_URL + "auth/fetchTotalCommunityVillagers",
      type: "POST",
      data: data,
      processData: false,
      contentType: false,
      timeout: 10000, // 10 seconds
      success: function (response) {
        const responseData = JSON.parse(response);
             
        if (responseData.status === "OK") {
          // Set the list of villagers
          setAllVillagers(responseData.VillagersData);
        } else {
          setError(responseData.api_message || "Failed to fetch villagers.");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        setError("An error occurred while fetching villagers.");
      },
      complete: function () {
        setLoading(false);
      },
    });
  };

  // Fetch data when communityId changes
  useEffect(() => {
    if (communityId) {
      fetchData();
    }
  }, [communityId]);

  return {
    allVillagers, // List of villagers
    total: allVillagers.length, // Total number of villagers
    loading, // Loading state
    error, // Error message
  };
};
