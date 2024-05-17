import React from "react";

function CarTable({ cars, filter, setFilter, handleSelectCar }) {
  const handleSort = (sortBy) => {
    let sortedCars = [...cars];
    switch (sortBy) {
      case "name":
        sortedCars.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "price":
        sortedCars.sort(
          (a, b) =>
            parseFloat(a.price.replace("$", "").replace(",", "")) -
            parseFloat(b.price.replace("$", "").replace(",", ""))
        );
        break;
      case "fuelType":
        sortedCars.sort((a, b) => a.fuelType.localeCompare(b.fuelType));
        break;
      case "transmission":
        sortedCars.sort((a, b) => a.transmission.localeCompare(b.transmission));
        break;
      default:
        break;
    }
    setFilter(sortBy);
  };

  return (
    <table className="car-table">
      <thead>
        <tr>
          <th onClick={() => handleSort("name")}>Name</th>
          <th onClick={() => handleSort("price")}>Price</th>
          <th onClick={() => handleSort("fuelType")}>Fuel Type</th>
          <th onClick={() => handleSort("transmission")}>Transmission</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {cars.map((car) => (
          <tr key={car.id}>
            <td>{car.name}</td>
            <td>{car.price}</td>
            <td>{car.fuelType}</td>
            <td>{car.transmission}</td>
            <td>
              <button onClick={() => handleSelectCar(car)}>Select</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default CarTable;