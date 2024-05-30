import React from "react";
import PropTypes from "prop-types";
import { getCarInformation } from "./api";

function CarDetails({ car, handleBackButton }) {
  const handleGetInfo = async () => {
    try {
      const carInfo = await getCarInformation(car);
      console.log("Car information:", carInfo);
    } catch (error) {
      console.error("Error getting car information:", error);
    }
  };

  if (!car) {
    return (
      <div className="app-content car-details">
        <h2 className="no-car-heading">No Car Selected</h2>
        <button className="back-button" onClick={handleBackButton}>
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="app-content car-details">
      <h2 className="selected-car-heading">Selected Car:</h2>
      <div className="car-details-container">
        <div className="car-name">
          <p><strong>Name:</strong> {car}</p>
        </div>
        {/* Additional information display */}
      </div>
      <div className="button-row">
        <button className="back-button" onClick={handleBackButton}>
          Back
        </button>
        <button className="get-info-button" onClick={handleGetInfo}>
          Get Information
        </button>
      </div>
    </div>
  );
}

CarDetails.propTypes = {
  car: PropTypes.string,
  handleBackButton: PropTypes.func.isRequired,
};

export default CarDetails;