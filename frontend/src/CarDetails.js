import React, { useState } from "react";
import PropTypes from "prop-types";
import { getCarInformation } from "./api";

function CarDetails({ car, handleBackButton }) {
  const [carInfo, setCarInfo] = useState("");
  const [showInfo, setShowInfo] = useState(false);

  const handleGetInfo = async () => {
    try {
      const info = await getCarInformation(car);
      setCarInfo(info);
      setShowInfo(true);
    } catch (error) {
      console.error("Error getting car information:", error);
    }
  };

  return (
    <div className="app-content car-details">
      <h2 className="selected-car-heading">Selected Car:</h2>
      <div className="car-details-container">
        <div className="car-name">
          <p>
            <strong>Name:</strong> {car}
          </p>
        </div>
        <div className="button-row">
          <button className="back-button" onClick={handleBackButton}>
            Back
          </button>
          {!showInfo && (
            <button className="get-info-button" onClick={handleGetInfo}>
              Get Information
            </button>
          )}
        </div>
        {showInfo && (
          <div className="car-info-textbox">
            <textarea
              value={carInfo}
              onChange={() => {}}
              rows={6}
              style={{ width: "100%", boxSizing: "border-box" }}
              placeholder="Car Information"
              readOnly
            />
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
