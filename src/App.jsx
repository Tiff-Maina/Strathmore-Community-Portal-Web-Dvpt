import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { auth, db } from './firebaseConfig.js'; // Import 'db' for Firestore
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Auth functions
import { doc, getDoc } from 'firebase/firestore'; // Firestore functions for fetching user details

// Components - Layout
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import HomePage from './components/Layout/HomePage';
import AboutPage from './components/Layout/AboutPage';
import './components/Layout/Header.css'; // Importing CSS for Header styles

// Components - Auth (Separated Login and Register)
import LoginPage from './components/Auth/LoginPage'; // New: LoginPage
import RegisterPage from './components/Auth/RegisterPage'; // New: RegisterPage

// Components - Campaigns
import CreateCampaign from './components/Campaigns/CreateCampaign';
import CampaignList from './components/Campaigns/CampaignList';
import CampaignDetail from './components/Campaigns/CampaignDetail';

// Components - Admin
import AdminDashboard from './components/Admin/AdminDashboard';

// It should match the UID of your admin user in Firebase Authentication.
const ADMIN_UID = 'eeLVnYceVYSfGJCsxWPrD64D6762'; 

// Main App component
function App() {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true); // To check initial auth state

  // Effect to listen for authentication state changes (login/logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Fetch user details from Firestore to get the displayName
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUser({
              ...currentUser,
              displayName: userData.displayName || currentUser.displayName || currentUser.email // Prioritize Firestore name
            });
          } else {
            // Fallback if Firestore doc doesn't exist (e.g., old users or incomplete registration)
            setUser(currentUser);
          }
        } catch (error) {
          console.error("Error fetching user displayName in App.js:", error);
          setUser(currentUser); // Still set user even if name fetch fails
        }
      } else {
        setUser(null); // No user logged in
      }
      setLoadingAuth(false); // Authentication state has been determined
    });
    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, [ADMIN_UID]); // Added ADMIN_UID to dependency array as it's used in the effect

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-strathmore-lightBlue">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-strathmore-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-strathmore-blue">Loading Portal</h2>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Header is always visible and receives the current user info */}
        <Header user={user} />

        {/* Main content area, grows to fill available space */}
        <main className="flex-grow bg-strathmore-lightBlue">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* Separate Login and Register Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes (require login) */}
            {/* Redirect to /login if not authenticated */}
            <Route path="/create-campaign" element={user ? <CreateCampaign /> : <LoginPage />} />
            <Route path="/campaigns" element={user ? <CampaignList /> : <LoginPage />} />
            <Route path="/campaign/:id" element={user ? <CampaignDetail /> : <LoginPage />} />

            {/* Admin Protected Route */}
            <Route path="/admin" element={user?.uid === ADMIN_UID ? <AdminDashboard /> : <LoginPage />} />
          </Routes>
        </main>

        {/* Footer is always visible */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
