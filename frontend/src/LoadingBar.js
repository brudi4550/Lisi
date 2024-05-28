import React from "react";
import "./LoadingBar.css";
import carImage from "./car.jpg";

const LoadingBar = () => {
  return (
    <div className="loading-container">
      {/* Use the imported image */}
      <img src={carImage} alt="Loading" className="loading-image" />
    </div>
  );
};

export default LoadingBar;
