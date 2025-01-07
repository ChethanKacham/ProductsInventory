import React, { useEffect, useState } from "react";
import { getDoc, doc } from "firebase/firestore";
import { fireDB } from "../firebaseConfig";
import "../styles/UserDetails.css";
import Loader from "./Loader";

function UserDetails() {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const currentUser = JSON.parse(localStorage.getItem("currentUser"));
      if (currentUser && currentUser.uid) {
        const userDoc = await getDoc(doc(fireDB, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserDetails(userDoc.data());
        } else {
          console.error("User not found");
        }
      } else {
        console.error("No current user");
        setUserDetails(null);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setLoading(false);
    }
  };

  return (
    <div className="user-details-page">
      {loading ? (
        <Loader />
      ) : userDetails ? (
        <div className="user-details-container">
          <h1 className="user-details-title">User Profile</h1>
          <div className="user-details-info">
            <p>
              <strong>Name:</strong> {userDetails.firstname}{" "}
              {userDetails.lastname}
            </p>
            <p>
              <strong>Email:</strong> {userDetails.email}
            </p>
            <p>
              <strong>Location:</strong> {userDetails.location || "Not provided"}
            </p>
            <p>
              <strong>Mobile:</strong> {userDetails.mobilenumber || "Not provided"}
            </p>
          </div>
        </div>
      ) : (
        <p className="error-message">No user details available.</p>
      )}
    </div>
  );
}

export default UserDetails;
