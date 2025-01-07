import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { fireDB } from "../firebaseConfig";
import "../styles/RegistrationPage.css";
import Loader from "./Loader";

function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [location, setLocation] = useState("");
  const [mobilenumber, setMobilenumber] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  const validateFields = () => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/; // At least 8 characters, one letter, one number
    const mobileRegex = /^[0-9]{10}$/; // Exactly 10 digits

    if (!firstname.trim()) newErrors.firstname = "First name is required.";
    if (!lastname.trim()) newErrors.lastname = "Last name is required.";
    if (!email.trim() || !email.includes("@"))
      newErrors.email = "Valid email is required.";
    if (!passwordRegex.test(password))
      newErrors.password =
        "Password must be at least 8 characters and include a letter and a number.";
    if (!mobileRegex.test(mobilenumber))
      newErrors.mobilenumber = "Mobile number must be exactly 10 digits.";
    if (!location.trim()) newErrors.location = "Location is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateFields()) return; // Stop submission if validation fails

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if Firestore record exists (just for completeness)
      await setDoc(doc(fireDB, "users", user.uid), {
        email,
        firstname,
        lastname,
        location,
        mobilenumber,
      });

      setLoading(false);
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      setLoading(false);

      // Handle Firebase Auth Errors
      if (error.code === "auth/email-already-in-use") {
        alert(
          "An account with this email already exists in Firebase Authentication. Please log in or contact support."
        );
      } else if (error.code === "auth/weak-password") {
        alert("Password is too weak. Please use a stronger password.");
      } else {
        console.error("Error registering user:", error.message);
        alert("Failed to register. Please try again.");
      }
    }
  };

  return (
    <div className="registration-page">
      {loading && <Loader />}
      <div className="registration-container">
        <h2 className="registration-title">Register</h2>
        <form onSubmit={handleRegister} noValidate>
          <input
            type="text"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            className={`registration-input ${errors.firstname ? "error-input" : ""}`}
          />
          {errors.firstname && <p className="error-text">{errors.firstname}</p>}

          <input
            type="text"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            className={`registration-input ${errors.lastname ? "error-input" : ""}`}
          />
          {errors.lastname && <p className="error-text">{errors.lastname}</p>}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`registration-input ${errors.email ? "error-input" : ""}`}
          />
          {errors.email && <p className="error-text">{errors.email}</p>}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`registration-input ${errors.password ? "error-input" : ""}`}
          />
          {errors.password && <p className="error-text">{errors.password}</p>}

          <input
            type="text"
            placeholder="Mobile Number"
            value={mobilenumber}
            onChange={(e) => setMobilenumber(e.target.value)}
            className={`registration-input ${errors.mobilenumber ? "error-input" : ""}`}
          />
          {errors.mobilenumber && <p className="error-text">{errors.mobilenumber}</p>}

          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`registration-input ${errors.location ? "error-input" : ""}`}
          />
          {errors.location && <p className="error-text">{errors.location}</p>}

          <button type="submit" className="registration-button">
            Register
          </button>
        </form>
        <p className="login-link">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login here</span>
        </p>
      </div>
    </div>
  );
}

export default RegistrationPage;
