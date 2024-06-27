// SuccessPage.js

import React, { useEffect, useState } from 'react';

const SuccessPage = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/auth/google/success') // Assuming your backend is running on the same server as your React app
      .then(response => response.json())
      .then(data => {
        setUserData(data); // Store user data in state
        // Perform redirection to /home
        window.location.href = '/home';
      })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  return (
    <div>
      <h1>Redirecting...</h1>
      {/* Optional: Display user data if needed */}
      {userData && (
        <div>
          <p>User: {userData.user.username}</p>
          <p>Email: {userData.user.email}</p>
        </div>
      )}
    </div>
  );
};

export default SuccessPage;
