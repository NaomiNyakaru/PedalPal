import React, { useState, useEffect } from 'react';
import './Admin.css';

const Admin = () => {
  const [bikes, setBikes] = useState([]);
  const [editingBike, setEditingBike] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
  const [newBike, setNewBike] = useState({
    name: "",
    model: "",
    terrain: "",
    description: "",
    frame_size: "",
    wheel_size: "",
    image_url: "",
    available: true
  });

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://pedalpal.onrender.com/admin-dashboard");
      if (!response.ok) throw new Error('Failed to fetch bikes');
      const data = await response.json();
      setBikes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBike = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://pedalpal.onrender.com/admin-dashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newBike,
          rent_price: parseFloat(newBike.rent_price)
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add bike');
      }
      
      const data = await response.json();
      setBikes([...bikes, data.bike]); // Update to access the bike from the response
      setNewBike({
        name: "",
        model: "",
        terrain: "",
        description: "",
        frame_size: "",
        wheel_size: "",
        image_url: "",
        available: true
      });
      setShowAddDialog(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateBike = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://pedalpal.onrender.com/admin-dashboard/${editingBike.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingBike),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update bike');
      }

      const updatedBike = await response.json();
      setBikes(bikes.map(bike => 
        bike.id === updatedBike.id ? updatedBike : bike
      ));
      setEditingBike(null);
      setShowEditDialog(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteBike = async (bikeId) => {
    try {
      const response = await fetch(`https://pedalpal.onrender.com/admin-dashboard/${bikeId}`,{
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete bike');
      }
      
      setBikes(bikes.filter(bike => bike.id !== bikeId));
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading bikes...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="admin-container">
      <div className="header">
        <h1>Bike Management</h1>
        <button className="btn add-btn" onClick={() => setShowAddDialog(true)}>
          <span className="icon">+</span>
          Add New Bike
        </button>
      </div>

      {showAddDialog && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Bike</h2>
              <button className="close-btn" onClick={() => setShowAddDialog(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddBike} className="modal-content">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={newBike.name}
                  onChange={(e) => setNewBike({ ...newBike, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="model">Model</label>
                <input
                  id="model"
                  type="text"
                  value={newBike.model}
                  onChange={(e) => setNewBike({ ...newBike, model: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="terrain">Terrain Type</label>
                <input
                  id="terrain"
                  type="text"
                  value={newBike.terrain}
                  onChange={(e) => setNewBike({ ...newBike, terrain: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  value={newBike.description}
                  onChange={(e) => setNewBike({ ...newBike, description: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="frame_size">Frame Size</label>
                  <input
                    id="frame_size"
                    type="text"
                    value={newBike.frame_size}
                    onChange={(e) => setNewBike({ ...newBike, frame_size: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="wheel_size">Wheel Size</label>
                  <input
                    id="wheel_size"
                    type="text"
                    value={newBike.wheel_size}
                    onChange={(e) => setNewBike({ ...newBike, wheel_size: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="rent_price">Price</label>
                <input
                  id="rent_price"
                  type="number"
                  value={newBike.rent_price}
                  onChange={(e) => setNewBike({ ...newBike, rent_price: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="image_url">Image URL</label>
                <input
                  id="image_url"
                  type="text"
                  value={newBike.image_url}
                  onChange={(e) => setNewBike({ ...newBike, image_url: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="available">Available</label>
                <select
                  id="available"
                  value={newBike.available}
                  onChange={(e) => setNewBike({ ...newBike, available: e.target.value === 'true' })}
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
              <button type="submit" className="btn submit-btn">Add Bike</button>
            </form>
          </div>
        </div>
      )}

      <div className="bike-grid">
        {bikes.map((bike) => (
          <div key={bike.id} className="bike-card">
            <div className="bike-header">
              <h3>{bike.name}</h3>
              <div className="action-buttons">
                <button
                  className="icon-btn edit-btn"
                  onClick={() => {
                    setEditingBike(bike);
                    setShowEditDialog(true);
                  }}
                >
                  ✎
                </button>
                <button
                  className="icon-btn delete-btn"
                  onClick={() => handleDeleteBike(bike.id)}
                >
                  🗑
                </button>
              </div>
            </div>
            <div className="bike-content">
              <img
                src={bike.image_url}
                alt={bike.name}
                className="bike-image"
              />
              <div className="bike-details">
                <p><strong>Model:</strong> {bike.model}</p>
                <p><strong>Terrain:</strong> {bike.terrain}</p>
                <p><strong>Price:</strong> ${bike.rent_price}</p>
                <p>
                  <strong>Status:</strong>
                  <span className={`status-badge ${bike.available ? 'available' : 'unavailable'}`}>
                    {bike.available ? 'Available' : 'Not Available'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showEditDialog && editingBike && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Bike</h2>
              <button className="close-btn" onClick={() => {
                setShowEditDialog(false);
                setEditingBike(null);
              }}>&times;</button>
            </div>
            <form onSubmit={handleUpdateBike} className="modal-content">
              <div className="form-group">
                <label htmlFor="edit-name">Name</label>
                <input
                  id="edit-name"
                  type="text"
                  value={editingBike.name}
                  onChange={(e) => setEditingBike({
                    ...editingBike,
                    name: e.target.value,
                  })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="edit-available">Status</label>
                <select
                  id="edit-available"
                  value={editingBike.available}
                  onChange={(e) => setEditingBike({
                    ...editingBike,
                    available: e.target.value === 'true',
                  })}
                >
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>
              <button type="submit" className="btn submit-btn">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;