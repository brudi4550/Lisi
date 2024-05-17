import React, { useState, useEffect } from "react";
import axios from "axios";
import ChatWindow from "./ChatWindow";
import UserForm from "./UserForm";
import CarTable from "./CarTable";
import CarDetails from "./CarDetails";
import { fetchRecommendedCars, sendUserDataToBackend, sendCarToBackend } from "./api";
import "./App.css";

function App() {
  const [userData, setUserData] = useState({});
  const [recommendedCars, setRecommendedCars] = useState([]);
  const [selectedCars, setSelectedCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    if (currentPage === "recommendation") {
      fetchData();
    }
  }, [currentPage, userData]);

  const fetchData = async () => {
    try {
      const fetchedCars = await fetchRecommendedCars(userData);
      setRecommendedCars(fetchedCars);
    } catch (error) {
      console.error("Error fetching recommended cars:", error);
      setError("Error fetching recommended cars. Please try again later.");
    }
  };

  const handleRecommendation = async () => {
    if (Object.values(userData).some(field => !field)) {
      setError("Please fill out all fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendUserDataToBackend(userData);
      setCurrentPage("recommendation");
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      setError("Error fetching recommendation. Please try again later.");
    }
    setLoading(false);
  };

  const handleSelectCar = async (car) => {
    try {
      await sendCarToBackend(car);
      setSelectedCars([...selectedCars, car]);
      setCurrentPage("carDetails");
    } catch (error) {
      console.error("Error sending car to backend:", error);
    }
  };

  const handleSendMessage = async (message) => {
    setChatMessages([...chatMessages, { sender: "user", message }]);
    try {
      const response = await axios.post("/questions", { question: message });
      const responseData = response.data;
      const botMessage = responseData?.answer || "Sorry, I could not understand that.";
      setChatMessages([...chatMessages, { sender: "bot", message: botMessage }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setChatMessages([...chatMessages, { sender: "bot", message: "Sorry, something went wrong." }]);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <UserForm
            userData={userData}
            setUserData={setUserData}
            handleRecommendation={handleRecommendation}
            loading={loading}
            error={error}
          />
        );
      case "recommendation":
        return (
          <div className="app-content">
            <h2>Recommended Cars:</h2>
            <ChatWindow onSendMessage={handleSendMessage} chatMessages={chatMessages} />
            <CarTable
              cars={recommendedCars}
              filter={filter}
              setFilter={setFilter}
              handleSelectCar={handleSelectCar}
            />
          </div>
        );
      case "carDetails":
        return (
          <CarDetails cars={selectedCars} handleBackButton={() => setCurrentPage("home")} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">LISI</h1>
      </header>
      {renderPage()}
      <footer className="app-footer">
        <p>Powered by AI Leasing</p>
      </footer>
    </div>
  );
}

export default App;