import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getCarInformation } from "./api";
import LoadingBar from "./LoadingBar";
import ReactMarkdown from "react-markdown";

function CarDetails({ car, handleBackButton }) {
  const [carInfo, setCarInfo] = useState("");
  const [showInfo, setShowInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCarData = async () => {
      setLoading(true);
      try {
        const info = await getCarInformation(car);
        setCarInfo(info);
        setShowInfo(true);
      } catch (error) {
        console.error("Error getting car information:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [car]);

  return (
    <div className="app-content car-details">
      {showInfo && (
        <div className="button-row" style={{ textAlign: "left" }}>
          <button className="back-button" onClick={handleBackButton}>
            Back
          </button>
        </div>
      )}
      <h2 className="selected-car-heading">Selected Car:</h2>
      <div className="car-details-container">
        <div className="car-name">
          <p>{car}</p>
        </div>
        {loading && <LoadingBar />}
        {showInfo && (
          <div
            className="car-info-textbox"
            style={{ width: "100%", textAlign: "left" }}
          >
            <ReactMarkdown>{carInfo}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

CarDetails.propTypes = {
  car: PropTypes.string,
  handleBackButton: PropTypes.func.isRequired,
};

export default CarDetails;
