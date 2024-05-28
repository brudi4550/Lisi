import React from "react";
import "./LoadingBar.css";

const LoadingBar = () => {
  return (
    <div className="loading-container">
      {<img src="./car.png" alt="Loading" className="loading-image" />}
    </div>
  );
};

export default LoadingBar;