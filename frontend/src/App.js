import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function ChatWindow({ onSendMessage, chatMessages }) {
  const [message, setMessage] = useState('');

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {chatMessages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}>
            <p>{msg.message}</p>
          </div>
        ))}
      </div>
      <textarea
        className="chat-input"
        value={message}
        onChange={handleMessageChange}
        placeholder="Type your message..."
      />
      <button className="chat-button" onClick={handleSendMessage}>
        Send
      </button>
    </div>
  );
}

function App() {
  const [userData, setUserData] = useState({
    age: '',
    income: '',
    preferences: '',
    fuelType: '',
    environmentalAwareness: '',
    pricePreference: '',
  });
  const [recommendedCars, setRecommendedCars] = useState([]);
  const [selectedCars, setSelectedCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCars = await fetchRecommendedCars(userData);
        setRecommendedCars(fetchedCars);
      } catch (error) {
        console.error('Error fetching recommended cars:', error);
        setError('Error fetching recommended cars. Please try again later.');
      }
    };

    if (currentPage === 'recommendation') {
      fetchData();
    }
  }, [currentPage, userData]);

  const handleRecommendation = async () => {
    if (!userData.age || !userData.income || !userData.preferences || !userData.fuelType || !userData.environmentalAwareness) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fetchedCars = await fetchRecommendedCars(userData);
      //setRecommendedCars(fetchedCars);
      sendUserDataToBackend(userData);
      setCurrentPage('recommendation');
    } catch (error) {
      console.error('Error fetching recommendation:', error);
      setError('Error fetching recommendation. Please try again later.');
    }

    setLoading(false);
  };

  const fetchRecommendedCars = (userData) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const cars = [
          { id: 1, name: 'Car X', price: '$30,000', fuelType: 'Gasoline', transmission: 'Automatic' },
          { id: 2, name: 'Car Y', price: '$35,000', fuelType: 'Hybrid', transmission: 'Automatic' },
          { id: 3, name: 'Car Z', price: '$40,000', fuelType: 'Electric', transmission: 'Automatic' },
          { id: 4, name: 'Car A', price: '$25,000', fuelType: 'Diesel', transmission: 'Manual' },
          { id: 5, name: 'Car B', price: '$28,000', fuelType: 'Gasoline', transmission: 'Automatic' },
          { id: 6, name: 'Car C', price: '$32,000', fuelType: 'Hybrid', transmission: 'Automatic' },
          { id: 7, name: 'Car D', price: '$38,000', fuelType: 'Electric', transmission: 'Automatic' },
          { id: 8, name: 'Car E', price: '$22,000', fuelType: 'Diesel', transmission: 'Manual' },
          { id: 9, name: 'Car F', price: '$27,500', fuelType: 'Gasoline', transmission: 'Automatic' },
          { id: 10, name: 'Car G', price: '$33,000', fuelType: 'Hybrid', transmission: 'Automatic' },
          { id: 11, name: 'Car H', price: '$42,000', fuelType: 'Electric', transmission: 'Automatic' },
          { id: 12, name: 'Car I', price: '$24,000', fuelType: 'Diesel', transmission: 'Manual' },
          { id: 13, name: 'Car J', price: '$29,500', fuelType: 'Gasoline', transmission: 'Automatic' },
          { id: 14, name: 'Car K', price: '$31,500', fuelType: 'Hybrid', transmission: 'Automatic' },
          { id: 15, name: 'Car L', price: '$45,000', fuelType: 'Electric', transmission: 'Automatic' },
          { id: 16, name: 'Car M', price: '$20,000', fuelType: 'Diesel', transmission: 'Manual' },
        ];
        resolve(cars);
      }, 2000);
    });
  };

  const sendUserDataToBackend = async (userData) => {
    try {
      console.log('sending user data')
      await axios.post('http://localhost:3000/user', userData);
    } catch (e) {
      console.log(e)
    }
  };

  const handleSelectCar = async (car) => {
    try {
      await sendCarToBackend(car);
      console.log("Car successfully sent to backend:", car);
    } catch (error) {
      console.error("Error sending car to backend:", error);
    }
    setSelectedCars([...selectedCars, car]);
    setCurrentPage('carDetails');
  };

  const sendCarToBackend = async (car) => {
    await axios.post('/recommendations', car);
  };

  const handleBackButton = () => {
    setSelectedCars([]);
    setCurrentPage('home');
  };

  const handleFilterChange = (e, filterType) => {
    setFilter(filterType);
  };

  const filterRecommendedCars = (cars, filter) => {
    if (!filter) {
      return cars;
    }

    switch (filter) {
      case 'price':
        return [...cars].sort((a, b) => parseFloat(a.price.replace('$', '').replace(',', '')) - parseFloat(b.price.replace('$', '').replace(',', '')));
      case 'fuelType':
        return [...cars].sort((a, b) => a.fuelType.localeCompare(b.fuelType));
      case 'transmission':
        return [...cars].sort((a, b) => a.transmission.localeCompare(b.transmission));
      default:
        return cars;
    }
  };

  const handleSort = (sortBy) => {
    switch (sortBy) {
      case 'name':
        setRecommendedCars([...recommendedCars].sort((a, b) => a.name.localeCompare(b.name)));
        break;
      case 'price':
        setRecommendedCars([...recommendedCars].sort((a, b) => parseFloat(a.price.replace('$', '').replace(',', '')) - parseFloat(b.price.replace('$', '').replace(',', ''))));
        break;
      case 'fuelType':
        setRecommendedCars([...recommendedCars].sort((a, b) => a.fuelType.localeCompare(b.fuelType)));
        break;
      case 'transmission':
        setRecommendedCars([...recommendedCars].sort((a, b) => a.transmission.localeCompare(b.transmission)));
        break;
      default:
        console.log(`Sorting by ${sortBy}`);
        break;
    }
  };

  const handleSendMessage = async (message) => {
    setChatMessages([...chatMessages, { sender: 'user', message }]);

    try {
      const response = await axios.post('/questions', { question: message });
      const responseData = response.data;
      if (responseData && responseData.answer) {
        setChatMessages([...chatMessages, { sender: 'bot', message: responseData.answer }]);
      } else {
        setChatMessages([...chatMessages, { sender: 'bot', message: 'Sorry, I could not understand that.' }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setChatMessages([...chatMessages, { sender: 'bot', message: 'Sorry, something went wrong.' }]);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="app-content">
            <div className="input-row">
              <label className="input-label">Age:</label>
              <input type="number" name="age" value={userData.age} onChange={handleInputChange} className="input-field" />
            </div>
            <div className="input-row">
              <label className="input-label">Income:</label>
              <input type="text" name="income" value={userData.income} onChange={handleInputChange} className="input-field" />
            </div>
            <div className="input-row">
              <label className="input-label">Preferences:</label>
              <select name="preferences" value={userData.preferences} onChange={handleInputChange} className="input-field">
                <option value="">Select</option>
                <option value="Kombi">Kombi</option>
                <option value="Low">Limusine</option>
                <option value="Medium">SUV</option>
                <option value="High">Cabrio</option>
                <option value="High">Coupe</option>
              </select>
            </div>
            <div className="input-row">
              <label className="input-label">Fuel-Type:</label>
              <select name="fuelType" value={userData.fuelType} onChange={handleInputChange} className="input-field">
                <option value="">Select</option>
                <option value="Electro">Electric</option>
                <option value="Gas">Gasoline</option>
                <option value="Patrol">Diesel</option>
                <option value="Patrol">Hybrid</option>
                <option value="Patrol">Mulitple</option>
              </select>
            </div>
            <div className="input-row">
              <label className="input-label">Price Preference:</label>
              <select name="price" value={userData.pricePreference} onChange={handleInputChange} className="input-field">
                <option value="">Select</option>
                <option value="LessThen10000">Less then 10.000</option>
                <option value="Between10000AND20000">10.000 - 20.000</option>
                <option value="Between20000AND30000">20.000 - 30.000</option>
                <option value="Between30000AND40000">30.000 - 40.000</option>
                <option value="MoreThen40000">More then 40.000</option>
              </select>
            </div>
            <div className="input-row">
              <label className="input-label">Environmental Awareness:</label>
              <select name="environmentalAwareness" value={userData.environmentalAwareness} onChange={handleInputChange} className="input-field">
                <option value="">Select</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            {error && <p className="error-message">{error}</p>}
            <div className="button-row">
              <button className="recommend-button" onClick={handleRecommendation} disabled={loading}>
                {loading ? 'Loading...' : 'Recommend Car'}
              </button>
            </div>
          </div>
        );
      case 'recommendation':
        const filteredCars = filterRecommendedCars(recommendedCars, filter);
        return (
          <div className="app-content">
            <h2>Recommended Cars:</h2>
            <ChatWindow onSendMessage={handleSendMessage} chatMessages={chatMessages} />
            <table className="car-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('name')}>Name</th>
                  <th onClick={() => handleSort('price')}>
                    Price
                  </th>
                  <th onClick={() => handleSort('fuelType')}>
                    Fuel Type
                  </th>
                  <th onClick={() => handleSort('transmission')}>
                    Transmission
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredCars.map((car) => (
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
          </div>
        );
      case 'carDetails':
        return (
          <div className="app-content car-details">
            <h2>Selected Cars:</h2>
            <div className="car-list">
              {selectedCars.map((car, index) => (
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
              <button className="back-button" onClick={handleBackButton}>Back</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Car Recommendation App</h1>
      </header>
      {renderPage()}
      <footer className="app-footer">
        <p>Powered by AI Leasing</p>
      </footer>
    </div>
  );
}

export default App;