import React, { useState,useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RatingReview from "./RatingReview";
import { AuthContext } from "./AuthContext";

function BikeDetails({ userId}) {
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const bike = useLocation().state.bike;

  const handleRent = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/payments");     
    }
  };

  return (
    <div className="bike2-details-container">
      <div
        className="bike2-background"
        style={{ backgroundImage: `url(${bike.image_url})`}}
      >
        <div className="bike2-overlay">
          <h2 className="bike2-name">{bike.name}</h2>
        </div>
      </div>
      <div className="bike2-info">
        <p><strong>Model :</strong> {bike.model}</p>
        <p><strong>Terrain:</strong> {bike.terrain}</p>
        <p><strong>Description:</strong> {bike.description}</p>
        <p><strong>Frame Size:</strong> {bike.frame_size}</p>
        <p><strong>Wheel Size:</strong> {bike.wheel_size}</p>
        <p><strong>Availabilty:</strong> {bike.availability}</p>
        <h3 className="bike-card-description"> $:{bike.rent_price}</h3>
        <br />
        <button onClick={handleRent} className="btn2-rent">Rent Now</button>
        <br />
        <br />
        <a href="/bikes" className="btn">Back</a>
      </div>
      <RatingReview rating={rating} setRating={setRating} bikeId={bike.id} userId={userId} />
    </div>
  );
}

export default BikeDetails;
