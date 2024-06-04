import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import ChatWindow from "./ChatWindow";
import UserForm from "./UserForm";
import CarTable from "./CarTable";
import CarDetails from "./CarDetails";
import GamePage from "./GamePage";
import LoadingBar from "./LoadingBar";
import {
  fetchRecommendedCars,
  sendUserDataToBackend,
  chatbotMessage,
} from "./api";
import "./App.css";

function App() {
  const [userData, setUserData] = useState({});
  const [recommendedCars, setRecommendedCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [game, setGame] = useState([]);

  const fetchData = async () => {
    console.log("Fetching data...");
    setLoading(true);
    try {
      const fetchedCars = await fetchRecommendedCars(userData);
      setRecommendedCars(fetchedCars);
    } catch (error) {
      console.error("Error fetching recommended cars:", error);
      setError("Error fetching recommended cars. Please try again later.");
    } finally {
      setLoading(false);
      console.log("Fetching data finished.");
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
      await fetchData();
    } catch (error) {
      console.error("Error fetching recommendation:", error);
      setError("Error fetching recommendation. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message) => {
    setLoading(true);
    try {
      const chatCars = await chatbotMessage(message);
      setRecommendedCars(chatCars);
    } catch (error) {
      console.error("Error fetching recommended cars:", error);
      setError("Error fetching recommended cars. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetState = () => {
    setUserData({});
    setRecommendedCars([]);
    setSelectedCar(null);
    setError("");
    setChatMessages([]);
    setGame([]);
  };

  return (
    <Router>
      <div className="app-container">
        <AppHeader handleResetState={handleResetState} />
        <div className="content-wrapper">
          <Routes>
            <Route
              path="/"
              element={
                <HomePage
                  userData={userData}
                  setUserData={setUserData}
                  handleRecommendation={handleRecommendation}
                  loading={loading}
                  error={error}
                />
              }
            />
            <Route
              path="/recommendation"
              element={
                <RecommendationPage
                  recommendedCars={recommendedCars}
                  loading={loading}
                  handleSendMessage={handleSendMessage}
                  chatMessages={chatMessages}
                  setSelectedCar={setSelectedCar}
                />
              }
            />
            <Route
              path="/cardetails"
              element={<CarDetailsPage selectedCar={selectedCar} />}
            />
            <Route path="/gamepage" element={<GamePage game={game} />} />
          </Routes>
        </div>
        <footer className="app-footer">
          <p>Powered by AI Leasing</p>
        </footer>
      </div>
    </Router>
  );
}

const AppHeader = ({ handleResetState }) => {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    handleResetState();
    navigate("/");
  };

  return (
    <header className="app-header">
      <h1
        className="app-title"
        onClick={handleTitleClick}
        style={{ cursor: "pointer" }}
      >
        LISI
      </h1>
    </header>
  );
};

const HomePage = ({
  userData,
  setUserData,
  handleRecommendation,
  loading,
  error,
}) => {
  const navigate = useNavigate();

  const handleGameButtonClick = () => {
    navigate("/gamepage");
  };

  const handleSubmit = async () => {
    await handleRecommendation();
    navigate("/recommendation");
  };

  return (
    <div className="main-content">
      <div className="center-section">
        <UserForm
          userData={userData}
          setUserData={setUserData}
          handleRecommendation={handleSubmit}
          loading={loading}
          error={error}
          handleGameButtonClick={handleGameButtonClick}
        />
        {loading && <LoadingBar />}
      </div>
    </div>
  );
};

const RecommendationPage = ({
  recommendedCars,
  loading,
  handleSendMessage,
  chatMessages,
  setSelectedCar,
}) => {
  const navigate = useNavigate();

  const handleSelectCar = (car) => {
    setSelectedCar(car);
    navigate("/cardetails");
  };

  return (
    <div className="app-content">
      <h2>Recommended Cars:</h2>
      <ChatWindow
        onSendMessage={handleSendMessage}
        chatMessages={chatMessages}
      />
      {loading && <LoadingBar />}
      <CarTable cars={recommendedCars} handleSelectCar={handleSelectCar} />
    </div>
  );
};

const CarDetailsPage = ({ selectedCar }) => {
  const navigate = useNavigate();

  return (
    <div className="app-content">
      <CarDetails
        car={selectedCar}
        handleBackButton={() => navigate("/recommendation")}
      />
    </div>
  );
};

export default App;
