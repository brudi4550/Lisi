import React from "react";
import PropTypes from "prop-types";

function CarTable({ cars, handleSelectCar }) {
  let rows = [];

  if (Array.isArray(cars)) {
    if (cars.length === 0) {
      rows.push(
        <tr key="no-cars">
          <td colSpan="2">No cars available.</td>
        </tr>
      );
    } else {
      for (const car of cars) {
        rows.push(
          <tr key={car}>
            <td>{car}</td>
            <td>
              <button onClick={() => handleSelectCar(car)}>Select</button>
            </td>
          </tr>
        );
      }
    }
  } else {
    rows.push(
      <tr key="error">
        <td colSpan="2">Error: Cars is not an array.</td>
      </tr>
    );
  }

  return (
    <table className="car-table">
      <thead>
        <tr>
          <th>Car</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
}

CarTable.propTypes = {
  cars: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleSelectCar: PropTypes.func.isRequired,
};

export default CarTable;