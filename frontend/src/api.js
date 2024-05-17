import axios from "axios";

export const fetchRecommendedCars = async (userData) => {
  try {
    const response = await axios.get(
      "http://localhost:3000/recommendations",
      {}
    );
    console.log(response.data.recommendedCars);
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
    console.log("userinput: " + userInput);
    await axios
      .post("http://localhost:3000/refine", null, {
        params: userInput,
      })
      .then((response) => {
        if (response.status === 200) {
          return response.data.recommendedCars;
        } else {
          // Handle other status codes here if needed
          console.error("Request failed with status", response.status);
          return null; // or throw an error, or handle the error in another way
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        return null; // or throw an error, or handle the error in another way
      });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};
