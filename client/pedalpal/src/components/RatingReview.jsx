import React, { useEffect, useState } from 'react';

function RatingReview({ bikeId, userId }) {
  const [rating, setRating] = useState(0);

  useEffect(() => {
    
    const fetchRating = async () => {
      try {
        const response = await fetch(`https://pedalpal.onrender.com/rating/${userId}&bikeId=${bikeId}`);
        const data = await response.json();

        if (data.length > 0) {
          setRating(data[0].rating);
          localStorage.setItem(`userRating_${bikeId}`, JSON.stringify(data[0])); 
        }
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    };

    fetchRating();
  }, [userId, bikeId]);

  const handleRating = async (star) => {
    setRating(star);

    const updatedRating = {
      user: userId,
      bikeId: bikeId,
      rating: star,
    };

   
    try {
      const response = await fetch(`https://pedalpal.onrender.com/rating/${userId}&bikeId=${bikeId}`);
      const data = await response.json();

      if (data.length > 0) {
        
        await fetch(`https://pedalpal.onrender.com/rating/${data[0].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedRating),
        });
      } else {
        
        await fetch(`https://pedalpal.onrender.com/rating`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedRating),
        });
      }

      
      localStorage.setItem(`userRating_${bikeId}`, JSON.stringify(updatedRating));
    } catch (error) {
      console.error('Error updating rating:', error);
    }
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className='star'
          style={{
            cursor: 'pointer',
            color: rating >= star ? 'gold' : 'gray',
            fontSize: '35px',
          }}
          onClick={() => handleRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default RatingReview;