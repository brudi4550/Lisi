import axios from "axios";

export const fetchRecommendedCars = async (userData) => {
  try {
    const response = await axios.get("http://localhost:3000/recommendations", {});
    return response.data.recommendedCars;
  } catch (error) {
    console.error("Error fetching recommended cars:", error);
    throw error;
  }
};

export const sendUserDataToBackend = async (userData) => {
  try {
    await axios.post("http://localhost:3000/user", null, {
      params: userData,
    });
  } catch (error) {
    console.error("Error sending user data:", error);
    throw error;
  }
};

export const chatbotMessage = async (userInput) => {
  try {
    const response = await axios.post("http://localhost:3000/refine", null, {
      params: { userInput },
    });
    if (response.status === 200) {
      return response.data.recommendedCars;
    } else {
      console.error("Request failed with status", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getCarInformation = async (carName) => {
  try {
    const response = await axios.post("http://localhost:3000/getcardetails", null, {
      params: { carName: carName },
    });
    if (response.status === 200) {
      return response.data;
    } else {
      console.error("Request failed with status", response.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching car information:", error);
    throw error;
  }
};