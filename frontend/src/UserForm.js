import React from "react";

function UserForm({
  userData,
  setUserData,
  handleRecommendation,
  loading,
  error,
  handleGameButtonClick,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="app-content">
      <div className="input-row">
        <label className="input-label">Age:</label>
        <input
          type="number"
          name="age"
          value={userData.age || ""}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
      <div className="input-row">
        <label className="input-label">Monthly income:</label>
        <input
          type="text"
          name="income"
          value={userData.income || ""}
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
      <div className="input-row">
        <label className="input-label">Preferences:</label>
        <select
          name="preferences"
          value={userData.preferences || ""}
          onChange={handleInputChange}
          className="input-field"
        >
          <option value="">Select</option>
          <option value="Kombi">Kombi</option>
          <option value="Limusine">Limusine</option>
          <option value="SUV">SUV</option>
          <option value="Cabrio">Cabrio</option>
          <option value="Coupe">Coupe</option>
        </select>
      </div>
      <div className="input-row">
        <label className="input-label">Fuel-Type:</label>
        <select
          name="fuelType"
          value={userData.fuelType || ""}
          onChange={handleInputChange}
          className="input-field"
        >
          <option value="">Select</option>
          <option value="Electro">Electric</option>
          <option value="Gas">Gasoline</option>
          <option value="Diesel">Diesel</option>
          <option value="Hybrid">Hybrid</option>
          <option value="Multiple">Mulitple</option>
        </select>
      </div>
      <div className="input-row">
        <label className="input-label">Price Preference:</label>
        <select
          name="pricePreference"
          value={userData.pricePreference || ""}
          onChange={handleInputChange}
          className="input-field"
        >
          <option value="">Select</option>
          <option value="LessThen10000">Less than 10,000</option>
          <option value="Between10000AND20000">10,000 - 20,000</option>
          <option value="Between20000AND30000">20,000 - 30,000</option>
          <option value="Between30000AND40000">30,000 - 40,000</option>
          <option value="MoreThen40000">More than 40,000</option>
        </select>
      </div>
      <div className="input-row">
        <label className="input-label">Environmental Awareness:</label>
        <select
          name="environmentalAwareness"
          value={userData.environmentalAwareness || ""}
          onChange={handleInputChange}
          className="input-field"
        >
          <option value="">Select</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="button-row">
        <button
          className="recommend-button"
          onClick={handleRecommendation}
          disabled={loading}
        >
          {loading ? "Loading..." : "Recommend Car"}
        </button>
        <button
          className="game-button"
          onClick={handleGameButtonClick}
          disabled={loading}
        >
          {loading ? "Loading..." : "Play Game"}
        </button>
      </div>
    </div>
  );
}

export default UserForm;
