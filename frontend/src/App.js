import React, { useState, useEffect } from "react";
import ChatWindow from "./ChatWindow";
import UserForm from "./UserForm";
import CarTable from "./CarTable";
import { fetchRecommendedCars, sendUserDataToBackend, chatbotMessage } from "./api";
import "./App.css";
import GamePage from "./GamePage";
import LoadingSpinner from "./LoadingSpinner";
import LoadingBar from "./LoadingBar";

function App() {
  const [userData, setUserData] = useState({});
  const [recommendedCars, setRecommendedCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState("home");
  const [error, setError] = useState("");
  const [chatbotMessage, setChatMessages] = useState([]);
  const [game, setgame] = useState([]);

  useEffect(() => {
    if (currentPage === "recommendation") {
      fetchData();
    }
  }, [currentPage, userData]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedCars = await fetchRecommendedCars(userData);
      setRecommendedCars(fetchedCars);
    } catch (error) {
      console.error("Error fetching recommended cars:", error);
      setError("Error fetching recommended cars. Please try again later.");
    } finally {
      setLoading(false);
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

  const handleSendMessage = async (message) => {
    try {
      const chatCars = await chatbotMessage(message);
      setRecommendedCars(chatCars);
    } catch (error) {
      console.error("Error fetching recommended cars:", error);
      setError("Error fetching recommended cars. Please try again later.");
    }
  };

  const handleGameButtonClick = () => {
    setCurrentPage("gamepage");
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return (
          <div className="main-content">
            <div className="center-section">
              <UserForm
                userData={userData}
                setUserData={setUserData}
                handleRecommendation={handleRecommendation}
                loading={loading}
                error={error}
                handleGameButtonClick={handleGameButtonClick}
              />
            </div>
          </div>
        );
      case "recommendation":
        return (
          <div className="app-content">
            <h2>Recommended Cars:</h2>
            <ChatWindow
              onSendMessage={handleSendMessage}
              chatMessages={chatbotMessage}
            />
            <CarTable cars={recommendedCars} />
            {loading && <LoadingBar />}
          </div>
        );
      case "gamepage":
        return (
          <div className="app-content">
            <h2>Game:</h2>
            <GamePage game={game} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">LI-SI</h1>
      </header>
      <div className="content-wrapper">
        {renderPage()}
      </div>
      <footer className="app-footer">
        <p>Powered by AI Leasing</p>
      </footer>
    </div>
  );
}

export default App;