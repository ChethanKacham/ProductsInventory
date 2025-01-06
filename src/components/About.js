import React from "react";
import Layout from "../components/Layout";

function About() {
  return (
    <Layout>
      <div className="container">
        <div className="row">
          <p>
            Products Inventory Application. In this application, we add, update
            and delete the products based on the authorization. We have
            implemented features like lazy loading, transition, customization,
            charts, search filter, and the entire application is responsive.
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default About;
