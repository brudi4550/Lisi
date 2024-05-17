import React from "react";

function CarTable({ cars, handleSelectCar }) {
  let rows = [];

  if (Array.isArray(cars)) {
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
  } else {
    rows.push(
      <tr key="error">
        <td>Error: cars is not an array.</td>
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

export default CarTable;
