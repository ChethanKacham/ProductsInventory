import React from "react";
import "../styles/AboutPage.css";

function AboutPage() {
  return (
    <div className="about-page">
      <div className="about-container">
        <h1 className="about-title">About Products Inventory</h1>
        <p className="about-description">
          The Products Inventory application is a user-friendly platform that allows you to manage your product inventory efficiently. With features like product addition, editing, deletion, and data visualization through charts, it provides an all-in-one solution for inventory management.
        </p>
        <p className="about-description">
          Built using modern web technologies like React, Firebase, and Chart.js, this application ensures seamless performance and responsiveness. Whether you're a small business owner or a large enterprise, this app adapts to your needs and simplifies inventory management.
        </p>
        <p className="about-highlight">
          Features:
        </p>
        <ul className="about-features">
          <li>User Authentication with Firebase</li>
          <li>Real-time Product Management</li>
          <li>Data Visualization with Charts</li>
          <li>Responsive Design for All Devices</li>
          <li>Secure and Scalable Backend</li>
        </ul>
      </div>
    </div>
  );
}

export default AboutPage;
