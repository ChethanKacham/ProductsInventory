import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import Loader from "./Loader";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Required")
      .email("Email is invalid"),
    password: Yup.string()
      .required("Required")
      .min(8, "Minimum 8 characters"),
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      localStorage.setItem("currentUser", JSON.stringify(result));
      setLoading(false);
      toast.success("Login successful");
      window.location.href = "/";
    } catch (error) {
      toast.error("Login failed");
      setLoading(false);
    }
  };

  return (
    <div className="login-parent">
      {loading && <Loader />}
      <div className="row justify-content-center">
        <div className="col-md-5">
          <lottie-player
            src="https://assets10.lottiefiles.com/packages/lf20_p8bfn5to.json"
            background="transparent"
            speed="1"
            loop
            autoplay
          ></lottie-player>
        </div>
        <div className="col-md-4 z1">
          <div className="login-form">
            <h2>Login</h2>
            <hr />
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
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
                <br />

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
                <br />
                <div align="center">
                  <button
                    className="my-2"
                    type="submit"
                  >
                    Login
                  </button>
                </div>
                <hr />
                <Link to="/signup">Click Here To Register</Link>
                <br />
                <Link to="/">Click Here for Home Page</Link>
              </Form>
            </Formik>
          </div>
        </div>
      </div>
      <div className="login-bottom"></div>
    </div>
  );
}

export default LoginPage;
