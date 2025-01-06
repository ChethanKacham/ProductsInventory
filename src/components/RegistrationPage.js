import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { collection, setDoc, doc } from "firebase/firestore";
import { fireDB, auth } from "../firebaseConfig";
import Loader from "./Loader";

function RegistrationPage() {
  const [loading, setLoading] = useState(false);
  const auth = getAuth();
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    location: "",
    mobilenumber: "",
  };

  const phoneExp = /^(?:(?:\+|00)91|0)?[789]\d{9}$/;

  const validationSchema = Yup.object({
    email: Yup.string().required("Required").email("Email is invalid"),
    password: Yup.string()
      .required("Required")
      .min(8, "Minimum 8 characters"),
    firstname: Yup.string()
      .max(15, "Must be 15 characters or less")
      .required("Required"),
    lastname: Yup.string()
      .max(20, "Must be 20 characters or less")
      .required("Required"),
    location: Yup.string().required("Required"),
    mobilenumber: Yup.string()
      .matches(phoneExp, "Phone number is not valid")
      .required("Required"),
  });

  const register = async (email, password, firstname, lastname, location, mobilenumber) => {
    try {
      setLoading(true);
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(collection(fireDB, "users"), result.user.uid), {
        email,
        password,
        firstname,
        lastname,
        location,
        mobilenumber,
      });
      console.log(result);
      setLoading(false);
      toast.success("Registration successful");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error);
      toast.error("Registration failed");
      setLoading(false);
    }
  };

  const onSubmit = async (values) => {
    register(
      values.email,
      values.password,
      values.firstname,
      values.lastname,
      values.location,
      values.mobilenumber
    );
    console.log(values);
  };

  return (
    <div className="register-parent">
      {loading && <Loader />}
      <div className="register-top"></div>
      <div className="row justify-content-center">
        <div className="col-md-4 z1">
          <div className="register-form">
            <h2>Register</h2>
            <hr />
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ error }) => (
                <Form>
                  <label htmlFor="email">Email ID</label>
                  <Field
                    className="form-control"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Email"
                  />
                  <ErrorMessage name="email">
                    {(error) => <div className="error">{error}</div>}
                  </ErrorMessage>

                  <label htmlFor="password">Password</label>
                  <Field
                    className="form-control"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Password"
                  />
                  <ErrorMessage name="password">
                    {(error) => <div className="error">{error}</div>}
                  </ErrorMessage>

                  <label htmlFor="firstname">First Name</label>
                  <Field
                    className="form-control"
                    type="text"
                    id="firstname"
                    name="firstname"
                    placeholder="First Name"
                  />
                  <ErrorMessage name="firstname">
                    {(error) => <div className="error">{error}</div>}
                  </ErrorMessage>

                  <label htmlFor="lastname">Last Name</label>
                  <Field
                    className="form-control"
                    type="text"
                    id="lastname"
                    name="lastname"
                    placeholder="Last Name"
                  />
                  <ErrorMessage name="lastname">
                    {(error) => <div className="error">{error}</div>}
                  </ErrorMessage>

                  <label htmlFor="location">Location</label>
                  <Field
                    className="form-control"
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Location"
                  />
                  <ErrorMessage name="location">
                    {(error) => <div className="error">{error}</div>}
                  </ErrorMessage>

                  <label htmlFor="mobilenumber">Mobile Number</label>
                  <Field
                    className="form-control"
                    type="text"
                    id="mobilenumber"
                    name="mobilenumber"
                    placeholder="Mobile number"
                  />
                  <ErrorMessage name="mobilenumber">
                    {(error) => <div className="error">{error}</div>}
                  </ErrorMessage>

                  <div align="center">
                    <button className="m-2" type="submit">
                      Register
                    </button>
                    <button className="m-2" type="reset">
                      Reset
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <Link to="/login">Click Here To Login</Link>
            <br />
            <Link to="/">Click Here for Home Page</Link>
          </div>
        </div>
        <div className="col-md-5">
          <lottie-player
            src="https://assets10.lottiefiles.com/packages/lf20_my6hfrzr.json"
            background="transparent"
            speed="1"
            loop
            autoplay
          ></lottie-player>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
