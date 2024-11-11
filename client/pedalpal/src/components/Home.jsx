import React from 'react';


const Home = () => {
  return (
    <div>
      <header className="hero">
        <div className="hero-content">
          <h1>Rent the Best Bikes in Town</h1>
          <p>Two wheels, endless possibilities. Cycling : where the journey is just as important as the destination. Feel the wind in your face and the freedom of the open road.</p>
          <a href="/bikes" className="btn">Browse Bikes</a>
        </div>
      </header>

      <section id="categories" className="categories">
        <h2>Bike Categories</h2>
        <div className="category-grid">
          <div className="category">
            <img src="https://plus.unsplash.com/premium_photo-1678718713393-2b88cde9605b?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="City Bike" />
            <h3>City Bikes</h3>
            <p>Perfect for urban commutes and casual rides around the city.</p>
          </div>
          <div className="category">
            <img src="https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"alt="Mountain Bike" />
            <h3>Mountain Bikes</h3>
            <p>Ideal for off-road adventures and challenging terrains.</p>
          </div>
          <div className="category">
            <img src="https://images.unsplash.com/photo-1513540870164-07649a1d676f?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Electric Bike" />
            <h3>Electric Bikes</h3>
            <p>Experience effortless riding with our powerful e-bikes.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>&copy; 2024 Bike Rental Service. All rights reserved.</p>
        <nav>
          <a href="#categories">Categories</a>
          <a href="#contact">Contact Us</a>
          <a href="#about">About Us</a>
        </nav>
      </footer>
    </div>
  );
};

export default Home;