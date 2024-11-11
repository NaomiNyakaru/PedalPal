import React, { useState, useEffect } from 'react';

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
    type: "",
    description: "",
    frameSize: "",
    wheelSize: "",
    price: "",
    image_url: "",
    status: "available"
  });

  useEffect(() => {
    fetchBikes();
  }, []);

  const fetchBikes = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("https://json-server-vercel-lemon-nu.vercel.app/bikes");
      if (!response.ok) throw new Error('Failed to fetch bikes');
      const data = await response.json();
      setBikes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBike = async () => {
    try {
      const response = await fetch("https://json-server-vercel-lemon-nu.vercel.app/bikes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newBike),
      });

      if (!response.ok) throw new Error('Failed to add bike');
      
      const addedBike = await response.json();
      setBikes([...bikes, addedBike]);
      setNewBike({
        name: "",
        model: "",
        type: "",
        description: "",
        frameSize: "",
        wheelSize: "",
        price: "",
        image_url: "",
        status: "available"
      });
      setShowAddDialog(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateBike = async () => {
    try {
      const response = await fetch(`https://json-server-vercel-lemon-nu.vercel.app/bikes/${editingBike.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingBike),
      });

      if (!response.ok) throw new Error('Failed to update bike');

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
      const response = await fetch(`https://json-server-vercel-lemon-nu.vercel.app/bikes/${bikeId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error('Failed to delete bike');
      
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
            <div className="modal-content">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newBike.name}
                  onChange={(e) => setNewBike({ ...newBike, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Model</label>
                <input
                  type="text"
                  value={newBike.model}
                  onChange={(e) => setNewBike({ ...newBike, model: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Terrain Type</label>
                <input
                  type="text"
                  value={newBike.type}
                  onChange={(e) => setNewBike({ ...newBike, type: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newBike.description}
                  onChange={(e) => setNewBike({ ...newBike, description: e.target.value })}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Frame Size</label>
                  <input
                    type="text"
                    value={newBike.frameSize}
                    onChange={(e) => setNewBike({ ...newBike, frameSize: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Wheel Size</label>
                  <input
                    type="text"
                    value={newBike.wheelSize}
                    onChange={(e) => setNewBike({ ...newBike, wheelSize: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  value={newBike.price}
                  onChange={(e) => setNewBike({ ...newBike, price: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="text"
                  value={newBike.image_url}
                  onChange={(e) => setNewBike({ ...newBike, image_url: e.target.value })}
                />
              </div>
              <button className="btn submit-btn" onClick={handleAddBike}>Add Bike</button>
            </div>
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
                <p><strong>Type:</strong> {bike.type}</p>
                <p><strong>Price:</strong> ${bike.price}</p>
                <p>
                  <strong>Status:</strong>
                  <span className={`status-badge ${bike.status === 'available' ? 'available' : 'unavailable'}`}>
                    {bike.status || 'available'}
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
            <div className="modal-content">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={editingBike.name}
                  onChange={(e) => setEditingBike({
                    ...editingBike,
                    name: e.target.value,
                  })}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={editingBike.status || 'available'}
                  onChange={(e) => setEditingBike({
                    ...editingBike,
                    status: e.target.value,
                  })}
                >
                  <option value="available">Available</option>
                  <option value="not available">Not Available</option>
                  <option value="maintenance">Under Maintenance</option>
                </select>
              </div>
              <button className="btn submit-btn" onClick={handleUpdateBike}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-container {
          padding: 1.5rem;
          max-width: 1280px;
          margin: 0 auto;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        h1 {
          font-size: 1.875rem;
          font-weight: bold;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .add-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #3b82f6;
          color: white;
        }

        .add-btn:hover {
          background-color: #2563eb;
        }

        .icon {
          font-size: 1.25rem;
        }

        .bike-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .bike-card {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          overflow: hidden;
          background-color: white;
        }

        .bike-header {
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e5e7eb;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.25rem;
          padding: 0.25rem;
          border-radius: 0.25rem;
        }

        .icon-btn:hover {
          background-color: #f3f4f6;
        }

        .edit-btn {
          color: #4b5563;
        }

        .delete-btn {
          color: #ef4444;
        }

        .bike-content {
          padding: 1rem;
        }

        .bike-image {
          width: 100%;
          height: 12rem;
          object-fit: cover;
          border-radius: 0.375rem;
          margin-bottom: 1rem;
        }

        .bike-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .status-badge {
          margin-left: 0.5rem;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }

        .available {
          background-color: #dcfce7;
          color: #166534;
        }

        .unavailable {
          background-color: #fee2e2;
          color: #991b1b;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background-color: white;
          border-radius: 0.5rem;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
        }

        .modal-content {
          padding: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
        }

        input, textarea, select {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 0.375rem;
          font-size: 1rem;
        }

        textarea {
          min-height: 100px;
          resize: vertical;
        }

        .submit-btn {
          background-color: #3b82f6;
          color: white;
          width: 100%;
          margin-top: 1rem;
        }

        .submit-btn:hover {
          background-color: #2563eb;
        }

        .loading {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .error {
          display: flex;
          justify-content: center;
           align-items: center;
          color: #ef4444;
          font-size: 1.25rem;
          height: 100vh;
        }
      `}</style>
    </div>
  );
};

export default Admin;