import React, { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import UserForm from "./UserForm";
import CarTable from "./CarTable";
import CarDetails from "./CarDetails";
import {
  fetchRecommendedCars,
  sendUserDataToBackend,
  //sendCarToBackend,
  chatbotMessage,
} from "./api";
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
    if (Object.values(userData).some((field) => !field)) {
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
  const handleSendMessage = async (chatMessages) => {
    try {
      const chatCars = await chatbotMessage(chatMessages);
      console.log("******Before Update" + recommendedCars);
      setRecommendedCars(chatCars);
      //console.log("++++++After Update" + recommendedCars);
    } catch (error) {
      console.error("Error fetching recommended cars:", error);
      setError("Error fetching recommended cars. Please try again later.");
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
            <ChatWindow
              onSendMessage={handleSendMessage}
              chatMessages={chatMessages}
            />
            <CarTable cars={recommendedCars} />
          </div>
        );
      case "carDetails":
        return (
          <CarDetails
            cars={selectedCars}
            handleBackButton={() => setCurrentPage("home")}
          />
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
