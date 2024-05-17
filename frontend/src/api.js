import axios from "axios";

export const fetchRecommendedCars = async (userData) => {
  try {
    const response = await axios.get("http://localhost:3000/recommendations", {
      params: userData,
    });
    return response.data;
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

export const sendCarToBackend = async (car) => {
  try {
    await axios.post("/recommendations", car);
  } catch (error) {
    console.error("Error sending car to backend:", error);
    throw error;
  }
};