import React, { useEffect, useState } from 'react';
import Layout from './Layout';
import { getDoc, doc } from 'firebase/firestore';
import { fireDB, auth } from "../firebaseConfig";

function UserDetails() {
  const [loading, setLoading] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const user = JSON.parse(localStorage.getItem('currentUser')) || {};

  async function getData() {
    try {
      if (!user.uid) {
        console.error("User UID is missing.");
        return;
      }
      setLoading(true);
      const userinfo = await getDoc(doc(fireDB, 'users', user.uid));
      setUserDetails(userinfo.data());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  }

  useEffect(() => {
    getData();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <Layout loading={loading}>
      <section>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="col col-lg-6 mb-4">
              <div className="card mb-3">
                <div className="row g-0">
                  <div className="col-md-12">
                    <div className="card-body p-4">
                      <h6>User Profile</h6>
                      <hr className="mt-0 mb-4" />
                      <div className="row pt-1">
                        <div className="col-6 mb-3">
                          <h6>Name</h6>
                          <p className="text-muted">
                            {userDetails.firstname} {userDetails.lastname}
                          </p>
                        </div>
                        <div className="col-6 mb-3">
                          <h6>Email</h6>
                          <p className="text-muted">{userDetails.email}</p>
                        </div>
                      </div>
                      <div className="row pt-1">
                        <div className="col-6 mb-3">
                          <h6>Mobile Number</h6>
                          <p className="text-muted">{userDetails.mobilenumber}</p>
                        </div>
                        <div className="col-6 mb-3">
                          <h6>Location</h6>
                          <p className="text-muted">{userDetails.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default UserDetails;
