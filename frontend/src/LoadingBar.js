import React from "react";
import "./LoadingBar.css";
import carImage from "./car.png";

const LoadingBar = () => {
  return (
    <div className="loading-container">
      {}
      <img src={carImage} alt="Loading" className="loading-image" />
    </div>
  );
};

export default LoadingBar;
