import React from "react";

function CarDetails({ cars, handleBackButton }) {
  return (
    <div className="app-content car-details">
      <h2>Selected Cars:</h2>
      <div className="car-list">
        {cars.map((car, index) => (
          <div key={index} className="car-item">
            <div className="car-info">
              <p className="car-name">{car.name}</p>
              <p className="car-price">Price: {car.price}</p>
              <p className="car-fuel">Fuel Type: {car.fuelType}</p>
              <p className="car-transmission">Transmission: {car.transmission}</p>
            </div>
            <div className="car-image">
              <img src={car.imageUrl} alt={car.name} />
            </div>
          </div>
        ))}
      </div>
      <div className="button-row">
        <button className="back-button" onClick={handleBackButton}>
          Back
        </button>
      </div>
    </div>
  );
}

export default CarDetails;