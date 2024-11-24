import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import RatingReview from "./RatingReview";
import { AuthContext } from "./AuthContext";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

function BikeDetails({ userId }) {
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();
  const { isLoggedIn } = useContext(AuthContext);
  const bike = useLocation().state?.bike;

  const handleRent = () => {
    if (!isLoggedIn) {
      navigate("/login");
    } else if (bike.available) {
      navigate("/payments");
    } else {
      toast.error("Sorry, this bike is currently unavailable for rent.");
    }
  };

  const handleBack = () => {
    navigate("/bikes"); // Goes back to the previous page in the user's history
  };

  if (!bike) {
    return <div className="text-center p-4">No bike details available.</div>;
  }

  return (
    <div className="bike2-details-container">
      <div
        className="bike2-background"
        style={{ backgroundImage: `url(${bike.image_url})` }}
      >
        <div className="bike2-overlay">
          <h2 className="bike2-name">{bike.name}</h2>
        </div>
      </div>
      <div className="bike2-info">
        <p>
          <strong>Model :</strong> {bike.model}
        </p>
        <p>
          <strong>Terrain:</strong> {bike.terrain}
        </p>
        <p>
          <strong>Description:</strong> {bike.description}
        </p>
        <p>
          <strong>Frame Size:</strong> {bike.frame_size}
        </p>
        <p>
          <strong>Wheel Size:</strong> {bike.wheel_size}
        </p>
        <p>
          <strong>Availability:</strong>{" "}
          <span
            className={`availability-indicator ${
              bike.available ? "available" : "unavailable"
            }`}
          >
            {bike.available ? "●" : "●"}{" "}
            {bike.available ? "Available" : "Not Available"}
          </span>
        </p>
        <br />
        <button
          disabled={!bike.available}
          onClick={handleRent}
          className={`btn2-rent ${bike.available ? "" : "disabled"}`}
        >
          Rent Now
        </button>
        <br />
        <br />
        <button onClick={handleBack} className="btn">
          Back
        </button>
      </div>
      <RatingReview
        rating={rating}
        setRating={setRating}
        bikeId={bike.id}
        userId={userId}
      />
    </div>
  );
}

export default BikeDetails;
